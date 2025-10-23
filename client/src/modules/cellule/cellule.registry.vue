<template>
  <div class="col-p12 card page-body">
   
    <DataTable
      @rowSelect="onRowSelect"
      :value="cellules"
      showGridlines
      stripedRows
      v-model:selection="selectedCellule"
      dataKey="uuid"
      :loading="loading"
      responsiveLayout="scroll"
    >
      <template #header>
        {{ $t("TREE.CELLULE") }}
        <div class="flex justify-content-between flex-column sm:flex-row">
           <Button
          id="addButton"
          v-on:click="Add()"
          :label="$t('FORM.BUTTONS.ADD')"
          icon="pi pi-plus"
          style="float: right"
        />
        </div>
      </template>

      <template #empty>
        {{ $t("FORM.SELECT.EMPTY") }}
      </template>

      <Column selectionMode="single" headerStyle="width: 3em"></Column>
      <Column field="number" :header="$t('FORM.LABELS.NUMBER')"></Column>
      <Column field="name" :header="$t('FORM.LABELS.NAME')"></Column>
      <Column field="town_id" :header="$t('TREE.TOWN')"></Column>
      <Column field="creation_date" :header="$t('FORM.LABELS.CREATED_AT')"></Column>

      <Column field="action" header="Action" style="width: 100px">
        <template #body="e">
          <celluleActions
            :entity="e.data"
            :actionId="e.data.name"
            v-on:reloadCelluleList="getCellules()"
          />
        </template>
      </Column>
    </DataTable>

    <CreateUpdateModal
      :cellule="cellule"
      ref="addcelluleModal"
      :close="closeDialog"
      :display="displayCreateModal"
    >
    </CreateUpdateModal>
  </div>
</template>

<script>
import celluleService from "./cellule.service";
import celluleActions from "./actions.vue";
import CreateUpdateModal from "./createUpdateModal.vue";
import AppCache from "../../service/appCache";

export default {
  data() {
    return {
      cellules: [],
      cellule: {},
      items: [],
      loading: false,
      selectedCellule: {},
      displayCreateModal: false,
    };
  },
  created() {
    const cache = AppCache.get("session") || {};
    if (cache.token) {
      this.getCellules();
    } else {
      this.$router.push("/auth");
    }
  },
  methods: {
    getCellules() {
      this.loading = true;
      celluleService
        .read()
        .then((cellules) => {
          this.cellules = cellules;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onRowSelect($event) {
      console.log($event.data);
    },
    Add() {
      this.displayCreateModal = true;
      this.cellule = {};
    },
    closeDialog(result) {
      this.displayCreateModal = false;
      if (result) {
        this.getCellules();
      }
      
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
    celluleActions,
    CreateUpdateModal,
  },
};
</script>
