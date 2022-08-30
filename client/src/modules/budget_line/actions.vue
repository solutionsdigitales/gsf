<template>
  <div style="text-align: right !important">
    <div @click="toggle" class="link" style="color: #001; padding: 2px">
      <span style="font-size: 12px">{{ $t("FORM.BUTTONS.ACTIONS") }}</span>
      <i class="link pi pi-chevron-down" style="font-size: 12px"> </i>
    </div>
    <Menu ref="menu" :model="items" :popup="true" style="width: 300px" />

    <CreateUpdateModal
      :BudgetLine="entity"
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

    <EmployeeSelectModal
      ref="employeeSelectModal"
      :close="closeEmployeeSelectModal"
      :display="displayEmployeeSelectModal"
    >
    </EmployeeSelectModal>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import CreateUpdateModal from "./createUpdateModal";
import ConfirmModal from "../../components/ConfirmModal.vue";
import EmployeeSelectModal from "../employee/modal/employeeSelectModal.vue";
import BudgetLineService from "./bugetLine.service";
import NotifyService from "../../service/Notify.service";

export default defineComponent({
  name: "BudgetLineAction",
  props: {
    entity: Object,
  },
  data() {
    return {
      items: [],
      display: false,
      displayConfirm: false,
      displayUserRoleMoal: false,
      displayEmployeeSelectModal: false,
    };
  },
  emits: ["reloadBudgetLineList"],
  setup() {},
  methods: {
    toggle(event) {
      this.$refs.menu.toggle(event);
      this.setItems();
    },

    closeDialog(result) {
      if (result) {
        this.$emit("reloadBudgetLineList", true);
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

      BudgetLineService.delete(this.entity.uuid)
        .then(() => {
          this.$emit("reloadBudgetLineList", true);
          this.HideModal();
        })
        .catch(() => {});
    },

    setItems() {
      this.items = [
        {
          label: ``,
          items: [
            {
              label: this.$t("FORM.BUTTONS.EDIT"),
              icon: "pi pi-fw pi-pencil",
              command: () => {
                this.display = true;
              },
            },            
            {
              label: this.$t("PRF.BUDGET_HOLDER"),
              icon: "pi pi-user",
              command: () => {
                this.displayEmployeeSelectModal = true;
              },
            },
            {
              label: this.$t("FORM.BUTTONS.DELETE"),
              icon: "pi pi-fw pi-times",
              command: () => {
                this.displayConfirm = true;
              },
            },
          ],
        },
      ];
    },
    closeEmployeeSelectModal(result) {
      if (result) {
        const employeeUuid = result.uuid;
        const uuids = [this.entity.uuid];
        BudgetLineService.setBudgetHolder({
          uuids,
          employeeUuid,
        })
          .then(() => {
            NotifyService.success(this, "", null);
            this.$emit("reloadBudgetLineList", true);
          })
          .catch(() => {
            NotifyService.danger(this, "", null);
          });
      }
      this.displayEmployeeSelectModal = false;
    },
  },
  components: {
    CreateUpdateModal,
    ConfirmModal,
    EmployeeSelectModal,
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