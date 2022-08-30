<template>
  <div class="col-p12 card page-body">
    <div style="float: right; width: 300px">
      <span class="p-buttonset">
        <Button style="float: right" v-on:click="Add()" :label="$t('FORM.BUTTONS.ADD')" icon="pi pi-plus" />
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
      :selection="selectedDivision"
      dataKey="id"
      responsiveLayout="scroll"
    >
      <template #header>
        {{ $t("TREE.DIVISION") }}
      </template>
      
      <template #empty>
        {{$t('FORM.SELECT.EMPTY')}}
      </template>

      <Column selectionMode="single" headerStyle="width: 3em"></Column>

      <Column field="name" :header="$t('FORM.LABELS.NAME')"></Column>

      <Column field="action" header="Action" style="width: 100px">
        <template #body="e">
          <divitionActions 
            :entity="e.data"
            v-on:reloadDivisionList="getDivision()" />
        </template>
      </Column>
    </DataTable>
   
    <CreateUpdateModal
      :division="divition"
      ref="adddivitionModal"
      :close='closeDialog'
      :display="displayCreateModal">
    </CreateUpdateModal>

  </div>
</template>

<script>
import divisionService from "./division.service";
import divitionActions from "./actions";
import CreateUpdateModal from "./createUpdateModal";
import AppCache from "../../service/appCache";

export default {
  data() {
    return {
      division: [],
      divition : {},
      items: [],
      selectedDivision: null,
      displayCreateModal : false,
    };
  },
  created() {
    const cache = AppCache.get('session') || {};
    if(cache.token) {
      this.getDivision();
    } else {
      this.$router.push("/auth");
    }
  },
  methods: {
    getDivision() {
      divisionService.read().then((items) => {
        this.items = items;
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
        this.getDivision();
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
