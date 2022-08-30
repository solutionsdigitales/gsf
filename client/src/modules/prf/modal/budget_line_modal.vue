<template>
  <Dialog
    v-if="display"
    :header="$t('TREE.BUDGET_LINE')"
    :closable="false"
    position="top"
    :style="{ width: '65vw' }"
    :modal="true"
    :visible="display"
    footer="Footer"
  >
    <br />
    <div>
      <div style="height: calc(50vh)">
        <DataTable
          :value="budgetLineList"
          v-model:selection="selectedLine"
          :resizableColumns="true"
          v-model:filters="filters"
          filterDisplay="row"
          showGridlines
          :scrollable="true"
          scrollHeight="flex"
          columnResizeMode="fit"
          stripedRows
          dataKey="uuid"
          responsiveLayout="scroll"
        >
          <template #empty>
            {{ $t("FORM.SELECT.EMPTY") }}
          </template>
          <Column
            selectionMode="single"
            :frozen="true"
            style="max-width: 3rem"
          ></Column>

          <Column
            field="description"
            :frozen="true"
            style="min-width: 600px; max-width: 900px"
            :header="$t('FORM.LABELS.DESCRIPTION')"
          >
            <template #body="e">
              <span
                class="link"
                :id="'line' + e.index"
                @click="setLine(e.data)"
                v-tooltip.bottom="e.data.description"
              >
                {{ e.data.description }}
              </span>
            </template>

            <template #filter="{ filterModel, filterCallback }">
             <div class="fullWidth">
                <InputText
                type="text"
                v-model="filterModel.value"
                @input="filterCallback()"
                class="p-column-filter"
              />
             </div>
            </template>
          </Column>

          <Column field="loc" style="max-width: 4rem" header="loc">
          </Column>

          <Column
            field="sub_project"
            style="min-width: 130px; max-width: 13rem"
            header="sub_project"
          >
          
          
            <template #body="{ data }">
              <span class="link">{{ data.sub_project }}</span>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText
                type="text"
                v-model="filterModel.value"
                @input="filterCallback()"
                class="p-column-filter"
              />
            </template>

          
          </Column>
          <Column
            field="function_code"
            style="min-width: 130px; max-width: 13rem"
            header="function_code"
          >
          
            <template #body="{ data }">
              <span class="link">{{ data.function_code }}</span>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText
                type="text"
                v-model="filterModel.value"
                @input="filterCallback()"
                class="p-column-filter"
                />
            </template>

          </Column>

          <Column
            field="sub_project_name"
            style="max-width: 50rem !important; min-width: 30rem !important"
            header="sub_project_name"
          >
            <template #body="e">
              <div v-tooltip.left="e.data.sub_project_name">
                {{ e.data.sub_project_desc }}
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
    <template #footer>
      <Button
        :label="$t('FORM.BUTTONS.CANCEL')"
        @click="closeDialog"
        class="p-button-text"
      />
      <Button
        v-if="selectedLine.uuid"
        :label="$t('FORM.BUTTONS.SELECT')"
        @click="selectItem"
        class="p-button-raised p-button-text"
      />
    </template>
  </Dialog>
</template>

<script>
import { defineComponent } from "vue";
import { FilterMatchMode } from "primevue/api";
import BudgetLineService from "../../budget_line/bugetLine.service";
const YOUR_FILTER = 'YOUR FILTER';

export default defineComponent({
  number: "BudgetLineModal",
  props: {
    row: Object,
    officeCode: String,
    reportingOfficeCode: String,
    close: Function,
    display: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      budgetLineList: [],
      selectedLine: {},
      columns: [],
    
       filters: {
            'sub_project': {value: null, matchMode: FilterMatchMode.CONTAINS},
            'description': {value: null, matchMode: FilterMatchMode.CONTAINS},
            'function_code': {value: null, matchMode: FilterMatchMode.CONTAINS}
            
            },
            matchModeOptions: [
                {label: 'Your Equals', value: YOUR_FILTER},
                {label: 'Starts With', value: FilterMatchMode.STARTS_WITH}
            ],
    };
  },
  created() {
    this.columns = [
      { field: "name", header: "Name" },
      { field: "category", header: "Category" },
      { field: "quantity", header: "Quantity" },
    ];
    this.selectedColumns = this.columns;
  },
  watch: {
    display(newVal) {
      if (newVal) {
        this.getCombinations(this.row.project.code);
      }
    },
  },
  methods: {
    reset() {
      this.budgetLineList = [];
      this.selectedLine = {};
    },

    closeDialog() {
      this.reset();
      this.close(false);
    },
    setLine(line) {
      this.selectedLine = line;
      this.selectItem();
    },
    selectItem() {
      if (!this.selectedLine.uuid) return;

      this.close({
        row: this.row,
        budgetLine: this.selectedLine,
      });
      this.reset();
    },
    getCombinations(projectCode) {
      BudgetLineService.read(null, {
        project: projectCode,
        reporting_office: this.row.cash_return? this.reportingOfficeCode : this.officeCode,
      }).then((lines) => {
        this.budgetLineList = lines.map((ll) => {
          ll.description = (ll.description || "").substr(0, 100);
          ll.sub_project_desc = (ll.sub_project_name || "").substr(0, 100);
          return ll;
        });
      });
    },
  },
});
</script>