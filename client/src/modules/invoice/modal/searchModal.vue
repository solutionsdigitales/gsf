<template>
  <Dialog
    v-if="display"
    :header="$t('FORM.BUTTONS.SEARCH')"
    :closable="false"
    position="top"
    :style="{ width: '35vw' }"
    :modal="true"
    :visible="display"
    footer="Footer"
  >
    <div>
      <div style="height: 360px; padding-top: 20px">
        <TabView>
          <TabPanel :header="$t('FORM.LABELS.SEARCH_QUERIES')">
            <div class="col-p12 padding0">
              <div class="p-field">
                <label for="membre_number">{{ $t("TREE.MEMBERS") }}</label>
                <InputText
                  id="membre_number"
                  class="col-12"
                  placeholder="Numero"
                  v-model="search.customFilters.membre_number"
                />
              </div>
              <br />
              <div class="p-field">
                <label for="pricing">
                  {{ $t("Opération") }}
                </label>
                <Dropdown
                  inputId="pricing"
                  :filter="true"
                  style="padding: 2px"
                  class="col-12"
                  v-model="selectedPricing"
                  @change="setPricing()"
                  :options="pricingList"
                  optionLabel="name"
                />
              </div>
              <br />
              <div class="p-field">
                <label for="cellule">
                  {{ $t("TREE.CELLULE") }}
                </label>
                <Dropdown
                  inputId="cellule"
                  :filter="true"
                  style="padding: 2px"
                  class="col-12"
                  v-model="selectedCellule"
                  @change="setCellule()"
                  :options="cellules"
                  optionLabel="name"
                />
              </div>

              <br />

              <div class="p-field">
                <label for="year">
                  {{ $t("FORM.LABELS.YEAR") }}
                </label>
                <Dropdown
                  id="year"
                  class="col-12"
                  v-model="selectedYear"
                  @change="setYear()"
                  :options="years"
                  :filter="true"
                  optionLabel="id"
                />
              </div>
              <br/>
              <div class="p-field">
                <label for="month">
                  {{ $t("FORM.LABELS.MONTH") }}
                </label>
                <Dropdown
                  id="month"
                  class="col-12"
                  v-model="selectedMonth"
                  @change="setMonth()"
                  :options="months"
                  optionLabel="label"
                  display="chip"
                />
                <br/>
              </div>
            </div>
          </TabPanel>
          <TabPanel :header="$t('FORM.LABELS.DEFAULTS')">
            <div class="col-p12 padding0">
              <periodSelect @onSelectCallback="onSelectPeriod"></periodSelect>
              <br />
              <div class="p-field">
                <label for="limit">{{ $t("FORM.LABELS.LIMIT") }}</label>
                <InputText
                  id="limit"
                  class="col-12"
                  v-model="search.defaultFilters.limit"
                />
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </div>
    <template #footer>
      <div>
        <Button
          :label="$t('FORM.BUTTONS.CANCEL')"
          @click="closeDialog"
          class="p-button-text"
        />

        <Button
          :label="$t('FORM.BUTTONS.SUBMIT')"
          @click="submit"
          class="p-button-raised p-button-text"
        />
      </div>
    </template>
  </Dialog>
</template>

<script>
import { defineComponent } from "vue";
import Store from "../../../service/store";
import searchUtil from "../../../service/searchModalUtil";
import PeriodUtil from "../../../service/period";
import periodSelect from "../../../components/periodSelect.vue";
import PricingService from "../../priceList/price.service";
import CelluleService from "../../cellule/cellule.service";
import constants from "../../../service/constant";

export default defineComponent({
  number: "SearchModal",
  props: {
    filters: Object,
    close: Function,
    display: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      displayValues: {},
      lastDisplayValues: {},
      selectedEmployee: {},
      filterMap: {},
      search: {
        defaultFilters: {},
        changes: null,
        searchQueries: {},
      },

      selectedLocation: null,
      selectedPricing: {},
      selectedCellule: {},
      cellules: [],
      pricingList: [],
      months: [],
      selectedMonth: {},
      selectedYear: {},
      years: [
        {
          id: 2022,
        },
        { id: 2023 },
      ],
    };
  },
  watch: {
    display(newVal) {
      if (newVal) {
        this.reset();
        this.loadFilters();
      }
    },
  },
  mounted() {
    this.init();
  },
  created() {
    this.months = [];
    constants.MONTHS.forEach((m) => {
      this.months.push({
        id: m,
        label: this.$t(`TABLE.COLUMNS.DATE_MONTH.${m}`),
      });
    });
  },
  methods: {
    init() {
      PricingService.read().then((list) => {
        this.pricingList = list;
      });
      CelluleService.read().then((cellues) => {
        this.cellules = cellues.map((cellule) => {
          cellule.name = `${cellule.number} - ${cellule.name}`;
          return cellule;
        });
      });
    },
    submit() {
      const loggedChanges = searchUtil.getChanges(
        Object.assign(
          {},
          this.search.defaultFilters,
          this.search.customFilters
        ),
        this.changes,
        this.displayValues,
        this.lastDisplayValues
      );
      this.close(loggedChanges);
    },
    loadFilters() {
      this.changes = new Store({ identifier: "key" });
      const _defaults = ["limit", "period"];
      const _customs = ["membre_number", "pricing", "cellule", "year", "month"];

      searchUtil.setFilters(this, _defaults, "defaultFilters");
      searchUtil.setFilters(this, _customs, "customFilters");

      searchUtil.setDropDownValue(
        this,
        "pricing",
        this.pricingList,
        "selectedPricing",
        "uuid",
        "name"
      );
      searchUtil.setDropDownValue(
        this,
        "cellule",
        this.cellules,
        "selectedCellule",
        "uuid",
        "name"
      );
    },

    setYear() {
      this.search.customFilters.year = this.selectedYear.id;
    },

    setMonth() {
      this.search.customFilters.month = this.selectedMonth.id;
      this.displayValues.month = this.selectedMonth.label;
    },
    setCellule() {
      this.search.customFilters.cellule = this.selectedCellule.uuid;
      this.displayValues.cellule = this.selectedCellule.name;
    },
    onSelectPeriod(period) {
      const periodKeys = PeriodUtil.processFilterChanges(period);
      periodKeys.forEach((filter) => {
        this.search.defaultFilters[filter.key] = filter.value;
        this.displayValues[filter.key] = filter.displayValue;
      });
    },
    reset() {
      this.search = {
        defaultFilters: {},
        customFilters: {},
      };
    },
    setPricing() {
      this.search.customFilters.pricing = this.selectedPricing.uuid;
      this.displayValues.pricing = this.selectedPricing.name;
    },

    closeDialog() {
      this.reset();
      this.close(false);
    },
  },
  components: {
    periodSelect,
  },
});
</script>
<style scoped>
.padding0 {
  padding: 0px !important;
}
</style>