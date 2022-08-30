<template>
  <Dialog
    v-if="display"
    :closable="false"
    position="top"
    :style="{ width: '40vw' }"
    :modal="true"
    :visible="display"
    footer=""
  >
    <template #header>
      <span>{{ $t("ESIGN.TITLE") }} </span>
    </template>
    <div v-if="saveSignature && !isEditing">
      <div style="height: 280px; width:100%">
      <img :src="saveSignature" alt="images" />
      </div>
      <div class="dialogFooter">
        <Button id="saveButton" :label="$t('ESIGN.CHANGE')" @click="editMode()" />

        <Button
          id="closeButton"
          :label="$t('FORM.BUTTONS.CLOSE')"
          class="p-button-text"
          @click="closeDialog"
        />
      </div>
    </div>
    <div  id="editingView" style="height: 350px; padding: 0px">
      <TabView>
        <TabPanel :header="$t('ESIGN.DRAW')" @click="setCurrentView('draw')">
          <div>
            <canvas id="sig-canvas" width="530" height="255">
              Get a better browser, bro.
            </canvas>

            <div class="dialogFooter">
              <Button
                class="p-button-secondary"
                id="sig-clearBtn"
                @click="clear()"
                >{{ $t("ESIGN.CLEAR") }}</Button
              >

              <Button
                id="saveButton"
                :label="isEditing? $t('ESIGN.EDIT') : $t('ESIGN.SAVE')"
                @click="saveDraw()"
              />

              <Button
                id="closeButton"
                :label="$t('FORM.BUTTONS.CLOSE')"
                class="p-button-text"
                @click="closeDialog"
              />
            </div>
          </div>
        </TabPanel>
        <TabPanel :header="$t('ESIGN.PICTURE')">
          <div>
            <label>{{ $t("FORM.SELECT.FILE") }}</label>
            <div class="button-wrapper p-button-label">
              <input
                type="file"
                id="updaload"
                name="myFile"
                @change="fileSelected($event)"
              />
              <div class="col-12 preview-container">
                <img src="" id="sig-preview" style="height: 200; width: 100%" />
              </div>
            </div>

            <div class="dialogFooter">
              <Button
                id="saveButton"
                :label="$t('ESIGN.SAVE')"
                @click="hasSignature()"
              />

              <Button
                id="closeButton"
                :label="$t('FORM.BUTTONS.CLOSE')"
                class="p-button-text"
                @click="closeDialog"
              />
            </div>
          </div>
        </TabPanel>
      </TabView>
    </div>
  </Dialog>
</template>

<script>
import { defineComponent } from "vue";
import SignaturePad from "signature_pad";
import NotifyService from "../service/Notify.service";
import SignatureService from "../modules/employee/esign.service";

export default defineComponent({
  name: "eSignModal",
  props: {
    close: Function,
    display: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      content: "",
      file: null,
      showLoader: true,
      signaturePad: null,
      currentView: "draw",
      saveSignature: null,
      lastSignatureUuid : null,
      isEditing: false,
      dataUri: null,
      currentEmployee: {},
      data: {
        file: {},
      },
    };
  },
  created() {
    this.currentEmployee = this.$store.state.session.employee;
  },
  watch: {
    display(newVal) {
      if (newVal) {
        this.isEditing = false;
        this.dataUri = null;
        this.saveSignature = null;
        this.loadSignature();
        setTimeout(() => {
          const canvas = document.getElementById("sig-canvas");
          this.signaturePad = new SignaturePad(canvas);
          this.signaturePad.penColor = "#2196F3";
          this.signaturePad.backgroundColor = "transparent";
        }, 1000);
      }
    },
  },
  methods: {
    closeDialog() {
      this.reset();
      this.close(false);
    },
    loadSignature() {
      SignatureService.read(null, {
        employee_uuid: this.currentEmployee.uuid,
      }).then((result) => {
        if (result.length === 0) return;
        document.getElementById('editingView').style = 'display:none';
        this.saveSignature = result[0].signature;
        this.lastSignatureUuid = result[0].uuid;
      });
    },
    saveDraw() {
      this.dataUri = this.signaturePad.toDataURL();
      this.hasSignature();
    },
    hasSignature() {
      if (!this.dataUri) {
        NotifyService.danger(this, "FORM.ERRORS.INVALID", "");
      } else {
        const operation = this.isEditing ? SignatureService.update(this.lastSignatureUuid,
        {
          employee_uuid: this.currentEmployee.uuid,
          signature: this.dataUri,
        }) : SignatureService.create({
          employee_uuid: this.currentEmployee.uuid,
          signature: this.dataUri,
        });

        operation
          .then(() => {
            NotifyService.success(this, "", null);
            this.close(true);
          })
          .catch(() => {
            NotifyService.danger(this, "", "");
          });
      }
    },
    submit() {
      this.reset();
      this.close(true);
    },
    reset() {
      this.content = "";
      this.showLoader = true;
      this.file = null;
    },
    clear() {
      this.signaturePad.clear();
    },
    editMode() {
      this.isEditing = true;
      document.getElementById('editingView').style = 'display:block';
    },
    fileSelected(event) {
      const f = event.target.files[0];
      if (f) {
        this.data.file = f;
        const reader = new FileReader();
        reader.addEventListener(
          "load",
          () => {
            const preview = document.getElementById("sig-preview");
            // on convertit l'image en une chaîne de caractères base64
            this.dataUri = reader.result;
            preview.src = reader.result;
            preview.style = "height:200px; max-width:500px";
          },
          false
        );

        if (f) {
          reader.readAsDataURL(f);
        }
        return;
      }
    },
  },
});
</script>
<style scoped>
.p-tabview-panels {
  height: 400px !important;
  padding: 0px !important;
}

#sig-canvas {
  border: 2px dotted #cccccc;
  border-radius: 2px;
  cursor: crosshair;
}
.preview-container {
  border: 2px dotted #cccccc;
  border-radius: 2px;
  height: 240px;
}
.p-button {
  margin-right: 5px;
  margin-top: 10px;
}
.dialogFooter {
  float: right;
}
</style>