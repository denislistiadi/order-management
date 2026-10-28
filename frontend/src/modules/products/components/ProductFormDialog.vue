<template>
  <v-dialog :model-value="modelValue" max-width="520" persistent @update:model-value="$emit('update:modelValue', $event)">
    <v-card class="product-dialog-card">
      <div class="dialog-title">
        {{ isEditMode ? 'Edit Data Produk' : 'Tambah Produk Baru' }}
      </div>

      <v-form ref="formRef" v-model="isFormValid" :disabled="submitting" class="dialog-body" @submit.prevent="handleSubmit">
        <v-text-field
          v-model="productCodeSuffix"
          label="Kode Produk *"
          placeholder="021"
          prefix="PRD-"
          type="text"
          inputmode="numeric"
          density="comfortable"
          variant="outlined"
          :rules="[rules.required, rules.digitsOnly, rules.maxLength(16)]"
          class="mb-3 code-field"
          hint="Hanya berupa angka setelah awalan PRD- (misal: 021)"
          persistent-hint
          @input="onCodeInput"
          @keypress="onCodeKeyPress"
        />

        <v-text-field
          v-model="form.product_name"
          label="Nama Produk *"
          placeholder="Misal: Logitech MX Master 3S"
          density="comfortable"
          variant="outlined"
          :rules="[rules.required, rules.maxLength(150)]"
          class="mb-3"
          :autofocus="!isEditMode"
          @input="props.serverError && $emit('clearError')"
        />

        <v-row dense>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="displayPrice"
              label="Harga Satuan *"
              placeholder="0"
              prefix="Rp"
              type="text"
              inputmode="numeric"
              density="comfortable"
              variant="outlined"
              :rules="[rules.required, rules.positiveNumber]"
              class="mb-3"
              @input="onPriceInput"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="displayStock"
              label="Jumlah Stok *"
              placeholder="0"
              type="text"
              inputmode="numeric"
              density="comfortable"
              variant="outlined"
              :rules="[rules.required, rules.nonNegativeNumber]"
              class="mb-3"
              @input="onStockInput"
            />
          </v-col>
        </v-row>

        <div v-if="serverError" class="dialog-error-box mt-3" data-testid="dialog-error-banner">
          <div class="error-badge-icon">
            <v-icon icon="mdi-alert-circle-outline" size="18" />
          </div>
          <div class="error-body">
            <span class="error-title">Gagal Menyimpan Data</span>
            <span class="error-desc">{{ serverError }}</span>
          </div>
        </div>
      </v-form>

      <div class="dialog-actions">
        <v-btn variant="plain" :disabled="submitting" @click="$emit('update:modelValue', false)">
          Batal
        </v-btn>
        <v-btn
          class="btn-submit"
          :loading="submitting"
          :disabled="!isFormValid || submitting"
          @click="handleSubmit"
        >
          {{ isEditMode ? 'Simpan Perubahan' : 'Tambah Produk' }}
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import { Product, ProductFormData } from '../types/product.types';

interface Props {
  modelValue: boolean;
  product?: Product | null;
  submitting?: boolean;
  serverError?: string | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', data: ProductFormData): void;
  (e: 'clearError'): void;
}>();

const formRef = ref<any>(null);
const isFormValid = ref(false);

const form = reactive<{
  product_name: string;
  price: number;
  stock: number;
}>({
  product_name: '',
  price: 0,
  stock: 0,
});

const productCodeSuffix = ref('');
const displayPrice = ref('');
const displayStock = ref('');

const isEditMode = computed(() => !!props.product);

function formatNumberWithSeparator(val: number | string): string {
  const digits = String(val).replace(/\D/g, '');
  if (!digits) return '';
  return new Intl.NumberFormat('id-ID').format(Number(digits));
}

function onCodeKeyPress(e: KeyboardEvent) {
  // Hanya memperbolehkan karakter angka (0-9)
  if (!/\d/.test(e.key)) {
    e.preventDefault();
  }
}

function onCodeInput(e: Event) {
  const target = e.target as HTMLInputElement;
  // Membersihkan input secara instan dari karakter non-angka (termasuk jika paste awalan "PRD-")
  const digits = target.value.replace(/\D/g, '');
  productCodeSuffix.value = digits;
  if (props.serverError) emit('clearError');
}

function onPriceInput(e: Event) {
  const target = e.target as HTMLInputElement;
  const raw = target.value.replace(/\D/g, '');
  form.price = raw ? parseInt(raw, 10) : 0;
  displayPrice.value = raw ? formatNumberWithSeparator(raw) : '';
  if (props.serverError) emit('clearError');
}

function onStockInput(e: Event) {
  const target = e.target as HTMLInputElement;
  const raw = target.value.replace(/\D/g, '');
  form.stock = raw ? parseInt(raw, 10) : 0;
  displayStock.value = raw ? formatNumberWithSeparator(raw) : '';
  if (props.serverError) emit('clearError');
}

watch(
  () => props.product,
  (val) => {
    if (val) {
      productCodeSuffix.value = val.product_code.replace(/\D/g, '');
      form.product_name = val.product_name;
      form.price = parseFloat(val.price) || 0;
      form.stock = val.stock;
      displayPrice.value = form.price > 0 ? formatNumberWithSeparator(form.price) : '';
      displayStock.value = formatNumberWithSeparator(form.stock);
    } else {
      productCodeSuffix.value = '';
      form.product_name = '';
      form.price = 0;
      form.stock = 0;
      displayPrice.value = '';
      displayStock.value = '0';
    }
  },
  { immediate: true }
);

const rules = {
  required: (v: any) => (v !== null && v !== undefined && String(v).trim() !== '') || 'Field ini wajib diisi',
  digitsOnly: (v: string) => !v || /^\d+$/.test(v) || 'Kode produk hanya boleh berupa angka',
  maxLength: (max: number) => (v: string) => !v || v.length <= max || `Maksimal ${max} karakter`,
  positiveNumber: (v: any) => {
    const num = typeof v === 'number' ? v : Number(String(v).replace(/\D/g, ''));
    return num > 0 || 'Harga harus lebih dari 0';
  },
  nonNegativeNumber: (v: any) => {
    if (v === '' || v === null || v === undefined) return 'Field ini wajib diisi';
    const num = typeof v === 'number' ? v : Number(String(v).replace(/\D/g, ''));
    return num >= 0 || 'Stok tidak boleh bernilai negatif';
  },
};

async function handleSubmit() {
  const { valid } = await formRef.value?.validate();
  if (!valid) return;

  const digits = productCodeSuffix.value.replace(/\D/g, '');
  const productCode = `PRD-${digits}`;

  const payload: ProductFormData = {
    product_code: productCode,
    product_name: form.product_name.trim(),
    price: form.price,
    stock: form.stock,
  };
  emit('submit', payload);
}
</script>

