<template>
  <div>
    <BlockUI :blocked="blockedPage">
      <div class="col-p12 card page-body" v-if="!noEmployee">
        <div class="col-p12 loader1" :hidden="!blockedPage">
          <i class="pi pi-spin pi-spinner" style="font-size: 5rem"></i>
          <br />
          <span>{{ $t("FORM.INFO.LOADING") }}</span>
        </div>
        <div class="grid">
          <div class="col-12 lg:col-8 xl:col-8">
            <h4>{{ $t("TREE.EXPENSE_REPORT") }}</h4>
          </div>
          <div class="col-12 lg:col-4 xl:col-4">
            <div style="float: right">
              <span class="link" @click="selectProject()"
                >{{ $t("TREE.PROJECT") }}:
                <b
                  >{{ selectedProject.code }} -{{
                    selectedProject.short_name
                  }}</b
                ></span
              >
            </div>
            <br />
            <div style="float: right">
              <span class="link" @click="selectLocation($event)"
                >{{ $t("PRF.LINE.OFFICE") }}:
                <span
                  class="prf_status"
                  v-if="voucher.status.id"
                  :style="
                    'background:' +
                    voucher.status.bg +
                    ';color:' +
                    voucher.status.color
                  "
                  >{{ reportingOffice.name }}</span
                >
              </span>
            </div>
          </div>
        </div>
        <hr />
        <h6>1. {{ $t("PRF.REQUESTER_SECTION") }}</h6>
        <div class="p-fluid">
          <div class="grid">
            <div class="col-12 lg:col-4 xl:col-4">
              <div class="p-field">
                <label for="firstname">{{
                  $t("TABLE.COLUMNS.EMPLOYEE_NAME")
                }}</label>
                <div class="text-primary">
                  {{ applicant.displayname }},
                  {{ applicant.position }}
                </div>
              </div>
            </div>

            <div class="col-12 lg:col-4 xl:col-4">
              <div class="p-field">
                <label class="label-required" for="fctOffice">
                  {{ $t("TREE.LOCATION") }}
                </label>
                <Help description="HELP.FONCTION_OFFICE" />

                <Dropdown
                  id="fctOffice"
                  v-model="selectedFonctionOffice"
                  :options="locations"
                  :disabled="budgetlines.length > 0"
                  @change="validate()"
                  optionLabel="name"
                  :placeholder="$t('PRF.SELECT_OFFICE')"
                  :filter="true"
                >
                </Dropdown>
              </div>
            </div>

            <div class="col-12 lg:col-4 xl:col-4">
              <div class="p-field">
                <label
                  for="approvers"
                  style="font-size: 14px !important"
                  class="label-required"
                  :class="{
                    'p-error': validationErrors.approvers && submitted,
                  }"
                >
                  {{ $t("PRF.BUDGET_HOLDER_NAME") }}
                </label>

                <MultiSelect
                  id="approvers"
                  v-model="selectedApprovers"
                  :options="approvers"
                  @change="validate()"
                  optionLabel="displayname"
                  :placeholder="$t('PRF.SELECT_APPROVER')"
                  :filter="true"
                  display="chip"
                >
                </MultiSelect>
              </div>
            </div>
          </div>
        </div>
        <h6>2. {{ $t("PRF.DELIVERY_SECTION") }}</h6>
        <div class="p-fluid">
          <div class="grid">
            <div class="col-12 lg:col-12 xl:col-12">
              <div class="p-field">
                <label class="label-required" for="lastname">{{
                  $t("PRF.RECIPIENT")
                }}</label>
                <InputText
                  id="delivery_recipient"
                  v-model="voucher.delivery.recipient"
                  @input="validate()"
                  :class="{
                    'p-invalid':
                      validationErrors.delivery_recipient && submitted,
                  }"
                />
              </div>

              <div class="p-field">
                <label for="activity">{{ $t("TREE.ACTIVITY") }}</label>
                <InputText
                  id="activity"
                  v-model="exr.activity"
                  @input="validate()"
                  :class="{
                    'p-invalid': validationErrors.activity && submitted,
                  }"
                />
              </div>
            </div>

            <div class="col-12 lg:col-4 xl:col-4">
              <div class="p-field">
                <label for="traval_place">{{
                  $t("VOUCHERS.TRAVEL_PLACE")
                }}</label>
                <InputText
                  id="traval_place"
                  v-model="exr.traval_place"
                  @input="validate()"
                  :class="{
                    'p-invalid': validationErrors.traval_place && submitted,
                  }"
                />
              </div>
            </div>
            <div class="col-12 lg:col-4 xl:col-4">
              <div class="p-field">
                <label for="advance_amount">{{
                  $t("VOUCHERS.ADVANCE_AMOUNT")
                }}</label>
                <InputNumber
                  id="advance_amount"
                  :currency="enterprise.currency_format_key"
                  :locale="enterprise.currency_intel_number_format"
                  :minFractionDigits="2"
                  v-model="exr.advance_amount"
                  style="width: 100%"
                />
              </div>
            </div>
            <div class="col-12 lg:col-4 xl:col-4">
              <div class="p-field">
                <label for="advance_date">{{
                  $t("VOUCHERS.ADVANCE_DATE")
                }}</label>
                <Calendar
                  id="advance_date"
                  v-model="exr.advance_date"
                  :showButtonBar="true"
                  @date-select="validate()"
                  :showIcon="true"
                  :maxDate="new Date()"
                  dateFormat="dd/mm/yy"
                />
              </div>
            </div>
          </div>
        </div>
        <h6>3. {{ $t("PRF.BUDGET_LINES_SECTION") }}</h6>

        <div id="budget_line_grid">
          <DataTable
            :value="budgetlines"
            dataKey="uuid"
            showGridlines
            editMode="cell"
            class="editable-cells-table"
            responsiveLayout="scroll"
          >
            <template #header>
              <div>
                <Button
                  id="newLine"
                  :label="$t('FORM.BUTTONS.ADD')"
                  @click="addBudgetLine()"
                  icon="pi pi-plus"
                  class="p-button-raised p-button-text"
                />
              </div>
            </template>

            <Column field="status" style="width: 1%; padding: 0px">
              <template #body="e">
                <div class="invalid-line" v-if="!e.data.status">&nbsp;</div>
                <div class="valid-line" v-if="e.data.status">&nbsp;</div>
              </template>
            </Column>

            <Column
              field="date_from"
              :header="$t('FORM.LABELS.DATE_FROM')"
              style="width: 10%"
            >
              <template #body="e">
                <div class="link">
                  <span>{{ formatDate(e.data.date_from) }}</span>
                  <span :id="'bl_date_from' + e.index" class="cWhite">.</span>
                </div>
              </template>

              <template #editor="{ data, field, index }">
                <Calendar
                  :id="'bl_date_from_input' + index"
                  v-model="data[field]"
                  :showIcon="true"
                  @date-select="onDateSelect(data, field, index)"
                  :showButtonBar="true"
                  placeholder="dd/mm/yyyy"
                  dateFormat="dd/mm/yy"
                />
              </template>
            </Column>

            <Column
              field="date_to"
              :header="$t('FORM.LABELS.DATE_TO')"
              style="width: 10%"
            >
              <template #body="e">
                <div class="link">
                  <span>{{ formatDate(e.data.date_to) }}</span>
                  <span :id="'bl_date_to' + e.index" class="cWhite">.</span>
                </div>
              </template>

              <template #editor="{ data, field, index }">
                <Calendar
                  :id="'bl_date_to_input' + index"
                  v-model="data[field]"
                  :showIcon="true"
                  :minDate="data.date_from"
                  @date-select="onDateSelect(data, field, index)"
                  :showButtonBar="true"
                  placeholder="dd/mm/yyyy"
                  dateFormat="dd/mm/yy"
                />
              </template>
            </Column>

            <Column field="description" header="Description" style="width: 20%">
              <template #body="e">
                <div class="link">
                  <span>{{ e.data.description }}</span>
                  <span :id="'description' + e.index" class="cWhite">.</span>
                </div>
              </template>

              <template #editor="{ data, field, index }">
                <Textarea
                  :id="'description_input' + index"
                  rows="1"
                  style="width: 100%"
                  @update:modelValue="onItemUpdated($event, field, index)"
                 
                  v-model="data[field]"
                />
              </template>
            </Column>

            <Column
              field="budget_line"
              :header="$t('TREE.BUDGET_LINE')"
              style="width: 20%"
            >
              <template #body="e">
                <div class="link" @click="showBudgetLineModal(e.data, index)">
                  <span>{{ e.data.budgetLine.description }}</span>
                  <span :id="'BL' + e.index" class="cWhite">.</span>
                </div>
              </template>
            </Column>

            <Column
              field="debit"
              :header="$t('FORM.LABELS.AMOUNT')"
              style="width: 5%"
            >
              <template #body="e">
                <div class="link text-right">
                  <span>{{
                    formatCurrency(e.data.debit, enterprise.currency_id)
                  }}</span>
                  <span :id="'debit' + e.index" class="cWhite">.</span>
                </div>
              </template>
              <template #editor="{ data, field, index }">
                <InputNumber
                  :id="'debit_input' + index"
                  :currency="enterprise.currency_format_key"
                  :locale="enterprise.currency_intel_number_format"
                  :minFractionDigits="2"
                  v-model="data[field]"
                  v-on:input="
                    onNumberFieldSave($event.value, data, field, index)
                  "
                  style="width: 100%"
                />
              </template>
            </Column>


            <Column
              field="action2"
              :header="$t('PRF.CASH_RETURN')"
              bodyStyle="text-align:center; color:red"
              style="width: 2%"
            >
              <template #body="e">
                <div class="p-field-checkbox">
                  <Checkbox
                    id="locked"
                    :binary="true"
                    name="locked"
                    v-model="e.data.cash_return"
                  />
                </div>
              </template>
            </Column>

            
            <Column
              field="action"
              header="Action"
              bodyStyle="text-align:center; color:red"
              style="width: 2%"
            >
              <template #body="e">
                <div
                  :id="'removeLine' + e.index"
                  class="link"
                  @click="removeRow(e.data)"
                >
                  <i class="pi pi-trash p-text-danger" />
                </div>
              </template>
            </Column>
          </DataTable>
          <br />
          <div class="grid">
            <div class="col-12 lg:col-10 xl:col-10"></div>
            <div class="col-12 lg:col-2 xl:col-2">
              <span>{{ $t("FORM.LABELS.TOTAL") }}</span>
              <span>
                :
                <b>{{ formatCurrency(total, enterprise.currency_id) }}</b></span
              >
            </div>
          </div>

          <div class="p-field" v-if="voucherUuid && !clone">
            <label
              for="update_note"
              :class="{ 'p-error': validationErrors.update_note && submitted }"
            >
              {{ $t("PRF.UPDATE_NOTE") }}
            </label>

            <Textarea
              id="update_note"
              class="col-12"
              rows="4"
              v-on:input="validate()"
              v-model="voucher.update.note"
            />
          </div>
        </div>
        <br />

        <div class="grid">
          <div class="col-12 lg:col-9 xl:col-9"></div>
          <div class="col-12 lg:col-3 xl:col-3">
            <Button
              id="submitButton"
              @click="submit"
              :label="
                voucherUuid
                  ? $t('FORM.BUTTONS.UPDATE')
                  : $t('FORM.BUTTONS.SAVE')
              "
              style="float: right"
              :icon="loading ? 'pi pi-spin pi-spinner' : ''"
              class="p-button-raised p-button-primary"
            />

            <Button
              :label="$t('FORM.BUTTONS.CANCEL')"
              @click="cancel()"
              style="float: right; margin-right: 10px"
              class="p-button-text p-button-raised"
            />
          </div>
        </div>

        <BudgetLineModal
          :row="selectedLine"
          :officeCode="selectedFonctionOffice.code"
          :reportingOfficeCode="reportingOffice.code"
          :close="closeModal"
          :display="displayBudgetLineModal"
        ></BudgetLineModal>

        <ProjectModal
          :close="closeProjectModal"
          :display="displayProjectModal"
        ></ProjectModal>
      </div>

      <div class="col-p12 card page-body" v-if="noEmployee">
        <Message severity="warn" :key="$t('PRF.NO_ACCESS')">
          {{ $t("PRF.NO_ACCESS") }}
        </Message>
      </div>

      <pdfViewer
        :fileName="fileName"
        :downloadFunction="pdfDownloadFunction"
        :display="displayPdfViewerModal"
        :close="closePrfViewer"
      >
      </pdfViewer>

      <OfficeSelectModal
        :close="closeOfficeModal"
        :display="displayOfficeModal"
      ></OfficeSelectModal>
    </BlockUI>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import DocState from "../prf/document_state_service";
import BudgetLineModal from "../prf/modal/budget_line_modal.vue";
import ProjectModal from "../prf/modal/projectSelectModal.vue";
import ExpenseReportService from "./exr.service";
import ProjectService from "../project/project.service";
import constants from "../../service/constant";
import pdfViewer from "../../components/PdfViewer.vue";
import NotifyService from "../../service/Notify.service";
import OfficeService from "../location/office.service";
import EmployeeService from "../employee/employee.service";
import EnterpriseService from "../enterprise/enterprise.service";
import currencyService from "../../service/currencyService";
import accountService from "../account/account.service";
import validator from "./new.validation";
import util from "../../service/util";
import UuidService from "../../service/uuidService";
import OfficeSelectModal from "../location/LocationSelectModal.vue";

export default defineComponent({
  name: "new_expense_report",
  props: {
    entity: Object,
  },
  data() {
    return {
      submitted: false,
      blockedPage: true,
      loading: false,
      validationErrors: {},
      applicant: {},
      voucherUuid: null,
      total: 0,
      projects: [],
      services: [],
      DocumentStatus: [], // menu action of states
      documentStatusList: [], // diffente states
      selectedApprovers: null,
      selectedFonctionOffice: {},
      selectedFonctionOfficeCode: "",
      selectedLocation: {},
      locations: [],
      approvers: [],
      voucher: { delivery: {} },
      selectedService: {},
      selectedProject: {},
      currentEmployee: {},
      reportingOffice: {},
      selectedLine: {},
      budgetlines: [],
      accounts: [],
      displayBudgetLineModal: false,
      displayProjectModal: false,
      displayPdfViewerModal: false,
      noEmployee: false,
      privilegedUser: false,
      displayOfficeModal: false,
      clone: false,
      server: "",
      lang: "fr",
      fileName: "",
      enterprise: {},
      exr: {},
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.voucher = {
        requester: {},
        delivery: {},
        project: {},
        budgetLine: {},
        status: {},
        update: {},
      };
      this.server = this.$store.state.server;
      this.lang = this.$i18n.locale;

      this.connectedUser = this.$store.state.session.user || {};
      if (!this.connectedUser.is_employee) {
        this.noEmployee = true;
        return;
      }
      EnterpriseService.read()
        .then((enterprises) => {
          this.enterprise = enterprises[0] || {};
          return ProjectService.read();
        })
        .then((projects) => {
          this.projects = projects;
          return DocState.read();
        })
        .then((docStatus) => {
          this.documentStatusList = docStatus;
          this.voucher.status = docStatus.filter((ds) => ds.id === 1)[0] || {};
          return OfficeService.read();
        })
        .then((locations) => {
          this.locations = locations;
          return accountService.read();
        })
        .then((accounts) => {
          this.accounts = accounts.map((a) => {
            a.name = `${a.code}-${a.short_title || a.short_title}`;
            return a;
          });
          return EmployeeService.read(null, { is_budget_holder: 1 });
        })
        .then((approvers) => {
          this.approvers = approvers;
          this.getUserInformations();
        });
    },

    getUserInformations() {
      this.currentEmployee = this.$store.state.session.employee;
      this.voucher.delivery.recipient = this.currentEmployee.displayname;
      this.voucher.delivery.address = this.currentEmployee.office_address;

      this.locations.forEach((l) => {
        if (l.uuid === this.currentEmployee.office_uuid) {
          this.selectedLocation = l;
        }
      });

      const { voucherUuid, clone } = this.$route.query;
      this.applicant = this.currentEmployee;
      this.clone = clone;
      if (!voucherUuid) {
        this.displayProjectModal = true;
        setTimeout(() => {
          this.blockedPage = false;
        }, 1000);
      } else {
        setTimeout(() => {
          this.loadPRFInfo(voucherUuid);
        }, 1000);
      }
    },
    showBudgetLineModal(line) {
      if (!line.project.uuid) {
        line.project = this.selectedProject;
        line.project_uuid = this.selectedProject.uuid;
      }
      this.selectedLine = line;
      this.displayBudgetLineModal = true;
    },
    formatCurrency(amount, currecnyId) {
      return currencyService.format(amount, currecnyId);
    },
    viewPDF(voucherUuid) {
      ExpenseReportService.read(voucherUuid).then((exr) => {
        this.voucherUuid = voucherUuid;
        this.fileName = this.createFileName(exr);
        this.displayPdfViewerModal = true;
      });
    },

    createFileName(doc) {
      return `${doc.employee.displayname} ${doc.document.text} v${doc.prf.version} ${doc.prf.submission_date}.pdf`;
    },
    pdfDownloadFunction() {
      return ExpenseReportService.dowloadPdf(
        `export/${this.voucherUuid}?lang=${this.lang}&stream=1&renderer=pdf`,
        this.fileName,
        true
      );
    },

    closePrfViewer() {
      this.displayPdfViewerModal = false;
      this.$router.push("/exr_registry");
    },
    closeOfficeModal(office) {
      if (office) {
        this.reportingOffice = office;
      }
      this.displayOfficeModal = false;
    },
    setLocation() {
      this.voucher.office_uuid = this.selectedLocation.uuid;
      this.validate();
    },
    round(num) {
      return util.round(num);
    },
    // editing PRF, let load prf info from it uuid
    loadPRFInfo(voucherUuid) {
      this.voucherUuid = voucherUuid;
      ExpenseReportService.read(voucherUuid)
        .then((result) => {
          if (!this.clone) {
            this.applicant = result.employee;
          }

          this.selectedProject = result.project;
          const prfApprovers = result.approvers.map((ap) => ap.employee_uuid);
          this.selectedServices = [];
          this.selectedApprovers = [];
          this.approvers.forEach((approver) => {
            if (prfApprovers.includes(approver.uuid)) {
              this.selectedApprovers.push(approver);
            }
          });
          // office
          this.reportingOffice = result.office;
          this.locations.forEach((l) => {
            if (l.uuid === result.prf.fct_office_uuid) {
              this.selectedFonctionOffice = l;
              this.selectedFonctionOfficeCode = l.code;
            }
          });

          this.exr = result.exr;
          this.exr.advance_date = new Date(result.exr.advance_date);
          // delivery info
          this.voucher.delivery.recipient =
            result.prf.delivery_recipient || result.employee.displayname;
          this.voucher.update = {};

          // document state
          // checking the document state, procurement cand edit an approved document, in that case the document state doesn't change
          const stateResult = DocState.getState({
            documentStateId: result.prf.document_state_id,
            clone: this.clone,
            documentMaker: result.employee.uuid,
            prfStatusList: this.documentStatusList,
            currentEmployee: this.currentEmployee,
          });

          this.voucher.status = stateResult.state;
          this.privilegedUser = stateResult.privilegedUser;

          result.items.forEach((line) => {
            const dateFrom = new Date(line.date_from);
            this.budgetlines.push({
              uuid: line.uuid,
              description: line.specification,
              date_from: dateFrom,
              date_to: line.date_to ? new Date(line.date_to) : dateFrom,
              cash_return : !!line.cash_return,
              unit: line.unit_id,
              quantity: line.quantity,
              reference: line.reference,
              debit: line.debit,
              credit: line.credit,
              total: this.round(line.debit * line.quantity),
              project_uuid: line.project_uuid,
              project: result.project,
              budgetLine: {
                uuid: line.budget_line_uuid,
                entity_code: line.entity_code,
                function_code: line.function_code,
                funding_source: line.funding_source,
                loc: line.loc,
                project: line.project,
                reporting_office: line.reporting_office,
                description: line.description,
                sub_project: line.sub_project,
                activity: line.activity,
              },
              unitObject: {
                id: 18,
                abbr: "unit",
              },
            });
          });
          this.validateLines();
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.blockedPage = false;
        });
    },
    calculateTotal() {
      this.total = 0;
      this.budgetlines.forEach((bl) => {
        const qtt = util.isCorrectFloat(bl.quantity);
        const unitPrice = util.isCorrectFloat(bl.debit);
        if (qtt && unitPrice) {
          bl.total = parseFloat(this.round(bl.debit * bl.quantity));
          this.total += bl.debit * bl.quantity;
        }
      });
    },
    addBudgetLine() {
      const uuid = new UuidService().generate();
      let project = {};
      let projectUuid = null;

      if (this.budgetlines.length > 0) {
        const lastItem = this.budgetlines[this.budgetlines.length - 1];
        if (lastItem.project_uuid) {
          project = Object.assign({}, lastItem.project);
          projectUuid = project.uuid;
        }
      }

      this.budgetlines.push({
        uuid,
        description: null,
        unit: 18,
        quantity: 1,
        debit: null,
        credit: 0,
        total: null,
        project_uuid: projectUuid,
        project,
        date: null,
        budgetLine: {},
        cash_return: false,
        unitObject: {
          id: 18,
          abbr: "unit",
        },
      });
    },
    onNumberFieldSave(value, data, field, index) {
      data[field] = value;
      return this.onFieldSave(data, field, index);
    },
    onItemUpdated(val, field, index) {
       const newData = this.budgetlines[index] || {};
      newData[field] = val;
      this.budgetlines[index] = newData;
      this.validateLines();
    },
    onDateSelect(data, field, index) {
      this.onFieldSave(data, field, index);
    },
    formatDate(date) {
      if (!date) return;
      return util.formatDate(date, "DD/MM/YYYY");
    },
    onFieldSave(data, field, index) {
      const newData = this.budgetlines[index] || {};
      newData[field] = data[field];
      this.budgetlines[index] = newData;
      this.validateLines();
    },
    setProject(index, data, field) {
      const project = data[field];
      const newData = this.budgetlines[index] || {};
      newData.project = project;
      this.budgetlines[index] = newData;
      newData[field] = project.uuid;
      newData.budgetLine = {};
    },

    setBudgetLine(index, data, field) {
      const newData = this.budgetlines[index] || {};
      newData.budgetLine = data[field];
      this.budgetlines[index] = newData;
      this.validateLines();
    },
    closeProjectModal(project) {
      this.selectedProject = project;
      this.displayProjectModal = false;
      this.selectLocation();
    },
    selectLocation() {
      this.displayOfficeModal = true;
    },
    closeModal(result) {
      if (result) {
        const rows = this.budgetlines.filter(
          (bl) => result.row.uuid === bl.uuid
        );
        if (rows.length > 0) {
          rows[0].budgetLine = result.budgetLine;
          this.validateLines();
        }
      }
      this.displayBudgetLineModal = false;
    },
    selectProject() {
      if (this.budgetlines.length > 0) return;
      this.displayProjectModal = true;
    },
    validate(showErrors) {
      if (!this.submitted) return;
      this.validationError = {};
      const _approvers = this.selectedApprovers || [];

      // some services should be selected
      const approverLength = _approvers.length;
      const correctApproverLength = [1, 2].includes(approverLength);
      this.validationErrors.approvers = !correctApproverLength;

      // buget lines
      const specifiedLines = this.budgetlines.length; // selected budget lines should not be empty
      const incorretLines = this.budgetlines.filter((bl) => !bl.status).length;
      // other errors
      //
      if (this.selectedFonctionOffice.code) {
        this.selectedFonctionOfficeCode = this.selectedFonctionOffice.code;
      }

      if (!this.voucherUuid) {
        delete this.validationErrors.update_note;
      }

      validator.check("approvers", !correctApproverLength);

      validator.check("traval_place", !this.exr.traval_place);
      validator.check("activity", !this.exr.activity);
      validator.check("advance_amount", this.exr.advance_amount === null);
      validator.check("advance_date", !this.exr.advance_date);

      validator.check("grid", incorretLines !== 0 || specifiedLines === 0);
      validator.check(
        "update_note",
        this.voucherUuid && !this.clone ? !this.voucher.update.note : false
      );

      if (!showErrors) return;
      const validatationResult = validator.process();
      if (!validatationResult) return true;
      NotifyService.danger(
        this,
        "FORM.ERRORS.INVALID",
        validatationResult.text
      );
    },
    changeStatus(event) {
      this.$refs.DocumentStatusMenu.toggle(event);
      this.setStatus();
    },
    setStatus() {
      this.DocumentStatus = [];
      this.documentStatusList.forEach((status) => {
        this.DocumentStatus.push({
          label: this.$t(status.label),
          icon: this.voucher.status.id === status.id ? "pi pi-check" : "",
          command: () => {
            this.voucher.status = status;
          },
        });
      });
    },
    validateLines() {
      //
      this.budgetlines.forEach((bl) => {
        const hasDateFrom = !!bl.date_from;
        const hasDateTo = !!bl.date_to;
        let correctPeriod = true;
        if (hasDateTo) {
          correctPeriod = util.isFutureDate(bl.date_to, bl.date_from);
        }

        const qtt = util.isCorrectFloat(bl.quantity);
        const unitPrice = util.isCorrectFloat(bl.debit);
        const unit = util.isPositiveInteger(bl.unitObject.id);
        const desc = util.isCorrectString(bl.description);
        const projectDefined = !!bl.project.uuid;
        this.calculateTotal();
        bl.status =
          hasDateFrom &&
          correctPeriod &&
          bl.budgetLine &&
          projectDefined &&
          qtt &&
          unitPrice &&
          unit &&
          desc;
      });
    },
    submit() {
      if (this.loading) return;
      this.submitted = true;
      const isValid = this.validate(true);
      if (!isValid) return;

      this.loading = true;
      const reformateExpense = util.dateFormatter([this.exr]);
      const _lines = util.dateFormatter(this.budgetlines);
      ExpenseReportService.create({
        exr: reformateExpense[0],
        project_uuid: this.selectedProject.uuid,
        office_uuid: this.reportingOffice.uuid,
        fct_office_uuid: this.selectedFonctionOffice.uuid,

        status_id: this.voucher.status.id,
        employee: this.applicant,
        parent: !this.clone ? this.voucherUuid : null,
        isEdit: !this.clone && !!this.voucherUuid,
        edited_by: this.currentEmployee.uuid,
        amount: this.total,
        usefulness: this.voucher.usefulness,
        additional_info: this.voucher.additional_info,
        voucher_type_id: constants.voucherTypes.exr,
        update_note: this.voucher.update.note,
        delivery: {
          recipient: this.voucher.delivery.recipient,
          address: this.voucher.delivery.address,
          expected_date: util.formatDate(this.voucher.delivery.expected_date),
          email: this.voucher.delivery.email,
          note: this.voucher.delivery.note,
        },
        lines: _lines.map((line) => {
          line.budgetLine.reporting_office = this.reportingOffice.code;
          return line;
        }),
        services: [],
        approvers: this.selectedApprovers.map((ap) => ap.uuid),
      })
        .then((response) => {
          NotifyService.success(this, "", null);
          this.viewPDF(response.uuid);
        })
        .catch(() => {
          NotifyService.danger(this, "", null);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    removeRow(row) {
      // remove a budget kine row
      this.budgetlines = this.budgetlines.filter(
        (line) => line.uuid !== row.uuid
      );
    },
    cancel() {
      this.$router.go(-1);
    },
  },
  components: {
    BudgetLineModal,
    ProjectModal,
    OfficeSelectModal,
    pdfViewer,
  },
});
</script>
  
<style scoped>
.cWhite {
  color: #fff;
}
.p-field label {
  font-size: 14px !important;
}
.loader1 {
  text-align: center;
  width: 100%;
  position: relative;
  z-index: 109;
}
</style>