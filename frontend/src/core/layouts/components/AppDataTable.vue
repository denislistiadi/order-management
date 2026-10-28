<!--
  Global AppDataTable component.
  Encapsulates unified server-side table styling, debounce search,
  clean pagination controls (without 'All'), and dynamic slot forwarding.
-->
<template>
  <div class="app-data-table-wrapper">
    <!-- Optional Toolbar with Search & Custom Actions -->
    <div v-if="showSearch || $slots['toolbar-actions']" class="table-toolbar">
      <v-text-field
        v-if="showSearch"
        v-model="searchKeyword"
        :placeholder="searchPlaceholder"
        :loading="loading ? '#FF5B00' : false"
        prepend-inner-icon="mdi-magnify"
        density="compact"
        variant="outlined"
        hide-details
        clearable
        class="search-field"
        :data-testid="searchTestId"
        @update:model-value="onSearchInput"
      />
      <div v-if="$slots['toolbar-actions']" class="toolbar-actions d-flex align-center gap-2">
        <slot name="toolbar-actions" />
      </div>
    </div>

    <!-- Core Data Table Server -->
    <v-data-table-server
      :headers="headers"
      :items="items"
      :items-length="totalItems"
      :loading="loading ? '#FF5B00' : false"
      :items-per-page="itemsPerPage"
      :items-per-page-options="itemsPerPageOptions"
      :page="page"
      :sort-by="sortBy"
      :multi-sort="multiSort"
      hover
      density="comfortable"
      class="custom-data-table"
      :no-data-text="noDataText"
      :loading-text="loadingText"
      @update:options="onOptionsChange"
      @update:sort-by="$emit('update:sortBy', $event)"
    >
      <template #loading>
        <div class="d-flex flex-column align-center justify-center py-12">
          <v-progress-circular indeterminate color="#FF5B00" size="36" width="3" class="mb-3" />
          <span class="text-caption text-grey font-weight-medium">{{ loadingText }}</span>
        </div>
      </template>

      <template #no-data>
        <div class="d-flex flex-column align-center justify-center py-12">
          <v-icon size="44" color="grey-lighten-1" class="mb-2">mdi-package-variant-closed-remove</v-icon>
          <div class="text-subtitle-2 font-weight-semibold text-grey-darken-3 mb-1">
            {{ noDataText }}
          </div>
          <span class="text-caption text-grey">
            Tidak ada data yang cocok dengan kriteria saat ini.
          </span>
        </div>
      </template>

      <!-- Dynamic slot passthrough for headers, rows, item cells, footer -->
      <template v-for="(_, slotName) in $slots" #[slotName]="slotData">
        <slot :name="slotName" v-bind="slotData" />
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface HeaderItem {
  title: string;
  key: string;
  align?: 'start' | 'center' | 'end';
  sortable?: boolean;
  width?: string | number;
  minWidth?: string | number;
}

interface Props {
  headers: HeaderItem[];
  items: any[];
  totalItems: number;
  loading?: boolean;
  page?: number;
  itemsPerPage?: number;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchTestId?: string;
  noDataText?: string;
  loadingText?: string;
  itemsPerPageOptions?: Array<{ value: number; title: string }>;
  multiSort?: boolean;
  sortBy?: Array<{ key: string; order: 'asc' | 'desc' }>;
}

withDefaults(defineProps<Props>(), {
  loading: false,
  page: 1,
  itemsPerPage: 10,
  showSearch: true,
  searchPlaceholder: 'Cari data...',
  noDataText: 'Belum ada data tersedia',
  loadingText: 'Memuat data...',
  multiSort: true,
  sortBy: () => [{ key: 'product_name', order: 'asc' }],
  itemsPerPageOptions: () => [
    { value: 10, title: '10' },
    { value: 25, title: '25' },
    { value: 50, title: '50' },
    { value: 100, title: '100' },
  ],
});

const emit = defineEmits<{
  (e: 'update:options', options: { page: number; itemsPerPage: number; sortBy: any[] }): void;
  (e: 'update:sortBy', sortBy: any[]): void;
  (e: 'search', keyword: string): void;
}>();

const searchKeyword = ref('');
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function onSearchInput(val: string | null) {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    emit('search', val?.trim() || '');
  }, 300);
}

function onOptionsChange(options: any) {
  emit('update:options', options);
}
</script>

<style scoped lang="scss" src="../styles/data-table.scss" />
