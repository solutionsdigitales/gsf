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
              <span class="link" @click="showUnauthorizedPRFs()">
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
import ApprovementService from "../modules/prf/prf_approvement";

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
    ApprovementService.read(null, {
      employee_uuid: this.currentEmployee.uuid,
      has_approved: 0,
      document_state_id: 1,
    }).then((result) => {
      this.prfUnauthorizedNumber = result.length;
    });
  },
  methods: {
    showUnauthorizedPRFs() {
      this.$router.push({
        name: "prf_approve_view",
        query: {
          period: "allTime",
          approver_uuid: this.currentEmployee.uuid,
          unauthorized: 1,
        },
      });
    },
  },
});
</script>