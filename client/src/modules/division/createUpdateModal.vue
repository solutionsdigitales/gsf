
<template>
  <Dialog
    v-if="display"
    :header="$t('TREE.DIVISION')"
    :closable="false"
    position="top"
    :style="{ width: '30vw' }"
    :modal="true"
    :visible="display"
    footer="Footer"
  >
    <form @submit.prevent="submit()" class="p-fluid">
      <div class="col-p12" style="margin-top: 25px">
        <div class="p-float-label">
          <InputText
            id="name"
            v-on:input="validate()"
            v-model="selectedDivision.name"
            :class="{
              'p-invalid': validationErrors.name && submitted,
            }"
          />
          <label
            for="name"
            :class="{ 'p-error': validationErrors.name && submitted }"
          >
            {{ $t("FORM.LABELS.NAME") }}
          </label>
        </div>
      </div>
      
    </form>
    <template #footer>
      <Button
        :label="$t('FORM.BUTTONS.CANCEL')"
        @click="closeDialog"
        class="p-button-text"
      />
      <Button
        type="submit"
        @click="submit"
        :label="$t('FORM.BUTTONS.SAVE')"
      />
    </template>
  </Dialog>
</template>

<script>
import { defineComponent } from "vue";

import divisionService from "./division.service";
import Notifydivision from "../../service/Notify.service";

export default defineComponent({
  number: "CreateUpdateModal",
  props: {
    division: Object,
    close: Function,
    display: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      items: [],
      selectedDivision: {},
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
      this.selectedDivision = {};
      this.close(false);
    },
    submit() {

      if(this.loading) return;
      this.submitted = true;
      const isValid = this.validate();
      if (!isValid) {
        Notifydivision.danger(
          this,
          "",
          "FORM.ERRORS.INVALID"
        );
        return;
      }
      this.loading = true;
      const operation = this.division.uuid
        ? divisionService.update(this.division.uuid, this.selectedDivision)
        : divisionService.create(this.selectedDivision);

      operation
        .then(() => {
          Notifydivision.success(this, "", null);
          this.selectedDivision = {};
          this.close(true);
        })
        .catch(() => {
           Notifydivision.danger(this, "", null);
        }).finally(() => {
          this.loading = false;
        })
    },
    find() {
      console.log(this.division);
      if (!this.division.uuid) return;
      divisionService.read(this.division.uuid).then((division) => {
        if(division.activation_date) {
          division.activation_date = new Date(division.activation_date);
        }
        this.selectedDivision = division;
      });
    },
    validate() {
      if (!this.submitted) return;
      if (this.selectedDivision.name) {
        delete this.validationErrors.name;
      } else {
        this.validationErrors.name = true;
      }
      return Object.keys(this.validationErrors).length === 0;
    },
  },
});
</script>