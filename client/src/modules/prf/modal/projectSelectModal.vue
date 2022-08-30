<template>
  <Dialog
    v-if="display"
    :header="$t('TREE.PROJECT')"
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
          :value="projects"
          v-model:selection="selectedProject"
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
            field="code"
            style="max-width: 8rem"
            :header="$t('FORM.LABELS.CODE')"
          >
            <template #body="e">
              <span :id="e.data.code" class="link" @click="setProject(e.data)">{{
                e.data.code
              }}</span>
            </template>
          </Column>

          <Column
            field="short_name"
            style="max-width: 8rem"
            :header="$t('FORM.LABELS.ABBREVIATION')"
          ></Column>
          <Column
            field="name"
            style="max-width: 38rem"
            :header="$t('FORM.LABELS.NAME')"
          ></Column>
        </DataTable>
      </div>
    </div>
    <template #footer>
      <div>
        <Button
          :label="$t('FORM.BUTTONS.BACK')"
          @click="back()"
          :hide="projects.length === 0"
          style="float: right; margin-right: 10px"
          class="p-button-text p-button-raised"
        />

        <Button
          v-if="selectedProject.uuid"
          :label="$t('FORM.BUTTONS.SELECT')"
          @click="selectItem"
          class="p-button-raised p-button-text"
        />
      </div>
    </template>
  </Dialog>
</template>

<script>
import { defineComponent } from "vue";
import { FilterMatchMode } from "primevue/api";
import EmployeeService from "../../employee/employee.service";

export default defineComponent({
  number: "ProjectSelectModal",
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
      projects: [],
      selectedProject: {},
      filters1: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
    };
  },
  watch: {
    display(newVal) {
      if (newVal) {
        this.getProjects();
      }
    },
  },
  methods: {
    reset() {
      this.projects = [];
      this.selectedProject = {};
    },
    closeDialog() {
      this.reset();
      this.close(false);
    },
    selectItem() {
      if (!this.selectedProject.uuid) return;
      this.close(this.selectedProject);
      this.reset();
    },
    onRowSelect() {
      this.selectItem();
    },
    setProject(p) {
      this.selectedProject = p;
      this.selectItem();
    },
    getProjects() {
      const { uuid } = this.$store.state.session.employee;
      EmployeeService.projects(uuid).then((lines) => {
        this.projects = lines;
        if (lines.length === 1) {
          this.close(lines[0]);
          this.reset();
        }
      });
    },
    back() {
      this.$router.go(-1);
    },
  },
});
</script>