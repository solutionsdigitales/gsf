<template>
  <div class="col-p12 card page-body">
    
    <DataTable
      @rowSelect="onRowSelect"
      :value="users"
      showGridlines
      stripedRows
      filterDisplay="row"
      v-model:selection="selectedUser"
      v-model:filters="filters"
      dataKey="id"
      responsiveLayout="scroll"
    >
      <template #header>
        {{ $t("TREE.USER") }}
        <div class="flex justify-content-between flex-column sm:flex-row">
          <span>
             <InputGroup>
            <Button
          id="addButton"
          v-on:click="Add()" 
          :label="$t('FORM.BUTTONS.ADD')" icon="pi pi-plus" />
          </InputGroup>
          </span>

        </div>
      </template>
      <Column selectionMode="single" headerStyle="width: 3em"></Column>

      <Column field="name" :header="$t('FORM.LABELS.NAME')">
       <template #body="{ data }">
            {{ data.name }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              type="text"
              v-model="filterModel.value"
              @input="filterCallback()"
              class="p-column-filter"
              :placeholder="`Search by name - ${filterModel.matchMode}`"
            />
          </template>
          </Column>
      <Column field="roles" :header="$t('FORM.LABELS.ROLE')"></Column>
       <Column field="locked" style="width:120px" :header="$t('FORM.LABELS.LOCKED')">
         <template #body="e">
           <span>
             {{$t(e.data.locked ? 'FORM.LABELS.YES' : 'FORM.LABELS.NO')}}
           </span>
         </template>
      </Column>
      <Column field="action" header="Action" style="width: 100px">
        <template #body="e">
          <userActions 
            :entity="e.data"
            :actionId="e.data.name"
            v-on:reloadUserList="getUsers()" />
        </template>
      </Column>
    </DataTable>
   
    <CreateUpdateModal
        :user="user"
        ref="addUserModal"
        :close='closeDialog'
       :display="displayCreateModal">
    </CreateUpdateModal>

  </div>
</template>

<script>
import { FilterMatchMode } from "@primevue/core/api";
import userverService from "./user.service";
import userActions from "./actions.vue";
import CreateUpdateModal from "./createUpdateModal.vue";
import AppCache from "../../service/appCache";

export default {
  data() {
    return {
      users: [],
      user : {},
      items: [],
      selectedUser: null,
      displayCreateModal : false,
      filters: {
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
    };
  },
  created() {
    const cache = AppCache.get('session') || {};
    if(cache.token) {
      this.getUsers();
    } else {
      this.$router.push("/auth");
    }
    
  },
  methods: {
    getUsers() {
      userverService.read().then((users) => {
        this.users = users;
      });
    },
    onRowSelect($event) {
      console.log($event.data);
    },
    Add() {
      this.displayCreateModal = true;
      this.user = {};
    },
    closeDialog(result) {
      if(result) {
        this.getUsers();
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
    userActions,
    CreateUpdateModal,
  
  },
};
</script>
