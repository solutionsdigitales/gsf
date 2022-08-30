
<template>
  <Dialog
    v-if="display"
    :header="$t('TREE.ROLE')"
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
            v-model="selectedRole.label"
            :class="{
              'p-invalid': validationErrors.name && submitted,
            }"
          />
        </div>

        <br />
          <div class="p-field-checkbox">
            <Checkbox
              id="is_default"
              :binary="true"
              name="is_default"
              v-model="selectedRole.is_default"
            />
            <label class="link" for="is_default">
              {{ $t("FORM.LABELS.DEFAULT_ROLE") }}
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
        :label="role.id ? $t('FORM.BUTTONS.UPDATE') : $t('FORM.BUTTONS.SAVE')"
      />
    </template>
  </Dialog>
</template>

<script>
import { defineComponent } from "vue";

import RoleService from "./role.service";
import NotifyService from "../../service/Notify.service";

export default defineComponent({
  name: "CreateUpdateModal",
  props: {
    role: Object,
    close: Function,
    display: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      items: [],
      selectedRole: {},
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
      this.selectedRole = {};
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
      const operation = this.role.uuid
        ? RoleService.update(this.role.uuid, this.selectedRole)
        : RoleService.create(this.selectedRole);

      operation
        .then(() => {
          NotifyService.success(this, "", null);
           this.selectedRole = {};
          this.close(true);
        })
        .catch(() => {
           NotifyService.danger(this, '', null);
        }).finally(() => {
          this.loading = false;
        })
    },
    
    find() {
      if (!this.role.uuid) return;
      RoleService.read(this.role.uuid).then((role) => {
        role.is_default = !!role.is_default;
        this.selectedRole = role;
        console.log(role);
      });
    },
    validate() {
      if (!this.submitted) return;
      if (this.selectedRole.label) {
        delete this.validationErrors.label;
      } else {
        this.validationErrors.label = true;
      }
     
      return Object.keys(this.validationErrors).length === 0;
    },
  },
});
</script>