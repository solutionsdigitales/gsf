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

    <ConfirmModal
      :employee="entity"
      :message="$t('ESIGN.CONFIRM', { reference: entity.reference })"
      :close="closeSignConfirmDialog"
      :display="displayConfirmSign"
    >
    </ConfirmModal>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import ConfirmModal from "../../components/ConfirmModal.vue";
import PRFApprovement from "./prf_approvement";
import PRFService from "./prf.service";
import NotifyService from "../../service/Notify.service";
import constant from "../../service/constant";
import ESignService from "../employee/esign.service";
import util from "../../service/util";

export default defineComponent({
  name: "PrfAction",
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
      displayConfirmSign: false,
    };
  },
  emits: ["reloadPRFList"],
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

    closeSignConfirmDialog(result) {
      if (result) {
        ESignService.sign({
          employee_uuid: this.employee.uuid,
          voucher_uuid: this.entity.uuid,
          role: "document_maker",
          details: "document maker",
          position: 1,
        })
          .then(() => {
            NotifyService.success(this, "", null);
            this.HideModal();
          })
          .catch((err) => {
            const errorJson = err.toJSON();
            const isUnauthorized = errorJson.message.indexOf("401") !== -1;
            const duplication = errorJson.message.indexOf("409") !== -1;
            if (isUnauthorized) {
              NotifyService.danger(this, "ESIGN.SET", null);
            } else if (duplication) {
              NotifyService.danger(this, "ESIGN.DUPLICATION", null);
            } else {
              NotifyService.danger(this, "", null);
            }
          });
      }
      this.displayConfirmSign = false;
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

      PRFService.delete(this.entity.uuid)
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
        .catch((err) => {
          const errorJson = err.toJSON();
          const isUnauthorized = errorJson.message.indexOf("401") !== -1;
          const duplication = errorJson.message.indexOf("409") !== -1;
          if (isUnauthorized) {
            NotifyService.danger(this, "ESIGN.SET", null);
          } else if (duplication) {
            NotifyService.danger(this, "ESIGN.DUPLICATION", null);
          } else {
            NotifyService.danger(this, "", null);
          }
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

      listActions.push(
        {
          label: this.$t("FORM.BUTTONS.DOWNLOAD"),
          icon: "pi pi-fw pi-file-pdf",
          command: () => {
            const lang = this.$i18n.locale;
            const url = `export/${this.entity.uuid}?lang=${lang}`;
            const uri = url + "&renderer=pdf&stream=1";
            const fileName = PRFService.getFileName(this.entity);
            PRFService.dowloadPdf(uri, fileName);
          },
        },
        {
          label: "CSV",
          icon: "pi pi-fw pi-file-o",
          command: () => {
            PRFService.exportCSV(this.entity.uuid).then((data) => {
              const items = data.items.map((item) => {
                item.unit = this.$t(item.unit);
                return item;
              });
              util.exportCSVFile(null, items, `${data.document.text} items`);
            });
          },
        }
      );

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

      listActions.push({
        label: this.$t("FORM.BUTTONS.CLONE"),
        icon: "pi pi-fw pi-pencil",
        command: () => {
          this.$router.push({
            name: "prf_registration",
            query: { prfUuid: this.entity.uuid, clone: 1 },
          });
        },
      });

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
                name: "prf_registration",
                query: { prfUuid: this.entity.uuid },
              });
            },
          },
          {
            label: this.$t("ESIGN.SIGN"),
            icon: "pi pi-fw pi-user-edit",
            command: () => {
              this.displayConfirmSign = true;
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