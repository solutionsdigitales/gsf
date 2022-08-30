<template>
  <div>
    <div class="grid card page-body" style="padding: 12px">
      <div class="col-12 lg:col-9 xl:col-9" style="padding: 0px">
        <u
          ><h5>{{ $t("VOUCHERS.NOTES") }}</h5></u
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
      <div class="col-12 lg:col-3 xl:col-3" >
        <h6>{{ $t("VOUCHERS.NOTES") }}</h6>
        <hr />

        <div>
          <Textarea id="update_note" class="col-12" 
          :placeholder="$t('VOUCHERS.NOTE_PLACEHOLDER')"
          rows="2" v-model="note" />
          <Button
            :label="$t('FORM.BUTTONS.SAVE')"
            @click="save()"
            v-if="validNote()"
            :disabled="loading"
            class="p-button-raised p-button-primary"
          />
          </div>

          <hr />
          <div style="padding: 3px; height:64vh !important; overflow:scroll">
          <div  v-for="(n, i) in notes" :key="n.uuid">
            <Panel :toggleable="true" :collapsed="i!==0" style="margin:2px">
              <template #header>
                <div style="padding:0px; width:100%; color:#fff; height:100%">
                  <span class="enhancement_by_me" >{{ n.employee_displayname }}</span>
                <span class="enhancement_waiting" >{{ formatDate(n.created_at) }}</span>
                </div>
              </template>
              <div style="font-size:12px">
                {{ n.note }}
              </div>
            </Panel>
          </div>
          </div>
      </div>
      <ConfirmModal
        :message="$t('PRF.APPROVE_DESC', { reference: selectedPrf.reference })"
        :close="ApproveConfirmDialog"
        :display="displayConfirm"
      >
      </ConfirmModal>
    </div>

    <div class="col-p12 card page-body" v-if="prfs.length === 0">
      <Message severity="warn" :key="$t('FORM.WARNINGS.NOT_FOUND')">
        {{ $t("FORM.WARNINGS.NOT_FOUND") }}
      </Message>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import PRFService from "./prf.service";
import contants from "../../service/constant";
import currencyService from "../../service/currencyService";
import ConfirmModal from "../../components/ConfirmModal.vue";
import NoteService from "./voucher_note.service";
import NotifyService from "../../service/Notify.service";
import util from "../../service/util";

export default defineComponent({
  data() {
    return {
      customEvents: [],
      prfReference: "",
      voucherUuid: null,
      note: null,
      notes: [],
      displayPdfViewerModal: false,
      pdfViewerUrl: "",
      prfs: [],
      lang: "",
      selectedPrf: {},
      displayConfirm: false,
      queryParams: {},
      loading: false,
    };
  },
  created() {
    const params = this.$route.query;
    this.server = this.$store.state.server;
    params.not_closed = contants.DOCUMENT_STATUS.CLOSED;
    this.lang = this.$i18n.locale;
    this.queryParams = params;
    this.getPrfs();
    this.getNotes();
  },
  methods: {
    getPrfs() {
      PRFService.read(null, { uuid: this.queryParams.uuid }).then((result) => {
        this.pdfViewerUrl = "";
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
      this.selectedPrf = prf;
      this.voucherUuid = prf.uuid;
      const documentUrl = {};
      documentUrl[contants.voucherTypes.prf] = "prfs";
      documentUrl[contants.voucherTypes.ddf] = "frs";
      documentUrl[contants.voucherTypes.exr] = "expense_reports";
      documentUrl[contants.voucherTypes.och] = "ochs";
      documentUrl[contants.voucherTypes.ta] = "traval_advances";

      this.pdfViewerUrl = `${this.server}${
        documentUrl[prf.voucher_type_id]
      }/export/${this.voucherUuid}?lang=${this.lang}`;
    },
    HideModal() {
      this.displayConfirm = false;
    },
    validNote() {
      return util.isCorrectString(this.note);
    },
    formatDate(d) {
      return util.formatDate(d, 'DD/MM/YYYY H:mm:s');
    },
    getNotes() {
      this.voucherUuid = this.queryParams.uuid;
      NoteService.read(null, {
        voucher_uuid: this.voucherUuid,
      })
        .then((notes) => {
          this.notes = notes;
        })
        .catch(() => {
          NotifyService.danger(this, "", null);
        });
    },
    save() {
      this.loading = true;
      const { employee } = this.$store.state.session;
      NoteService.create({
        employee_uuid: employee.uuid,
        voucher_uuid: this.voucherUuid,
        note: this.note,
      })
        .then(() => {
          this.note = null;
          this.getNotes();
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
.p-panel {
  padding: 0px;
}
.p-panel.p-panel-toggleable .p-panel-header {
  padding: 9.5rem 1rem;
  color: red !important;
}
</style>