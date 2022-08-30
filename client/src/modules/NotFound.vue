<template>
  <div class="form-demo">
    <div class="header">
        <div class="row">
          <br/>
          <br/>
                    
         </div>
      <!--Content before waves-->
      <div class="inner-header flex">
        <!--Just the logo.. Don't mind this-->
    <div class="p-d-flex p-jc-center">
            <h1>Page not trouvée</h1>
          </div> 
 
      </div>

      <!--Waves Container-->
      <div>
         <svg
          version="1.1"
          class="logo"
          baseProfile="tiny"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 500 500"
          xml:space="preserve"
        ></svg>
        <svg
          class="waves"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shape-rendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g class="parallax">
            <use
              xlink:href="#gentle-wave"
              x="48"
              y="0"
              fill="rgba(255,255,255,0.7"
            />
            <use
              xlink:href="#gentle-wave"
              x="48"
              y="3"
              fill="rgba(255,255,255,0.5)"
            />
            <use
              xlink:href="#gentle-wave"
              x="48"
              y="5"
              fill="rgba(255,255,255,0.3)"
            />
            <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
          </g>
        </svg>
      </div>
      <!--Waves end-->
    </div>
    <!--Header ends-->

    <!--Content ends-->
  </div>
</template>

<script>
import NotifyService from "../service/Notify.service";

export default {
  data() {
    return {
      user: { name: null, password: null },
      validationErrors: {},
      submitted: false,
      countries: null,
      showMessage: false,
    };
  },
  created() {},
  mounted() {},
  methods: {
    handleSubmit() {
      this.submitted = true;
      const isValid = this.validate();
      if (!isValid) {
        NotifyService.error(
          this,
          "Erreur",
          "FORM.ERRORS.INVALID"
        );
        return;
      }
      console.log(this.user);
      NotifyService.success(this, "Succès", "Fait!!");
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

    resetForm() {
      this.user = {
        name: null,
        password: null,
      };

      this.submitted = false;
    },
  },
};
</script>


<style lang="css" scoped>


@import '../assets/styles/wave.css';

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