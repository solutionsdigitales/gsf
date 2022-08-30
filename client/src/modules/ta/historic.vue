<template>
<div class="col-p12 card page-body">
  <div class="grid">
    <div class="col-12">
      <div>
        <h4>{{ $t("PRF.HISTORIC") }} : <span class="text-primary">{{prfReference}}</span></h4>

        <Timeline
          :value="customEvents"
          align="alternate"
          class="customized-timeline"
        >
          <template #marker="slotProps">
            <span
              class="custom-marker shadow-1"
              :style="{ backgroundColor: slotProps.item.color }"
            >
              <i :class="slotProps.item.icon"></i>
            </span>
          </template>
          <template #content="slotProps">
            <Card>
              <template #title>
                {{ slotProps.item.status }}
              </template>
              <template #subtitle>
                {{ slotProps.item.date }}
              </template>
              <template #content>
                <span class="legend"
                >{{$t(slotProps.item.legend)}}</span><br/>
                <span><b>{{slotProps.item.employee_name}}</b></span><br/>
                <span class="link text-primary prf" v-if="slotProps.item.viewPDF" @click="viewPDF(slotProps.item.uuid)">
                  {{prfReference}} v{{slotProps.item.version}}</span>
                <p>{{slotProps.item.update_note}}</p>
                
              </template>
            </Card>
          </template>
        </Timeline>
      </div>
    </div>
    
    <pdfViewer
      :url="pdfViewerUrl"
      :display="displayPdfViewerModal"
      :close="closePrfViewer"
    >
    </pdfViewer>
  </div>
</div>
</template>

<script>
import { defineComponent } from "vue";
import TravalAdvanceService from "./ta.service";
import pdfViewer from "../../components/PdfViewer.vue";
export default defineComponent({
  data() {
    return {
      customEvents: [],
      prfReference : '',
      prfUuid : null,
      displayPdfViewerModal: false,
      pdfViewerUrl : '',
    };
  },
  mounted() {
    this.prfReference= this.$route.query.reference;
    this.prfUuid= this.$route.query.uuid;
    this.getPrfs();
  },
  methods : {
    getPrfs() {
      TravalAdvanceService.historic(this.prfReference).then(result => {
        this.customEvents = result.map(item => {
          if(item.type === 'APPROVE') {
            item.color = 'green';
            item.icon = 'pi pi-check';
            item.legend = 'FORM.LEGENDS.APROVAL';
          } else {
            item.legend =  item.version === 1 ? 'FORM.LEGENDS.CREATION' : 'FORM.LEGENDS.EDITION';
            item.color = item.version === 1 ? 'rgb(255, 152, 0)' : 'rgb(103, 58, 183)';
            item.icon = item.version === 1 ? 'pi pi-circle-fill' : 'pi pi pi-pencil';
            item.viewPDF = true;
          }
          // rgb(96, 125, 139); rgb(255, 152, 0); rgb(103, 58, 183);
          
          return item;
        })
      });
    },
    viewPDF(prfUuid) {
      const server = this.$store.state.server;
      const lang = this.$i18n.locale;
      this.pdfViewerUrl = `${server}prfs/export/${prfUuid}?lang=${lang}`;
      this.displayPdfViewerModal = true;
    },
    closePrfViewer() {
      this.displayPdfViewerModal = false;
    },
  },
  components : {
    pdfViewer,
  }

});
</script>

<style lang="scss" scoped>
.prf {
  font-size: 12px;
  color: #fff;
  padding: 3px;
  font-weight: bold;
}
.legend {
  font-size: 15px;
  padding: 3px;
  color: #fff;
  border: 2px solid #fff;

  font-weight: bolder;
  text-shadow: 0px 1px 1px #001;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  width: 200px;
}
.custom-marker {
  display: flex;
  width: 2rem;
  height: 2rem;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  border-radius: 50%;
  z-index: 1;
}

::v-deep(.p-button) {
  min-width: 8em;
}

::v-deep(.p-timeline-event-content) {
  line-height: 1;
}
::v-deep(.p-timeline-event-opposite) {
  line-height: 1;
}

  ::v-deep(.customized-timeline) {
    .p-timeline-event:nth-child(even) {
      flex-direction: row !important;

      .p-timeline-event-content {
        text-align: left !important;
      }
    }
    .p-timeline-event-opposite {
      flex: 0;
    }
    .p-card {
      margin-top: 1rem;
    }
}
</style>