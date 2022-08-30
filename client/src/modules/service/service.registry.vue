<template>
  <div class="col-p12 card page-body">
    <div style="float: right; width: 300px">
      <span class="p-buttonset">
        <Button
          id="addButton"
          v-on:click="Add()"
          :label="$t('FORM.BUTTONS.ADD')"
          icon="pi pi-plus"
          style="float: right"
        />
      </span>
    </div>
    <br />
    <br />
    <br />

    <DataTable
      @rowSelect="onRowSelect"
      :value="services"
      showGridlines
      stripedRows
      v-model:selection="selectedService"
      dataKey="uuid"
      :loading="loading"
      responsiveLayout="scroll"
    >
      <template #header>
        {{ $t("FORM.LABELS.SERVICE") }}
      </template>

      <template #empty>
        {{ $t("FORM.SELECT.EMPTY") }}
      </template>

      <Column selectionMode="single" headerStyle="width: 3em"></Column>

      <Column field="name" :header="$t('FORM.LABELS.NAME')"></Column>

      <Column field="action" header="Action" style="width: 100px">
        <template #body="e">
          <userActions
            :entity="e.data"
            :actionId="e.data.name"
            v-on:reloadServiceList="getServices()"
          />
        </template>
      </Column>
    </DataTable>

    <CreateUpdateModal
      :service="user"
      ref="addUserModal"
      :close="closeDialog"
      :display="displayCreateModal"
    >
    </CreateUpdateModal>
  </div>
</template>

<script>
import serviceService from "./service.service";
import userActions from "./actions";
import CreateUpdateModal from "./createUpdateModal";
import AppCache from "../../service/appCache";

export default {
  data() {
    return {
      services: [],
      user: {},
      items: [],
      loading: false,
      selectedService: null,
      displayCreateModal: false,
    };
  },
  created() {
    const cache = AppCache.get("session") || {};
    if (cache.token) {
      this.getServices();
    } else {
      this.$router.push("/auth");
    }
  },
  methods: {
    getServices() {
      this.loading = true;
      serviceService.read()
      .then((services) => {
        this.services = services;
      }).finally(() => {
        this.loading = false;
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
      if (result) {
        this.getServices();
      }
      this.displayCreateModal = false;
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
    userActions,
    CreateUpdateModal,
  },
};
</script>
