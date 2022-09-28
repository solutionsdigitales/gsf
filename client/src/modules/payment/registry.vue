<template>
  <div class="col-p12 card page-body">
       <div style="float: right; width: 300px">
      
        <Button v-on:click="Add()" :label="$t('FORM.BUTTONS.ADD')" icon="pi pi-plus" />
      
       <Button
          v-on:click="downloadExcel()"
          class="p-button-secondary"
          :label="$t('FORM.BUTTONS.EXPORT')"
          icon="pi pi-file-excel"
        />
    </div>
    <br />
    <br />
    
    <div style="height: calc(73vh)">
    <DataTable
      @rowSelect="onRowSelect"
      :value="items"
      showGridlines
      stripedRows
      filterDisplay="row"
      v-model:filters="filters"
      v-model:selection="selectedTransaction"
      dataKey="uuid"
       :resizableColumns="true"
        :scrollable="true"
        columnResizeMode="fit"
        scrollHeight="flex"
        responsiveLayout="scroll"
      :loading="loading"
    >
      <template #header>
        {{ $t("TREE.PAYMENT") }}
      </template>

      <template #empty>
        {{ $t("FORM.SELECT.EMPTY") }}
      </template>

      <Column selectionMode="single" style="max-width: 30px"></Column>

      <Column
        field="locked"
        :header="$t('FORM.LABELS.STATUS')"
        style="width: 1%; padding: 0px"
      >
        <template #body="e">
          <div style="height:10px" class="w100">
            <div class="invalid-line" v-if="e.data.locked">&nbsp;</div>
          <div class="valid-line" v-if="!e.data.locked">&nbsp;</div>
          </div>
        </template>
      </Column>

      <Column field="number" :header="$t('FORM.LABELS.NUMBER')"></Column>
      <Column field="date" :header="$t('FORM.LABELS.DATE')"></Column>
      <Column
        field="created_at"
        :header="$t('TABLE.COLUMNS.DATE_REGISTERED')"
      ></Column>

      <Column field="member_fullname" style="min-width: 200px" :header="$t('TREE.MEMBERS')">
        <template #body="{ data }">
          {{ data.member_fullname }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            type="text"
            v-model="filterModel.value"
            @input="filterCallback()"
            class="p-column-filter"
            placeholder="Recherche par noms"
          />
        </template>
      </Column>
      <Column field="amount" :header="$t('FORM.LABELS.AMOUNT')">
        <template #body="e">
          <div class="text-right w100">
             {{ e.data.amount }} {{ e.data.currency }} 
          </div>
        </template>
      </Column>
      <Column
        field="payment_method"
        :header="$t('FORM.LABELS.PAYMENT_METHOD')"
      ></Column>
      <Column
        field="transaction_type"
        :header="$t('FORM.LABELS.TRANSACTION_TYPE')"
      ></Column>
       <Column
        field="period"
        :header="$t('FORM.LABELS.PERIOD')"
      ></Column>
      <Column
        field="user_name"
        :header="$t('TABLE.COLUMNS.REGISTERED_BY')"
      ></Column>

      <Column field="action" header="Action" style="width: 100px">
        <template #body="e">
          <PaymentActions
            :entity="e.data"
            :actionId="e.data.code"
            v-on:reloadtransactionList="getTransaction()"
          />
        </template>
      </Column>
    </DataTable>
    </div>
    <CreateUpdateModal
      :transaction="Transaction"
      ref="addTransactionModal"
      :close="closeDialog"
      :display="displayCreateModal"
    >
    </CreateUpdateModal>
  </div>
</template>

<script>
import { FilterMatchMode } from "primevue/api";
import transactionService from "./payment.service";
import PaymentActions from "./actions";
import CreateUpdateModal from "./new.vue";
import AppCache from "../../service/appCache";
import UtilService from "../../service/util";

export default {
  data() {
    return {
      transaction: [],
      Transaction: {},
      items: [],
      loading: false,
      server: '',
      lang: '',
      selectedTransaction: null,
      displayCreateModal: false,
      filters: {
        member_fullname: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
    };
  },
  created() {
    const cache = AppCache.get("session") || {};
    this.server = this.$store.state.server;
     this.lang = this.$i18n.locale;
    if (cache.token) {
      this.getTransaction();
    } else {
      this.$router.push("/auth");
    }
  },
  methods: {
    getTransaction() {
      this.loading = true;
      transactionService
        .read()
        .then((items) => {
          this.items = items.map((t) => {

            if(t.month) {
              t.period = this.$t('TABLE.COLUMNS.DATE_MONTH.' + t.month ) + ' '+ (t.year || '');
            }
            t.member_fullname = `${t.member_number} -  ${t.member_lastname}  ${(t.member_middlename || '')} ${t.member_firstname}`;
            return t;
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onRowSelect($event) {
      console.log($event.data);
    },
    Add() {
      this.displayCreateModal = true;
      this.Transaction = {};
    },
     downloadExcel() {
      const uri = `${this.server}transactions/download/excel?lang=${this.lang}`;
      UtilService.downloadURI(uri);
    },
    closeDialog(result) {
      if (result) {
        this.getTransaction();
      }
      this.displayCreateModal = false;
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
    PaymentActions,
    CreateUpdateModal,
  },
};
</script>
