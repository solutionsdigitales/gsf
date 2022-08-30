<template>
  <div class="col-p12 card page-body">
    <span
      ><b>{{ $t("FORM.LABELS.SETTING") }}/{{ $t("TREE.TA_SETTING") }}</b></span
    >
    <br />
    <br />

    <div style="height: calc(70vh)">
      <DataTable
        :value="locations"
        showGridlines
        stripedRows
        v-model:selection="selectedLocation"
        :resizableColumns="true"
        :scrollable="true"
        v-model:filters="filters"
        filterDisplay="row"
        columnResizeMode="fit"
        scrollHeight="flex"
        responsiveLayout="scroll"
        dataKey="uuid"
        sortMode="multiple"
        :loading="loading"
      >
        <template #header>
          {{ $t("TREE.LOCATION") }}

          <div class="flex justify-content-between flex-column sm:flex-row">
            <span></span>

            <span class="p-buttonset mb-2">
              <Button
                class="p-button-secondary"
                style="float: left"
                @click="importAccounts()"
                :label="$t('FORM.BUTTONS.IMPORT')"
              />

              <Button
                type="button"
                @click="addLocation"
                :label="$t('FORM.BUTTONS.ADD')"
              />
            </span>
          </div>
        </template>

        <template #empty>
          {{ $t("FORM.SELECT.EMPTY") }}
        </template>
        <Column selectionMode="single" style="max-width: 2rem"></Column>
        <Column
          field="name"
          :header="$t('FORM.LABELS.NAME')"
          style="min-width: 400px"
        >
          <template #body="{ data }">
            {{ data.name }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              type="text"
              v-model="filterModel.value"
              @input="filterCallback()"
              class="p-column-filter"
              :placeholder="`Search by name - ${filterModel.matchMode}`"
            />
          </template>
        </Column>
        <Column field="per_diem_1_14" :header="$t('VOUCHERS.PERDIEM') + '-14'">
          <template #body="e">
            <span class="text-right w100">
              {{ formatCurrency(e.data.per_diem_1_14, enterprise.currency_id) }}
            </span>
          </template>
        </Column>
        <Column
          field="per_diem_15_more"
          :header="$t('VOUCHERS.PERDIEM') + '-15'"
        >
          <template #body="e">
            <span class="text-right w100">
              {{
                formatCurrency(e.data.per_diem_15_more, enterprise.currency_id)
              }}
            </span>
          </template>
        </Column>
        <Column field="lodging" :header="$t('VOUCHERS.HOSTING')">
          <template #body="e">
            <span class="text-right w100">
              {{ formatCurrency(e.data.lodging, enterprise.currency_id) }}
            </span>
          </template>
        </Column>

        <Column field="total" :header="$t('FORM.LABELS.TOTAL')">
          <template #body="e">
            <span class="text-right w100">
              {{ formatCurrency(e.data.total, enterprise.currency_id) }}
            </span>
          </template>
        </Column>

        <Column field="action" header="Action" style="max-width: 8rem">
          <template #body="e">
            <div style="width:100%">
              <LocationActtions
              :entity="e.data"
              v-on:reloadLocationList="getLocations()"
            />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <LocationEditModal
      :location="selectedLocation"
      :close="closeDialog"
      :display="displayLocationEditModal"
    >
    </LocationEditModal>

    <ImportModal
      ref="importModal"
      :close="closeDialog"
      :display="displayImportModal"
    >
    </ImportModal>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { FilterMatchMode } from "primevue/api";
import LocationService from "./location.service";
import LocationEditModal from "./locationEditModal.vue";
import ImportModal from "./importModal.vue";
import LocationActtions from "./LocationActions.vue";
import currencyService from "../../service/currencyService";
import EnterpriseService from "../enterprise/enterprise.service";

export default defineComponent({
  name: "ta_setting",
  data() {
    return {
      types: [],
      locations: [],
      displayLocationEditModal: false,
      displayImportModal: false,
      selectedType: {},
      enterprise: {},
      selectedLocation: {},
      filters: {
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
    };
  },
  created() {
    this.getLocations();
    this.getEnterprise();
  },
  methods: {
    addLocation() {
      this.displayLocationEditModal = true;
    },
    getEnterprise() {
      EnterpriseService.read().then((enterprises) => {
        this.enterprise = enterprises[0] || {};
      });
    },
    formatCurrency(amount) {
      const currecnyId = this.enterprise.currency_id;
      return currencyService.format(amount, currecnyId);
    },
    importAccounts() {
      this.displayImportModal = true;
    },
    getLocations() {
      LocationService.read().then((locations) => {
        this.locations = locations.map((l) => {
          l.total =
            (l.lodging || 0) +
            (l.per_diem_1_14 || 0) +
            (l.per_diem_15_more || 0);
          return l;
        });
      });
    },
    closeDialog(result) {
      if (result) {
        this.getLocations();
      }
      this.displayLocationEditModal = false;
      this.displayImportModal = false;
    },
  },
  components: {
    LocationEditModal,
    LocationActtions,
    ImportModal,
  },
});
</script>
