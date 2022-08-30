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
            <h4>{{ $t("TREE.PRF") }}</h4>
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
                  v-if="prf.status.id"
                  :style="
                    'background:' + prf.status.bg + ';color:' + prf.status.color
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
                <label for="services">
                  {{ $t("FORM.LABELS.SERVICE") }}
                </label>

                <MultiSelect
                  id="services"
                  v-model="selectedServices"
                  :options="services"
                  @change="validate()"
                  optionLabel="name"
                  :placeholder="$t('PRF.SELECT_SERVICE')"
                  :filter="true"
                >
                </MultiSelect>
              </div>
            </div>

            <div class="col-12 lg:col-4 xl:col-4">
              <div class="p-field">
                <label
                  for="approvers"
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
            <div class="col-12 lg:col-4 xl:col-4">
              <div class="p-field">
                <label class="label-required" for="lastname">{{
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

              <div
                class="p-field-checkbox link"
                style="padding: 10px; padding-left: 0px"
              >
                <Checkbox
                  id="is_owner"
                  :binary="true"
                  name="is_owner"
                  v-model="prf.delivery.is_owner"
                />
                <label for="is_owner" style="padding-left: 10px">
                  {{ $t("FORM.LABELS.OWNER") }}
                </label>
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
                  {{ $t("PRF.EXPECTED_DATE") }}
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
                <label
                  for="delivery_note"
                  :class="{ 'p-error': validationErrors.title3 && submitted }"
                >
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
                  @update:modelValue="onItemUpdated($event, field, index)"
                  v-model="data[field]"
                />
              </template>
            </Column>
            <Column field="unit" :header="$t('PRF.UNIT')" style="width: 5%">
              <template #body="e">
                <span>{{ $t(e.data.unitObject.text) }}</span>
                <span :id="'unit' + e.index" class="cWhite">.</span>
              </template>
              <template #editor="{ data, field, index }">
                <Dropdown
                  :id="'unit_input' + index"
                  v-model="data[field]"
                  @change="setUnit(index, data, field)"
                  :options="inventoryUnits"
                  :filter="true"
                  style="width: 100%"
                  placeholder="Select a unit"
                  optionLabel="text"
                >
                  <template #option="slotProps">
                    <span>
                      {{ slotProps.option.text }}
                    </span>
                  </template>
                </Dropdown>
              </template>
            </Column>

            <Column
              field="quantity"
              :header="$t('FORM.LABELS.QUANTITY')"
              style="width: 5%"
            >
              <template #body="e">
                <div class="link text-right">
                  <span class="cWhite" :id="'quantity' + e.index">.</span>
                  <span>{{ e.data.quantity }}</span>
                </div>
              </template>

              <template #editor="{ data, field, index }">
                <InputNumber
                  :id="'quantity_input' + index"
                  v-model="data[field]"
                  :currency="enterprise.currency_format_key"
                  :locale="enterprise.currency_intel_number_format"
                  :minFractionDigits="2"
                  v-on:input="
                    onNumberFieldSave($event.value, data, field, index)
                  "
                  style="width: 100%"
                />
              </template>
            </Column>

            <Column
              field="unit_price"
              :header="$t('FORM.LABELS.UNIT_PRICE')"
              style="width: 5%"
            >
              <template #body="e">
                <div class="link text-right">
                  <span>{{
                    formatCurrency(e.data.unit_price, enterprise.currency_id)
                  }}</span>
                  <span :id="'unit_price' + e.index" class="cWhite">.</span>
                </div>
              </template>
              <template #editor="{ data, field, index }">
                <InputNumber
                  :id="'unit_price_input' + index"
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
              field="reference"
              :header="$t('FORM.LABELS.REFERENCE')"
              style="width: 5%"
            >
              <template #body="e">
                <div class="link">
                  <span v-if="e.data.reference" v-tooltip="e.data.reference">{{
                    $t("FORM.LABELS.REFERENCE")
                  }}</span>
                  <span :id="'reference' + e.index" class="cWhite">.</span>
                </div>
              </template>
              <template #editor="{ data, field, index }">
                <InputText
                  :id="'reference_input' + index"
                  v-model="data[field]"
                  v-on:input="onFieldSave(data, field, index)"
                  style="width: 100%"
                />
              </template>
            </Column>

            <Column field="total" header="total" style="width: 3%">
              <template #body="e">
                <div class="text-right">
                  <span>{{
                    formatCurrency(e.data.total, enterprise.currency_id)
                  }}</span>
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

          <div class="p-field">
            <label
              for="usefulness"
              class="label-required"
              :class="{ 'p-error': validationErrors.usefulness && submitted }"
            >
              {{ $t("PRF.USEFULNESS") }}
              {{ ": {" + $t("PRF.USEFULNESS_COMMENT") + "}" }}
            </label>

            <Textarea
              id="usefulness"
              class="col-12"
              rows="4"
              v-on:input="validate()"
              v-model="prf.usefulness"
            />
          </div>

          <div class="p-field">
            <label for="additional_info">
              {{ $t("PRF.ADDITIONAL_INFO") }}
            </label>

            <Textarea
              id="additional_info"
              class="col-12"
              rows="4"
              v-on:input="validate()"
              v-model="prf.additional_info"
            />
          </div>

          <div class="p-field" v-if="prfUuid && !clone">
            <label
              class="label-required"
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
                prfUuid && !clone
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
import DocState from "./document_state_service";
import BudgetLineModal from "./modal/budget_line_modal.vue";
import ProjectModal from "./modal/projectSelectModal.vue";
import PRFService from "./prf.service";
import ProjectService from "../project/project.service";
import serviceService from "../service/service.service";
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
import OfficeSelectModal from "../location/LocationSelectModal.vue";

import validator from "./new.validation";

export default defineComponent({
  name: "new_prf",
  props: {
    entity: Object,
  },
  data() {
    return {
      age: null,
      submitted: false,
      blockedPage: true,
      loading: false,
      privilegedUser: false,
      validationErrors: {},
      prfUuid: null,
      total: 0,
      projects: [],
      services: [],
      prfStatus: [], // menu action of states
      prfStatusList: [], // diffente states
      selectedServices: null,
      selectedApprovers: null,
      selectedLocation: {},
      selectedFonctionOffice: {},
      displayOfficeModal: false,
      reportingOffice: {},
      pdfViewerUrl: "",
      locations: [],
      approvers: [],
      prf: { delivery: {} },
      selectedService: {},
      selectedProject: {},
      applicant: {}, // demandeur
      currentEmployee: {},
      inventoryUnits: [],
      selectedLine: {},
      budgetlines: [],
      displayBudgetLineModal: false,
      displayProjectModal: false,
      displayPdfViewerModal: false,
      noEmployee: false,
      clone: false,
      server: "",
      fileName: "",
      lang: "fr",
      enterprise: {},
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
          return serviceService.read();
        })
        .then((services) => {
          this.services = services;
          return DocState.read();
        })
        .then((docStatus) => {
          this.prfStatusList = docStatus;
          const pending = constants.DOCUMENT_STATUS.PENDING;
          this.prf.status = docStatus.filter((d) => d.id === pending)[0];
          return OfficeService.read();
        })
        .then((locations) => {
          this.locations = locations;
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

    getUserInformations() {
      this.currentEmployee = this.$store.state.session.employee;

      this.prf.delivery.address = this.currentEmployee.office_address;
      this.prf.delivery.recipient = this.currentEmployee.displayname;

      const { prfUuid, clone } = this.$route.query;
      this.clone = clone;
      this.applicant = this.currentEmployee;
      if (!prfUuid) {
        this.displayProjectModal = true;

        setTimeout(() => {
          this.blockedPage = false;
        }, 1000);
      } else {
        setTimeout(() => {
          this.loadPRFInfo(prfUuid);
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
    viewPDF(prfUuid) {
      PRFService.read(prfUuid).then((prf) => {
        this.fileName = this.createFileName(prf);
        this.pdfViewerUrl = `export/${prfUuid}?lang=${this.lang}&stream=1&renderer=pdf`;
        this.displayPdfViewerModal = true;
      });
    },
    createFileName(doc) {
      return `${doc.employee.displayname} ${doc.document.text} v${doc.prf.version} ${doc.prf.submission_date}.pdf`;
    },
    pdfDownloadFunction() {
      return PRFService.dowloadPdf(
        `export/${this.prfUuid}?lang=${this.lang}&stream=1&renderer=pdf`,
        this.fileName,
        true
      );
    },
    closePrfViewer() {
      this.displayPdfViewerModal = false;
      this.$router.push("/prf_registry");
    },

    round(num) {
      return UtilService.round(num);
    },
    // editing PRF, let load prf info from it uuid
    loadPRFInfo(PRFUuid) {
      this.prfUuid = PRFUuid;
      PRFService.read(PRFUuid)
        .then((result) => {
          if (!this.clone) {
            this.applicant = result.employee;
          }

          this.selectedProject = result.project;
          const prfServices = result.services.map((s) => s.uuid);
          const prfApprovers = result.approvers.map((ap) => ap.employee_uuid);
          this.selectedServices = [];

          this.services.forEach((s) => {
            if (prfServices.includes(s.uuid)) {
              this.selectedServices.push(s);
            }
          });

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
            }
          });

          this.prf.usefulness = result.prf.usefulness;
          this.prf.additional_info = result.prf.additional_info;

          // delivery info
          this.prf.delivery.recipient = result.prf.delivery_recipient;
          this.prf.delivery.address = result.prf.delivery_address;
          this.prf.delivery.email = result.prf.delivery_email;
          this.prf.delivery.phone = result.prf.delivery_phone;
          this.prf.delivery.note = result.prf.delivery_note;
          console.log(result.prf.delivery_is_owner);
          this.prf.delivery.is_owner = !!result.prf.delivery_is_owner;
          this.prf.delivery.expected_date = new Date(
            result.prf.delivery_expected_date
          );

          this.prf.update = {};
          // checking the document state, procurement cand edit an approved document, in that case the document state doesn't change
          const stateResult = DocState.getState({
            documentStateId: result.prf.document_state_id,
            clone: this.clone,
            documentMaker: result.employee.uuid,
            prfStatusList: this.prfStatusList,
            currentEmployee: this.currentEmployee,
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
              unit_price: line.unit_price,
              total: this.round(line.unit_price * line.quantity),
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
        const unitPrice = UtilService.isCorrectFloat(bl.unit_price);
        if (qtt && unitPrice) {
          bl.total = parseFloat(this.round(bl.unit_price * bl.quantity));
          this.total += bl.unit_price * bl.quantity;
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
        unit: null,
        quantity: null,
        unit_price: null,
        total: null,
        project_uuid: projectUuid,
        project,
        budgetLine: {},
        unitObject: { text: "" },
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
      this.selectLocation();
    },
    closeModal(result) {
      if (result) {
        const rows = this.budgetlines.filter(
          (bl) => result.row.uuid === bl.uuid
        );
        if (rows.length > 0) {
          rows[0].budgetLine = result.budgetLine;
        }
      }
      this.displayBudgetLineModal = false;
    },
    selectProject() {
      if (this.budgetlines.length > 0) return;
      this.displayProjectModal = true;
    },
    selectLocation() {
      this.displayOfficeModal = true;
    },
    closeOfficeModal(office) {
      if (office) {
        this.reportingOffice = office;
      }
      this.displayOfficeModal = false;
    },
    validate(showErrors) {
      if (!this.submitted) return;
      this.validationError = {};
      console.log();
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

      // check expected date
      const isFutureDate = UtilService.isFutureDate(
        this.prf.delivery.expected_date
      );
      if (!isFutureDate) {
        this.validationErrors.delivery_expected_date = true;
        validator.check("delivery_expected_date", true);
      }

      validator.check("usefulness", !this.prf.usefulness);
      this.validationErrors.usefulness = !UtilService.isCorrectString(
        this.prf.usefulness
      );

      // some services should be selected
      const approverLength = _approvers.length;
      const correctApproverLength = [1, 2].includes(approverLength);
      this.validationErrors.approvers = !correctApproverLength;

      // buget lines
      const specifiedLines = this.budgetlines.length; // selected budget lines should not be empty
      const incorretLines = this.budgetlines.filter((bl) => !bl.status).length;
      // other errors

      if (!this.prfUuid || this.clone) {
        delete this.validationErrors.update_note;
      }

      validator.check("approvers", !correctApproverLength);
      validator.check("grid", incorretLines !== 0 || specifiedLines === 0);
      validator.check(
        "update_note",
        this.prfUuid && !this.clone ? !this.prf.update.note : false
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
      if (!this.privilegedUser) return;
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
    onItemUpdated(val, field, index) {
      const newData = this.budgetlines[index] || {};
      newData[field] = val;
      this.budgetlines[index] = newData;
      this.validateLines();
    },
    validateLines() {
      //
      this.budgetlines.forEach((bl) => {
        const qtt = UtilService.isCorrectFloat(bl.quantity);
        const unitPrice = UtilService.isCorrectFloat(bl.unit_price);
        const unit = UtilService.isPositiveInteger(bl.unit);
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
      PRFService.create({
        project_uuid: this.selectedProject.uuid,
        office_uuid: this.reportingOffice.uuid,
        fct_office_uuid: this.selectedFonctionOffice.uuid,
        status_id: this.prf.status.id,
        employee: this.applicant,
        parent: !this.clone ? this.prfUuid : null,
        isEdit: !this.clone && !!this.prfUuid,
        edited_by: this.currentEmployee.uuid,
        amount: this.total,
        usefulness: this.prf.usefulness,
        additional_info: this.prf.additional_info,
        voucher_type_id: constants.voucherTypes.prf,
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
          is_owner: this.prf.delivery.is_owner,
        },
        lines: this.budgetlines.map((line) => {
          line.budgetLine.reporting_office = this.reportingOffice.code;
          return line;
        }),
        services: (this.selectedServices || []).map((s) => s.uuid),
        approvers: this.selectedApprovers.map((ap) => ap.uuid),
      })
        .then((response) => {
          NotifyService.success(this, "", null);
          this.prfUuid = response.uuid;
          setTimeout(() => {
            this.viewPDF(response.uuid);
          }, 1000);
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
.loader1 {
  text-align: center;
  width: 100%;
  position: relative;
  z-index: 109;
}

.p-field label {
  font-size: 14px !important;
}
</style>