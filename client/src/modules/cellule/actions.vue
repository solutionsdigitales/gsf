<template>
  <div style="text-align: right" :id="actionId">
    <div @click="toggle" class="link">
      <span style="font-size: 14px">Actions</span>
      <i class="link pi pi-chevron-down" style="fontsize: 1rem"> </i>
    </div>
    <Menu ref="menu" :model="items" :popup="true" />

    <CreateUpdateModal
      :cellule="entity"
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
import CreateUpdateModal from "./createUpdateModal.vue";
import ConfirmModal from "../../components/ConfirmModal.vue";

export default defineComponent({
  name: "celluleAction",
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
  emits: ["reloadCelluleList"],
  setup() {},
  methods: {
    toggle(event) {
      this.$refs.menu.toggle(event);
      this.setItems();
    },

    closeDialog(result) {
      if (result) {
        this.$emit("reloadCelluleList", true);
      }
      this.display = false;
      this.displayConfirm = false;
      this.displayUserRoleMoal = false;
    },
    HideModal() {
      this.display = false;
      this.displayConfirm = false;
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