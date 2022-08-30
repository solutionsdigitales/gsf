
<template>
  <Dialog
    v-if="display"
    :header="$t('TREE.ACTIVITY')"
    :closable="false"
    position="top"
    :style="{ width: '30vw' }"
    :modal="true"
    :visible="display"
    footer="Footer"
  >
    <form @submit.prevent="submit()" class="p-fluid">
      <div class="col-p12">
        <div class="p-field">
          <label
            for="code"
            :class="{ 'p-error': validationErrors.code && submitted }"
          >
            {{ $t("FORM.LABELS.CODE") }}
          </label>

          <InputText
            id="code"
            v-on:input="validate()"
            v-model="selectedactivity.code"
            :class="{
              'p-invalid': validationErrors.code && submitted,
            }"
          />
        </div>

        <div class="p-field">
          <label
            for="title"
            :class="{ 'p-error': validationErrors.title && submitted }"
          >
            {{ $t("FORM.LABELS.TITLE") }}
          </label>

          <InputText
            id="title"
            v-on:input="validate()"
            v-model="selectedactivity.title"
            :class="{
              'p-invalid': validationErrors.title && submitted,
            }"
          />
        </div>
        <div class="p-field">
          <label
            for="short_title"
            :class="{ 'p-error': validationErrors.short_title && submitted }"
          >
            {{ $t("FORM.LABELS.ABBREVIATION") }}
          </label>

          <InputText
            id="short_title"
            v-on:input="validate()"
            v-model="selectedactivity.short_title"
          />
        </div>

        <div class="p-field">
          <label
            for="type"
            :class="{ 'p-error': validationErrors.type && submitted }"
          >
            {{ $t("FORM.LABELS.TYPE") }}
          </label>

          <InputText
            id="type"
            v-on:input="validate()"
            v-model="selectedactivity.type"
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
      <Button type="submit" @click="submit" :label="$t('FORM.BUTTONS.SAVE')" />
    </template>
  </Dialog>
</template>

<script>
import { defineComponent } from "vue";
import ActivityService from "./acivity.service";
import NotifyService from "../../service/Notify.service";

export default defineComponent({
  number: "CreateUpdateModal",
  props: {
    activity: Object,
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
      selectedactivity: {},
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
      this.selectedactivity = {};
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
      const operation = this.activity.uuid
        ? ActivityService.update(this.activity.uuid, this.selectedactivity)
        : ActivityService.create(this.selectedactivity);

      operation
        .then(() => {
          NotifyService.success(this, "", null);
          this.selectedactivity = {};
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
      if (!this.activity.uuid) return null;
      ActivityService.read(this.activity.uuid).then((activity) => {
        if (this.activity.uuid) {
          this.selectedactivity = activity;
        }
      });
    },
    validate() {
      if (!this.submitted) return;

      const requiredCols = ["code", "title"];

      requiredCols.forEach((col) => {
        if (this.selectedactivity[col]) {
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
</style>
