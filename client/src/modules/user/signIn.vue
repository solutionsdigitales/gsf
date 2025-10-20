<template>
  <div class="form-demo" style="background-color: azure; height: 100vh;">
    <div>

      <!--Content before waves-->
      <div class="inner-header flex">
        <!--Just the logo.. Don't mind this-->

        <div class="p-d-flex p-ai-center p-dir-col p-pt-6 p-px-3">
          <div class="p-d-flex p-jc-center">
            <div class="card">
              <div class="p-center">
                <div>
                  <SwitchLanguage :dottes="true"></SwitchLanguage>
                </div>
                <center>
                  <i class="pi pi-user iconProfil" :style="{ fontSize: '5rem', color: 'var(--black-100)' }"></i>
                </center>
              </div>
              <div><b>GSF</b></div>
              <span class="p-text-center">Authentification</span>

              <form @submit.prevent="handleSubmit()" style="width: 100%;">
                <div class="p-field">
                  <div class="p-float-label">
                    <InputText id="name" v-on:input="validate()" placeholder="Nom d'utilisateur" v-model="user.name"
                      :class="{
                        'p-invalid': validationErrors.name && submitted,
                      }" />

                  </div>
                </div>

                <div class="p-field">
                  <div class="p-float-label">
                    <Password id="password" v-model="user.password" :feedback="false" style="width: 100%;"
                      placeholder="Mot de passe" v-on:input="validate()" :class="{
                        'p-invalid': validationErrors.password && submitted,
                      }" toggleMask>
                    </Password>

                  </div>
                </div>

                <Button id="submitButton" type="submit"
                 :label="$t('FORM.BUTTONS.SIGN_IN')" style="width: 100%;"
                  :disabled="loading" />

                <br /><br />

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--Content ends-->
  </div>
</template>

<script>
import SwitchLanguage from "../../components/SwitchLanguage.vue";
import NotifyService from "../../service/Notify.service";
import AppCache from "../../service/appCache";
import UserService from "./user.service";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      user: { name: null, password: null },
      validationErrors: {},
      submitted: false,
      countries: null,
      showMessage: false,
      loading: false,
    };
  },
  created() {
    const { by_msauth } = this.$route.query;
    if (by_msauth) {
      const clientInitiated = AppCache.get('msauth');
      if (clientInitiated === `1`) {
        this.getMsAuthInfo();
      }
    }
  },
  methods: {
    handleSubmit() {
      this.submitted = true;
      const isValid = this.validate();
      if (!isValid) {
        NotifyService.danger(this, "", "FORM.ERRORS.INVALID");
        return;
      }
      this.loading = true;
      UserService.auth({
        name: this.user.name,
        pwd: this.user.password,
      })
        .then((res) => {
          NotifyService.success(this, null, `Welcome ${res.user.name}`);
          this.$store.commit("updateSession", res);
          this.$router.push("/home");
        })
        .catch((er) => {
          console.log(er);
          NotifyService.danger(this, null, "FORM.ERRORS.INVALID_LOGIN_OR_PWD");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    validate() {
      if (!this.submitted) return;
      if (this.user.name) {
        delete this.validationErrors.name;
      } else {
        this.validationErrors.name = true;
      }
      if (this.user.password) {
        delete this.validationErrors.password;
      } else {
        this.validationErrors.password = true;
      }

      return Object.keys(this.validationErrors).length === 0;
    },
    msauth() {
      AppCache.set('msauth', 1);
      const server = this.$store.state.server;
      window.location = `${server}auth`;
    },
    getMsAuthInfo() {
      this.loading = true;
      UserService.msauth()
        .then((res) => {
          NotifyService.success(this, null, `Welcome ${res.user.name}`);
          this.$store.commit("updateSession", res);
          AppCache.set('msauth', -121);
          this.$router.push("/home");
        })
        .catch((er) => {
          console.log(er);
          NotifyService.danger(this, null, "FORM.ERRORS.INVALID_LOGIN_OR_PWD");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    resetForm() {
      this.user = {
        name: null,
        password: null,
      };

      this.submitted = false;
    },
  },
  components: {
    SwitchLanguage,
  },
});
</script>


<style lang="css" scoped>
@import "../../assets/styles/wave.css";

.form-demo .card {
  background: #fff;
  position: relative;
  z-index: 1000;
  color: black;
  min-width: 450px;
  padding: 15px;
  box-shadow: 0px 1px 50px rgba(46, 45, 45, 0.18);
  margin-top: 30px;
}

.form-demo .card a {
  text-decoration: none !important;
}

.form-demo form {
  margin-top: 0rem;
  padding: 5px;
  padding-top: 10px;
  padding-bottom: 0px;
}

.form-demo .p-field {
  margin-bottom: 1.5rem;
}

.iconProfil {
  box-shadow: 0px -1px 10px rgba(116, 116, 117, 0.2);
  border-radius: 50%;
  padding: 30px;
}

@media screen and (max-width: 960px) {
  .card {
    width: 80%;
  }
}
</style>