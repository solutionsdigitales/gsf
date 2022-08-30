<template>
  <div class="col-p12 card page-body">
    <div style="float: right; width: 300px">
      <span class="p-buttonset">
        <Button style="float: right" id="addButton" v-on:click="Add()" :label="$t('FORM.BUTTONS.ADD')" icon="pi pi-plus" />
      </span>
    </div>
    <br />
    <br />
    <br />
    <DataTable
      @rowSelect="onRowSelect"
      :value="items"
      showGridlines
      stripedRows
      v-model:selection="selectedProject"
      dataKey="uuid"
      :loading="loading"
      responsiveLayout="scroll"
    >
      <template #header>
        {{ $t("TREE.PROJECT") }}
      </template>

      
      <template #empty>
        {{$t('FORM.SELECT.EMPTY')}}
      </template>

      <Column selectionMode="single" headerStyle="width: 3em"></Column>

      <Column field="code" :header="$t('FORM.LABELS.CODE')"></Column>
      <Column field="name" :header="$t('FORM.LABELS.NAME')"></Column>
      <Column field="short_name" :header="$t('FORM.LABELS.ABBREVIATION')"></Column>

      <Column field="action" header="Action" style="width: 100px">
        <template #body="e">
          <divitionActions 
            :entity="e.data"
            :actionId="e.data.code"
            v-on:reloadProjectList="getProject()" />
        </template>
      </Column>
    </DataTable>
   
    <CreateUpdateModal
      :project="divition"
      ref="adddivitionModal"
      :close='closeDialog'
      :display="displayCreateModal">
    </CreateUpdateModal>

  </div>
</template>

<script>
import projectService from "./project.service";
import divitionActions from "./actions";
import CreateUpdateModal from "./createUpdateModal";
import AppCache from "../../service/appCache";

export default {
  data() {
    return {
      project: [],
      divition : {},
      items: [],
      loading : false,
      selectedProject: null,
      displayCreateModal : false,
    };
  },
  created() {
    const cache = AppCache.get('session') || {};
    if(cache.token) {
      this.getProject();
    } else {
      this.$router.push("/auth");
    }
  },
  methods: {
    getProject() {
      this.loading = true;
      projectService.read()
      .then((items) => {
        this.items = items;
      }).finally(() => {
        this.loading = false;
      });
    },
    onRowSelect($event) {
      console.log($event.data);
    },
    Add() {
      this.displayCreateModal = true;
      this.divition = {};
    },
    closeDialog(result) {
      if(result) {
        this.getProject();
      }
      this.displayCreateModal = false;
    },
    toggleAction(event) {
      this.$refs.cm.show(event.originalEvent);
      this.items = [
        {
          label: "delete",
          icon: "pi pi-check",
          command: () => {
          },
        },
      ];
    },
  },
  components: {
    divitionActions,
    CreateUpdateModal,  
  },
};
</script>
