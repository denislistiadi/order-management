import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCreateOrderMutation } from './useOrders';
import { useCustomersQuery } from '@/modules/customers/composables/useCustomers';
import { useProductsQuery } from '@/modules/products/composables/useProducts';
import { extractApiError } from '@/core/utils/queryErrors';
import { useToast } from '@/core/composables/useToast';
import type { Customer } from '@/modules/customers/types/customer.types';
import type { Product } from '@/modules/products/types/product.types';

export interface OrderItemFormState {
  product_id: number | null;
  quantity: number;
}

export function useOrderCreateForm() {
  const router = useRouter();
  const toast = useToast();

  // Queries for customer and product datasets
  const customerParams = ref({ per_page: 100 });
  const { data: customersData, isLoading: isLoadingCustomers } = useCustomersQuery(customerParams);

  const productParams = ref({ per_page: 100 });
  const { data: productsData } = useProductsQuery(productParams);

  const customersList = computed<Customer[]>(() => customersData.value?.data || []);
  const productsList = computed<Product[]>(() => productsData.value?.data || []);

  // Form input states
  const selectedCustomerId = ref<string | null>(null);
  const orderItems = ref<OrderItemFormState[]>([{ product_id: null, quantity: 1 }]);

  // Error management for API responses
  const fieldErrors = ref<Record<string, string[]>>({});
  const generalError = ref<string | null>(null);

  // Selected customer details
  const selectedCustomer = computed(() => {
    return customersList.value.find((c) => c.id === selectedCustomerId.value) || null;
  });

  const customerError = computed(() => {
    const errs = fieldErrors.value['customer_id'];
    return errs && errs.length > 0 ? errs[0] : undefined;
  });

  function getItemError(index: number): string | null {
    const errs = fieldErrors.value[`items.${index}.quantity`];
    return errs && errs.length > 0 ? errs[0] : null;
  }

  function getProductError(index: number): string | null {
    const errs = fieldErrors.value[`items.${index}.product_id`];
    return errs && errs.length > 0 ? errs[0] : null;
  }

  function clearErrors() {
    fieldErrors.value = {};
    generalError.value = null;
  }

  // Row manipulation actions
  function addItem() {
    orderItems.value.push({ product_id: null, quantity: 1 });
    clearErrors();
  }

  function removeItem(index: number) {
    if (orderItems.value.length > 1) {
      orderItems.value.splice(index, 1);
      clearErrors();
    }
  }

  function updateItem(index: number, val: OrderItemFormState) {
    orderItems.value[index] = val;
    clearErrors();
  }

  // Calculations for items and prices
  const totalQuantity = computed(() => {
    return orderItems.value.reduce((sum, item) => sum + (item.quantity || 0), 0);
  });

  const grandTotal = computed(() => {
    return orderItems.value.reduce((sum, item) => {
      if (!item.product_id) return sum;
      const prod = productsList.value.find((p) => p.id === item.product_id);
      if (!prod) return sum;
      const priceNum = parseFloat(prod.price) || 0;
      return sum + priceNum * (item.quantity || 0);
    }, 0);
  });

  const isFormValid = computed(() => {
    if (!selectedCustomerId.value) return false;
    if (orderItems.value.length === 0) return false;
    return orderItems.value.every((item) => !!item.product_id && item.quantity > 0);
  });

  // Mutation handling for creating an order
  const { mutateAsync: createOrder, isPending: isSubmitting } = useCreateOrderMutation();

  async function handleSubmitOrder() {
    clearErrors();

    if (!isFormValid.value) {
      const errMap: Record<string, string[]> = {};
      if (!selectedCustomerId.value) {
        errMap['customer_id'] = ['Pelanggan wajib dipilih terlebih dahulu'];
      }
      orderItems.value.forEach((item, idx) => {
        if (!item.product_id) {
          errMap[`items.${idx}.product_id`] = ['Produk barang wajib dipilih'];
        }
        if (!item.quantity || item.quantity <= 0) {
          errMap[`items.${idx}.quantity`] = ['Jumlah kuantitas minimal 1 unit'];
        }
      });
      fieldErrors.value = errMap;
      generalError.value = 'Mohon lengkapi pelanggan dan seluruh barang pesanan dengan benar';
      return;
    }

    const payload = {
      customer_id: selectedCustomerId.value!,
      items: orderItems.value.map((i) => ({
        product_id: i.product_id!,
        quantity: i.quantity,
      })),
    };

    try {
      const result = await createOrder(payload);
      toast.success(`Transaksi berhasil dibuat: ${result.data?.order_number}`);
      selectedCustomerId.value = null;
      orderItems.value = [{ product_id: null, quantity: 1 }];
      router.push('/orders');
    } catch (err) {
      const extracted = extractApiError(err);
      generalError.value = extracted.message;
      fieldErrors.value = extracted.fieldErrors || {};
      toast.error(extracted.message);
    }
  }

  return {
    customersList,
    productsList,
    isLoadingCustomers,
    selectedCustomerId,
    orderItems,
    fieldErrors,
    generalError,
    selectedCustomer,
    customerError,
    getItemError,
    getProductError,
    clearErrors,
    addItem,
    removeItem,
    updateItem,
    totalQuantity,
    grandTotal,
    isFormValid,
    isSubmitting,
    handleSubmitOrder,
  };
}

