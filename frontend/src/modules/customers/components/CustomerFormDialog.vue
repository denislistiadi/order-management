<template>
  <v-dialog :model-value="modelValue" max-width="520" persistent @update:model-value="$emit('update:modelValue', $event)">
    <v-card class="customer-dialog-card">
      <div class="dialog-title">
        {{ isEditMode ? 'Edit Data Pelanggan' : 'Tambah Pelanggan Baru' }}
      </div>

      <v-form ref="formRef" v-model="isFormValid" :disabled="submitting" class="dialog-body" @submit.prevent="handleSubmit">
        <v-text-field
          v-model="form.customer_name"
          label="Nama Lengkap *"
          placeholder="Misal: Budi Santoso"
          density="comfortable"
          variant="outlined"
          :rules="[rules.required, rules.maxLength(150)]"
          class="mb-3"
          :autofocus="!isEditMode"
          @input="clearErrorIfAny"
        />

        <!-- Segmented Toggle Button for Gender -->
        <div class="segmented-control-wrapper">
          <label class="control-label">Jenis Kelamin *</label>
          <div class="segmented-toggle">
            <button
              type="button"
              :class="['toggle-btn', { active: form.gender === 'Pria', 'active-pria': form.gender === 'Pria' }]"
              @click="setGender('Pria')"
            >
              <v-icon size="16" icon="mdi-gender-male" />
              Pria
            </button>
            <button
              type="button"
              :class="['toggle-btn', { active: form.gender === 'Wanita', 'active-wanita': form.gender === 'Wanita' }]"
              @click="setGender('Wanita')"
            >
              <v-icon size="16" icon="mdi-gender-female" />
              Wanita
            </button>
          </div>
        </div>

        <v-row dense>
          <v-col cols="12" sm="6">
            <v-date-input
              v-model="birthDateValue"
              label="Tanggal Lahir *"
              placeholder="Pilih tanggal lahir"
              density="comfortable"
              variant="outlined"
              prepend-icon=""
              append-inner-icon="mdi-calendar"
              :max="maxDate"
              :rules="[rules.required, rules.pastDate]"
              class="mb-3"
              clearable
              @update:model-value="onDateChange"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.phone"
              label="Nomor Telepon"
              placeholder="Misal: 081234567890"
              type="text"
              inputmode="numeric"
              density="comfortable"
              variant="outlined"
              :rules="[rules.phoneRule]"
              class="mb-3"
              @input="onPhoneInput"
            />
          </v-col>
        </v-row>

        <v-textarea
          v-model="form.customer_address"
          label="Alamat Lengkap *"
          placeholder="Misal: Jl. Sudirman No. 45, RT 01/RW 02, Jakarta Selatan"
          density="comfortable"
          variant="outlined"
          rows="3"
          :rules="[rules.required, rules.maxLength(255)]"
          class="mb-1"
          @input="clearErrorIfAny"
        />

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
          {{ isEditMode ? 'Simpan Perubahan' : 'Tambah Pelanggan' }}
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import { VDateInput } from 'vuetify/labs/VDateInput';
import { Customer, CustomerFormData, GenderType } from '../types/customer.types';

interface Props {
  modelValue: boolean;
  customer?: Customer | null;
  submitting?: boolean;
  serverError?: string | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', data: CustomerFormData): void;
  (e: 'clearError'): void;
}>();

const formRef = ref<any>(null);
const isFormValid = ref(false);

const form = reactive<CustomerFormData>({
  customer_name: '',
  customer_address: '',
  gender: 'Pria',
  birth_date: '',
  phone: '',
});

const isEditMode = computed(() => !!props.customer);
const birthDateValue = ref<Date | null>(null);
const maxDate = new Date();

function clearErrorIfAny() {
  if (props.serverError) {
    emit('clearError');
  }
}

function setGender(gender: GenderType) {
  form.gender = gender;
  clearErrorIfAny();
}

function onPhoneInput(e: Event) {
  const target = e.target as HTMLInputElement;
  // Permit numbers and standard phone symbols +, -, (, )
  const sanitized = target.value.replace(/[^0-9+()\- ]/g, '');
  form.phone = sanitized;
  clearErrorIfAny();
}

function onDateChange(val: any) {
  clearErrorIfAny();
  if (!val) {
    birthDateValue.value = null;
    form.birth_date = '';
    return;
  }
  const d = new Date(val);
  if (!isNaN(d.getTime())) {
    birthDateValue.value = d;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    form.birth_date = `${yyyy}-${mm}-${dd}`;
  } else {
    form.birth_date = '';
  }
}

watch(
  () => props.customer,
  (val) => {
    if (val) {
      form.customer_name = val.customer_name;
      form.customer_address = val.customer_address;
      form.gender = val.gender;
      form.phone = val.phone || '';
      if (val.birth_date) {
        const d = new Date(val.birth_date);
        birthDateValue.value = !isNaN(d.getTime()) ? d : null;
        form.birth_date = val.birth_date.split('T')[0];
      } else {
        birthDateValue.value = null;
        form.birth_date = '';
      }
    } else {
      form.customer_name = '';
      form.customer_address = '';
      form.gender = 'Pria';
      form.birth_date = '';
      form.phone = '';
      birthDateValue.value = null;
    }
  },
  { immediate: true }
);

const rules = {
  required: (v: any) => (v !== null && v !== undefined && String(v).trim() !== '') || 'Field ini wajib diisi',
  maxLength: (max: number) => (v: string) => !v || v.length <= max || `Maksimal ${max} karakter`,
  pastDate: (v: any) => {
    if (!v) return 'Tanggal lahir wajib diisi';
    const date = new Date(v);
    if (isNaN(date.getTime())) return 'Tanggal lahir tidak valid';
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date <= today || 'Tanggal lahir harus berada di masa lampau';
  },
  phoneRule: (v: string) => {
    if (!v) return true;
    if (v.length > 20) return 'Nomor telepon maksimal 20 digit';
    return /^[0-9+()\- ]*$/.test(v) || 'Format nomor telepon tidak valid';
  },
};

async function handleSubmit() {
  const { valid } = await formRef.value?.validate();
  if (!valid) return;

  const payload: CustomerFormData = {
    customer_name: form.customer_name.trim(),
    customer_address: form.customer_address.trim(),
    gender: form.gender,
    birth_date: form.birth_date,
    phone: form.phone?.trim() ? form.phone.trim() : undefined,
  };

  emit('submit', payload);
}
</script>

