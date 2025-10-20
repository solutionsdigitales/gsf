<template>
  <div class="col-p12 card page-body">
    <div style="float: right; width: 300px">
      <span class="p-buttonset">
        <Button style="float: right" v-on:click="Add()" :label="$t('FORM.BUTTONS.ADD')" icon="pi pi-plus" />
      </span>
    </div>
    <br />
    <br />
    <DataTable
      @rowSelect="onRowSelect"
      :value="items"
      showGridlines
      stripedRows
      :selection="selectedactivity"
      dataKey="uuid"
      responsiveLayout="scroll"
    >
      <template #header>
        {{ $t("TREE.ACTIVITY") }}
      </template>
      <Column selectionMode="single" headerStyle="width: 3em"></Column>
      <Column field="code" :header="$t('FORM.LABELS.CODE')"></Column>
      <Column field="title" :header="$t('FORM.LABELS.TITLE')"></Column>
      <Column field="short_title" :header="$t('FORM.LABELS.ABBREVIATION')"></Column>
      <Column field="type" :header="$t('FORM.LABELS.TYPE')"></Column>
       <Column field="status" :header="$t('FORM.LABELS.STATUS')"></Column>
      <Column field="action" header="Action" style="width: 100px">
        <template #body="e">
          <activityActtions 
            :entity="e.data"
            v-on:reloadActivityRegistry="getActivities()" />
        </template>
      </Column>
    </DataTable>
   
    <CreateUpdateModal
      :activity="activity"
      ref="addActivitySourceModal"
      :close='closeDialog'
      :display="displayCreateModal">
    </CreateUpdateModal>

  </div>
</template>

<script>
import ActivityService from "./acivity.service";
import activityActtions from "./actions.vue";
import CreateUpdateModal from "./createUpdateModal.vue";
import AppCache from "../../service/appCache";

export default {
  data() {
    return {
      activity : {},
      items: [],
      selectedactivity: null,
      displayCreateModal : false,
    };
  },
  created() {
    const cache = AppCache.get('session') || {};
    if(cache.token) {
      this.getActivities();
    } else {
      this.$router.push("/auth");
    }
  },
  methods: {
    getActivities() {
      ActivityService.read().then((items) => {
        this.items = items;
      });
    },
    onRowSelect($event) {
      console.log($event.data);
    },
    Add() {
      this.displayCreateModal = true;
      this.activity = {};
    },
    closeDialog(result) {
      if(result) {
        this.getActivities();
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
    activityActtions,
    CreateUpdateModal,  
  },
};
</script>
