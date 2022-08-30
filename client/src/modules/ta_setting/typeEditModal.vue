
<template>
  <Dialog
    v-if="display"
    :header="$t('FORM.LABELS.TYPE')"
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
            v-model="selectedType.name"
            :class="{
              'p-invalid': validationErrors.name && submitted,
            }"
          />
        </div>
        <div class="p-field">
          <label
            for="per_diem"
             class="label-required"
            :class="{ 'p-error': validationErrors.perdiem && submitted }"
          >
            {{ $t("VOUCHERS.PERDIEM") }}
          </label>
          <br/>

          <InputNumber
                  id="per_diem"
                  :currency="enterprise.currency_format_key"
                  :locale="enterprise.currency_intel_number_format"
                  :minFractionDigits="2"
                  v-model="selectedType.per_diem"
                  v-on:input="validate()"
                  style="width: 100%"
                />
        </div>

        <div class="p-field">
          <label
            for="hosting"
          >
            {{ $t("VOUCHERS.HOSTING") }}
          </label>

          <InputNumber
                  id="hosting"
                  :currency="enterprise.currency_format_key"
                  :locale="enterprise.currency_intel_number_format"
                  :minFractionDigits="2"
                  v-model="selectedType.hosting"
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
      <Button type="submit" @click="submit" :label="$t('FORM.BUTTONS.SAVE')" />
    </template>
  </Dialog>
</template>

<script>
import { defineComponent } from "vue";

import TypeService from "./locationType.service";
import NotifyService from "../../service/Notify.service";
import EnterpriseService from '../enterprise/enterprise.service';

export default defineComponent({
  number: "CreateUpdateModal",
  props: {
    type: Object,
    close: Function,
    display: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      items: [],
      projects: [],
      selectedType: {},
      selectedProject: {},
      validationErrors: {},
      enterprise : {},
      submitted: false,
    };
  },
  watch: {
    display(newVal) {
      if (newVal) {
        this.enterpriseInfo();
        this.find();
      }
    },
  },
  methods: {
    closeDialog() {
      this.submitted = false;
      this.selectedType = {};
      this.close(false);
    },
    enterpriseInfo() {
        EnterpriseService.read()
        .then((enterprises) => {
          this.enterprise = enterprises[0] || {};
        })
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
      const operation = this.type.uuid
        ? TypeService.update(this.type.uuid, this.selectedType)
        : TypeService.create(this.selectedType);

      operation
        .then(() => {
          NotifyService.success(this, "", null);
          this.selectedType = {};
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
      
      if (!this.type.uuid) return null;
      TypeService.read(this.type.uuid).then((type) => {
        if (this.type.uuid) {
          this.projects.forEach((p) => {
            if (p.uuid === type.project_uuid) {
              this.selectedProject = p;
            }
          });
          this.selectedType = type;
        }
      });
    },
    
    validate() {
      if (!this.submitted) return;

      const requiredCols =  [
        'name', 'per_diem','hosting',
      ];

      requiredCols.forEach((col) => {
        if (this.selectedType[col]) {
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
