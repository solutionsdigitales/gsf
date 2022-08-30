<template>
  <div class="col-p12 card page-body">
    <div class="fRight">
      <span class="p-buttonset fRight">
        <Button
          id="searchButton"
          v-on:click="openSearchModal()"
          :label="$t('FORM.BUTTONS.SEARCH')"
          icon="pi pi-search"
        />
        <Button
          id="importButton"
          class="p-button-secondary"
          @click="importBudgetLines()"
          :label="$t('FORM.BUTTONS.IMPORT')"
        />
        <Button
          id="addButton"
          @click="Add()"
          :label="$t('FORM.BUTTONS.ADD')"
          icon="pi pi-plus"
        />
        <SplitButton
          :label="$t('FORM.LABELS.OPTIONS')"
          v-if="selectedLines.length > 0"
          :model="optionItems"
        />
      </span>
    </div>
    <br />
    <br />

    <div style="height: calc(73vh)">
      <DataTable
        :value="items"
        v-model:selection="selectedLines"
        :resizableColumns="true"
        showGridlines
        :scrollable="true"
        :loading="loading"
        scrollHeight="flex"
        stripedRows
        dataKey="uuid"
        sortMode="multiple"
        responsiveLayout="scroll"
      >
        <template #header>
          {{ $t("TREE.BUDGET_LINE") }}
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
        <Column selectionMode="multiple" style="max-width: 3rem"></Column>
        <Column field="entity_code" style="max-width: 4rem" header="entity">
          
        </Column>

        <Column
          field="loc"
          style="max-width: 5rem"
          header="loc"
          :sortable="true"
        ></Column>
        <Column
          field="funding_source"
          style="max-width: 8rem"
          header="funding_source"
          :sortable="true"
        ></Column>
        <Column
          field="project"
          style="max-width: 7rem"
          header="project"
          :sortable="true"
        ></Column>
        <Column
          field="reporting_office"
          style="max-width: 8rem"
          header="reporting_office"
          :sortable="true"
        ></Column>
        <Column
          field="sub_project"
          style="max-width: 8rem"
          header="sub_project"
          :sortable="true"
        ></Column>

        <Column
          field="function_code"
          style="max-width: 8rem"
          header="function_code"
          :sortable="true"
        ></Column>
        <Column
          field="activity"
          style="max-width: 5rem"
          header="activity"
        ></Column>
        <Column
          field="description"
          :header="$t('FORM.LABELS.DESCRIPTION')"
        ></Column>

        <Column
          field="amount"
          headerStyle="width: 4em"
          :header="$t('FORM.LABELS.AMOUNT')"
          :sortable="true"
        >
          <template #body="e">
            <span style="width: 100%" class="text-right">
              {{ formatCurrency(e.data.amount, enterprise.currency_id) }}
            </span>
          </template>
        </Column>
        <Column
          field="used_amount"
          headerStyle="width: 4em"
          :header="$t('FORM.LABELS.BALANCE')"
          :sortable="true"
        >
          <template #body="e">
            <span style="width: 100%" class="text-right">
              {{ getBalance(e.data) }}
            </span>
          </template>
        </Column>

        <Column
          field="employee_displayname"
          :header="$t('PRF.BUDGET_HOLDER')"
        ></Column>
        <Column field="action" header="Action" style="max-width: 5rem">
          <template #body="e">
            <BudgetLineActtions
              :entity="e.data"
              v-on:reloadBudgetLineList="getBudgetLines()"
            />
          </template>
        </Column>
      </DataTable>
      <div>{{ items.length }} {{ $t("FORM.INFO.ROWS") }}</div>
    </div>
    <div></div>
    <CreateUpdateModal
      :BudgetLine="divition"
      ref="addBudgetLineModal"
      :close="closeDialog"
      :display="displayCreateModal"
    >
    </CreateUpdateModal>

    <EmployeeSelectModal
      ref="employeeSelectModal"
      :close="closeEmployeeSelectModal"
      :display="displayEmployeeSelectModal"
    >
    </EmployeeSelectModal>

    <SearchModal
      :filters="latestViewFilters"
      :display="displaySearchModal"
      :close="closeModal"
    >
    </SearchModal>

    <ConfirmModal
      :employee="entity"
      :close="DeleteConfirmDialog"
      :display="displayConfirm"
    >
    </ConfirmModal>

    <ImportModal
      ref="importModal"
      :close="closeDialog"
      :display="displayImportModal"
    >
    </ImportModal>
  </div>
</template>

<script>
import BudgetLineService from "./bugetLine.service";
import BudgetLineActtions from "./actions";
import EmployeeSelectModal from "../employee/modal/employeeSelectModal.vue";
import CreateUpdateModal from "./createUpdateModal";
import SearchModal from "./modal/searchModal.vue";
import AppCache from "../../service/appCache";
import ImportModal from "./importModal.vue";
import bhFilters from "../../components/filters.vue";
import ConfirmModal from "../../components/ConfirmModal.vue";
import NotifyService from "../../service/Notify.service";
import currencyService from "../../service/currencyService";
import EnterpriseService from "../enterprise/enterprise.service";

export default {
  data() {
    return {
      BudgetLine: [],
      divition: {},
      items: [],
      latestViewFilters: {},
      enterprise: {},
      selectedLines: [],
      optionItems: [],
      selectedBudgetLine: null,
      displayCreateModal: false,
      displaySearchModal: false,
      displayImportModal: false,
      displayEmployeeSelectModal: false,
      connectedUser: {},
      isEmployee: false,
      loading: false,
      displayConfirm: false,
      cashKey: "budgetLines",
      filters: [],
    };
  },
  created() {
    const cache = AppCache.get("session") || {};
    if (!cache.token) {
      this.$router.push("/auth");
      return;
    }

    this.filters = BudgetLineService.filters;
    this.latestViewFilters = this.filters.formatView();

    this.connectedUser = this.$store.state.session.user || {};
    this.isEmployee = !!this.connectedUser.is_employee;

    this.getEnterpriseInfo();
    this.filters.loadCache(this, "latestViewFilters", this.cashKey, () => {
      this.getBudgetLines();
    });
    this.setOptionsitems();
  },
  methods: {
    getBudgetLines() {
      this.loading = true;
      const params = this.filters.formatHTTP(true) || {};
      if (this.isEmployee) {
        params.employeeAccess = this.$store.state.session.employee.uuid;
      }
      BudgetLineService.read(null, params)
        .then((items) => {
          this.items = items;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    Add() {
      this.displayCreateModal = true;
      this.divition = {};
    },
    openSearchModal() {
      this.displaySearchModal = true;
    },
    getEnterpriseInfo() {
      EnterpriseService.read().then((enterprises) => {
        this.enterprise = enterprises[0] || {};
      });
    },
    closeModal(changes) {
      this.displaySearchModal = false;
      if (!changes) return;
      this.filters.updateKeys(this, "latestViewFilters", changes, () => {
        this.getBudgetLines();
        this.filters.cachFilters(this.cashKey);
      });
    },
    closeDialog(result) {
      if (result) {
        this.getBudgetLines();
      }
      this.displayCreateModal = false;
      this.displayImportModal = false;
    },

    deleteLines() {
      this.displayConfirm = true;
    },
    DeleteConfirmDialog(result) {
      this.displayConfirm = false;
      if (!result) return;
      const uuids = this.selectedLines.map((l) => l.uuid);
      BudgetLineService.removeLine(uuids)
        .then(() => {
          NotifyService.success(this, "", null);
          this.selectedLines = [];
          this.getBudgetLines();
        })
        .catch(() => {
          NotifyService.danger(this, "", null);
        });
    },
    importBudgetLines() {
      this.displayImportModal = true;
    },
    formatCurrency(amount, currecnyId) {
      return currencyService.format(amount, currecnyId);
    },
    getBalance(row) {
      const diff =
        (row.amount ? row.amount : 0) - (row.used_amount ? row.used_amount : 0);
      return this.formatCurrency(diff, this.enterprise.currency_id);
    },
    onRemoveFilter(filter) {
      this.filters.resetFilterState(filter._key);
      this.latestViewFilters = this.filters.formatView();
      this.filters.cachFilters(this.cashKey);
      return this.getBudgetLines();
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
    setOptionsitems() {
      this.optionItems = [
        {
          label: this.$t("FORM.BUTTONS.DELETE"),
          icon: "pi pi-trash",
          command: () => {
            this.deleteLines();
          },
        },
        {
          label: this.$t("PRF.BUDGET_HOLDER"),
          icon: "pi pi-user",
          command: () => {
            this.displayEmployeeSelectModal = true;
          },
        },
      ];
    },
    closeEmployeeSelectModal(result) {
      if (result) {
        const employeeUuid = result.uuid;
        const uuids = this.selectedLines.map((l) => l.uuid);
        BudgetLineService.setBudgetHolder({
          uuids,
          employeeUuid,
        })
          .then(() => {
            NotifyService.success(this, "", null);
            this.selectedLines = [];
            this.getBudgetLines();
          })
          .catch(() => {
            NotifyService.danger(this, "", null);
          });
      }
      this.displayEmployeeSelectModal = false;
    },
  },
  components: {
    BudgetLineActtions,
    CreateUpdateModal,
    EmployeeSelectModal,
    ImportModal,
    ConfirmModal,
    bhFilters,
    SearchModal,
  },
};
</script>
