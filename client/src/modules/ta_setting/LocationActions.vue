<template>
  <div style="text-align: right">
    <div @click="toggle" class="link">
      <span style="font-size: 14px">Actions</span>
      <i class="link pi pi-chevron-down" style="fontsize: 1rem"> </i>
    </div>
    <Menu ref="menu" :model="items" :popup="true" style="width:300px" />

    <LocationEditModal
      :location="entity"
      :close="closeDialog"
      :display="display"
    >
    </LocationEditModal>

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
import LocationEditModal from "./locationEditModal.vue";
import ConfirmModal from "../../components/ConfirmModal.vue";
import LocationService from "./location.service";

export default defineComponent({
  name: "vendorAction",
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
  emits: ["reloadLocationList"],
  methods: {
    toggle(event) {
      this.$refs.menu.toggle(event);
      this.setItems();
    },

    closeDialog(result) {
      if (result) {
        this.$emit("reloadLocationList", true);
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

      LocationService
        .delete(this.entity.uuid)
        .then(() => {
          this.$emit("reloadLocationList", true);
          this.HideModal();
        })
        .catch(() => {});
    },

    setItems() {
      this.items = [
        {
          label: `${this.entity.name}`,
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
    ConfirmModal,
    LocationEditModal,
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