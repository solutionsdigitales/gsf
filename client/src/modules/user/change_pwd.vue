
<template>
  <Dialog
    v-if="display"
    :header="$t('IHRIS.CHANGE_PASSWORD')"
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
            for="oldPwd"
            :class="{ 'p-error': validationErrors.oldPwd && submitted }"
          >
            {{ $t("IHRIS.OLD_PASSWORD") }}*
          </label>

          <Password
            id="password"
            v-model="data.oldPwd"
            :feedback="false"
            v-on:input="validate()"
            :class="{
              'p-invalid': validationErrors.oldPwd && submitted,
            }"
            toggleMask
          >
          </Password>
        </div>

         <div class="p-field">
          <label
            for="newPwd"
            :class="{ 'p-error': validationErrors.newPwd && submitted }"
          >
            {{ $t("IHRIS.NEW_PASSWORD") }}*
          </label>

          <Password
            id="newPwd"
            v-model="data.newPwd"
            :feedback="false"
            v-on:input="validate()"
            :class="{
              'p-invalid': validationErrors.newPwd && submitted,
            }"
            toggleMask
          >
          </Password>
        </div>

         <div class="p-field">
          <label
            for="confirm_password"
            :class="{ 'p-error': validationErrors.confirm_password && submitted }"
          >
            {{ $t("IHRIS.CONFIRM_PASSWORD") }}*
          </label>

          <Password
            id="password"
            v-model="data.confirm_password"
            :feedback="false"
            v-on:input="validate()"
            :class="{
              'p-invalid': validationErrors.confirm_password && submitted,
            }"
            toggleMask
          >
          </Password>
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
        v-if="data.newPwd && data.newPwd === data.confirm_password"
        :label="$t('FORM.BUTTONS.SAVE')" />
    </template>
  </Dialog>
</template>

<script>
import { defineComponent } from "vue";

import UserService from "./user.service";
import NotifyService from "../../service/Notify.service";

export default defineComponent({
  name: "ChangePasswordModal",
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
      data: {},
      validationErrors: {},
      submitted: false,
    };
  },
  watch: {
    display(newVal) {
      if (newVal) {
        console.log(newVal);
      }
    },
  },
  methods: {
    closeDialog() {
      this.data = {};
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
      const { user } = this.connectedUser = this.$store.state.session;
      this.data.user_id = user.id;
      UserService.changeSelfPassword(this.data)
        .then(() => {
          NotifyService.success(this, "", null);
          this.data = {};
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
      if (!this.role.uuid) return;
      UserService.read(this.role.uuid).then((role) => {
        this.data = role;
        console.log(role);
      });
    },
    validate() {
      if (!this.submitted) return;
     
      const requiredCols = [
        "oldPwd",
        "newPwd",
      ];

      requiredCols.forEach((col) => {
        if (this.data[col]) {
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
  padding-top: 10px;
}
</style>