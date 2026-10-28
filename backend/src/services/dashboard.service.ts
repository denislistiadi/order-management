import { Prisma, Product } from '@prisma/client';
import { prisma } from '../lib/prisma';
import {
  DashboardSummaryData,
  TopProductItem,
  LowStockProductItem,
  DailySalesItem,
} from '../types/dashboard.types';

export class DashboardService {
  /**
   * Aggregates executive dashboard metrics including transaction KPIs,
   * top-selling products, inventory health, and recent daily sales trend.
   */
  async getSummary(): Promise<DashboardSummaryData> {
    // Transaction counts and total revenue
    const totalTransactionsPromise = prisma.order.count();
    const totalRevenuePromise = prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
    });

    // Active product and customer counts
    const totalProductsPromise = prisma.product.count({
      where: { deletedAt: null },
    });
    const totalCustomersPromise = prisma.customer.count({
      where: { deletedAt: null },
    });

    // Critical inventory with stock below threshold
    const lowStockPromise = prisma.product.findMany({
      where: {
        deletedAt: null,
        stock: { lt: 5 },
      },
      orderBy: { stock: 'asc' },
      take: 10,
    });

    // Top 5 selling products aggregated by sold quantity
    const topItemsPromise = prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
        subtotal: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    // Generate date boundaries for the past 7 days
    const now = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    const days: Array<{ dateStr: string; label: string; start: Date; end: Date }> = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0] ?? '';
      const dayNum = d.getDate();
      const monthName = monthNames[d.getMonth()] ?? '';

      const start = new Date(d);
      start.setHours(0, 0, 0, 0);

      const end = new Date(d);
      end.setHours(23, 59, 59, 999);

      days.push({
        dateStr,
        label: `${dayNum} ${monthName}`,
        start,
        end,
      });
    }

    const firstDay = days[0];
    const lastDay = days[days.length - 1];

    const recentOrdersPromise = firstDay && lastDay
      ? prisma.order.findMany({
          where: {
            orderDate: {
              gte: firstDay.start,
              lte: lastDay.end,
            },
          },
          select: {
            orderDate: true,
            totalAmount: true,
          },
        })
      : Promise.resolve([]);

    const [
      totalTransactions,
      revenueResult,
      totalProducts,
      totalCustomers,
      lowStockRecords,
      topGroupedItems,
      recentOrders,
    ] = await Promise.all([
      totalTransactionsPromise,
      totalRevenuePromise,
      totalProductsPromise,
      totalCustomersPromise,
      lowStockPromise,
      topItemsPromise,
      recentOrdersPromise,
    ]);

    // Format low stock products
    const lowStockProducts: LowStockProductItem[] = lowStockRecords.map((p: Product) => ({
      id: p.id,
      product_code: p.productCode,
      product_name: p.productName,
      price: p.price.toString(),
      stock: p.stock,
    }));

    // Resolve top products details
    const topProductIds = topGroupedItems.map((g: { productId: number }) => g.productId);
    const topProductRecords = await prisma.product.findMany({
      where: { id: { in: topProductIds } },
    });

    const productLookup = new Map<number, Product>();
    topProductRecords.forEach((p: Product) => productLookup.set(p.id, p));

    const totalTopQuantity = topGroupedItems.reduce(
      (sum: number, item: { _sum: { quantity: number | null } }) =>
        sum + (item._sum.quantity || 0),
      0
    );

    const topProducts: TopProductItem[] = topGroupedItems.map(
      (item: { productId: number; _sum: { quantity: number | null; subtotal: Prisma.Decimal | null } }) => {
        const product = productLookup.get(item.productId);
        const soldQuantity = item._sum.quantity || 0;
        const subtotalDecimal = item._sum.subtotal || new Prisma.Decimal(0);
        const percentage =
          totalTopQuantity > 0 ? Math.round((soldQuantity / totalTopQuantity) * 100) : 0;

        return {
          id: item.productId,
          product_code: product ? product.productCode : `PRD-${item.productId}`,
          product_name: product ? product.productName : `Produk #${item.productId}`,
          sold_quantity: soldQuantity,
          total_revenue: subtotalDecimal.toString(),
          percentage,
        };
      }
    );

    // Calculate daily sales trend for the past 7 days
    const dailySales: DailySalesItem[] = days.map((day) => {
      const dayTotal = recentOrders
        .filter((order: { orderDate: Date; totalAmount: Prisma.Decimal }) => {
          const t = order.orderDate.getTime();
          return t >= day.start.getTime() && t <= day.end.getTime();
        })
        .reduce(
          (sum: number, order: { orderDate: Date; totalAmount: Prisma.Decimal }) =>
            sum + parseFloat(order.totalAmount.toString()),
          0
        );

      return {
        date: day.dateStr,
        label: day.label,
        revenue: Math.round(dayTotal),
      };
    });

    const totalRevenue = revenueResult._sum.totalAmount
      ? revenueResult._sum.totalAmount.toString()
      : '0';

    return {
      total_transactions: totalTransactions,
      total_revenue: totalRevenue,
      total_products: totalProducts,
      total_customers: totalCustomers,
      top_products: topProducts,
      low_stock_products: lowStockProducts,
      daily_sales: dailySales,
    };
  }
}

export const dashboardService = new DashboardService();
