<template>
  <div style="text-align: right">
    <div @click="toggle" class="link">
      <span style="font-size: 14px">Actions</span>
      <i class="link pi pi-chevron-down" style="fontsize: 1rem"> </i>
    </div>
    <Menu ref="menu" :model="items" :popup="true" />

    <CreateUpdateModal 
      :division="entity"
      :close="closeDialog"
      :display="display">
    </CreateUpdateModal>

    <ConfirmModal
      :user="entity"
      :close="DeleteConfirmDialog"
      :display="displayConfirm"
    >
    </ConfirmModal>

  </div>
</template>

<script>
import { defineComponent } from "vue";
import CreateUpdateModal from "./createUpdateModal";

import ConfirmModal from "../../components/ConfirmModal.vue";

import serviceService from "./division.service";
export default defineComponent({
  name: "divisionAction",
  props: {
    entity: Object,
  },
  data() {
    return {
      items: [],
      display: false,
      displayConfirm: false,
      displayUserRoleMoal: false,
    };
  },
  emits: ["reloadDivisionList"],
  setup() {},
  methods: {
    toggle(event) {
      this.$refs.menu.toggle(event);
      this.setItems();
    },

    closeDialog(result) {
      if (result) {
        this.$emit("reloadDivisionList", true);
      }
      this.display = false;
      this.displayConfirm = false;
      this.displayUserRoleMoal = false;
    },
    HideModal() {
      this.display = false;
        this.displayConfirm = false;
    },

    DeleteConfirmDialog(result) {
    

      if (!result) {
        this.HideModal();
        return;
      }

      serviceService
        .delete(this.entity.uuid)
        .then(() => {
          this.$emit("reloadDivisionList", true);
          this.HideModal();
        })
        .catch(() => {});
    },

    setItems() {
      this.items = [
        {
          label: this.entity.name,
          items: [
            {
              label: this.$t("FORM.BUTTONS.EDIT"),
              icon: "pi pi-fw pi-pencil",
              command: () => {
                this.display = true;
              },
            },
            {
              label: this.$t("FORM.BUTTONS.DELETE"),
              icon: "pi pi-fw pi-times",
              style: "color:red",
              command: () => {
                this.displayConfirm = true;
              },
            },
           
          ],
        },
      ];
    },
  },
  components: {
    CreateUpdateModal,
    ConfirmModal,
  },
});
</script>

<style>
select {
  width: 150px;
  line-height: 49px;
  height: 38px;
  font-size: 22px;
  outline: 0;
  margin-bottom: 15px;
}
.link {
  cursor: pointer;
}
</style>