<template>
  <div class="col-p12 card page-body">
    <div style="float: right; width: 400px">
      <Button
        v-on:click="onenSearchModal()"
        :label="$t('FORM.BUTTONS.SEARCH')"
        icon="pi pi-search"
      />

      <Button
        v-on:click="Add()"
        :label="$t('FORM.BUTTONS.ADD')"
        icon="pi pi-plus"
      />

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
        v-model:filters="filter2"
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
          {{ $t("TREE.TRANSACTIONS") }}
          <div class="col-12 noLeft">
            <bhFilters
              :filters="latestViewFilters"
              @onRemoveFilter="onRemoveFilter"
            >
            </bhFilters>
          </div>
        </template>

        <template #empty>
          {{ $t("FORM.SELECT.EMPTY") }}
        </template>

        <Column selectionMode="single" style="max-width: 30px"></Column>

        <Column
          field="locked"
          :header="$t('FORM.LABELS.STATUS')"
          style=" padding: 0px"
        >
          <template #body="e">
            <div style="height: 10px" class="w100">
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

        <Column
          field="member_fullname"
          style="min-width: 200px"
          :header="$t('TREE.MEMBERS')"
        >
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
        <Column field="period" :header="$t('FORM.LABELS.PERIOD')"></Column>
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
    <div>{{ items.length }} {{ $t("FORM.INFO.ROWS") }}</div>

    <CreateUpdateModal
      :transaction="Transaction"
      ref="addTransactionModal"
      :close="closeDialog"
      :display="displayCreateModal"
    >
    </CreateUpdateModal>
    <SearchModal
      :filters="latestViewFilters"
      :display="displaySearchModal"
      :close="closeModal"
    >
    </SearchModal>
  </div>
</template>

<script>
import { FilterMatchMode } from "@primevue/core/api";
import transactionService from "./payment.service";
import PaymentActions from "./actions.vue";
import bhFilters from "../../components/filters.vue";
import SearchModal from "./modal/searchModal.vue";
import CreateUpdateModal from "./new.vue";
import AppCache from "../../service/appCache";
import UtilService from "../../service/util";
import PaymentService from "./payment.service";

export default {
  data() {
    return {
      transaction: [],
      Transaction: {},
      latestViewFilters: {},
      items: [],
      loading: false,
      displaySearchModal: false,
      server: "",
      lang: "",
      selectedTransaction: null,
      displayCreateModal: false,
      cashKey: "payList",
      filters: [],
      filter2: {
        member_fullname: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
    };
  },
  created() {
    const cache = AppCache.get("session") || {};
    const searchParams = Object.keys(this.$route.params);
    this.lang = this.$i18n.locale;
    this.filters = PaymentService.filters;
    this.latestViewFilters = this.filters.formatView();
    this.server = this.$store.state.server;
    this.lang = this.$i18n.locale;
    if (cache.token) {
      if (searchParams.length > 0) {
        this.filters._resetCustomFilters();
        this.filters.updateKeys(
          this,
          "latestViewFilters",
          JSON.parse(this.$route.params.filters),
          () => {
            this.getTransaction();
            this.filters.cachFilters(this.cashKey);
          }
        );
      } else {
        this.filters.loadCache(this, "latestViewFilters", this.cashKey, () => {
          this.getTransaction();
        });
      }
    } else {
      this.$router.push("/auth");
    }
  },
  methods: {
    getTransaction() {
      this.loading = true;
      const params = this.filters.formatHTTP(true) || {};
      transactionService
        .read(null, params)
        .then((items) => {
          this.items = items.map((t) => {
            if (t.month) {
              t.period =
                this.$t("TABLE.COLUMNS.DATE_MONTH." + t.month) +
                " " +
                (t.year || "");
            }
            t.member_fullname = `${t.member_number} -  ${t.member_lastname}  ${
              t.member_middlename || ""
            } ${t.member_firstname}`;
            t.date = this.formatDate1(t.date);
            t.created_at = this.formatDate2(t.created_at);
            return t;
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    formatDate1(date) {
      if (!date) return;
      return UtilService.formatDate(date, "DD/MM/YYYY");
    },
     formatDate2(date) {
      if (!date) return;
      return UtilService.formatDate(date, "DD/MM/YYYY H:mm:s");
    },
    onRemoveFilter(filter) {
      this.filters.resetFilterState(filter._key);
      this.latestViewFilters = this.filters.formatView();
      this.filters.cachFilters(this.cashKey);
      return this.getTransaction();
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
    onenSearchModal() {
      this.displaySearchModal = true;
    },
    closeDialog(result) {
      if (result) {
        this.getTransaction();
      }
      this.displayCreateModal = false;
    },
    closeModal(changes) {
      this.displaySearchModal = false;
      if (!changes) return;
      this.filters.updateKeys(this, "latestViewFilters", changes, () => {
        this.getTransaction();
        this.filters.cachFilters(this.cashKey);
      });
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
    bhFilters,
    SearchModal,
  },
};
</script>
