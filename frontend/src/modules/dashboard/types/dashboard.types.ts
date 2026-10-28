export interface TopProductItem {
  id: number;
  product_code: string;
  product_name: string;
  sold_quantity: number;
  total_revenue: string;
  percentage: number;
  color?: string;
}

export interface LowStockProductItem {
  id: number;
  product_code: string;
  product_name: string;
  price: string;
  stock: number;
}

export interface DailySalesItem {
  date: string;
  label: string;
  revenue: number;
}

export interface DashboardSummaryData {
  total_transactions: number;
  total_revenue: string;
  total_products: number;
  total_customers: number;
  top_products: TopProductItem[];
  low_stock_products: LowStockProductItem[];
  daily_sales: DailySalesItem[];
}

