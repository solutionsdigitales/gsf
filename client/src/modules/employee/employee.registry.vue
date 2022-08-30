<template>
  <div class="col-p12 card page-body">
    <div style="float: right !important; width: 205px">
      <span class="p-buttonset">
        <Button
          id="importButton"
          class="p-button-secondary"
          style="float: left"
          @click="importEmployees()"
          :label="$t('FORM.BUTTONS.IMPORT')"
        />

        <Button
          id="addButton"
          @click="Add()"
          :label="$t('FORM.BUTTONS.ADD')"
          icon="pi pi-plus"
        />
      </span>
    </div>
    <br />
    <br />
    <div style="height: calc(70vh)">
      <DataTable
        @rowSelect="onRowSelect"
        :value="employees"
        showGridlines
        :scrollable="true"
        scrollHeight="flex"
        stripedRows
        v-model:selection="selectedEmployee"
        dataKey="uuid"
        :filters="filters1"
        :resizableColumns="true"
        :rowHover="true" 
        :loading="loading"
      >
        <template #header>
          {{ $t("TREE.EMPLOYEE") }}

          <div class="flex justify-content-between flex-column sm:flex-row">
                            <span></span>
                            <span class="p-input-icon-left mb-2">
                                <i class="pi pi-search" />
                                <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="width: 100%"/>
                            </span>
                        </div>
        </template>

        <Column selectionMode="single" style="max-width:2rem"></Column>
        <Column field="reference" :header="$t('FORM.LABELS.REFERENCE')">
          <template #body="e">
            {{e.data.reference}}
          </template>
        </Column>

        <Column field="displayname" :sortable="true"  style="min-width:14rem" :header="$t('FORM.LABELS.NAME')">
        </Column>
        <Column field="gender" :header="$t('FORM.LABELS.GENDER')"></Column>
        <Column field="phone" :header="$t('FORM.LABELS.PHONE')"></Column>
        <Column field="email" :header="$t('FORM.LABELS.EMAIL')"></Column>
        <Column field="grade" :header="$t('FORM.LABELS.GRADE')"></Column>
        <Column field="position" :header="$t('FORM.LABELS.POSITION')"></Column>
        <Column
          field="service_name"
          :header="$t('FORM.LABELS.SERVICE')"
        ></Column>
        
        <Column field="action" header="Action" style="max-width:5rem">
          <template #body="e">
            <EmployeeActions
              :actionId="e.data.reference"
              :entity="e.data"
              v-on:reloadEmployeeList="getEmployees()"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <CreateUpdateModal
      :employee="employee"
      ref="addemployeeModal"
      :close="closeDialog"
      :display="displayCreateModal"
    >
    </CreateUpdateModal>

    <ImportModal
      ref="importModal"
      :close="closeDialog"
      :display="displayImportModal"
    >
    </ImportModal>
  </div>
</template>

<script>
import {FilterMatchMode} from 'primevue/api';
import EmployeeService from "./employee.service";
import EmployeeActions from "./actions";
import CreateUpdateModal from "./createUpdateModal";
import ImportModal from "./ImportModal.vue";
import AppCache from "../../service/appCache";

export default {
  data() {
    return {
      employees: [],
      filters1: { 'global': {value: null, matchMode: FilterMatchMode.CONTAINS}},
      employee: {},
      items: [],
      selectedEmployee: null,
      displayCreateModal: false,
      displayImportModal: false,
      loading : false,
    };
  },
  created() {
    const cache = AppCache.get("session") || {};
    if (cache.token) {
      this.getEmployees();
    } else {
      this.$router.push("/auth");
    }
  },
  methods: {
    getEmployees() {
      this.loading = true;
      EmployeeService.read().then((employees) => {
        this.employees = employees;
      }).finally(() => {
        this.loading = false;
      });
    },
    onRowSelect($event) {
      console.log($event.data);
    },
    Add() {
      this.displayCreateModal = true;
      this.employee = {};
    },
    importEmployees() {
      this.displayImportModal = true;
    },
    closeDialog(result) {
      if (result) {
        this.getEmployees();
      }
      this.displayCreateModal = false;
      this.displayImportModal = false;
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
  },
  components: {
    EmployeeActions,
    CreateUpdateModal,
    ImportModal,
  },
};
</script>
