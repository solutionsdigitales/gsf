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
      :selection="selectedFundingSource"
      dataKey="uuid"
      responsiveLayout="scroll"
    >
      <template #header>
        {{ $t("TREE.FUNDING_SOURCE") }}
      </template>

      
      <template #empty>
        {{$t('FORM.SELECT.EMPTY')}}
      </template>

      <Column selectionMode="single" headerStyle="width: 3em"></Column>
      <Column field="code" :header="$t('FORM.LABELS.CODE')"></Column>
      <Column field="title" :header="$t('FORM.LABELS.TITLE')"></Column>
      <Column field="short_title" :header="$t('FORM.LABELS.ABBREVIATION')"></Column>
      <Column field="type" :header="$t('FORM.LABELS.TYPE')"></Column>
       <Column field="status" :header="$t('FORM.LABELS.STATUS')"></Column>
      <Column field="action" header="Action" style="width: 100px">
        <template #body="e">
          <fundingSourceActtions 
            :entity="e.data"
            v-on:reloadFDSList="getfundingSource()" />
        </template>
      </Column>
    </DataTable>
   
    <CreateUpdateModal
      :fundingSource="fundingSource"
      ref="addfundingSourceModal"
      :close='closeDialog'
      :display="displayCreateModal">
    </CreateUpdateModal>

  </div>
</template>

<script>
import fundingSourceService from "./funding_source.service";
import fundingSourceActtions from "./actions";
import CreateUpdateModal from "./createUpdateModal";
import AppCache from "../../service/appCache";

export default {
  data() {
    return {
      fundingSource : {},
      items: [],
      selectedFundingSource: null,
      displayCreateModal : false,
    };
  },
  created() {
    const cache = AppCache.get('session') || {};
    if(cache.token) {
      this.getfundingSource();
    } else {
      this.$router.push("/auth");
    }
  },
  methods: {
    getfundingSource() {
      fundingSourceService.read().then((items) => {
        this.items = items;
      });
    },
    onRowSelect($event) {
      console.log($event.data);
    },
    Add() {
      this.displayCreateModal = true;
      this.fundingSource = {};
    },
    closeDialog(result) {
      if(result) {
        this.getfundingSource();
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
    fundingSourceActtions,
    CreateUpdateModal,  
  },
};
</script>
