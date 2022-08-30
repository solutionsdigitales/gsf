<template>
  <Dialog
    v-if="display"
    :header="$t('FORM.LABELS.IMPORTING')"
    :closable="false"
    position="top"
    :style="{ width: '30vw' }"
    :modal="true"
    :visible="display"
    footer="Footer"
  >
    <div class="col-p12" style="margin-top:10px">
    <div class="download-template">
     <i class="pi pi-cloud-download"></i>
      <a :href="server +'templates/perdiem_lodging.xlsx'" download="download">
      {{$t('FORM.BUTTONS.DOWNLOAD_TEMPLATE')}}
      </a>
    </div>
    <br/>
     
        <label>{{$t("FORM.SELECT.FILE")}}</label>
    <div class="button-wrapper p-button-label">
       <div class="filename"> 
           <span>{{data.file.name}}</span>
        </div>
        
    <input type="file" id="updaload" name="myFile" @change="fileSelected($event)" />

    <div class="btn p-button p-component">
        <i class="pi pi-cloud-upload"></i>
    </div>
    </div>
    </div>
    <template #footer>
      <Button
        :label="$t('FORM.BUTTONS.CANCEL')"
        @click="closeDialog"
        class="p-button-text"
      />
      <Button
        type="submit"
        @click="submit()"
        :label="$t('FORM.BUTTONS.IMPORT')"
      />
    </template>
  </Dialog>
</template>



<script>
import { defineComponent } from "vue";
import NotifyService from '../../service/Notify.service';
import LocationService from './location.service';

export default defineComponent({
  name: "ImportEmployeeModal",
  props: {
    close: Function,
    display: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      submitted: false,
      selectedLocation: {},
      server : '/',
      validationErrors: {},
      data: {
        file : {}

      },
    };
  },
  
  watch: {
    display(newVal) {
      if (newVal) {
        this.server = this.$store.state.server;
      }
    },
  },
  methods: {
    closeDialog() {
      this.submitted = false;
      this.data = {
          file : {},
      }
      this.close(false);
    },
    submit() {
     if (this.loading) return;
      this.submitted = true;
      const isValid = this.validate();
      if (!isValid) {
        NotifyService.danger(
          this,
          '',
          'FORM.ERRORS.INVALID');
        return;
      }

      const fd = new FormData();
      fd.append('excelFile', this.data.file);
      this.loading = true;
      LocationService.import(fd).then(() => {
        this.close(true);
      }) .catch(() => {
          NotifyService.danger(this, "", null);
        })
        .finally(() => {
          this.loading = false;
        });

    },
    fileSelected(event) {
      const f = event.target.files[0];
      if(f) {
        this.data.file = f;
        return;
      }
    },
    setLocation() {
      this.data.office_uuid = this.selectedLocation.uuid;
      this.validate();
    },

    validate() {
      if (!this.submitted) return;
      return !!this.data.file.name;
    },
    injectFile(file, v, key) {
      const reader = new FileReader();
      reader.onload = (e) => {
        v[key] =  {
            base64 : e.target.result,
            name : file.name,
            type : file.type
        };
      };
      reader.readAsDataURL(file);
    },
  },
});
</script>
<style scoped>
.p-field {
  padding-top: 20px;
}

.button-wrapper {
  position: relative;
  width: 100%px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  cursor: pointer;
  margin-top: 10px;
  height: 38px;
}

.button-wrapper .btn {
  float: right;
  background: gray;
  border: none !important;
  padding: 10px;
}
.filename {
    float:left;
    padding: 7px;
    padding-top: 12px;
    width: 90%;
    color: #2196F3;
    font-size: 13px;
    overflow: hidden;
}
#updaload{
    display: inline-block;
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 20px;
    top: 0;
    left: 0;
    opacity: 0;
    cursor: pointer;
}
.download-template {
  text-align: center;
}
</style>

