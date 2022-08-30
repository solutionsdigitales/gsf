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
            <h4>{{ $t("TREE.FR") }}</h4>
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
              <span class="link"
                >{{ $t("FORM.LABELS.STATUS") }}:
                <span
                  class="prf_status"
                  v-if="prf.status.id"
                  :style="
                    'background:' + prf.status.bg + ';color:' + prf.status.color
                  "
                  >{{ $t(prf.status.label || "") }}</span
                >
              </span>
              <!-- <Menu ref="prfStatusMenu" :model="prfStatus" :popup="true" /> -->
            </div>
          </div>
        </div>
        <hr />
        <h6>1. {{ $t("PRF.REQUESTER_SECTION") }}</h6>
        <div class="p-fluid">
          <div class="grid">
            <div class="col-12 lg:col-12 xl:col-12">
              <div class="p-field">
                <label for="firstname">{{ $t("PRF.REQUESTER") }} :</label>
                <span class="text-primary">
                  {{ applicant.displayname }},
                  {{ applicant.position }}
                </span>
              </div>
            </div>

            <div class="col-12 lg:col-4 xl:col-4">
              <div class="p-field">
                <label class="label-required" for="locations">
                  {{ $t("PRF.LINE.OFFICE") }}
                </label>

                <Dropdown
                  id="locations"
                  v-model="selectedLocation"
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
                  class="label-required"
                  for="paymentMethod"
                  :class="{
                    'p-error': validationErrors.paymentMethod && submitted,
                  }"
                >
                  {{ $t("FORM.LABELS.PAYMENT_METHOD") }}
                </label>
                <Dropdown
                  id="paymentMethod"
                  :filter="true"
                  v-model="selectedPaymentMethod"
                  @change="setPayemntMethod()"
                  :options="paymentMethods"
                  optionLabel="name"
                  :class="{
                    'p-invalid': validationErrors.paymentMethods && submitted,
                  }"
                />
              </div>
            </div>

            <div class="col-12 lg:col-4 xl:col-4">
              <div class="p-field">
                <label
                  for="approvers"
                  class="label-required"
                  style="font-size: 14px !important"
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
            <div class="col-12 lg:col-4 xl:col-4">
              <div class="p-field">
                <label for="lastname" class="label-required">{{
                  $t("PRF.RECIPIENT")
                }}</label>
                <InputText
                  id="delivery_recipient"
                  v-model="prf.delivery.recipient"
                  @input="validate()"
                  :class="{
                    'p-invalid':
                      validationErrors.delivery_recipient && submitted,
                  }"
                />
              </div>

              <div class="p-field">
                <label for="delivery_adress">{{
                  $t("PRF.DELIVERY_ADRESS")
                }}</label>
                <InputText
                  id="delivery_adress"
                  v-model="prf.delivery.address"
                />
              </div>

              <div class="p-field">
                <label
                  class="label-required"
                  for="delivery_expected_date"
                  :class="{
                    'p-error':
                      validationErrors.delivery_expected_date && submitted,
                  }"
                >
                  {{ $t("VOUCHERS.PAYEMENT_DATE") }}
                </label>

                <Calendar
                  id="delivery_expected_date"
                  v-model="prf.delivery.expected_date"
                  :showButtonBar="true"
                  @date-select="validate()"
                  :minDate="new Date()"
                  :showIcon="true"
                  placeholder="dd/mm/yyyy"
                  dateFormat="dd/mm/yy"
                />
              </div>
            </div>
            <div class="col-12 lg:col-4 xl:col-4">
              <div class="p-field">
                <label for="delivery_phone">{{
                  $t("FORM.LABELS.PHONE")
                }}</label>
                <InputText
                  id="delivery_phone"
                  v-model="prf.delivery.phone"
                  @input="validate()"
                  :class="{
                    'p-invalid': validationErrors.delivery_phone && submitted,
                  }"
                />
              </div>

              <div class="p-field">
                <label for="email">{{ $t("FORM.LABELS.EMAIL") }}</label>
                <InputText id="delivery_email" v-model="prf.delivery.email" />
              </div>
            </div>

            <div class="col-12 lg:col-4 xl:col-4">
              <div class="p-field">
                <label for="delivery_note">
                  {{ $t("FORM.INFO.NOTE") }}
                </label>

                <Textarea
                  id="delivery_note"
                  rows="4"
                  v-on:input="validate()"
                  v-model="prf.delivery.note"
                />
              </div>
            </div>
          </div>
        </div>
        <h6>3. {{ $t("PRF.BUDGET_LINES_SECTION") }}</h6>
        <div class="grid">
          <div class="col-12 lg:col-4 xl:col-4">
            <div class="p-field">
              <label
                class="label-required"
                for="account_to_credit"
                :class="{
                  'p-error': validationErrors.account_to_credit && submitted,
                }"
              >
                {{ $t("VOUCHERS.ACCOUNT_TO_CREDIT") }}
              </label>
              <br />
              <Dropdown
                id="account_to_credit"
                :filter="true"
                v-model="selectedAccount"
                @change="setAccount()"
                :options="accounts"
                optionLabel="name"
                style="padding: 0px; width: 100%"
                :class="{
                  'p-invalid': validationErrors.account_to_credit && submitted,
                }"
              />
            </div>
          </div>
        </div>
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
                  v-on:input="onFieldSave(data, field, index)"
                  v-model="data[field]"
                />
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

          <div class="p-field" v-if="voucherUuid">
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
              v-model="prf.update.note"
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
          :officeCode="selectedLocation.code"
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

    </BlockUI>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import DocState from "../prf/document_state_service";
import BudgetLineModal from "../prf/modal/budget_line_modal.vue";
import ProjectModal from "../prf/modal/projectSelectModal.vue";
import DDFService from "./ddf.service";
import ProjectService from "../project/project.service";
import paymentMethodService from "./payment_method_service";
import UuidService from "../../service/uuidService";
import UtilService from "../../service/util";
import constants from "../../service/constant";
import pdfViewer from "../../components/PdfViewer.vue";
import NotifyService from "../../service/Notify.service";
import InventoryUnit from "../inventory/unit.service";
import OfficeService from "../location/office.service";
import EmployeeService from "../employee/employee.service";
import EnterpriseService from "../enterprise/enterprise.service";
import currencyService from "../../service/currencyService";
import accountService from "../account/account.service";
import validator from "./new.validation";

export default defineComponent({
  name: "new_ddf",
  props: {
    entity: Object,
  },
  data() {
    return {
      submitted: false,
      blockedPage: true,
      loading: false,
      validationErrors: {},
      selectedPaymentMethod: {},
      selectedAccount: {},
      voucherUuid: null,
      total: 0,
      projects: [],
      paymentMethods: [],
      services: [],
      prfStatus: [], // menu action of states
      prfStatusList: [], // diffente states
      selectedApprovers: null,
      selectedLocation: {},
      locations: [],
      approvers: [],
      prf: { delivery: {} },
      selectedService: {},
      selectedProject: {},
      currentEmployee: {},
      inventoryUnits: [],
      selectedLine: {},
      budgetlines: [],
      accounts: [],
      displayBudgetLineModal: false,
      displayProjectModal: false,
      displayPdfViewerModal: false,
      noEmployee: false,
      privilegedUser: false,
      server: "",
      fileName:"",
      lang: "fr",
      enterprise: {},
      applicant: {},
      ddf: {},
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.prf = {
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
          return paymentMethodService.read();
        })
        .then((methods) => {
          this.paymentMethods = methods.map((m) => {
            m.name = this.$t(m.translation_key);
            return m;
          });
          return DocState.read();
        })
        .then((docStatus) => {
          this.prfStatusList = docStatus;
          this.prf.status = docStatus.filter((ds) => ds.id === 1)[0] || {};
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
          return InventoryUnit.read();
        })
        .then((units) => {
          this.inventoryUnits = units.map((u) => {
            u.text = this.$t(u.text);
            return u;
          });

          this.getUserInformations();
        });
    },
    setPayemntMethod() {
      this.ddf.payment_method_id = this.selectedPaymentMethod.id;
      this.validate();
    },
    setAccount() {
      this.ddf.account_to_credit = this.selectedAccount.uuid;
      this.validate();
    },
    getUserInformations() {
      this.currentEmployee = this.$store.state.session.employee;
      this.prf.delivery.address = this.currentEmployee.office_address;
      this.prf.delivery.recipient = this.currentEmployee.displayname;

      this.locations.forEach((l) => {
        if (l.uuid === this.currentEmployee.office_uuid) {
          this.selectedLocation = l;
        }
      });

      const { voucherUuid } = this.$route.query;
      this.applicant = this.currentEmployee;
      if (!voucherUuid) {
        this.displayProjectModal = true;
        setTimeout(() => {
          this.blockedPage = false;
        }, 1000);
      } else {
        setTimeout(() => {
          this.loadVoucherInfo(voucherUuid);
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
      DDFService.read(voucherUuid).then((ddf) => {
        this.voucherUuid = voucherUuid;
        this.fileName = this.createFileName(ddf);
        this.pdfViewerUrl = `export/${voucherUuid}?lang=${this.lang}&stream=1&renderer=pdf`;
        this.displayPdfViewerModal = true;
      });
    },
    createFileName(doc) {
      return `${doc.employee.displayname} ${doc.document.text} v${doc.prf.version} ${doc.prf.submission_date}.pdf`;
    },
    pdfDownloadFunction() {
      return DDFService.dowloadPdf(
        `export/${this.voucherUuid}?lang=${this.lang}&stream=1&renderer=pdf`,
        this.fileName,
        true
      );
    },
    closePrfViewer() {
      this.displayPdfViewerModal = false;
      this.$router.push("/fr_registry");
    },
    setLocation() {
      this.prf.office_uuid = this.selectedLocation.uuid;
      this.validate();
    },
    round(num) {
      return UtilService.round(num);
    },
    // editing PRF, let load prf info from it uuid
    loadVoucherInfo(voucherUuid) {
      this.voucherUuid = voucherUuid;
      DDFService.read(voucherUuid)
        .then((result) => {
          if(!this.clone) {
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
          this.locations.forEach((l) => {
            if (l.uuid === result.prf.office_uuid) {
              this.selectedLocation = l;
            }
          });

          const pMethods = this.paymentMethods.filter(
            (method) => method.id === result.ddf.payment_method_id
          );
          this.selectedPaymentMethod = pMethods[0] || {};
          this.ddf.payment_method_id = this.selectedPaymentMethod.id;
          const accs = this.accounts.filter(
            (ac) => ac.uuid === result.ddf.account_to_credit
          );
          this.selectedAccount = accs[0] || {};
          this.ddf.account_to_credit = this.selectedAccount.uuid;
          this.prf.usefulness = result.prf.usefulness;
          this.prf.additional_info = result.prf.additional_info;

          // delivery info
          this.prf.delivery.recipient = result.prf.delivery_recipient;
          this.prf.delivery.address = result.prf.delivery_address;
          this.prf.delivery.email = result.prf.delivery_email;
          this.prf.delivery.phone = result.prf.delivery_phone;
          this.prf.delivery.note = result.prf.delivery_note;
          this.prf.delivery.expected_date = new Date(
            result.prf.delivery_expected_date
          );

          this.prf.update = {};

          // document state
            // checking the document state, procurement cand edit an approved document, in that case the document state doesn't change
          const stateResult = DocState.getState({
            documentStateId : result.prf.document_state_id,
            clone : this.clone,
            documentMaker : result.employee.uuid,
            prfStatusList: this.prfStatusList,
            currentEmployee : this.currentEmployee
          });

          this.prf.status = stateResult.state;
          this.privilegedUser = stateResult.privilegedUser;

          result.items.forEach((line) => {
            this.budgetlines.push({
              uuid: line.uuid,
              description: line.specification,
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
              unitObject:
                this.inventoryUnits.filter((iv) => iv.id === line.unit_id)[0] ||
                {},
            });
          });
          this.validateLines();
        })
        .finally(() => {
          this.blockedPage = false;
        });
    },
    calculateTotal() {
      this.total = 0;
      this.budgetlines.forEach((bl) => {
        const qtt = UtilService.isCorrectFloat(bl.quantity);
        const unitPrice = UtilService.isCorrectFloat(bl.debit);
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
        budgetLine: {},
        unitObject: this.inventoryUnits.filter((ivU) => ivU.id === 18)[0],
      });
    },
    onNumberFieldSave(value, data, field, index) {
      data[field] = value;
      return this.onFieldSave(data, field, index);
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

    setUnit(index, data, field) {
      const _unit = data[field];
      const newData = this.budgetlines[index] || {};
      newData.unitObject = _unit;
      newData.unit = _unit.id;
      this.budgetlines[index] = newData;
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
    },
    closeModal(result) {
      if (result) {
        const rows = this.budgetlines.filter(
          (bl) => result.row.uuid === bl.uuid
        );
        if (rows.length > 0) {
          console.log(result.budgetLine);
          rows[0].budgetLine = result.budgetLine;
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
      // set validation errors
      const requiredCols = {
        delivery: ["expected_date", "recipient"],
        update: ["note"],
      };

      Object.keys(requiredCols).forEach((key) => {
        requiredCols[key].forEach((col) => {
          const errorKey = `${key}_${col}`;
          const result = validator.check(errorKey, !this.prf[key][col]);
          this.validationErrors[errorKey] = result;
        });
      });

      const methodVerification = validator.check(
        "paymentMethod",
        !this.ddf.payment_method_id
      );
      this.validationErrors["paymentMethod"] = methodVerification;

      const accountVerification = validator.check(
        "account_to_credit",
        !this.ddf.account_to_credit
      );
      this.validationErrors["account_to_credit"] = accountVerification;

      // check expected date
      const isFutureDate = UtilService.isFutureDate(
        this.prf.delivery.expected_date
      );
      if (!isFutureDate) {
        this.validationErrors.delivery_expected_date = true;
        validator.check("delivery_expected_date", true);
      }

      // some services should be selected
      const approverLength = _approvers.length;
      const correctApproverLength = [1, 2].includes(approverLength);
      this.validationErrors.approvers = !correctApproverLength;

      // buget lines
      const specifiedLines = this.budgetlines.length; // selected budget lines should not be empty
      const incorretLines = this.budgetlines.filter((bl) => !bl.status).length;
      // other errors

      if (!this.voucherUuid) {
        delete this.validationErrors.update_note;
      }

      validator.check("approvers", !correctApproverLength);
      validator.check("grid", incorretLines !== 0 || specifiedLines === 0);
      validator.check(
        "update_note",
        this.voucherUuid ? !this.prf.update.note : false
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
      this.$refs.prfStatusMenu.toggle(event);
      this.setStatus();
    },
    setStatus() {
      this.prfStatus = [];
      this.prfStatusList.forEach((status) => {
        this.prfStatus.push({
          label: this.$t(status.label),
          icon: this.prf.status.id === status.id ? "pi pi-check" : "",
          command: () => {
            this.prf.status = status;
          },
        });
      });
    },
    validateLines() {
      //
      this.budgetlines.forEach((bl) => {
        const qtt = UtilService.isCorrectFloat(bl.quantity);
        const unitPrice = UtilService.isCorrectFloat(bl.debit);
        const unit = UtilService.isPositiveInteger(bl.unitObject.id);
        const desc = UtilService.isCorrectString(bl.description);
        const projectDefined = !!bl.project.uuid;
        this.calculateTotal();
        bl.status =
          bl.budgetLine && projectDefined && qtt && unitPrice && unit && desc;
      });
    },
    submit() {
      if (this.loading) return;
      this.submitted = true;
      const isValid = this.validate(true);
      if (!isValid) return;

      this.loading = true;
      DDFService.create({
        ddf: this.ddf,
        project_uuid: this.selectedProject.uuid,
        office_uuid: this.selectedLocation.uuid,
        status_id: this.prf.status.id,
        employee: this.applicant,
        parent: !this.clone ? this.voucherUuid : null,
        isEdit: !this.clone && !!this.voucherUuid,
        edited_by : this.currentEmployee.uuid,
        amount: this.total,
        usefulness: this.prf.usefulness,
        additional_info: this.prf.additional_info,
        voucher_type_id: constants.voucherTypes.ddf,
        update_note: this.prf.update.note,
        delivery: {
          recipient: this.prf.delivery.recipient,
          address: this.prf.delivery.address,
          phone: this.prf.delivery.phone,
          expected_date: UtilService.formatDate(
            this.prf.delivery.expected_date
          ),
          email: this.prf.delivery.email,
          note: this.prf.delivery.note,
        },
        lines: this.budgetlines,
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