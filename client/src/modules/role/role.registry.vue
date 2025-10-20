<template>
  <div class="col-p12 card page-body">
  

    <DataTable
      @rowSelect="onRowSelect"
      :value="roles"
      showGridlines
      stripedRows
      v-model:selection="selectedRole"
      dataKey="uuid"
      responsiveLayout="scroll"
    >
      <template #header>
        {{ $t("TREE.ROLE") }}
        <div class="flex justify-content-between flex-column sm:flex-row">
          <span class="p-buttonset">
        <Button style="float: right" v-on:click="Add()" :label="$t('FORM.BUTTONS.ADD')" icon="pi pi-plus" />
      </span>
        </div>
      </template>
      
      <template #empty>
        {{$t('FORM.SELECT.EMPTY')}}
      </template>

      <Column selectionMode="single" headerStyle="width: 3em"></Column>

      <Column field="label" :header="$t('FORM.LABELS.LABEL')"></Column>
      <Column field="is_default" headerStyle="width: 16em" :header="$t('FORM.LABELS.DEFAULT_ROLE')">
      <template #body="e">
        <span>{{e.data.is_default ? $t('FORM.LABELS.YES') : $t('FORM.LABELS.NO')}}</span>
      </template>
      </Column>
     
      <Column field="action" header="Action" style="width: 100px">
        <template #body="e">
          <roleActions 
            :entity="e.data"
            v-on:reloadRoleList="getRoles()" />
        </template>
      </Column>
    </DataTable>
   
    <CreateUpdateModal
        :role = "role"
        ref="addroleModal"
        :close='closeDialog'
       :display="displayCreateModal">
    </CreateUpdateModal>
  </div>
</template>

<script>
import RoleService from "./role.service";
import roleActions from "./actions.vue";
import CreateUpdateModal from "./createUpdateModal.vue";
import AppCache from "../../service/appCache";

export default {
  data() {
    return {
      roles: [],
      role : {},
      items: [],
      selectedRole: null,
      displayCreateModal : false,
    };
  },
  created() {
    const cache = AppCache.get('session') || {};
    if(cache.token) {
      this.getRoles();
    } else {
      this.$router.push("/auth");
    }
    
  },
  methods: {
    getRoles() {
      RoleService.read().then((roles) => {
        this.roles = roles;
      });
    },
    onRowSelect($event) {
      console.log($event.data);
    },
    Add() {
      this.displayCreateModal = true;
      this.role = {};
    },
    closeDialog(result) {
      if(result) {
        this.getRoles();
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
    roleActions,
    CreateUpdateModal,
  },
};
</script>
