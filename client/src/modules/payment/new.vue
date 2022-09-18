
<template>
  <Dialog
    v-if="display"
    :header="$t('TREE.PAYMENT')"
    :closable="false"
    position="top"
    :style="{ width: '40vw' }"
    :modal="true"
    :visible="display"
    footer="Footer"
  >
    <form @submit.prevent="submit()" class="p-fluid">
      <div class="p-field">
        <label
          for="member"
          class="label-required"
          :class="{ 'p-error': validationErrors.member_uuid && submitted }"
        >
          {{ $t("TREE.MEMBERS") }}
        </label>
        <Dropdown
          id="member"
          v-model="selectedMember"
          @change="setMember()"
          :options="members"
          :filter="true"
          optionLabel="fullname"
          :class="{
            'p-invalid': validationErrors.member_uuid && submitted,
          }"
        />
      </div>

      <div class="p-field">
        <label
          for="pricing"
          class="label-required"
          :class="{ 'p-error': validationErrors.pricing_uuid && submitted }"
        >
          {{ $t("FORM.LABELS.PRICE_LIST") }}
        </label>
        <Dropdown
          id="pricing"
          v-model="selectedPrice"
          @change="setPrice()"
          :options="priceList"
          optionLabel="name"
          :class="{
            'p-invalid': validationErrors.pricing_uuid && submitted,
          }"
        />
      </div>

      <div class="p-field">
        <label
          for="currency_id"
          class="label-required"
          :class="{ 'p-error': validationErrors.currency_id && submitted }"
        >
          {{ $t("TABLE.COLUMNS.CURRENCY") }}
        </label>
        <Dropdown
          id="currency_id"
          v-model="selectedCurrency"
          @change="setCurrency()"
          :options="currencies"
          optionLabel="name"
          :class="{
            'p-invalid': validationErrors.currency_id && submitted,
          }"
        />
      </div>

      <div class="p-field">
        <label
          for="amount"
          :class="{ 'p-error': validationErrors.amount && submitted }"
        >
          {{ $t("FORM.LABELS.AMOUNT") }}
        </label>

        <InputNumber
          id="amount"
          v-on:input="validate()"
          :minFractionDigits="2"
          v-model="selectedTransaction.amount"
          :class="{
            'p-invalid': validationErrors.amount && submitted,
          }"
        />
      </div>

      <div class="p-field" v-if="selectedPrice.is_periodic">
        <label
          for="month"
          class="label-required"
          :class="{ 'p-error': validationErrors.month && submitted }"
        >
          {{ $t("FORM.LABELS.MONTH") }}
        </label>
        <Dropdown
          id="month"
          v-model="selectedMonth"
          @change="setMonth()"
          :options="months"
          :filter="true"
          optionLabel="label"
        />
      </div>

      <div class="p-field" v-if="selectedPrice.is_periodic">
        <label
          for="year"
          class="label-required"
          :class="{ 'p-error': validationErrors.year && submitted }"
        >
          {{ $t("FORM.LABELS.YEAR") }}
        </label>
        <Dropdown
          id="year"
          v-model="selectedYear"
          @change="setYear()"
          :options="years"
          :filter="true"
          optionLabel="id"
        />
      </div>

      <div class="p-field">
        <label
          for="date"
          :class="{
            'p-error': validationErrors.date && submitted,
          }"
        >
          {{ $t("VOUCHERS.PAYEMENT_DATE") }}
        </label>

        <Calendar
          id="date"
          v-model="selectedTransaction.date"
          :showButtonBar="true"
          :maxDate="new Date()"
          @date-select="validate()"
          :showIcon="true"
          placeholder="dd/mm/yyyy"
          dateFormat="dd/mm/yy"
        />
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
        :label="
          selectedTransaction.uuid
            ? $t('FORM.BUTTONS.UPDATE')
            : $t('FORM.BUTTONS.SAVE')
        "
      />
    </template>
  </Dialog>
</template>

<script>
import { defineComponent } from "vue";

import PaymentService from "./payment.service";
import NotifyService from "../../service/Notify.service";
import CurrencyService from "../../service/currencyService";
import priceListService from "../priceList/price.service";
import MemberService from "../member/member.service";
import RateService from "./rate.service";
import util from "../../service/util";
import constants from "../../service/constant";

export default defineComponent({
  number: "CreateUpdateModal",
  props: {
    transaction: Object,
    close: Function,
    display: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      items: [],
      priceList: [],
      members: [],
      currencies: [],
      selectedTransaction: {},
      selectedCurrency: {},
      validationErrors: {},
      selectedMember: {},
      selectedPrice: {},
      submitted: false,
      loading: false,
      months: [],
      selectedMonth: {},
      selectedYear: {},
      years: [
        {
          id: 2022,
        },
        { id: 2023 },
      ],
    };
  },
  created() {
    this.months = [];
    this.validationErrors = {};
    constants.MONTHS.forEach((m) => {
      this.months.push({
        id: m,
        label: this.$t(`TABLE.COLUMNS.DATE_MONTH.${m}`),
      });
    });
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
      this.selectedTransaction = {};
      this.close(false);
    },
    setPrice() {
      this.selectedTransaction.pricing_uuid = this.selectedPrice.uuid;
      this.setAmount();
      this.validate();
    },
    setMember() {
      this.selectedTransaction.member_uuid = this.selectedMember.uuid;
      this.validate();
    },
    setMonth() {
      this.selectedTransaction.month = this.selectedMonth.id;
    },
    setYear() {
      this.selectedTransaction.year = this.selectedYear.id;
    },
    setCurrency() {
      this.selectedTransaction.currency_id = this.selectedCurrency.id;
      this.selectedTransaction.currency = this.selectedCurrency.format_key;
      this.setAmount();
      this.validate();
    },
    async setAmount() {
      if (
        this.selectedTransaction.currency_id &&
        this.selectedTransaction.pricing_uuid
      ) {
        const rates = await RateService.read(null, {
          currency_id: this.selectedTransaction.currency_id,
          limit: 1,
        });
        const rate = (rates[0] || {}).buy_rate || 1;
        this.selectedTransaction.amount = this.selectedPrice.amount * rate;
      }
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
      this.selectedTransaction.quantity = 1;
      this.selectedTransaction.transaction_type = this.selectedPrice.name;
      this.selectedTransaction.payment_method = "CASH";
      this.selectedTransaction.status = "YES";
      this.selectedTransaction.user_id = this.$store.state.session.user.id;
      this.selectedTransaction.date = util.formatDate(
        this.selectedTransaction.date,
        "YYYY-MM-DD"
      );
      const operation = this.transaction.uuid
        ? PaymentService.update(this.transaction.uuid, this.selectedTransaction)
        : PaymentService.create(this.selectedTransaction);

      operation
        .then(() => {
          NotifyService.success(this, "", null);
          this.selectedTransaction = {};
          this.close(true);
        })
        .catch(() => {
          NotifyService.danger(this, "", null);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async find() {
      console.log(this.$store.state.session.user);
      this.selectedMember = {};
      this.selectedCurrency = {};
      this.selectedPrice = {};
      this.priceList = await priceListService.read();
      this.currencies = await CurrencyService.read();
      const _members = await MemberService.read();
      this.members = _members.map((m) => {
        m.fullname =
          m.number +
          " - " +
          m.lastname +
          " " +
          (m.middlename || "") +
          " " +
          m.firstname;
        return m;
      });
      this.currencies = this.$store.state.currencies;

      if (!this.transaction.uuid) return;
      PaymentService.read(this.transaction.uuid).then((transaction) => {
        if (transaction.activation_date) {
          transaction.activation_date = new Date(transaction.activation_date);
        }
        this.selectedTransaction = transaction;
      });
    },
    validate() {
      if (!this.submitted) return;
      const fields = [
        "currency_id",
        "member_uuid",
        "pricing_uuid",
        "amount",
        "date",
      ];
      if (this.selectedPrice.is_periodic) {
        fields.push("month", "yaer");
      }
      fields.forEach((field) => {
        if (this.selectedTransaction[field]) {
          delete this.validationErrors[field];
        } else {
          this.validationErrors[field] = true;
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
