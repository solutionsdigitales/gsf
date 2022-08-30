
<template>
  <Dialog
    v-if="display"
    :header="$t('TREE.VENDOR')"
    :closable="false"
    position="top"
    :style="{ width: '60vw' }"
    :modal="true"
    :visible="display"
    footer="Footer"
  >
    <form @submit.prevent="submit()" class="p-fluid">
      <div class="grid">
        <div class="col-12 lg:col-6 xl:col-6">
        
        <div class="p-field">
          <label
            for="id"
            class="label-required"
            :class="{ 'p-error': validationErrors.id && submitted }"
          >
            {{ $t("FORM.LABELS.CODE") }}
          </label>

          <InputText
            id="id"
            v-on:input="validate()"
            v-model="selectedVendor.id"
            :class="{
              'p-invalid': validationErrors.id && submitted,
            }"
          />
        </div>

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
            v-model="selectedVendor.name"
            :class="{
              'p-invalid': validationErrors.name && submitted,
            }"
          />
        </div>
        <div class="p-field">
          <label
            for="status"
             class="label-required"
            :class="{ 'p-error': validationErrors.status && submitted }"
          >
            {{ $t("FORM.LABELS.STATE") }}
          </label>
          <br/>
          <select class="p-component" v-model="selectedVendor.status">
            <option value="Active">
              {{$t('FORM.LABELS.ACTIVE')}}
            </option>
            <option value="Inactive">
              {{$t('FORM.LABELS.INACTIVE')}}
            </option>
          </select>
        </div>

        <div class="p-field">
          <label
            for="address"
          >
            {{ $t("FORM.LABELS.ADDRESS") }}
          </label>

          <InputText
            id="address"
            v-on:input="validate()"
            v-model="selectedVendor.address"
          />
        </div>

        <div class="p-field">
          <label
            for="city"
             class="label-required"
            :class="{ 'p-error': validationErrors.city && submitted }"
          >
            {{ $t("FORM.LABELS.CITY") }}
          </label>

          <InputText
            id="city"
            v-on:input="validate()"
            v-model="selectedVendor.city"
          />
        </div>
         <div class="p-field">
          <label
            for="province"
             class="label-required"
            :class="{ 'p-error': validationErrors.province && submitted }"
          >
            {{ $t("FORM.LABELS.PROVINCE") }}
          </label>

          <InputText
            id="province"
            v-on:input="validate()"
            v-model="selectedVendor.province"
          />
        </div>

        </div>
        <div class="col-12 lg:col-6 xl:col-6">
        
                

       
        <div class="p-field">
          <label
            for="country"
             class="label-required"
            :class="{ 'p-error': validationErrors.country && submitted }"
          >
            {{ $t("FORM.LABELS.COUNTRY") }}
          </label>

          <InputText
            id="country"
            v-on:input="validate()"
            v-model="selectedVendor.country"
          />
        </div>

        
        <div class="p-field">
          <label
            for="contact_name"
            :class="{ 'p-error': validationErrors.contact_name && submitted }"
          >
            {{ $t("FORM.LABELS.CONTACT_NAME") }}
          </label>

          <InputText
            id="contact_name"
            v-on:input="validate()"
            v-model="selectedVendor.contact_name"
          />
        </div>
        <div class="p-field">
          <label
            for="contact_title"
            :class="{ 'p-error': validationErrors.contact_title && submitted }"
          >
            {{ $t("FORM.LABELS.CONTACT_TITLE") }}
          </label>

          <InputText
            id="contact_title"
            v-on:input="validate()"
            v-model="selectedVendor.contact_title"
          />
        </div>

                
        <div class="p-field">
          <label
            for="email"
            :class="{ 'p-error': validationErrors.email && submitted }"
          >
            {{ $t("FORM.LABELS.EMAIL") }}
          </label>

          <InputText
            id="email"
            v-on:input="validate()"
            v-model="selectedVendor.email"
          />
        </div>

        
                
        <div class="p-field">
          <label
            for="proprietor_name" >
            {{ $t("FORM.LABELS.PROPIETOR_NAME") }}
          </label>

          <InputText
            id="proprietor_name"
            v-on:input="validate()"
            v-model="selectedVendor.proprietor_name"
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

import vendorService from "./vendor.service";
import NotifyService from "../../service/Notify.service";

export default defineComponent({
  name: "CreateUpdateModal",
  props: {
    vendor: Object,
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
      selectedVendor: {},
      selectedProject: {},
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
      this.selectedVendor = {};
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
      const operation = this.vendor.uuid
        ? vendorService.update(this.vendor.uuid, this.selectedVendor)
        : vendorService.create(this.selectedVendor);

      operation
        .then(() => {
          NotifyService.success(this, "", null);
          this.selectedVendor = {};
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
      if (!this.vendor.uuid) return null;
      vendorService.read(this.vendor.uuid).then((vendor) => {
        if (this.vendor.uuid) {
          this.projects.forEach((p) => {
            if (p.uuid === vendor.project_uuid) {
              this.selectedProject = p;
            }
          });
          this.selectedVendor = vendor;
        }
      });
    },
    setProject() {
      this.selectedVendor.project_uuid = this.selectedProject.uuid;
      this.validate();
    },
    validate() {
      if (!this.submitted) return;

      const requiredCols =  [
      'id', 'name', 'status',
      'city', 'province', 'country',];

      requiredCols.forEach((col) => {
        if (this.selectedVendor[col]) {
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
