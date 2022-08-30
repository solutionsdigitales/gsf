<template>
  <div class="col-p12 card page-body" style="padding-bottom: 100px">
    <div class="fRight">
      <span class="p-buttonset fRight">
        <Button
          v-on:click="onenSearchModal()"
          :label="$t('FORM.BUTTONS.SEARCH')"
          icon="pi pi-search"
        />
        <Button
          v-on:click="downloadExcel()"
          class="p-button-secondary"
          :label="$t('FORM.BUTTONS.EXPORT')"
          icon="pi pi-file-excel"
        />
      </span>
    </div>
    <br />
    <br />
    <br />
    <DataTable
      @rowSelect="onRowSelect"
      :value="prfList"
      showGridlines
      stripedRows
      v-model:selection="selectedDDF"
      :resizableColumns="true"
      columnResizeMode="fit"
      responsiveLayout="scroll"
      dataKey="uuid"
      sortMode="multiple"
      :loading="loading"
    >
      <template #header>
        {{ $t("TREE.EXPENSE_REPORT") }}
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
      <Column field="date" :header="$t('FORM.LABELS.DATE')" :sortable="true">
        <template #body="e">
          <span>
            {{ formatDate(e.data.date) }}
          </span>
        </template>
      </Column>
      <Column
        field="reference"
        style="width: 25px"
        :header="$t('FORM.LABELS.REFERENCE')"
      >
        <template #body="e">
          <span class="text-primary link" @click="viewPDF(e.data)">
            {{ e.data.reference }}
          </span>
        </template>
      </Column>

      <Column
        field="version"
        headerStyle="width: 2em"
        :header="$t('PRF.VERSION')"
      >
        <template #body="e">
          <div class="text-right">
            {{ e.data.version }}
          </div>
        </template>
      </Column>

      <Column
        field="amount"
        headerStyle="width: 4em"
        :header="$t('FORM.LABELS.AMOUNT')"
        :sortable="true"
      >
        <template #body="e">
          <div class="text-right">
            {{ formatCurrency(e.data.amount, e.data.currency_id) }}
          </div>
        </template>
      </Column>

      <Column
        field="employee_name"
        :header="$t('FORM.LABELS.EMPLOYEE')"
        :sortable="true"
      ></Column>

       <Column
        field="delivery_recipient"
        :header="$t('FORM.LABELS.OWNER')"
        :sortable="true"
      >
      <template #body="{data}">
          <div v-if="data.delivery_recipient !== data.employee_name">
           {{data.delivery_recipient}}
          </div>
        </template>

      </Column>

      

      <Column
        field="project_code"
        :sortable="true"
        :header="$t('TREE.PROJECT')"
      >
        <template #body="e">
          <span
            >{{ e.data.project_code }} - {{ e.data.project_short_name }}</span
          >
        </template>
      </Column>
      <Column field="project" :header="$t('PRF.LINE.OFFICE')">
        <template #body="e">
          <span>{{ e.data.office_code }} - {{ e.data.office_name }}</span>
        </template>
      </Column>
      <Column
        field="document_state_id"
        style="max-width: 4rem"
        :sortable="true"
        :header="$t('FORM.LABELS.STATE')"
      >
        <template #body="e">
          <span
            class="prf_status"
            v-if="e.data.document_state_id"
            :style="
              'background:' +
              e.data.document_state_bg +
              ';color:' +
              e.data.document_state_color
            "
            >{{ $t(e.data.document_state_label || "") }}</span
          >
        </template>
      </Column>

      <Column
        field="enhancement"
        :header="$t('TABLE.COLUMNS.LABEL')"
        headerStyle="width: 6em"
      >
        <template #body="e">
          <span
            class="enhancement_by_me"
            v-if="currentEmployee.uuid === e.data.employee_uuid"
          >
            {{ $t("PRF.LABELS.CREATED_BY_ME") }}
          </span>
          <span class="enhancement_waiting" v-if="e.data.needApprovement">
            {{ $t("PRF.LABELS.WAITING_FOR_ME") }}
          </span>
        </template>
      </Column>
      <Column field="action" header="Action" style="max-width: 5rem">
        <template #body="e">
          <PRFActions
            :canEdit="currentEmployee.uuid === e.data.employee_uuid"
            :canApprove="e.data.needApprovement"
            :entity="e.data"
            :server="server"
            :employee="currentEmployee"
            v-on:reloadPRFList="getExpenseReports()"
          />
        </template>
      </Column>
      <ColumnGroup type="footer">
        <Row>
          <Column
            footer="Totals:"
            :colspan="4"
            footerStyle="text-align:right"
          />
          <Column
            :footer="formatCurrency(totals, 1)"
            footerStyle="text-align:right"
          />
          <Column :footer="''" :colspan="7" />
        </Row>
      </ColumnGroup>
    </DataTable>

    <div>{{ prfList.length }} {{ $t("FORM.INFO.ROWS") }}</div>

    <SearchModal
      :filters="latestViewFilters"
      :display="displaySearchModal"
      :close="closeModal"
    >
    </SearchModal>
    
    <pdfViewer
      :fileName="fileName"
      :downloadFunction="pdfDownloadFunction"
      :display="displayPdfViewerModal"
      :close="closePrfViewer"
    >
    </pdfViewer>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import ExpenseReportService from "./exr.service";
import PRFActions from "./actions.vue";
import SearchModal from "./modal/searchModal.vue";
import bhFilters from "../../components/filters.vue";
import pdfViewer from "../../components/PdfViewer.vue";
import UtilService from "../../service/util";
import currencyService from "../../service/currencyService";
import ApprovementService from "../prf/prf_approvement";
import constants from "../../service/constant";

export default defineComponent({
  name: "prf_registry",
  data() {
    return {
      prfList: [],
      totals: 0,
      latestViewFilters: {},
      filters: [],
      displaySearchModal: false,
      displayPdfViewerModal: false,
      reloadFilters: false,
      loading: false,
      pdfViewerUrl: "",
      selectedDDF: {},
      server: "",
      fileName: "",
      voucherUuid: "",
      lang: "fr",
      currencySymbol: "$",
      cashKey: "exrList",
      currentEmployee: {},
      currencies: [],
    };
  },

  created() {
    const searchParams = Object.keys(this.$route.params);
    this.server = this.$store.state.server;
    this.lang = this.$i18n.locale;
    this.filters = ExpenseReportService.filters;
    this.latestViewFilters = this.filters.formatView();
    this.currentEmployee = this.$store.state.session.employee || {};

    if (searchParams.length > 0) {
      this.filters._resetCustomFilters();
      this.filters.updateKeys(
        this,
        "latestViewFilters",
        JSON.parse(this.$route.params.filters),
        () => {
          this.getExpenseReports();
          this.filters.cachFilters(this.cashKey);
        }
      );
    } else {
      this.filters.loadCache(this, "latestViewFilters", this.cashKey, () => {
        this.getExpenseReports();
      });
    }
  },

  methods: {
    viewPDF(exr) {
      console.log(exr);
      this.voucherUuid = exr.uuid;
      this.fileName = ExpenseReportService.getFileName(exr);
      this.displayPdfViewerModal = true;
    },
    pdfDownloadFunction() {
      return ExpenseReportService.dowloadPdf(
        `export/${this.voucherUuid}?lang=${this.lang}&stream=1&renderer=pdf`,
        this.fileName,
        true
      );
    },

    onenSearchModal() {
      this.displaySearchModal = true;
    },
    formatDate(date) {
      if (!date) return;
      return UtilService.formatDate(date, "DD/MM/YYYY H:mm:s");
    },
    downloadExcel() {
      const params = this.filters.formatHTTP(true) || {};
      params.not_closed = constants.DOCUMENT_STATUS.CLOSED;
      params.voucher_type_id = constants.voucherTypes.exr;
      const getParams = ExpenseReportService.serelize(params);
      const uri = `${this.server}expense_reports/download/excel?lang=${this.lang}&${getParams}`;
      UtilService.downloadURI(uri);
    },
    getExpenseReports() {
      this.loading = true;
      const params = this.filters.formatHTTP(true) || {};
      params.not_closed = constants.DOCUMENT_STATUS.CLOSED;
      if (this.currentEmployee.uuid) {
        params.employeeAccess = this.currentEmployee.uuid;
      }
      ExpenseReportService.read(null, params)
        .then((prfs) => {
          this.prfList = prfs;
          this.totals = 0;
          prfs.forEach((p) => {
            this.totals += p.amount;
          });
          this.getExpenseReportStatus();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getExpenseReportStatus() {
      const isBudgetHolder = this.currentEmployee.is_budget_holder;
      const params = this.filters.formatHTTP(true) || {};
      params.not_closed = constants.DOCUMENT_STATUS.CLOSED;
      params.employee_uuid = this.currentEmployee.uuid;
      params.has_approved = 0;
      if (isBudgetHolder) {
        ApprovementService.read(null, params).then((result) => {
          const mapRef = {};
          const voucherUuids = result.map((r) => r.voucher_uuid);

          this.prfList.forEach((_prf) => {
            if (voucherUuids.includes(_prf.uuid)) {
              if (!mapRef[_prf.reference]) {
                _prf.needApprovement = true;
                mapRef[_prf.reference] = true;
              }
            }
          });
        });
      }
    },
    onRemoveFilter(filter) {
      this.filters.resetFilterState(filter._key);
      this.latestViewFilters = this.filters.formatView();
      this.filters.cachFilters(this.cashKey);
      return this.getExpenseReports();
    },
    round(num) {
      return UtilService.round(num);
    },
    closePrfViewer() {
      this.displayPdfViewerModal = false;
    },
    formatCurrency(amount, currecnyId) {
      return currencyService.format(amount, currecnyId);
    },
    closeModal(changes) {
      this.displaySearchModal = false;
      if (!changes) return;
      this.filters.updateKeys(this, "latestViewFilters", changes, () => {
        this.getExpenseReports();
        this.filters.cachFilters(this.cashKey);
      });
    },
  },
  components: {
    PRFActions,
    bhFilters,
    SearchModal,
    pdfViewer,
  },
});
</script>
<style scoped>
.noLeft {
  padding-left: 0px !important;
}
.totals {
  width: 250px !important;
  float: right;
  padding: 7px;
  box-shadow: 0px 0px 11px rgb(221, 221, 221);
  background: #fff;
}
</style>
