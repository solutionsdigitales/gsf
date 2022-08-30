
<template>
  <Dialog
    v-if="display"
    :header="$t('TREE.PROJECT')"
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
            v-model="selectedProject.code"
            :class="{
              'p-invalid': validationErrors.code && submitted,
            }"
          />

        </div>
      </div>

       <div class="p-field">
          <label
            for="name"
            :class="{ 'p-error': validationErrors.name && submitted }"
          >
            {{ $t("FORM.LABELS.NAME") }}
          </label>

          <InputText
            id="name"
            v-on:input="validate()"
            v-model="selectedProject.name"
            :class="{
              'p-invalid': validationErrors.name && submitted,
            }"
          />

          <div class="p-field">
          <label for="short_name">
            {{ $t("FORM.LABELS.ABBREVIATION") }}
          </label>

          <InputText
            id="short_name"
            v-on:input="validate()"
            v-model="selectedProject.short_name"
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
        :label="selectedProject.uuid ?  $t('FORM.BUTTONS.UPDATE') :$t('FORM.BUTTONS.SAVE')"
      />
    </template>
  </Dialog>
</template>

<script>
import { defineComponent } from "vue";

import projectService from "./project.service";
import Notifyproject from "../../service/Notify.service";

export default defineComponent({
  number: "CreateUpdateModal",
  props: {
    project: Object,
    close: Function,
    display: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      items: [],
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
      this.selectedProject = {};
      this.close(false);
    },
    submit() {
      if(this.loading) return;
      this.submitted = true;
      const isValid = this.validate();
      if (!isValid) {
        Notifyproject.danger(
          this,
          "",
          "FORM.ERRORS.INVALID"
        );
        return;
      }
      this.loading = true;
      const operation = this.project.uuid
        ? projectService.update(this.project.uuid, this.selectedProject)
        : projectService.create(this.selectedProject);

      operation
        .then(() => {
          Notifyproject.success(this, "", null);
          this.selectedProject = {};
          this.close(true);
        })
        .catch(() => {
           Notifyproject.danger(this, "", null);
        }).finally(() => {
          this.loading = false;
        })
    },
    find() {
      console.log(this.project);
      if (!this.project.uuid) return;
      projectService.read(this.project.uuid).then((project) => {
        if(project.activation_date) {
          project.activation_date = new Date(project.activation_date);
        }
        this.selectedProject = project;
      });
    },
    validate() {
      if (!this.submitted) return;
      if (this.selectedProject.name) {
        delete this.validationErrors.name;
      } else {
        this.validationErrors.name = true;
      }
      if (this.selectedProject.code) {
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
