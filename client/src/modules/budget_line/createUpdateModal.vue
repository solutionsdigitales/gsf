
<template>
  <Dialog
    v-if="display"
    :header="$t('TREE.BUDGET_LINE')"
    :closable="false"
    position="top"
    :style="{ width: '50vw' }"
    :modal="true"
    :visible="display"
    footer="Footer"
  >
    <form @submit.prevent="submit()" class="p-fluid">
      <div class="grid">
        <div class="col-12 lg:col-6 xl:col-6">
          <div class="p-field">
            <label
              for="entity_code"
              :class="{ 'p-error': validationErrors.entity_code && submitted }"
            >
              {{ $t("PRF.LINE.ENTITY_CODE") }}
            </label>

            <InputText
              id="entity_code"
              v-on:input="validate()"
              v-model="selectedBudgetLine.entity_code"
              :class="{
                'p-invalid': validationErrors.entity_code && submitted,
              }"
            />
          </div>

          <div class="p-field">
            <label
              for="loc"
              :class="{ 'p-error': validationErrors.loc && submitted }"
            >
              {{ $t("PRF.LINE.LOC") }}
            </label>

            <InputText
              id="loc"
              v-on:input="validate()"
              v-model="selectedBudgetLine.loc"
              :class="{
                'p-invalid': validationErrors.loc && submitted,
              }"
            />
          </div>
          <div class="p-field">
            <label
              for="funding_source"
              :class="{
                'p-error': validationErrors.funding_source && submitted,
              }"
            >
              {{ $t("PRF.LINE.FUNDING_SOURCE") }}
            </label>

            <InputText
              id="funding_source"
              v-on:input="validate()"
              v-model="selectedBudgetLine.funding_source"
            />
          </div>

          <div class="p-field">
            <label
              for="project"
              :class="{ 'p-error': validationErrors.project && submitted }"
            >
              {{ $t("PRF.LINE.PROJECT") }}
            </label>

            <InputText
              id="project"
              v-on:input="validate()"
              v-model="selectedBudgetLine.project"
            />
          </div>

          <div class="p-field">
            <label
              for="reporting_office"
              :class="{
                'p-error': validationErrors.reporting_office && submitted,
              }"
            >
              {{ $t("PRF.LINE.OFFICE") }}
            </label>

            <InputText
              id="reporting_office"
              v-on:input="validate()"
              v-model="selectedBudgetLine.reporting_office"
            />
          </div>
        </div>

        <div class="col-12 lg:col-6 xl:col-6">
          <div class="p-field">
            <label
              for="sub_project"
              :class="{ 'p-error': validationErrors.sub_project && submitted }"
            >
              {{ $t("PRF.LINE.SUB_PROJECT") }}
            </label>

            <InputText
              id="sub_project"
              v-on:input="validate()"
              v-model="selectedBudgetLine.sub_project"
            />
          </div>

          <div class="p-field">
            <label
              for="function_code"
              :class="{
                'p-error': validationErrors.function_code && submitted,
              }"
            >
              {{ $t("PRF.LINE.FUNCTION_CODE") }}
            </label>

            <InputText
              id="function_code"
              v-on:input="validate()"
              v-model="selectedBudgetLine.function_code"
            />
          </div>
          <div class="p-field">
            <label
              for="activity"
              :class="{ 'p-error': validationErrors.activity && submitted }"
            >
              {{ $t("PRF.LINE.ACTIVITY") }}
            </label>

            <InputText
              id="activity"
              v-on:input="validate()"
              v-model="selectedBudgetLine.activity"
            />
          </div>

          <div class="p-field">
            <label
              for="description"
              :class="{ 'p-error': validationErrors.description && submitted }"
            >
              {{ $t("FORM.LABELS.DESCRIPTION") }}
            </label>

            <InputText
              id="description"
              v-on:input="validate()"
              v-model="selectedBudgetLine.description"
            />
          </div>

          <div class="p-field">
            <label
              for="amount"
              :class="{ 'p-error': validationErrors.amount && submitted }"
            >
              {{ $t("FORM.LABELS.AMOUNT") }}
            </label>

            <InputNumber
              id="amount"
              :minFractionDigits="2"
              :currency="enterprise.currency_format_key"
              :locale="enterprise.currency_intel_number_format"
              v-on:input="validate()"
              v-model="selectedBudgetLine.amount"
            />
          </div>
        </div>
      </div>
    </form>
    <template #footer>
      <Button
        :label="$t('FORM.BUTTONS.CANCEL')"
        @click="closeDialog"
        class="p-button-text"
      />
      <Button type="submit" @click="submit" :label="$t('FORM.BUTTONS.SAVE')" />
    </template>
  </Dialog>
</template>

<script>
import { defineComponent } from "vue";

import BudgetLineService from "./bugetLine.service";
import NotifyService from "../../service/Notify.service";
import EnterpriseService from "../enterprise/enterprise.service";

export default defineComponent({
  number: "CreateUpdateModal",
  props: {
    BudgetLine: Object,
    close: Function,
    display: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      items: [],
      projects: [],
      selectedBudgetLine: {},
      selectedProject: {},
      validationErrors: {},
      enterprise: {},
      submitted: false,
    };
  },
  watch: {
    display(newVal) {
      if (newVal) {
        this.find();
      }
    },
  },
  methods: {
    closeDialog() {
      this.submitted = false;
      this.selectedBudgetLine = {};
      this.close(false);
    },
    submit() {
      if (this.loading) return;
      this.submitted = true;
      const isValid = this.validate();
      if (!isValid) {
        NotifyService.danger(this, "", "FORM.ERRORS.INVALID");
        return;
      }
      this.loading = true;
      const operation = this.BudgetLine.uuid
        ? BudgetLineService.update(
            this.BudgetLine.uuid,
            this.selectedBudgetLine
          )
        : BudgetLineService.create(this.selectedBudgetLine);

      operation
        .then(() => {
          NotifyService.success(this, "", null);
          this.selectedBudgetLine = {};
          this.close(true);
        })
        .catch(() => {
          NotifyService.danger(this, "", null);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    find() {
      EnterpriseService.read().then((enterprises) => {
        this.enterprise = enterprises[0] || {};
      });

      if (!this.BudgetLine.uuid) return null;
      BudgetLineService.read(this.BudgetLine.uuid).then((budgetLine) => {
        if (budgetLine.uuid) {
          this.selectedBudgetLine = budgetLine;
        }
        console.log(this.selectedBudgetLine);
      });
    },
    setProject() {
      this.selectedBudgetLine.project_uuid = this.selectedProject.uuid;
      this.validate();
    },
    validate() {
      if (!this.submitted) return;

      const requiredCols = [
        "entity_code",
        "loc",
        "funding_source",
        "project",
        "reporting_office",
        "activity",
        "description",
      ];

      requiredCols.forEach((col) => {
        if (this.selectedBudgetLine[col]) {
          delete this.validationErrors[col];
        } else {
          this.validationErrors[col] = true;
        }
      });

      return Object.keys(this.validationErrors).length === 0;
    },
  },
});
</script>

<style scoped>
.p-field {
  padding-top: 20px;
}
</style>
