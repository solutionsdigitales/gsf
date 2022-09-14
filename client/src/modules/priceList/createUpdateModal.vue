
<template>
  <Dialog
    v-if="display"
    :header="$t('TREE.PRICE_LIST')"
    :closable="false"
    position="top"
    :style="{ width: '30vw' }"
    :modal="true"
    :visible="display"
    footer="Footer"
  >
    <form @submit.prevent="submit()" class="p-fluid">
      <div class="col-p12" style="margin-top: 25px">
        <div class="p-field">

          <label
            for="name"
            :class="{ 'p-error': validationErrors.name && submitted }"
          >
            {{ $t("FORM.LABELS.LABEL") }}*
          </label>

          <InputText
            id="name"
            v-on:input="validate()"
            v-model="selectedpricing.name"
            :class="{
              'p-invalid': validationErrors.name && submitted,
            }"
          />
        </div>

         <div class="p-field">

          <label
            for="amount"
            :class="{ 'p-error': validationErrors.name && submitted }"
          >
            {{ $t("FORM.LABELS.AMOUNT") }}*
          </label>

          <InputNumber
              id="amount"
              v-on:input="validate()"
              :minFractionDigits="2"
              v-model="selectedpricing.amount"
              :class="{
                'p-invalid': validationErrors.amount && submitted,
              }"
            />
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
        :label="pricing.id ? $t('FORM.BUTTONS.UPDATE') : $t('FORM.BUTTONS.SAVE')"
      />
    </template>
  </Dialog>
</template>

<script>
import { defineComponent } from "vue";

import PricingService from "./price.service";
import NotifyService from "../../service/Notify.service";

export default defineComponent({
  name: "CreateUpdateModal",
  props: {
    pricing: Object,
    close: Function,
    display: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      items: [],
      selectedpricing: {},
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
      this.selectedpricing = {};
      this.close(false);
    },
    submit() {

      if(this.loading) return;

     
      this.submitted = true;
      const isValid = this.validate();
      if (!isValid) {
        NotifyService.danger(
          this,
          "Erreur",
          "FORM.ERRORS.INVALID"
        );
        return;
      }
      this.loading = true;
      const operation = this.pricing.uuid
        ? PricingService.update(this.pricing.uuid, this.selectedpricing)
        : PricingService.create(this.selectedpricing);

      operation
        .then(() => {
          NotifyService.success(this, "", null);
           this.selectedpricing = {};
          this.close(true);
        })
        .catch(() => {
           NotifyService.danger(this, '', null);
        }).finally(() => {
          this.loading = false;
        })
    },
    
    find() {
      if (!this.pricing.uuid) return;
      PricingService.read(this.pricing.uuid).then((pricing) => {
        this.selectedpricing = pricing;
        console.log(pricing);
      });
    },
    validate() {
      if (!this.submitted) return;
      if (this.selectedpricing.name) {
        delete this.validationErrors.name;
      } else {
        this.validationErrors.name = true;
      }
     
      return Object.keys(this.validationErrors).length === 0;
    },
  },
});
</script>