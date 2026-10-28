/**
 * Product catalog service handling CRUD operations, multi-column sorting,
 * case-insensitive search, pagination, and soft delete logic.
 */

import { Prisma, Product } from '@prisma/client';
import { prisma } from '../lib/prisma';
import {
  CreateProductInput,
  ProductListParams,
  ProductListResult,
  ProductResponse,
  UpdateProductInput,
} from '../types/product.types';
import { AppError } from '../middlewares/errorHandler';
import { createPaginationMeta } from '../utils/response';

type ProductSortField = 'productName' | 'productCode' | 'price' | 'stock' | 'id';

const SORT_FIELD_MAP: Record<string, ProductSortField> = {
  product_name: 'productName',
  productname: 'productName',
  productName: 'productName',
  product_code: 'productCode',
  productcode: 'productCode',
  productCode: 'productCode',
  price: 'price',
  stock: 'stock',
  id: 'id',
};

export class ProductService {
  /**
   * Serializes a Prisma Product record into the standard API DTO.
   * Conforms to the snake_case contract specified in the assessment requirements.
   */
  private formatProduct(product: Product): ProductResponse {
    return {
      id: product.id,
      product_code: product.productCode,
      product_name: product.productName,
      stock: product.stock,
      price: product.price.toString(),
      deleted_at: product.deletedAt,
    };
  }

  /**
   * Parses flexible sort query parameters into Prisma OrderBy criteria.
   * Supports:
   * 1. Multi-column sort strings: "price:desc,product_name:asc"
   * 2. Comma-separated field list: "product_name,price"
   * 3. Single field with separate order param: sort="stock", order="desc"
   */
  private parseOrderBy(
    sort?: string,
    defaultOrder: 'asc' | 'desc' = 'asc'
  ): Prisma.ProductOrderByWithRelationInput[] {
    if (!sort) {
      return [{ productName: defaultOrder }];
    }

    const orderByList: Prisma.ProductOrderByWithRelationInput[] = [];
    const segments = sort.split(',').map((s) => s.trim()).filter(Boolean);

    for (const segment of segments) {
      const parts = segment.split(':').map((p) => p.trim());
      const rawField = parts[0]?.toLowerCase() ?? '';
      const rawDirection = parts[1]?.toLowerCase();
      const direction: Prisma.SortOrder =
        rawDirection === 'desc' ? 'desc' : rawDirection === 'asc' ? 'asc' : defaultOrder;

      const prismaField = SORT_FIELD_MAP[rawField];
      if (prismaField) {
        orderByList.push({ [prismaField]: direction });
      }
    }

    return orderByList.length > 0 ? orderByList : [{ productName: defaultOrder }];
  }

  /**
   * Retrieves a paginated list of non-deleted products with optional search and sorting.
   */
  async list(params: ProductListParams): Promise<ProductListResult> {
    const page = Math.max(1, Number(params.page) || 1);
    const perPage = Math.max(1, Math.min(100, Number(params.per_page) || 10));
    const skip = (page - 1) * perPage;

    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
    };

    if (params.search && params.search.trim()) {
      const keyword = params.search.trim();
      where.OR = [
        {
          productName: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
        {
          productCode: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
      ];
    }

    const orderBy = this.parseOrderBy(params.sort, params.order ?? 'asc');

    const [total, records] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: perPage,
      }),
    ]);

    return {
      data: records.map((record) => this.formatProduct(record)),
      meta: createPaginationMeta(page, perPage, total),
    };
  }

  /**
   * Retrieves a single active product by its unique integer identifier.
   */
  async getById(id: number): Promise<ProductResponse> {
    const product = await prisma.product.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!product) {
      const error: AppError = new Error('Produk tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }

    return this.formatProduct(product);
  }

  /**
   * Generates a unique sequential product code (e.g. PRD-021).
   * Extracts the numeric suffix from the latest registered product code in the database
   * to guarantee monotonic ordering and 100% collision-free assignment.
   */
  async generateProductCode(): Promise<string> {
    const lastProduct = await prisma.product.findFirst({
      orderBy: { id: 'desc' },
      select: { id: true, productCode: true },
    });

    let nextNum = (lastProduct?.id ?? 0) + 1;
    if (lastProduct?.productCode) {
      const match = lastProduct.productCode.match(/(\d+)/);
      if (match && match[1]) {
        const parsed = parseInt(match[1], 10);
        if (!isNaN(parsed) && parsed >= nextNum) {
          nextNum = parsed + 1;
        }
      }
    }

    let candidate = `PRD-${String(nextNum).padStart(3, '0')}`;
    while (await prisma.product.findFirst({ where: { productCode: candidate } })) {
      nextNum++;
      candidate = `PRD-${String(nextNum).padStart(3, '0')}`;
    }

    return candidate;
  }

  /**
   * Creates a new product item.
   * By default, the product_code is auto-generated on the backend to enforce table uniqueness and consistency.
   * If a custom product_code is explicitly provided, its uniqueness across the entire table is strictly verified.
   */
  async create(input: CreateProductInput): Promise<ProductResponse> {
    // Generate kode produk secara otomatis di backend jika tidak disediakan
    const productCode = input.product_code?.trim() || (await this.generateProductCode());

    // Validasi keunikan jika kode produk diberikan secara manual
    if (input.product_code?.trim()) {
      const existing = await prisma.product.findFirst({
        where: {
          productCode,
        },
      });

      if (existing) {
        const error: AppError = new Error('Kode produk sudah digunakan');
        error.statusCode = 409;
        error.errors = {
          product_code: ['Kode produk sudah digunakan oleh produk lain'],
        };
        throw error;
      }
    }

    const created = await prisma.product.create({
      data: {
        productCode,
        productName: input.product_name.trim(),
        price: new Prisma.Decimal(input.price),
        stock: input.stock ?? 0,
      },
    });

    return this.formatProduct(created);
  }

  /**
   * Updates an existing product item, ensuring product_code collision prevention if modified.
   */
  async update(id: number, input: UpdateProductInput): Promise<ProductResponse> {
    const product = await prisma.product.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!product) {
      const error: AppError = new Error('Produk tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }

    const updateData: Prisma.ProductUpdateInput = {};

    if (input.product_code !== undefined) {
      const trimmedCode = input.product_code.trim();
      if (trimmedCode !== product.productCode) {
        const existing = await prisma.product.findFirst({
          where: {
            productCode: trimmedCode,
            id: { not: id },
          },
        });

        if (existing) {
          const error: AppError = new Error('Kode produk sudah digunakan');
          error.statusCode = 409;
          error.errors = {
            product_code: ['Kode produk sudah digunakan oleh produk lain'],
          };
          throw error;
        }
      }
      updateData.productCode = trimmedCode;
    }

    if (input.product_name !== undefined) {
      updateData.productName = input.product_name.trim();
    }

    if (input.price !== undefined) {
      updateData.price = new Prisma.Decimal(input.price);
    }

    if (input.stock !== undefined) {
      updateData.stock = input.stock;
    }

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return this.formatProduct(updated);
  }

  /**
   * Performs soft deletion by marking deleted_at timestamp.
   * Ensures foreign key integrity for past order transactions.
   */
  async softDelete(id: number): Promise<void> {
    const product = await prisma.product.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!product) {
      const error: AppError = new Error('Produk tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }

    await prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

export const productService = new ProductService();
export default productService;
