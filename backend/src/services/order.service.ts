/**
 * Order service implementing atomic transaction processing, stock validation,
 * dot-notation error reporting, and historical price snapshotting.
 */

import { Order, OrderItem, Prisma, Product, Customer } from '@prisma/client';
import { prisma } from '../lib/prisma';
import {
  CreateOrderInput,
  OrderItemResponse,
  OrderListParams,
  OrderListResponse,
  OrderResponse,
} from '../types/order.types';
import { AppError } from '../middlewares/errorHandler';
import { createPaginationMeta } from '../utils/response';

type OrderWithRelations = Order & {
  customer: Customer;
  items: (OrderItem & { product: Product })[];
};

export class OrderService {
  /**
   * Generates a collision-free sequential order invoice number: INV-YYYYMMDD-XXXX.
   */
  private async generateOrderNumber(tx: Prisma.TransactionClient): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const prefix = `INV-${year}${month}${day}-`;

    const latestOrder = await tx.order.findFirst({
      where: {
        orderNumber: {
          startsWith: prefix,
        },
      },
      orderBy: {
        orderNumber: 'desc',
      },
      select: {
        orderNumber: true,
      },
    });

    let nextSequence = 1;
    if (latestOrder?.orderNumber) {
      const parts = latestOrder.orderNumber.split('-');
      const sequencePart = parts[2];
      if (sequencePart && /^\d+$/.test(sequencePart)) {
        nextSequence = parseInt(sequencePart, 10) + 1;
      }
    }

    let candidate = `${prefix}${String(nextSequence).padStart(4, '0')}`;
    let collision = await tx.order.findUnique({
      where: { orderNumber: candidate },
      select: { id: true },
    });

    while (collision) {
      nextSequence += 1;
      candidate = `${prefix}${String(nextSequence).padStart(4, '0')}`;
      collision = await tx.order.findUnique({
        where: { orderNumber: candidate },
        select: { id: true },
      });
    }

    return candidate;
  }

  /**
   * Formats an Order entity with relations into the unified OrderResponse DTO.
   */
  private formatOrder(order: OrderWithRelations): OrderResponse {
    return {
      id: order.id,
      order_number: order.orderNumber,
      customer_id: order.customerId,
      customer_name: order.customer.customerName,
      created_by: order.createdBy,
      order_date: order.orderDate.toISOString(),
      total_amount: order.totalAmount.toString(),
      items: order.items.map((item) => this.formatOrderItem(item)),
    };
  }

  /**
   * Formats an OrderItem entity into the OrderItemResponse DTO.
   */
  private formatOrderItem(item: OrderItem & { product: Product }): OrderItemResponse {
    return {
      id: item.id,
      product_id: item.productId,
      product_name: item.product.productName,
      product_code: item.product.productCode,
      quantity: item.quantity,
      unit_price: item.unitPrice.toString(),
      subtotal: item.subtotal.toString(),
    };
  }

  /**
   * Creates a new sales transaction order atomically.
   * - Enforces database-driven unit price snapshotting.
   * - Validates customer existence.
   * - Validates sufficient stock for all requested items.
   * - Rolls back entirely on any stock shortfall and returns dot-notation errors.
   */
  async create(input: CreateOrderInput, userId: string): Promise<OrderResponse> {
    return await prisma.$transaction(async (tx) => {
      // Verify customer exists and is not soft-deleted
      const customer = await tx.customer.findFirst({
        where: {
          id: input.customer_id,
          deletedAt: null,
        },
      });

      if (!customer) {
        const error: AppError = new Error('Pelanggan tidak ditemukan atau sudah dihapus');
        error.statusCode = 404;
        throw error;
      }

      // Fetch all requested products in bulk
      const productIds = Array.from(new Set(input.items.map((i) => i.product_id)));
      const products = await tx.product.findMany({
        where: {
          id: { in: productIds },
          deletedAt: null,
        },
      });

      const productMap = new Map<number, Product>();
      products.forEach((p) => productMap.set(p.id, p));

      // Pre-validate stock and existence for all items to collect dot-notation errors
      const stockErrors: Record<string, string[]> = {};
      let hasError = false;

      // Group quantities if client submitted duplicate product items
      const requestedQuantities = new Map<number, number>();
      input.items.forEach((item) => {
        const current = requestedQuantities.get(item.product_id) || 0;
        requestedQuantities.set(item.product_id, current + item.quantity);
      });

      input.items.forEach((item, index) => {
        const product = productMap.get(item.product_id);
        const errorKey = `items.${index}.quantity`;

        if (!product) {
          stockErrors[`items.${index}.product_id`] = [
            'Produk tidak ditemukan atau sudah dinonaktifkan',
          ];
          hasError = true;
          return;
        }

        const totalRequested = requestedQuantities.get(item.product_id) || item.quantity;
        if (product.stock < totalRequested) {
          stockErrors[errorKey] = [
            `Stok ${product.productName} tersisa ${product.stock}, diminta ${totalRequested}`,
          ];
          hasError = true;
        }
      });

      if (hasError) {
        const error: AppError = new Error('Stok tidak mencukupi');
        error.statusCode = 422;
        error.errors = stockErrors;
        throw error;
      }

      // Generate unique order invoice number
      const orderNumber = await this.generateOrderNumber(tx);

      // Calculate precise subtotals and total amount using database unit price
      let totalAmountDecimal = new Prisma.Decimal(0);
      const itemsToCreate: Array<{
        productId: number;
        quantity: number;
        unitPrice: Prisma.Decimal;
        subtotal: Prisma.Decimal;
      }> = [];

      for (const item of input.items) {
        const product = productMap.get(item.product_id)!;
        const unitPrice = product.price; // Snapshot directly from product table
        const subtotal = unitPrice.mul(item.quantity);
        totalAmountDecimal = totalAmountDecimal.add(subtotal);

        itemsToCreate.push({
          productId: item.product_id,
          quantity: item.quantity,
          unitPrice,
          subtotal,
        });

        // Decrement product stock in database
        await tx.product.update({
          where: { id: item.product_id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Persist Order and OrderItems in single insert
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: input.customer_id,
          createdBy: userId,
          totalAmount: totalAmountDecimal,
          items: {
            create: itemsToCreate,
          },
        },
        include: {
          customer: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      return this.formatOrder(createdOrder);
    });
  }

  /**
   * Retrieves a paginated list of sales transactions.
   */
  async list(params: OrderListParams): Promise<OrderListResponse> {
    const page = Math.max(1, Number(params.page) || 1);
    const perPage = Math.max(1, Math.min(100, Number(params.per_page) || 10));
    const skip = (page - 1) * perPage;

    const where: Prisma.OrderWhereInput = {};

    if (params.customer_id) {
      where.customerId = params.customer_id;
    }

    if (params.search && params.search.trim()) {
      const keyword = params.search.trim();
      where.OR = [
        {
          orderNumber: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
        {
          customer: {
            customerName: {
              contains: keyword,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    if (params.from || params.to) {
      where.orderDate = {};
      if (params.from) {
        where.orderDate.gte = new Date(params.from);
      }
      if (params.to) {
        const toDate = new Date(params.to);
        toDate.setHours(23, 59, 59, 999);
        where.orderDate.lte = toDate;
      }
    }

    const direction: Prisma.SortOrder = params.order === 'asc' ? 'asc' : 'desc';
    const orderBy: Prisma.OrderOrderByWithRelationInput = {
      orderDate: direction,
    };

    const [total, records] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        orderBy,
        skip,
        take: perPage,
        include: {
          customer: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      }),
    ]);

    return {
      data: records.map((record) => this.formatOrder(record)),
      meta: createPaginationMeta(page, perPage, total),
    };
  }

  /**
   * Retrieves detail of an order by numeric ID.
   */
  async getById(id: number): Promise<OrderResponse> {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      const error: AppError = new Error('Order tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }

    return this.formatOrder(order);
  }
}

export const orderService = new OrderService();

