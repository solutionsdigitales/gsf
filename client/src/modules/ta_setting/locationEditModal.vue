
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
    <form @submit.prevent="submit()" class="p-fluid">
      <div class="grid">
        <div class="col-12 lg:col-12 xl:col-12">
          <div class="p-field">
            <label
              for="name"
              class="label-required"
              :class="{ 'p-error': validationErrors.name && submitted }"
            >
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
              for="per_diem_1_14"
              class="label-required"
              :class="{
                'p-error': validationErrors.per_diem_1_14 && submitted,
              }"
            >
              {{ $t("VOUCHERS.PERDIEM") }}-14
            </label>
            <InputNumber
              id="per_diem_1_14"
              :currency="enterprise.currency_format_key"
              :locale="enterprise.currency_intel_number_format"
              :minFractionDigits="2"
              v-model="selectedLocation.per_diem_1_14"
              v-on:input="validate()"
              style="width: 100%"
            />
          </div>

          <div class="p-field">
            <label
              for="per_diem_15_more"
              class="label-required"
              :class="{
                'p-error': validationErrors.per_diem_15_more && submitted,
              }"
            >
              {{ $t("VOUCHERS.PERDIEM") }}-15
            </label>
            <InputNumber
              id="per_diem_15_more"
              :currency="enterprise.currency_format_key"
              :locale="enterprise.currency_intel_number_format"
              :minFractionDigits="2"
              v-model="selectedLocation.per_diem_15_more"
              v-on:input="validate()"
              style="width: 100%"
            />
          </div>

          <div class="p-field">
            <label
              for="lodging"
              class="label-required"
              :class="{ 'p-error': validationErrors.lodging && submitted }"
            >
              {{ $t("VOUCHERS.HOSTING") }}
            </label>
            <InputNumber
              id="lodging"
              :currency="enterprise.currency_format_key"
              :locale="enterprise.currency_intel_number_format"
              :minFractionDigits="2"
              v-model="selectedLocation.lodging"
              v-on:input="validate()"
              style="width: 100%"
            />
          </div>
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
        location="submit"
        @click="submit"
        :label="$t('FORM.BUTTONS.SAVE')"
      />
    </template>
  </Dialog>
</template>

<script>
import { defineComponent } from "vue";
import LocationService from "./location.service";
import NotifyService from "../../service/Notify.service";

export default defineComponent({
  name: "CreateUpdateModal",
  props: {
    location: Object,
    close: Function,
    display: {
      location: Boolean,
      default: false,
    },
  },
  data() {
    return {
      items: [],
      projects: [],
      selectedType: {},
      selectedLocation: {},
      selectedProject: {},
      validationErrors: {},
      enterprise: {},
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
      this.selectedLocation = {};
      this.close(false);
    },

    submit() {
      if (this.loading) return;
      this.submitted = true;
      const isValid = this.validate();
      if (!isValid) {
        NotifyService.danger(this, "", "FORM.ERRORS.INVALID");
        return;
      }
      this.loading = true;
      const operation = this.location.uuid
        ? LocationService.update(this.location.uuid, this.selectedLocation)
        : LocationService.create(this.selectedLocation);

      operation
        .then(() => {
          NotifyService.success(this, "", null);
          this.selectedLocation = {};
          this.close(true);
        })
        .catch(() => {
          NotifyService.danger(this, "", null);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    find() {
      if (!this.location.uuid) return null;
      LocationService.read(this.location.uuid).then((location) => {
        this.selectedLocation = location;
        this.types.forEach((t) => {
          if (t.uuid === location.type) {
            this.selectedType = t;
          }
        });
      });
    },
    setType() {
      this.selectedLocation.type = this.selectedType.uuid;
    },
    validate() {
      if (!this.submitted) return;

      const requiredCols = ["name",  "per_diem_1_14"];

      requiredCols.forEach((col) => {
        if (this.selectedLocation[col]) {
          delete this.validationErrors[col];
        } else {
          this.validationErrors[col] = true;
        }
      });

      return Object.keys(this.validationErrors).length === 0;
    },
  },
});
</script>

<style scoped>
.p-field {
  padding-top: 20px;
}
select {
  width: 100%;
  border: 1px solid #ced4da !important;
}
select option {
  padding: 2px;
  cursor: pointer;
}
</style>
