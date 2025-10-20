
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
            v-model="selectedPricing.name"
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
            style="width: 100%;"
              v-on:input="validate()"
              :minFractionDigits="2"
              v-model="selectedPricing.amount"
              :class="{
                'p-invalid': validationErrors.amount && submitted,
              }"
            />
        </div>

         <br />
         <div class="flex flex-wrap justify-center gap-4">
         
     <div class="flex items-center gap-2">
        <Checkbox
          id="is_periodic"
          :binary="true"
          name="is_periodic"
          v-model="selectedPricing.is_periodic"
        />
        <label for="is_periodic">
          {{ $t("FORM.LABELS.PERIODIC") }}
        </label>
      </div>

         <br />
      <div class="flex items-center gap-2">
        <Checkbox
          id="is_debt"
          :binary="true"
          name="is_debt"
          v-model="selectedPricing.is_debt"
        />
        <label for="is_debt">
          {{ $t("FORM.LABELS.DEBT") }}
        </label>
      </div>


        
        <Checkbox
          id="is_refund"
          :binary="true"
          name="is_refund"
          v-model="selectedPricing.is_refund"
        />
        <label for="is_refund">
          {{ $t("FORM.LABELS.REFUND") }}
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
      selectedPricing: {},
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
      this.selectedPricing = {};
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
        ? PricingService.update(this.pricing.uuid, this.selectedPricing)
        : PricingService.create(this.selectedPricing);

      operation
        .then(() => {
          NotifyService.success(this, "", null);
           this.selectedPricing = {};
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
        pricing.is_periodic = !!pricing.is_periodic;
        pricing.is_debt = !!pricing.is_debt;
        pricing.is_refund = !!pricing.is_refund;
        this.selectedPricing = pricing;
        console.log(pricing);
      });
    },
    validate() {
      if (!this.submitted) return;
      if (this.selectedPricing.name) {
        delete this.validationErrors.name;
      } else {
        this.validationErrors.name = true;
      }
     
      return Object.keys(this.validationErrors).length === 0;
    },
  },
});
</script>