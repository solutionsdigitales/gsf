
<template>
  <Dialog
    v-if="display"
    :header="$t('TREE.USER')"
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
            {{ $t("FORM.LABELS.NAME") }}*
          </label>

          <InputText
            id="name"
            v-on:input="validate()"
            v-model="selectedUser.name"
            :class="{
              'p-invalid': validationErrors.name && submitted,
            }"
          />
        </div>
      </div>

      <div class="col-p12" style="margin-top: 25px" v-if="!selectedUser.id">
        <div class="p-field">
          <label
            for="password"
            :class="{
              'p-error': validationErrors.password && submitted,
            }"
            >{{ $t("FORM.LABELS.PASSWORD") }}*</label
          >
        </div>
        <Password
          id="password"
          v-model="selectedUser.pwd"
          :feedback="false"
          v-on:input="validate()"
          :class="{
            'p-invalid': validationErrors.password && submitted,
          }"
          toggleMask
        >
        </Password>
      </div>

      <br />
      <div class="p-field-checkbox">
        <Checkbox
          id="locked"
          :binary="true"
          name="locked"
          v-model="selectedUser.locked"
        />
        <label for="locked">
          {{ $t("FORM.LABELS.LOCKED") }}
        </label>
      </div>
    </form>
    <template #footer>
      <Button
        id="cancel"
        :label="$t('FORM.BUTTONS.CANCEL')"
        @click="closeDialog"
        class="p-button-text"
      />
      <Button
        type="submit"
        id="submitButton"
        @click="submit"
        :label="user.id ? $t('FORM.BUTTONS.UPDATE') : $t('FORM.BUTTONS.SAVE')"
      />
    </template>
  </Dialog>
</template>

<script>
import { defineComponent } from "vue";
import userService from "./user.service";
import NotifyService from "../../service/Notify.service";

export default defineComponent({
  name: "CreateUpdateModal",
  props: {
    user: Object,
    close: Function,
    display: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      items: [],
      selectedUser: {},
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
      this.selectedUser = {};
      this.submitted = false;
      this.close(false);
    },
    submit() {
      if (this.loading) return;

      this.submitted = true;
      const isValid = this.validate();
      if (!isValid) {
        NotifyService.danger(this, "Erreur", "FORM.ERRORS.INVALID");
        return;
      }
      this.loading = true;
      const operation = this.user.id
        ? userService.update(this.user.id, this.selectedUser)
        : userService.create(this.selectedUser);

      operation
        .then(() => {
          NotifyService.success(this, "", null);
          this.selectedUser = {};
          this.close(true);
        })
        .catch(() => {
          NotifyService.danger(this, "", null);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onInputChange(change) {
      this.selectedUser[change.id] = change.value;
    },
    find() {
      if (!this.user.id) return;
      userService.read(this.user.id).then((user) => {
        user.locked = !!user.locked;
        this.selectedUser = user;
      });
    },
    validate() {
      if (!this.submitted) return;
      if (this.selectedUser.name) {
        delete this.validationErrors.name;
      } else {
        this.validationErrors.name = true;
      }
      if (!this.selectedUser.id) {
        if (this.selectedUser.pwd) {
          delete this.validationErrors.password;
        } else {
          this.validationErrors.password = true;
        }
      }
      return Object.keys(this.validationErrors).length === 0;
    },
  },
});
</script>