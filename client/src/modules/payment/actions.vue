<template>
  <div style="text-align: right" :id="actionId">
    <div @click="toggle" class="link">
      <span style="font-size: 14px">Actions</span>
      <i class="link pi pi-chevron-down" style="fontsize: 1rem"> </i>
    </div>
    <Menu ref="menu" :model="items" :popup="true" />

    <CreateUpdateModal 
      :project="entity"
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
import PaymentService from "./payment.service";
import CreateUpdateModal from "./new.vue";
import ConfirmModal from "../../components/ConfirmModal.vue";
import NotifyService from "../../service/Notify.service";

export default defineComponent({
  name: "projectAction",
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
  emits: ["reloadProjectList"],
  setup() {},
  methods: {
    toggle(event) {
      this.$refs.menu.toggle(event);
      this.setItems();
    },

    closeDialog(result) {
      if (result) {
        this.$emit("reloadProjectList", true);
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

      PaymentService
        .delete(this.entity.uuid)
        .then(() => {
          NotifyService.success(this, "", null);
          this.$emit("reloadProjectList", true);
          this.HideModal();
        })
        .catch(() => {
           NotifyService.danger(this, "", null);
        });
    },

    setItems() {
      if(this.entity.locked) {
        this.items = [];
        return;
      }
      this.items = [
        {
          label: this.entity.name,
          items: [
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