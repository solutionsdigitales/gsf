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
      :selection="selectedFunctionCode"
      dataKey="id"
      responsiveLayout="scroll"
    >
      <template #header>
        {{ $t("TREE.FUNCTION_CODE") }}
      </template>
      <Column selectionMode="single" headerStyle="width: 3em"></Column>

      <Column field="code" :header="$t('FORM.LABELS.CODE')"></Column>
      <Column field="employee_name" :header="$t('TREE.EMPLOYEE')"></Column>
      <Column field="locked" style="width:120px" :header="$t('FORM.LABELS.LOCKED')">
         <template #body="e">
           <span>
             {{$t(e.data.locked ? 'FORM.LABELS.YES' : 'FORM.LABELS.NO')}}
           </span>
         </template>
      </Column>

      <Column field="action" header="Action" style="width: 100px">
        <template #body="e">
          <functionCodeActions 
            :entity="e.data"
            v-on:reloadFunctionCodeList="getFunctionCodes()" />
        </template>
      </Column>
    </DataTable>
   
    <CreateUpdateModal
      :functionCode="functionCode"
      ref="addFunctionCodeModal"
      :close='closeDialog'
      :display="displayCreateModal">
    </CreateUpdateModal>

  </div>
</template>

<script>
import FunctionCodeService from "./function_code.service";
import functionCodeActions from "./actions";
import CreateUpdateModal from "./createUpdateModal";
import AppCache from "../../service/appCache";

export default {
  data() {
    return {
      functionCode : {},
      items: [],
      selectedFunctionCode: null,
      displayCreateModal : false,
    };
  },
  created() {
    const cache = AppCache.get('session') || {};
    if(cache.token) {
      this.getFunctionCodes();
    } else {
      this.$router.push("/auth");
    }
  },
  methods: {
    getFunctionCodes() {
      FunctionCodeService.read().then((items) => {
        this.items = items;
      });
    },
    onRowSelect($event) {
      console.log($event.data);
    },
    Add() {
      this.displayCreateModal = true;
      this.functionCode = {};
    },
    closeDialog(result) {
      if(result) {
        this.getFunctionCodes();
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
    functionCodeActions,
    CreateUpdateModal,  
  },
};
</script>
