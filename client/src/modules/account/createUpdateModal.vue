
<template>
  <Dialog
    v-if="display"
    :header="$t('TREE.ACCOUNT')"
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
            v-model="selectedAccount.code"
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
            v-model="selectedAccount.title"
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
            v-model="selectedAccount.short_title"
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
            v-model="selectedAccount.type"
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

import accountService from "./account.service";
import NotifyService from "../../service/Notify.service";

export default defineComponent({
  number: "CreateUpdateModal",
  props: {
    account: Object,
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
      selectedAccount: {},
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
      this.selectedAccount = {};
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
      const operation = this.account.uuid
        ? accountService.update(this.account.uuid, this.selectedAccount)
        : accountService.create(this.selectedAccount);

      operation
        .then(() => {
          NotifyService.success(this, "", null);
          this.selectedAccount = {};
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
      if (!this.account.uuid) return null;
      accountService.read(this.account.uuid).then((account) => {
        if (this.account.uuid) {
          this.projects.forEach((p) => {
            if (p.uuid === account.project_uuid) {
              this.selectedProject = p;
            }
          });
          this.selectedAccount = account;
        }
      });
    },
    setProject() {
      this.selectedAccount.project_uuid = this.selectedProject.uuid;
      this.validate();
    },
    validate() {
      if (!this.submitted) return;

      const requiredCols = ["code", "title"];

      requiredCols.forEach((col) => {
        if (this.selectedAccount[col]) {
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
