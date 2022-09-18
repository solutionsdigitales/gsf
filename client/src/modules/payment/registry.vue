<template>
  <div class="col-p12 card page-body">
    <div style="float: right; width: 300px">
      <span class="p-buttonset">
        <Button
          style="float: right"
          id="addButton"
          v-on:click="Add()"
          :label="$t('FORM.BUTTONS.ADD')"
          icon="pi pi-plus"
        />
      </span>
    </div>
    <br />
    <br />
    <br />
    <DataTable
      @rowSelect="onRowSelect"
      :value="items"
      showGridlines
      stripedRows
      filterDisplay="row"
      v-model:filters="filters"
      v-model:selection="selectedTransaction"
      dataKey="uuid"
      :loading="loading"
      responsiveLayout="scroll"
    >
      <template #header>
        {{ $t("TREE.PAYMENT") }}
      </template>

      <template #empty>
        {{ $t("FORM.SELECT.EMPTY") }}
      </template>

      <Column selectionMode="single" headerStyle="width: 3em"></Column>

      <Column
        field="locked"
        :header="$t('FORM.LABELS.STATUS')"
        style="width: 1%; padding: 0px"
      >
        <template #body="e">
          <div class="invalid-line" v-if="e.data.locked">&nbsp;</div>
          <div class="valid-line" v-if="!e.data.locked">&nbsp;</div>
        </template>
      </Column>

      <Column field="number" :header="$t('FORM.LABELS.NUMBER')"></Column>
      <Column field="date" :header="$t('FORM.LABELS.DATE')"></Column>
      <Column
        field="created_at"
        :header="$t('TABLE.COLUMNS.DATE_REGISTERED')"
      ></Column>

      <Column field="member_fullname" :header="$t('FORM.LABELS.NAME')">
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
          <span> {{ e.data.amount }} {{ e.data.currency }} </span>
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

export default {
  data() {
    return {
      transaction: [],
      Transaction: {},
      items: [],
      loading: false,
      selectedTransaction: null,
      displayCreateModal: false,
      filters: {
        member_fullname: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
    };
  },
  created() {
    const cache = AppCache.get("session") || {};
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
            t.member_fullname =
              t.member_lastname +
              " " +
              (t.member_middlename || "") +
              " " +
              t.member_firstname;
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