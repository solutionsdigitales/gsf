<template>
  <div style="text-align: right" :id="actionId">
    <div @click="toggle" class="link">
      <span style="font-size: 14px">Actions</span>
      <i class="link pi pi-chevron-down" style="fontsize: 1rem"> </i>
    </div>
    <Menu ref="menu" :model="items" :popup="true" />

    <CreateUpdateModal :user="entity" :close="closeDialog" :display="display">
    </CreateUpdateModal>

    <ConfirmModal
      :user="entity"
      message="Suppression du message"
      :close="DeleteConfirmDialog"
      :display="displayConfirm"
    >
    </ConfirmModal>

    <UserRoleModal
        :user = "entity"
        ref="userRoleModal"
        :close='closeDialog'
       :display="displayUserRoleMoal">
    </UserRoleModal>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import CreateUpdateModal from "./createUpdateModal";

import ConfirmModal from "../../components/ConfirmModal.vue";
import UserRoleModal from "../role/user.roles.vue";
import userService from "../user/user.service";
export default defineComponent({
  name: "UserAction",
  props: {
    entity: Object,
    actionId : String,
  },
  data() {
    return {
      items: [],
      display: false,
      displayConfirm: false,
      displayUserRoleMoal: false,
    };
  },
  emits: ["reloadUserList"],
  setup() {},
  methods: {
    toggle(event) {
      this.$refs.menu.toggle(event);
      this.setItems();
    },

    closeDialog(result) {
      if (result) {
        this.$emit("reloadUserList", true);
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

      userService
        .delete(this.entity.id)
        .then(() => {
          this.$emit("reloadUserList", true);
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
              role:"edit",
              label: this.$t("FORM.BUTTONS.EDIT"),
              icon: "pi pi-fw pi-pencil",
              command: () => {
                this.display = true;
              },
            },
           
             {
              label: this.$t("FORM.LABELS.ROLE"),
              icon: "pi pi-cog",
              command: () => {
                this.displayUserRoleMoal = true;
              },
            },
             {
              label: this.$t("FORM.BUTTONS.DELETE"),
              icon: "pi pi-fw pi-times",
              style: {color:'red'},
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
    UserRoleModal,
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