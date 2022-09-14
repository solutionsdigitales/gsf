<template>
  <div style="text-align: right" :id="actionId">
    <div @click="toggle" class="link">
      <span style="font-size: 14px">Actions</span>
      <i class="link pi pi-chevron-down" style="fontsize: 1rem"> </i>
    </div>
    <Menu ref="menu" :model="items" :popup="true" />

    <CreateUpdateModal
      :pricing="entity"
      :close="closeDialog"
      :display="display"
    >
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
import Notifyproject from "../../service/Notify.service";
import ConfirmModal from "../../components/ConfirmModal.vue";

import PricingService from "./price.service";
export default defineComponent({
  name: "PriceAction",
  props: {
    entity: Object,
    actionId: String,
  },
  data() {
    return {
      items: [],
      display: false,
      displayConfirm: false,
      displayUserRoleMoal: false,
    };
  },
  emits: ["reloadPriceList"],
  setup() {},
  methods: {
    toggle(event) {
      this.$refs.menu.toggle(event);
      this.setItems();
    },

    closeDialog(result) {
      if (result) {
        this.$emit("reloadPriceList", true);
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

      PricingService
        .delete(this.entity.uuid)
        .then(() => {
          Notifyproject.success(this, "", null);
          this.$emit("reloadPriceList", true);
          this.HideModal();
        })
        .catch(() => {
          Notifyproject.danger(this, "", null);
        });
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