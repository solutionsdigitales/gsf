
<template>
  <Dialog
    v-if="display"
    :header="$t('TREE.LOCATION')"
    :closable="false"
    position="top"
    :style="{ width: '30vw' }"
    :modal="true"
    :visible="display"
    footer="Footer"
  >
  
    <form @submit.prevent="submit()" novalidate class="p-fluid">
      <div class="col-p12">
        <div class="p-field">
           <label
            for="code"
            :class="{ 'p-error': validationErrors.code && submitted }" >
            {{ $t("FORM.LABELS.CODE") }}
          </label>

          <InputText
            id="code"
            v-on:input="validate()"
            v-model="selectedLocation.code"
            :class="{
              'p-invalid': validationErrors.code && submitted,
            }"/>
         
        </div>

        <div class="p-field">
           <label
            for="name"
            :class="{ 'p-error': validationErrors.name && submitted }" >
            {{ $t("FORM.LABELS.NAME") }}
          </label>

          <InputText
            id="name"
            v-on:input="validate()"
            v-model="selectedLocation.name"
            :class="{
              'p-invalid': validationErrors.name && submitted,
            }"
          />
         
        </div>

          <div class="p-field">
            <label
              for="address">
              {{ $t("FORM.LABELS.ADDRESS") }}
            </label>

            <InputText
              id="address"
              v-on:input="validate()"
              v-model="selectedLocation.address"
            />
          </div>

      </div>
      
    </form>
    <template #footer>
      <Button
       id="cancelButton"
        :label="$t('FORM.BUTTONS.CANCEL')"
        @click="closeDialog"
        type="reset"
        class="p-button-text"
      />
      <Button
       id="submitButton"
        type="submit"
         @click="submit"
        :label="$t('FORM.BUTTONS.SAVE')"
      />
    </template>
  </Dialog>
</template>

<script>
import { defineComponent } from "vue";
import OfficeService from "./office.service";
import Notifylocation from "../../service/Notify.service";

export default defineComponent({
  number: "CreateUpdateModal",
  props: {
    location: Object,
    close: Function,
    display: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      items: [],
      selectedLocation: {},
      validationErrors: {},
      submitted: false,
      loading : false,
    };
  },
  watch: {
    display(newVal) {
      if (newVal) {
        this.find();
      }
    },
  },
  methods: {
    closeDialog() {
      this.submitted = false;
      this.selectedLocation = {};
      this.close(false);
    },
    submit() {

      if (this.loading) return;
      this.submitted = true;
      const isValid = this.validate();
      if (!isValid) {
        Notifylocation.danger(
          this,
          "",
          "FORM.ERRORS.INVALID"
        );
        return;
      }
      this.loading = true;
      const operation = this.location.uuid
        ? OfficeService.update(this.location.uuid, this.selectedLocation)
        : OfficeService.create(this.selectedLocation);

      operation
        .then(() => {
          Notifylocation.success(this, "", null);
          this.selectedLocation = {};
          this.close(true);
        })
        .catch(() => {
           Notifylocation.danger(this, "", null);
        }).finally(() => {
          this.loading = false;
        })
    },
    find() {
      console.log(this.location);
      if (!this.location.uuid) return;
      OfficeService.read(this.location.uuid).then((location) => {
        this.selectedLocation = location;
      });
    },
    validate() {
      if (!this.submitted) return;
      if (this.selectedLocation.name) {
        delete this.validationErrors.name;
      } else {
        this.validationErrors.name = true;
      }
       if (this.selectedLocation.code) {
        delete this.validationErrors.code;
      } else {
        this.validationErrors.code = true;
      }
      return Object.keys(this.validationErrors).length === 0;
    },
  },
});
</script>

<style scoped>
.p-field {
  padding-top: 20px ;
}
</style>
