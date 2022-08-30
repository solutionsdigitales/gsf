<template>
  <Dialog
    v-if="display"
    :header="$t('TREE.EMPLOYEE')"
    :closable="false"
    position="top"
    :style="{ width: '50vw' }"
    :modal="true"
    :visible="display"
    footer="Footer"
  >
    <br />
    <br />
    <div>
      <div style="height: calc(50vh)">
        <DataTable
          :value="employees"
          v-model:selection="selectedEmployee"
          @rowSelect="onRowSelect"
          :resizableColumns="true"
          :filters="filters1"
          showGridlines
          :scrollable="true"
          scrollHeight="flex"
          stripedRows
          dataKey="uuid"
          responsiveLayout="scroll"
        >
          <template #header>
            <div>
              <span></span>
              <span class="p-input-icon-left mb-">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters1['global'].value"
                  placeholder="Keyword Search"
                  style="width: 400px"
                />
              </span>
            </div>
          </template>
          <template #empty>
            {{ $t("FORM.SELECT.EMPTY") }}
          </template>
          <Column selectionMode="single" style="max-width: 3rem"></Column>

          <Column
            field="reference"
            style="max-width: 8rem"
            :header="$t('FORM.LABELS.REFERENCE')"
          >
            <template #body="e">
              <span class="link" :id="e.data.reference" @click="setEmployee(e.data)">{{
                e.data.reference
              }}</span>
            </template>
          </Column>

          <Column
            field="displayname"
            style="max-width: 38rem"
            :header="$t('FORM.LABELS.NAME')"
          ></Column>
          
          <Column
            field="postion"
            style="max-width: 38rem"
            :header="$t('FORM.LABELS.POSITION')"
          ></Column>

        </DataTable>
      </div>
    </div>
    <template #footer>
      <div>
        
        <Button
          v-if="selectedEmployee.uuid"
          :label="$t('FORM.BUTTONS.SELECT')"
          @click="selectItem"
          class="p-button-raised p-button-text"
        />

        <Button
          :label="$t('FORM.BUTTONS.BACK')"
          @click="back()"
          :hide="employees.length === 0"
          style="float: right; margin-right: 10px"
          class="p-button-text p-button-raised"
        />

      </div>
    </template>
  </Dialog>
</template>

<script>
import { defineComponent } from "vue";
import { FilterMatchMode } from "primevue/api";
import EmployeeService from "../employee.service";

export default defineComponent({
  number: "employeeselectModal",
  props: {
    employeeUuid: String,
    close: Function,
    display: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      employees: [],
      selectedEmployee: {},
      filters1: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
    };
  },
  watch: {
    display(newVal) {
      if (newVal) {
        this.getEmployees();
      }
    },
  },
  methods: {
    reset() {
      this.employees = [];
      this.selectedEmployee = {};
    },
    closeDialog() {
      this.reset();
      this.close(false);
    },
    selectItem() {
      if (!this.selectedEmployee.uuid) return;
      this.close(this.selectedEmployee);
      this.reset();
    },
    onRowSelect() {
    },
    setEmployee(p) {
      this.selectedEmployee = p;
      this.selectItem();
    },
    getEmployees() {
      EmployeeService.read().then((employees) => {
        this.employees = employees;
      });
    },
    back() {
       this.close();
       this.reset();
    },
  },
});
</script>