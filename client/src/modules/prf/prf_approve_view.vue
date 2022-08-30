<template>

  <div>
  <div class="grid card page-body" style="padding: 12px" v-if="prfs.length > 0">
    <div class="col-12 lg:col-9 xl:col-9" style="padding: 0px">
      <u
        ><h5>{{ $t("PRF.LIST_TO_APPROVE") }}</h5></u
      >
    </div>
    <div class="col-12 lg:col-9 xl:col-9" style="padding: 0px">
      <div style="height: 45vw; padding: 0px; overflow: scroll">
        <iframe
          :src="pdfViewerUrl"
          style="width: 100%; height: 100%; min-width: 1000px"
        >
        </iframe>
      </div>
    </div>
    <div class="col-12 lg:col-3 xl:col-3" style="padding: 3px">
      <h6>{{ prfs.length }}-{{ $t("TREE.PRF") }}</h6>
      <hr />
      <div v-if="selectedPrf.uuid">
        <Button :label="$t('PRF.APPROVE')" @click="showConfirModal()"></Button>
      </div>
      <hr />
      <ul class="prf-list">
        <li
          v-for="(p, index) in prfs"
          :key="p.uuid"
          @click="viewPDF(p)"
          :class="{ 'text-primary': p.uuid === prfUuid }"
          class="link prfLine shortText"
        >
          <span class="numbering">{{ index + 1 }}</span
          >-
          <span
            ><b>[{{ p.reference }}]</b></span
          >- <span>{{ formatCurrency(p.amount, p.curency_id) }}</span
          >- <span>{{ p.employee_name }}</span
          >-
          <span v-tooltip="p.project_name">{{ p.project_code }}</span>
        </li>
      </ul>
    </div>
    <ConfirmModal
      :message="$t('PRF.APPROVE_DESC', { reference: selectedPrf.reference })"
      :close="ApproveConfirmDialog"
      :display="displayConfirm"
    >
    </ConfirmModal>
  </div>

<div class="col-p12 card page-body" v-if="prfs.length===0">
      <Message severity="warn" :key="$t('FORM.WARNINGS.NOT_FOUND')">
        {{ $t("FORM.WARNINGS.NOT_FOUND") }}
      </Message>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import PRFService from "./prf.service";
import DocumentService from '../../service/DocumentService';
import constants from '../../service/constant';
import currencyService from "../../service/currencyService";
import ConfirmModal from "../../components/ConfirmModal.vue";
import PRFApprovement from "./prf_approvement";
import NotifyService from "../../service/Notify.service";

export default defineComponent({
  data() {
    return {
      customEvents: [],
      prfReference: "",
      prfUuid: null,
      displayPdfViewerModal: false,
      pdfViewerUrl: "",
      prfs: [],
      lang: "",
      selectedPrf: {},
      displayConfirm: false,
      queryParams: {},
    };
  },
  created() {
    const params = this.$route.query;
    this.server = this.$store.state.server;
    params.not_closed = constants.DOCUMENT_STATUS.CLOSED;
    this.lang = this.$i18n.locale;
    this.queryParams = params;
    this.getPrfs();
  },
  methods: {
    getPrfs() {
      PRFService.read(null, this.queryParams).then((result) => {
        this.pdfViewerUrl = '';
        if (result.length > 0) {
          this.viewPDF(result[0]);
        }
        this.prfs = result;
      });
    },
    formatCurrency(amount, currecnyId) {
      return currencyService.format(amount, currecnyId);
    },
    viewPDF(prf) {
      console.log(prf);
      this.selectedPrf = prf;
      this.prfUuid = prf.uuid;
      const docUrl = DocumentService.url(prf.voucher_type_id);
      this.pdfViewerUrl = `${this.server}${docUrl}/export/${this.prfUuid}?lang=${this.lang}`;
    },
    HideModal() {
      this.displayConfirm = false;
    },
    showConfirModal() {
      this.displayConfirm = true;
    },
    ApproveConfirmDialog(result) {
      if (!result) {
        this.HideModal();
        return;
      }
      PRFApprovement.approve({
        voucher_uuid: this.selectedPrf.uuid,
        employee_uuid: this.queryParams.approver_uuid,
      })
        .then(() => {
          NotifyService.success(this, "", null);
          this.HideModal();
          this.getPrfs();
        })
        .catch(() => {
          NotifyService.danger(this, "", null);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  components: {
    ConfirmModal,
  },
});
</script>

<style scoped>
.prf-list {
  list-style: none;
  padding: 2px;
}
.shortText {
  font-size: 13px;
}
.prfLine {
  border-bottom: 1px solid #aaa;
  padding: 2px;
}
.numbering {
  margin: 1px;
}

/* width */
::-webkit-scrollbar {
  width: 4px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>