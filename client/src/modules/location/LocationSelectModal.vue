<template>
  <Dialog
    v-if="display"
    :header="$t('PRF.LINE.OFFICE')"
    :closable="false"
    position="top"
    :style="{ width: '45vw' }"
    :modal="true"
    :visible="display"
    footer="Footer"
  >
    <br />
    <div>
      <div style="height: calc(50vh)">
        <DataTable
          :value="offices"
          v-model:selection="selectedLine"
          :resizableColumns="true"
          filterDisplay="row"
          showGridlines
          :scrollable="true"
          scrollHeight="flex"
          columnResizeMode="fit"
          stripedRows
          dataKey="uuid"
          responsiveLayout="scroll"
        >
          <template #empty>
            {{ $t("FORM.SELECT.EMPTY") }}
          </template>
          <Column
            selectionMode="single"
            :frozen="true"
            style="max-width: 3rem"
          ></Column>

          <Column
            field="name"
            :frozen="true"
            style="min-width: 300px; max-width: 400px"
            :header="$t('FORM.LABELS.NAME')"
          >

          <template #body="e">
              <span
                class="link"
                :id="e.data.name"
                @click="setLine(e.data)"
                v-tooltip.bottom="e.data.name"
              >
                {{ e.data.name }}
              </span>
            </template>
          </Column>

          <Column field="address" :header="$t('FORM.LABELS.ADDRESS')"></Column>
        </DataTable>
      </div>
    </div>
    <template #footer>
      <span>.</span>
      <Button
        v-if="selectedLine.uuid"
        :label="$t('FORM.BUTTONS.SELECT')"
        @click="selectItem"
        class="p-button-raised p-button-text"
      />
    </template>
  </Dialog>
</template>

<script>
import { defineComponent } from "vue";
import OfficeServie from "./office.service";

export default defineComponent({
  number: "OfficeSelectModal",
  props: {
    row: Object,
    close: Function,
    display: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      offices: [],
      selectedLine: {},
      columns: [],
    };
  },
  created() {
    this.columns = [
      { field: "name", header: "Name" },
      { field: "category", header: "Category" },
      { field: "quantity", header: "Quantity" },
    ];
    this.selectedColumns = this.columns;
  },
  watch: {
    display(newVal) {
      if (newVal) {
        this.getLocations();
      }
    },
  },
  methods: {
    reset() {
      this.offices = [];
      this.selectedLine = {};
    },

    closeDialog() {
      this.reset();
      this.close(false);
    },
    setLine(line) {
      this.selectedLine = line;
      this.selectItem();
    },
    selectItem() {
      if (!this.selectedLine.uuid) return;
      this.close( this.selectedLine);
      this.reset();
    },
    getLocations() {
      OfficeServie.read().then((lines) => {
        this.offices = lines;
      });
    },
  },
});
</script>