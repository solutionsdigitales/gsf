<template>
  <div class="col-p12 card page-body">
    <div style="float: right; width: 300px">
      <span class="p-buttonset">
        <Button
          id="addButton"
          style="float: right"
          v-on:click="Add()"
          :label="$t('FORM.BUTTONS.ADD')"
          icon="pi pi-plus"
        />
      </span>
    </div>
    <br />
    <br />
    <br />
    <DataTable
      @rowSelect="onRowSelect"
      :value="locations"
      showGridlines
      stripedRows
      v-model:selection="selectedlocation"
      dataKey="uuid"
      responsiveLayout="scroll"
    >
      <template #header>
        {{ $t("TREE.LOCATION") }}
      </template>
      <Column selectionMode="single" headerStyle="width: 3em"></Column>

      <Column field="code" :header="$t('FORM.LABELS.CODE')"></Column>
      <Column field="name" :header="$t('FORM.LABELS.NAME')"></Column>
      <Column field="address" :header="$t('FORM.LABELS.ADDRESS')"></Column>

      <Column field="action" header="Action" style="width: 100px">
        <template #body="e">
          <locationActions
            :entity="e.data"
            :actionId="e.data.code"
            v-on:reloadLocationList="getlocation()"
          />
        </template>
      </Column>
    </DataTable>

    <CreateUpdateModal
      :location="location"
      ref="addLocationModal"
      :close="closeDialog"
      :display="displayCreateModal"
    >
    </CreateUpdateModal>
  </div>
</template>

<script>
import OfficeService from "./office.service";
import locationActions from "./actions";
import CreateUpdateModal from "./createUpdateModal";
import AppCache from "../../service/appCache";

export default {
  data() {
    return {
      locations: [],
      location: {},
      items: [],
      selectedlocation: null,
      displayCreateModal: false,
    };
  },
  created() {
    const cache = AppCache.get("session") || {};
    if (cache.token) {
      this.getlocation();
    } else {
      this.$router.push("/auth");
    }
  },
  methods: {
    getlocation() {
      OfficeService.read().then((locations) => {
        this.locations = locations;
      });
    },
    onRowSelect($event) {
      console.log($event.data);
    },
    Add() {
      this.displayCreateModal = true;
      this.location = {};
    },
    closeDialog(result) {
      if (result) {
        this.getlocation();
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
    locationActions,
    CreateUpdateModal,
  },
};
</script>
