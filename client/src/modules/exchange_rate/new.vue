<template>
    <Dialog v-if="display" :header="$t('TREE.EXCHANGE_RATE')" :closable="false" position="top"
        :style="{ width: '40vw' }" :modal="true" :visible="display" footer="Footer">

        <form @submit.prevent="submit()" class="p-fluid">
            <br />
            <div class="p-field">
                <label for="currency_id" class="label-required"
                    :class="{ 'p-error': validationErrors.currency_id && submitted }">
                    {{ $t("TABLE.COLUMNS.CURRENCY") }}
                </label>
                <Dropdown id="currency_id" v-model="selectedCurrency" @change="setCurrency()" :options="currencies"
                    optionLabel="name" :class="{
                        'p-invalid': validationErrors.currency_id && submitted,
                    }" />
            </div>
            <br />
            <div class="p-field">
                <label for="rate">
                    {{ $t("FORM.LABELS.RATE") }}
                </label>

                <InputText id="rate" v-on:input="validate()" v-model="selectedRate.rate" />
            </div>




        </form>

        <template #footer>
            <Button id="cancelButton" :label="$t('FORM.BUTTONS.CANCEL')" @click="closeDialog" class="p-button-text" />
            <Button id="submitButton" type="submit" @click="submit" :label="selectedRate.uuid
                ? $t('FORM.BUTTONS.UPDATE')
                : $t('FORM.BUTTONS.SAVE')
                " />
        </template>
    </Dialog>
</template>
<script>

import { defineComponent } from "vue";
import CurrencyService from "../../service/currencyService";
import NotifyService from "../../service/Notify.service";
import ExchangeRateService from "./rate.service";

export default defineComponent({
    number: "CreateUpdateModal",
    props: {
        rate: Object,
        close: Function,
        display: {
            type: Boolean,
            default: false,
        },
    },
    watch: {
        display(newVal) {
            if (newVal) {
                this.find();
            }
        },
    },
    data() {
        return {
            submitted: false,
            validationErrors: {},
            selectedRate: {},
            selectedCurrency:null,
            currencies: [],
            enterprise: {}
        }
    },
    created() {
        console.log(this.$store.state.session);
        this.enterprise = this.$store.state.session.enterprise;
    },
    methods: {
        async find() {
            const currencies = await CurrencyService.read();
            this.currencies = currencies.filter((c) => c.id != this.enterprise.currency_id);
        },
        setCurrency() {
            this.selectedRate.currency_id = this.selectedCurrency.id;
        },
        closeDialog() {
            this.submitted = false;
            this.selectedRate = {};
            this.close(false);
        },
        validate() {
            if (!this.submitted) return;
            const fields = ["currency_id",'rate'];
            fields.forEach((field) => {
                if (this.selectedRate[field]) {
                delete this.validationErrors[field];
                } else {
                this.validationErrors[field] = true;
                }
            });

            return Object.keys(this.validationErrors).length === 0;
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
            this.selectedRate.buy_rate = this.selectedRate.rate;
            const operation = this.selectedRate.uuid
                ? ExchangeRateService.update(this.selectedRate.uuid, this.selectedRate)
                : ExchangeRateService.create(this.selectedRate);

            operation
                .then(() => {
                    NotifyService.success(this, "", null);
                    this.selectedRate= {};
                    this.close(true);
                })
                .catch(() => {
                    NotifyService.danger(this, "", null);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    }
});
</script>