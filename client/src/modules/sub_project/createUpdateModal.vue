
<template>
  <Dialog
    v-if="display"
    :header="$t('TREE.SUB_PROJECT')"
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
            v-model="selectedSubProject.code"
            :class="{
              'p-invalid': validationErrors.code && submitted,
            }"
          />

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
            v-model="selectedSubProject.name"
            :class="{
              'p-invalid': validationErrors.name && submitted,
            }"
          />

        </div>
   <div class="p-field">
          <label
            for="short_name"
            :class="{ 'p-error': validationErrors.short_name && submitted }"
          >
            {{ $t("FORM.LABELS.ABBREVIATION") }}
          </label>

          <InputText
            id="short_name"
            v-on:input="validate()"
            v-model="selectedSubProject.short_name"
          />

        </div>
            <div class="p-field">
            <label
              for="project"
              :class="{ 'p-error': validationErrors.project_uuid && submitted }"
            >
              {{ $t("TREE.PROJECT") }}
            </label>
            <Dropdown
              inputId="project_uuid"
              v-model="selectedProject"
              @change="setProject()"
              :options="projects"
              optionLabel="name"
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
        :label="$t('FORM.BUTTONS.SAVE')"
      />
    </template>
  </Dialog>
</template>

<script>
import { defineComponent } from "vue";

import subProjectService from "./sub_project.service";
import NotifyService from "../../service/Notify.service";
import ProjectService from "../project/project.service";

export default defineComponent({
  number: "CreateUpdateModal",
  props: {
    subProject: Object,
    close: Function,
    display: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      items: [],
      projects : [],
      selectedSubProject: {},
      selectedProject : {},
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
      this.selectedSubProject = {};
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
      const operation = this.subProject.uuid
        ? subProjectService.update(this.subProject.uuid, this.selectedSubProject)
        : subProjectService.create(this.selectedSubProject);

      operation
        .then(() => {
          NotifyService.success(this, "", null);
          this.selectedSubProject = {};
          this.close(true);
        })
        .catch(() => {
           NotifyService.danger(this, "", null);
        }).finally(() => {
          this.loading = false;
        })
    },
    find() {
      
      ProjectService.read().then(projects => {
        this.projects = projects;
         if (!this.subProject.uuid) {
           return null;
         } else {
           return subProjectService.read(this.subProject.uuid);
         }
      })
      .then((subProject) => {
        if (this.subProject.uuid) {
         this.projects.forEach(p => {
           if(p.uuid === subProject.project_uuid) {
             this.selectedProject = p;
           }
         })
        this.selectedSubProject = subProject;
        }
      });
    },
    setProject() {
      this.selectedSubProject.project_uuid = this.selectedProject.uuid;
      this.validate();
    },
    validate() {
      if (!this.submitted) return;
      
      const requiredCols = ["code","name", 'project_uuid'];

      requiredCols.forEach((col) => {
        if (this.selectedSubProject[col]) {
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
  padding-top: 20px ;
}
</style>
