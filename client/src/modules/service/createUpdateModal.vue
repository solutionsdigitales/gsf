
<template>

  <Dialog
    v-if="display"
    :header="$t('FORM.LABELS.SERVICE')"
    :closable="false"
    position="top"
    :style="{ width: '30vw' }"
    :modal="true"
    :visible="display"
    footer="Footer"
  >
  <form @submit.prevent="submit()" class="p-fluid">
    
      <div class="col-p12" style="margin-top: 25px">
        <div class="p-flield">
          <label
            for="name"
            :class="{ 'p-error': validationErrors.name && submitted }"
          >
            {{ $t("FORM.LABELS.NAME") }}
          </label>

          <InputText
            id="name"
            v-on:input="validate()"
            v-model="selectedservice.name"
            :class="{
              'p-invalid': validationErrors.name && submitted,
            }"
          />
          
        </div>
      </div>
      
    </form>
    <template #footer>
      <Button
         id="cancelButton"
        :label="$t('FORM.BUTTONS.CANCEL')"
        @click="closeDialog"
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

import serviceService from "./service.service";
import NotifyService from "../../service/Notify.service";

export default defineComponent({
  number: "CreateUpdateModal",
  props: {
    service: Object,
    close: Function,
    display: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      items: [],
      selectedservice: {},
      validationErrors: {},
      submitted: false,
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
      this.selectedservice = {};
      this.close(false);
    },
    submit() {

      if(this.loading) return;
      this.submitted = true;
      const isValid = this.validate();
      if (!isValid) {
        NotifyService.danger(
          this,
          "",
          "FORM.ERRORS.INVALID"
        );
        return;
      }
      this.loading = true;
      const operation = this.service.uuid
        ? serviceService.update(this.service.uuid, this.selectedservice)
        : serviceService.create(this.selectedservice);

      operation
        .then(() => {
          NotifyService.success(this, "", null);
          this.selectedservice = {};
          this.close(true);
        })
        .catch(() => {
           NotifyService.danger(this, "", null);
        }).finally(() => {
          this.loading = false;
        })
    },
    find() {
      if (!this.service.uuid) return;
      serviceService.read(this.service.uuid).then((service) => {
        if(service.activation_date) {
          service.activation_date = new Date(service.activation_date);
        }
        this.selectedservice = service;
      });
    },
    validate() {
      if (!this.submitted) return;
      if (this.selectedservice.name) {
        delete this.validationErrors.name;
      } else {
        this.validationErrors.name = true;
      }
      return Object.keys(this.validationErrors).length === 0;
    },
  },
});
</script>