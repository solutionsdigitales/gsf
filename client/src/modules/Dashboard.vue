<template>
  <div class="grid">
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">
              {{ $t("TREE.PRF") }}
            </span>
            <div class="text-900 font-medium text-xl">
              <span class="link">
                {{ prfUnauthorizedNumber }} {{ $t("FORM.INFO.UNAUTHORIZED") }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      products: null,
      currentEmployee: {},
      prfUnauthorizedNumber: 0,
      connectedUser: {},
      noEmployee: false,
    };
  },

  mounted() {
    this.connectedUser = this.$store.state.session.user || {};
    if (!this.connectedUser.is_employee) {
      this.noEmployee = true;
      return;
    }
    this.currentEmployee = this.$store.state.session.employee;
  },
  methods: {}
});
</script>