<template>
  <div style="text-align: right">
    <div @click="toggle" class="link">
      <span style="font-size: 14px">{{ $t("FORM.BUTTONS.ACTIONS") }}</span>
      <i class="link pi pi-chevron-down" style="fontsize: 1rem"> </i>
    </div>
    <Menu ref="menu" :model="items" :popup="true" />

    <ConfirmModal
      :employee="entity"
      :message="$t('PRF.APPROVE_DESC', { reference: entity.reference })"
      :close="ApproveConfirmDialog"
      :display="displayConfirm"
    >
    </ConfirmModal>

    <ConfirmModal
      :employee="entity"
      :close="DeletionConfirmDialog"
      :display="displayDeletionConfirmModal"
    >
    </ConfirmModal>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import ConfirmModal from "../../components/ConfirmModal.vue";
import PRFApprovement from "./prf_approvement";
import DDFService from "./ddf.service";
import NotifyService from "../../service/Notify.service";
import constant from "../../service/constant";

export default defineComponent({
  name: "DDFAction",
  props: {
    entity: Object,
    employee: Object,
    server: String,
    canEdit: {
      type: Boolean,
      default: false,
    },
    canApprove: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      items: [],
      showAction: 0,
      display: false,
      displayConfirm: false,
      displayDeletionConfirmModal: false,
    };
  },
  emits: ["reloadPRFList"],
  setup() {},
  methods: {
    toggle(event) {
      this.$refs.menu.toggle(event);
      this.setItems();
    },
    closeDialog(result) {
      if (result) {
        this.$emit("reloadPRFList", true);
      }
      this.display = false;
      this.displayConfirm = false;
    },
    HideModal() {
      this.display = false;
      this.displayConfirm = false;
      this.displayDeletionConfirmModal = false;
    },
    // close deletion confirm dialog
    DeletionConfirmDialog(result) {
      if (!result) {
        this.HideModal();
        return;
      }

      DDFService.delete(this.entity.uuid)
        .then(() => {
          NotifyService.success(this, "", null);
          this.selectedRole = {};
          this.$emit("reloadPRFList", true);
          this.HideModal();
        })
        .catch(() => {
          NotifyService.danger(this, "", null);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    ApproveConfirmDialog(result) {
      if (!result) {
        this.HideModal();
        return;
      }
      PRFApprovement.approve({
        voucher_uuid: this.entity.uuid,
        employee_uuid: (this.employee || {}).uuid,
      })
        .then(() => {
          NotifyService.success(this, "", null);
          this.HideModal();
          this.$emit("reloadPRFList", true);
        })
        .catch(() => {
          NotifyService.danger(this, "", null);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    setItems() {
      const listActions = [];
      this.showAction = 0;
      const closed = constant.DOCUMENT_STATUS.CLOSED;
      const approved = constant.DOCUMENT_STATUS.APPROVED;
      const employeeCategoryId = this.employee.category_id;
      listActions.push({
        label: this.$t("FORM.BUTTONS.DOWNLOAD"),
        icon: "pi pi-fw pi-file-pdf",
        command: () => {
          const lang = this.$i18n.locale;
          const url = `export/${this.entity.uuid}?lang=${lang}`;
          const uri = url + "&renderer=pdf&attachment=1";

          const fileName = DDFService.getFileName(this.entity);
          DDFService.dowloadPdf(uri, fileName);
        },
      });

      if (this.entity.version > 1) {
        this.showAction++;
        listActions.push({
          label: this.$t("PRF.HISTORIC"),
          icon: "pi pi-fw pi-sitemap",
          command: () => {
            this.$router.push({
              name: "prf_historic",
              query: {
                uuid: this.entity.uuid,
                reference: this.entity.reference,
              },
            });
          },
        });
      }

      if (
        [approved].includes(this.entity.document_state_id) &&
        (this.employee || {}).uuid !== this.entity.employee_uuid &&
        employeeCategoryId === constant.EMPLOYEE_CATEGORY.PROCUREMENT
      ) {
        this.showAction++;
        listActions.push({
          label: this.$t("FORM.BUTTONS.EDIT"),
          icon: "pi pi-fw pi-pencil",
          command: () => {
            this.$router.push({
              name: "fr_registration",
              query: { voucherUuid: this.entity.uuid, byDocumentMaker: 0 },
            });
          },
        });
      }

      if (
        this.canEdit &&
        ![closed, approved].includes(this.entity.document_state_id)
      ) {
        this.showAction++;
        listActions.push(
          {
            label: this.$t("FORM.BUTTONS.EDIT"),
            icon: "pi pi-fw pi-pencil",
            command: () => {
              this.$router.push({
                name: "fr_registration",
                query: { voucherUuid: this.entity.uuid },
              });
            },
          },
          {
            label: this.$t("FORM.BUTTONS.DELETE"),
            icon: "pi pi-fw pi-times",
            style: "color:red",
            command: () => {
              this.displayDeletionConfirmModal = true;
            },
          }
        );
      }

      listActions.push({
        label: this.$t("VOUCHERS.NOTES"),
        icon: "pi pi-fw pi-pencil",
        command: () => {
          this.$router.push({
            name: "prf_notes",
            query: { uuid: this.entity.uuid },
          });
        },
      });

      if (
        this.canApprove &&
        ![closed].includes(this.entity.document_state_id)
      ) {
        this.showAction++;
        listActions.push({
          label: this.$t("PRF.APPROVE"),
          icon: "pi pi-fw pi-check",
          command: () => {
            this.displayConfirm = true;
          },
        });
      }

      this.items = [
        {
          label: `${this.entity.reference} v${this.entity.version}`,
          items: listActions,
        },
      ];
    },
  },
  components: {
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