<template>
    <div class="col-p12 card page-body">
        <div style="float: right; width: 400px">

            <Button v-on:click="Add()" :label="$t('FORM.BUTTONS.ADD')" icon="pi pi-plus" />
        </div>
        <br />
        <br />

        <div style="height: calc(73vh)">
            <DataTable @rowSelect="onRowSelect" :value="items" showGridlines stripedRows filterDisplay="row"
                v-model:filters="filter2" v-model:selection="selectedTransaction" dataKey="id"
                :resizableColumns="true" :scrollable="true" columnResizeMode="fit" scrollHeight="flex"
                responsiveLayout="scroll" :loading="loading">
                <template #header>
                    {{ $t("TREE.EXCHANGE_RATE") }}
                </template>

                <template #empty>
                    {{ $t("FORM.SELECT.EMPTY") }}
                </template>

                <Column selectionMode="single" style="max-width: 30px"></Column>
                <Column field="date" :header="$t('TABLE.COLUMNS.DATE_REGISTERED')">
                    <template #body="e">
                        <span>{{ formatDate2(e.data.date)}}</span>
                    </template>
                </Column>
                <Column field="currencyName" :header="$t('FORM.LABELS.CURRENCY')"></Column>
                <Column field="buy_rate" :header="$t('FORM.LABELS.RATE')">
                   <template #body="e">
                    <span class="text-right">{{ round(e.data.buy_rate)}}</span>
                   </template>
                </Column>
            </DataTable>
        </div>
        <div>{{ items.length }} {{ $t("FORM.INFO.ROWS") }}</div>

        <CreateUpdateModal :rate="Rate" ref="addRateModal" :close="closeDialog"
            :display="displayCreateModal">
        </CreateUpdateModal>
    </div>
</template>

<script>
import { FilterMatchMode } from "@primevue/core/api";
import RateService from "./rate.service";

import CreateUpdateModal from "./new.vue";
import AppCache from "../../service/appCache";
import UtilService from "../../service/util";

export default {
    data() {
        return {
            transaction: [],
            Transaction: {},
            latestViewFilters: {},
            items: [],
            loading: false,
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

        this.server = this.$store.state.server;
        this.lang = this.$i18n.locale;
        this.getTransaction();
    },
    methods: {
        getTransaction() {
            this.loading = true;
            const params = {};
            RateService
                .read(null, params)
                .then((items) => {
                    this.items = items;
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
        round(val){
            return parseFloat(val);
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
                    command: () => { },
                },
            ];
        },
    },
    components: {
        CreateUpdateModal,
    },
};
</script>
