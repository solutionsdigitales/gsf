
<template>
  <Dialog
    v-if="display"
    :header="$t('TREE.FUNCTION_CODE')"
    :closable="false"
    position="top"
    :style="{ width: '30vw' }"
    :modal="true"
    :visible="display"
    footer="Footer"
  >
    <form @submit.prevent="submit()" class="p-fluid">
      <div class="col-p12">
        <div class="p-field">
          <label
            for="code"
            :class="{ 'p-error': validationErrors.code && submitted }"
          >
            {{ $t("FORM.LABELS.CODE") }}
          </label>

          <InputText
            id="code"
            v-on:input="validate()"
            v-model="selectedFunctionCode.code"
            :class="{
              'p-invalid': validationErrors.code && submitted,
            }"
          />
        </div>

        <div class="p-field">
          <label
            for="employee"
            :class="{ 'p-error': validationErrors.employee_uuid && submitted }"
          >
            {{ $t("FORM.LABELS.EMPLOYEE") }}*
          </label>
          <Dropdown
            inputId="employee"
            v-model="selectedEmployee"
            @change="setEmployee()"
            :filter="true"
            :options="employees"
            optionLabel="displayname"
            :class="{
              'p-invalid': validationErrors.employee_uuid && submitted,
            }"
          />
        </div>

<br/>
        <div class="p-field-checkbox">

          <Checkbox id="locked" :binary="true"  name="locked" v-model="selectedFunctionCode.locked" />
           <label
            for="locked">
            {{ $t("FORM.LABELS.LOCKED") }}
          </label>
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
import EmployeeService from "../employee/employee.service";
import FunctionCodeService from "./function_code.service";
import NotifyfunctionCode from "../../service/Notify.service";

export default defineComponent({
  number: "CreateUpdateModal",
  props: {
    functionCode: Object,
    close: Function,
    display: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      items: [],
      employees : [],
      selectedFunctionCode: {},
      selectedEmployee: {},
      validationErrors: {},
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
      this.selectedFunctionCode = {};
      this.close(false);
    },
    submit() {
      if (this.loading) return;
      this.submitted = true;
      const isValid = this.validate();
      if (!isValid) {
        NotifyfunctionCode.danger(this, "", "FORM.ERRORS.INVALID");
        return;
      }
      this.loading = true;
      const operation = this.functionCode.uuid
        ? FunctionCodeService.update(
            this.functionCode.uuid,
            this.selectedFunctionCode
          )
        : FunctionCodeService.create(this.selectedFunctionCode);

      operation
        .then(() => {
          NotifyfunctionCode.success(this, "", null);
          this.selectedFunctionCode = {};
          this.close(true);
        })
        .catch(() => {
          NotifyfunctionCode.danger(this, "", null);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    find() {
      EmployeeService.read()
        .then((employees) => {
          this.employees = employees;
          if (this.functionCode.uuid) {
            return FunctionCodeService.read(this.functionCode.uuid);
          }
        })
        .then((functionCode) => {
          if (this.functionCode.uuid) {
            this.employees.forEach(e => {
              if(e.uuid === this.functionCode.employee_uuid) {
                this.selectedEmployee = e;
              }
            })
            functionCode.locked = !!functionCode.locked;
            this.selectedFunctionCode = functionCode;
          }
        })
        .catch((ex) => {
          console.log(ex);
        });
    },
    setEmployee() {
      this.selectedFunctionCode.employee_uuid = this.selectedEmployee.uuid;
    },
    validate() {
      if (!this.submitted) return;
      if (this.selectedFunctionCode.code) {
        delete this.validationErrors.code;
      } else {
        this.validationErrors.code = true;
      }
      if (this.selectedFunctionCode.employee_uuid) {
        delete this.validationErrors.employee_uuid;
      } else {
        this.validationErrors.employee_uuid = true;
      }

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
