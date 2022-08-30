<template>
  <div class="col-p12 card page-body">
    <div style="float: right !important; width: 205px">
      <span class="p-buttonset">
        <Button
          class="p-button-secondary"
          style="float: left"
          @click="importAccounts()"
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
    <div style="height: calc(70vh)">
      <DataTable
        @rowSelect="onRowSelect"
        :value="items"
        showGridlines
        :scrollable="true"
        scrollHeight="flex"
        stripedRows
        dataKey="uuid"
        :filters="filters1"
        :resizableColumns="true"
        :rowHover="true"
        filterDisplay="menu"
        v-model:selection="selectedAccount"
   
        responsiveLayout="scroll"
        :loading="loading"
      >
        <template #header>
          {{ $t("TREE.ACCOUNT") }}

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

<Column field="code"  :header="$t('FORM.LABELS.CODE')" style="max-width: 5rem"></Column>
        <Column field="title" :header="$t('FORM.LABELS.TITLE')"></Column>
        <Column
          field="short_title"
          :header="$t('FORM.LABELS.ABBREVIATION')"
          style="max-width: 10rem"
        ></Column>
        <Column field="status" style="max-width: 4rem" :header="$t('FORM.LABELS.STATUS')"></Column>
        <Column field="action" header="Action" style="max-width: 5rem">
          <template #body="e">
            <accountActtions
              :entity="e.data"
              v-on:reloadaccountList="getAccount()"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <CreateUpdateModal
      :account="divition"
      ref="addAccountModal"
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
import accountService from "./account.service";
import accountActtions from "./actions";
import CreateUpdateModal from "./createUpdateModal";
import AppCache from "../../service/appCache";
import ImportModal from "./importModal.vue";
import { FilterMatchMode } from "primevue/api";

export default {
  data() {
    return {
      account: [],
      divition: {},
      items: [],
      selectedAccount: null,
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
      this.getAccount();
    } else {
      this.$router.push("/auth");
    }
  },
  methods: {
    getAccount() {
      this.loading = true;
      accountService.read().then((items) => {
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
      this.divition = {};
    },
    closeDialog(result) {
      if (result) {
        this.getAccount();
      }
      this.displayCreateModal = false;
      this.displayImportModal = false;
    },
    importAccounts() {
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
    accountActtions,
    CreateUpdateModal,
    ImportModal,
  },
};
</script>
