<template>
  <div class="products-page">
    <div class="page-header">
      <div>
        <h1 class="page-title mb-1">Katalog Produk</h1>
        <p class="page-subtitle">
          Kelola inventaris barang, kontrol stok real-time, dan tentukan harga jual produk.
        </p>
      </div>

      <v-btn
        prepend-icon="mdi-plus"
        class="btn-create-product"
        data-testid="create-product-btn"
        @click="openCreateDialog"
      >
        Tambah Produk
      </v-btn>
    </div>

    <v-card class="products-card">
      <ProductDataTable
        :items="productsList"
        :total-items="totalProducts"
        :loading="isTableLoading"
        :page="queryParams.page || 1"
        :items-per-page="queryParams.per_page || 10"
        :sort-by="currentSortBy"
        multi-sort
        @update:options="handleOptionsChange"
        @update:sort-by="currentSortBy = $event"
        @search="handleSearch"
        @edit="openEditDialog"
        @delete="openDeleteDialog"
      />
    </v-card>

    <ProductFormDialog
      v-model="isFormOpen"
      :product="selectedProduct"
      :submitting="isCreating || isUpdating"
      :server-error="formError"
      @submit="handleFormSubmit"
      @clear-error="formError = null"
    />

    <ProductDeleteDialog
      v-model="isDeleteOpen"
      :product="selectedProduct"
      :deleting="isDeleting"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ProductDataTable from '../components/ProductDataTable.vue';
import ProductFormDialog from '../components/ProductFormDialog.vue';
import ProductDeleteDialog from '../components/ProductDeleteDialog.vue';
import {
  useProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '../composables/useProducts';
import { Product, ProductFormData, ProductListParams } from '../types/product.types';
import { extractApiError } from '@/core/utils/queryErrors';
import { useToast } from '@/core/composables/useToast';

const toast = useToast();

const queryParams = ref<ProductListParams>({
  page: 1,
  per_page: 10,
  search: '',
  sort: 'product_name',
  order: 'asc',
});

const { data: apiResponse, isLoading, isFetching } = useProductsQuery(queryParams);
const isTableLoading = computed(() => isLoading.value || isFetching.value);
const { mutateAsync: createProduct, isPending: isCreating } = useCreateProductMutation();
const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdateProductMutation();
const { mutateAsync: deleteProduct, isPending: isDeleting } = useDeleteProductMutation();

const productsList = computed(() => apiResponse.value?.data || []);
const totalProducts = computed(() => apiResponse.value?.meta?.total || 0);

const isFormOpen = ref(false);
const isDeleteOpen = ref(false);
const selectedProduct = ref<Product | null>(null);
const formError = ref<string | null>(null);
const currentSortBy = ref<Array<{ key: string; order: 'asc' | 'desc' }>>([
  { key: 'product_name', order: 'asc' },
]);

function openCreateDialog() {
  selectedProduct.value = null;
  formError.value = null;
  isFormOpen.value = true;
}

function openEditDialog(product: Product) {
  selectedProduct.value = product;
  formError.value = null;
  isFormOpen.value = true;
}

function openDeleteDialog(product: Product) {
  selectedProduct.value = product;
  isDeleteOpen.value = true;
}

function handleOptionsChange(opts: { page: number; itemsPerPage: number; sortBy: any[] }) {
  queryParams.value.page = opts.page;
  queryParams.value.per_page = opts.itemsPerPage;

  if (opts.sortBy && opts.sortBy.length > 0) {
    currentSortBy.value = opts.sortBy;
    queryParams.value.sort = opts.sortBy.map((s) => `${s.key}:${s.order}`).join(',');
  } else {
    currentSortBy.value = [];
    queryParams.value.sort = 'product_name';
    queryParams.value.order = 'asc';
  }
}

function handleSearch(keyword: string) {
  queryParams.value.search = keyword;
  queryParams.value.page = 1;
}

async function handleFormSubmit(data: ProductFormData) {
  formError.value = null;
  try {
    if (selectedProduct.value) {
      await updateProduct({ id: selectedProduct.value.id, data });
      toast.success('Produk berhasil diperbarui');
    } else {
      await createProduct(data);
      toast.success('Produk baru berhasil ditambahkan');
    }
    isFormOpen.value = false;
  } catch (err) {
    const extracted = extractApiError(err);
    formError.value = extracted.message;
    toast.error(extracted.message);
  }
}

async function handleDeleteConfirm() {
  if (!selectedProduct.value) return;
  try {
    await deleteProduct(selectedProduct.value.id);
    toast.success('Produk berhasil dihapus');
    isDeleteOpen.value = false;
  } catch (err) {
    const extracted = extractApiError(err);
    toast.error(extracted.message);
  }
}
</script>

<style lang="scss" src="../styles/products.scss" />


