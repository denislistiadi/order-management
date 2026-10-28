/**
 * Customer directory service handling CRUD operations, multi-column sorting,
 * case-insensitive search, pagination, and soft delete logic.
 */

import { Customer, Gender, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import {
  CreateCustomerInput,
  CustomerListParams,
  CustomerListResponse,
  CustomerResponse,
  UpdateCustomerInput,
} from '../types/customer.types';
import { AppError } from '../middlewares/errorHandler';
import { createPaginationMeta } from '../utils/response';

type CustomerSortField = 'customerName' | 'customerAddress' | 'gender' | 'birthDate' | 'phone' | 'id';

const SORT_FIELD_MAP: Record<string, CustomerSortField> = {
  customer_name: 'customerName',
  customername: 'customerName',
  customerName: 'customerName',
  name: 'customerName',
  customer_address: 'customerAddress',
  customeraddress: 'customerAddress',
  customerAddress: 'customerAddress',
  address: 'customerAddress',
  gender: 'gender',
  birth_date: 'birthDate',
  birthdate: 'birthDate',
  birthDate: 'birthDate',
  phone: 'phone',
  id: 'id',
};

export class CustomerService {
  /**
   * Serializes a Prisma Customer record into the standard API DTO.
   * Conforms to the snake_case contract specified in the assessment requirements.
   */
  private formatCustomer(customer: Customer): CustomerResponse {
    const birthDateStr =
      customer.birthDate instanceof Date
        ? customer.birthDate.toISOString().split('T')[0]
        : String(customer.birthDate);

    return {
      id: customer.id,
      customer_name: customer.customerName,
      customer_address: customer.customerAddress,
      gender: customer.gender,
      birth_date: birthDateStr || '',
      phone: customer.phone,
      deleted_at: customer.deletedAt,
    };
  }

  /**
   * Parses flexible sort query parameters into Prisma OrderBy criteria.
   * Supports multi-column sorting: "customer_name:asc,birth_date:desc".
   */
  private parseOrderBy(
    sort?: string,
    defaultOrder: 'asc' | 'desc' = 'asc'
  ): Prisma.CustomerOrderByWithRelationInput[] {
    if (!sort) {
      return [{ customerName: defaultOrder }];
    }

    const orderByList: Prisma.CustomerOrderByWithRelationInput[] = [];
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

    return orderByList.length > 0 ? orderByList : [{ customerName: defaultOrder }];
  }

  /**
   * Retrieves a paginated list of non-deleted customers with optional search and sorting.
   */
  async list(params: CustomerListParams): Promise<CustomerListResponse> {
    const page = Math.max(1, Number(params.page) || 1);
    const perPage = Math.max(1, Math.min(100, Number(params.per_page) || 10));
    const skip = (page - 1) * perPage;

    const where: Prisma.CustomerWhereInput = {
      deletedAt: null,
    };

    if (params.search && params.search.trim()) {
      const keyword = params.search.trim();
      where.customerName = {
        contains: keyword,
        mode: 'insensitive',
      };
    }

    const orderBy = this.parseOrderBy(params.sort, params.order ?? 'asc');

    const [total, records] = await Promise.all([
      prisma.customer.count({ where }),
      prisma.customer.findMany({
        where,
        orderBy,
        skip,
        take: perPage,
      }),
    ]);

    return {
      data: records.map((record) => this.formatCustomer(record)),
      meta: createPaginationMeta(page, perPage, total),
    };
  }

  /**
   * Retrieves detail of an active customer by UUID.
   */
  async getById(id: string): Promise<CustomerResponse> {
    const customer = await prisma.customer.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!customer) {
      const error: AppError = new Error('Pelanggan tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }

    return this.formatCustomer(customer);
  }

  /**
   * Registers a new customer in the database.
   */
  async create(input: CreateCustomerInput): Promise<CustomerResponse> {
    const created = await prisma.customer.create({
      data: {
        customerName: input.customer_name.trim(),
        customerAddress: input.customer_address.trim(),
        gender: input.gender as Gender,
        birthDate: new Date(input.birth_date),
        phone: input.phone ? input.phone.trim() : null,
      },
    });

    return this.formatCustomer(created);
  }

  /**
   * Updates an existing customer profile.
   */
  async update(id: string, input: UpdateCustomerInput): Promise<CustomerResponse> {
    const existing = await prisma.customer.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existing) {
      const error: AppError = new Error('Pelanggan tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }

    const updateData: Prisma.CustomerUpdateInput = {};

    if (input.customer_name !== undefined) {
      updateData.customerName = input.customer_name.trim();
    }

    if (input.customer_address !== undefined) {
      updateData.customerAddress = input.customer_address.trim();
    }

    if (input.gender !== undefined) {
      updateData.gender = input.gender as Gender;
    }

    if (input.birth_date !== undefined) {
      updateData.birthDate = new Date(input.birth_date);
    }

    if (input.phone !== undefined) {
      updateData.phone = input.phone ? input.phone.trim() : null;
    }

    const updated = await prisma.customer.update({
      where: { id },
      data: updateData,
    });

    return this.formatCustomer(updated);
  }

  /**
   * Soft deletes a customer by setting deleted_at timestamp.
   * Ensures past order historical references remain intact.
   */
  async softDelete(id: string): Promise<void> {
    const existing = await prisma.customer.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existing) {
      const error: AppError = new Error('Pelanggan tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }

    await prisma.customer.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

export const customerService = new CustomerService();

