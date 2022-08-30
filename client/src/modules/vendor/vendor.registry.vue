<template>
   <div class="col-p12 card page-body">
    <div class="fRight"> <span class="p-buttonset">
        <Button
          class="p-button-secondary"
          style="float: left"
          @click="importvendors()"
          :label="$t('FORM.BUTTONS.IMPORT')"
        />

        <Button
          @click="Add()"
          :label="$t('FORM.BUTTONS.ADD')"
          icon="pi pi-plus"
        />
      </span>
    </div>
    <br />
    <br />
    <div style="height: calc(75vh)">
      <DataTable
        
        @rowSelect="onRowSelect"
        :value="items"
        showGridlines
        stripedRows
        v-model:selection="selectedVendor"
        :resizableColumns="true"
        :scrollable="true"
        columnResizeMode="fit"
        scrollHeight="flex"
        responsiveLayout="scroll"
        dataKey="uuid"
        sortMode="multiple"
        :loading="loading"
      >
        <template #header>
          {{ $t("TREE.VENDOR") }}

          <div class="flex justify-content-between flex-column sm:flex-row">
            <span></span>
            <span class="p-input-icon-left mb-2">
              <i class="pi pi-search" />
              <InputText
                v-model="filters1['global'].value"
                placeholder="Keyword Search"
                style="width: 100%"
              />
            </span>
          </div>
        </template>


        <template #empty>
          {{ $t("FORM.SELECT.EMPTY") }}
        </template>
        <Column selectionMode="single" style="max-width: 2rem"></Column>

        <Column field="id"  :header="$t('FORM.LABELS.ID')"></Column>
        <Column field="name" :header="$t('FORM.LABELS.NAME')" style="min-width: 400px"></Column>
        <Column
          field="status"
          :header="$t('FORM.LABELS.STATE')"
        ></Column>
        <Column field="address" :header="$t('FORM.LABELS.ADDRESS')"></Column>
        <Column field="city" :header="$t('FORM.LABELS.CITY')"></Column>
        <Column field="province" :header="$t('FORM.LABELS.PROVINCE')"></Column>
        <Column field="country" :header="$t('FORM.LABELS.COUNTRY')"></Column>
        <Column field="action" header="Action" style="max-width: 5rem">
          <template #body="e">
            <vendorActtions
              :entity="e.data"
              v-on:reloadvendorList="getvendor()"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <CreateUpdateModal
      :vendor="vendor"
      ref="addVendorModal"
      :close="closeDialog"
      :display="displayCreateModal"
    >
    </CreateUpdateModal>

    <ImportModal
      ref="importModal"
      :close="closeDialog"
      :display="displayImportModal"
    >
    </ImportModal>
  </div>
</template>

<script>
import VendorService from "./vendor.service";
import vendorActtions from "./actions";
import CreateUpdateModal from "./createUpdateModal";
import AppCache from "../../service/appCache";
import ImportModal from "./importModal.vue";
import { FilterMatchMode } from "primevue/api";

export default {
  data() {
    return {
      vendors: [],
      vendor: {},
      items: [],
      selectedVendor: null,
      displayCreateModal: false,
      displayImportModal: false,
      loading : false,
      filters1: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
    };
  },
  created() {
    const cache = AppCache.get("session") || {};
    if (cache.token) {
      this.getvendor();
    } else {
      this.$router.push("/auth");
    }
  },
  methods: {
    getvendor() {
      this.loading = true;
      VendorService.read().then((items) => {
        this.items = items;
      }).finally(() => {
        this.loading = false;
      })
    },
    onRowSelect($event) {
      console.log($event.data);
    },
    Add() {
      this.displayCreateModal = true;
      this.vendor = {};
    },
    closeDialog(result) {
      if (result) {
        this.getvendor();
      }
      this.displayCreateModal = false;
      this.displayImportModal = false;
    },
    importvendors() {
      this.displayImportModal = true;
    },
    toggleAction(event) {
      this.$refs.cm.show(event.originalEvent);
      this.items = [
        {
          label: "delete",
          icon: "pi pi-check",
          command: () => {},
        },
      ];
    },
  },
  components: {
    vendorActtions,
    CreateUpdateModal,
    ImportModal,
  },
};
</script>
