<template>
  <div class="col-p12 card page-body">
    <div style="float: right; width: 300px">
      <span class="p-buttonset">
        <Button style="float: right" v-on:click="Add()" :label="$t('FORM.BUTTONS.ADD')" icon="pi pi-plus" />
      </span>
    </div>
    <br />
    <br />
    <br />

    <DataTable
      @rowSelect="onRowSelect"
      :value="prices"
      showGridlines
      stripedRows
      v-model:selection="selectedPrice"
      dataKey="uuid"
      responsiveLayout="scroll"
    >
      <template #header>
        {{ $t("TREE.PRICE_LIST") }}
      </template>
      
      <template #empty>
        {{$t('FORM.SELECT.EMPTY')}}
      </template>

      <Column selectionMode="single" headerStyle="width: 3em"></Column>

      <Column field="name" :header="$t('FORM.LABELS.LABEL')"></Column>
      <Column field="amount" headerStyle="width: 16em" :header="$t('FORM.LABELS.AMOUNT')"/> 
      <Column field="is_periodic" headerStyle="width: 7em" :header="$t('FORM.LABELS.PERIODIC')">
      <template #body="e">
           <span>
             {{$t(e.data.is_periodic ? 'FORM.LABELS.YES' : 'FORM.LABELS.NO')}}
           </span>
         </template>
      </Column>

      <Column field="is_debt" headerStyle="width: 7em" :header="$t('FORM.LABELS.DEBT')">
      <template #body="e">
           <span>
             {{$t(e.data.is_debt ? 'FORM.LABELS.YES' : 'FORM.LABELS.NO')}}
           </span>
         </template>
      </Column>

      <Column field="is_refund" headerStyle="width: 7em" :header="$t('FORM.LABELS.REFUND')">
      <template #body="e">
           <span>
             {{$t(e.data.is_refund ? 'FORM.LABELS.YES' : 'FORM.LABELS.NO')}}
           </span>
         </template>
      </Column>

      <Column field="action" header="Action" style="width: 100px">
        <template #body="e">
          <priceActions 
            :entity="e.data"
            v-on:reloadPriceList="getPrices()" />
        </template>
      </Column>
    </DataTable>
   
    <CreateUpdateModal
        :pricing = "price"
        ref="addPriceModal"
        :close='closeDialog'
       :display="displayCreateModal">
    </CreateUpdateModal>
  </div>
</template>

<script>
import PricingService from "./price.service";
import priceActions from "./actions.vue";
import CreateUpdateModal from "./createUpdateModal";
import AppCache from "../../service/appCache";

export default {
  data() {
    return {
      prices: [],
      price : {},
      items: [],
      selectedPrice: null,
      displayCreateModal : false,
    };
  },
  created() {
    const cache = AppCache.get('session') || {};
    if(cache.token) {
      this.getPrices();
    } else {
      this.$router.push("/auth");
    }
    
  },
  methods: {
    getPrices() {
      PricingService.read().then((prices) => {
        this.prices = prices;
      });
    },
    onRowSelect($event) {
      console.log($event.data);
    },
    Add() {
      this.displayCreateModal = true;
      this.price = {};
    },
    closeDialog(result) {
      if(result) {
        this.getPrices();
      }
      this.displayCreateModal = false;
    },
   
    toggleAction(event) {
      this.$refs.cm.show(event.originalEvent);
      this.items = [
        {
          label: "delete",
          icon: "pi pi-check",
          command: () => {
          },
        },
      ];
    },
  },
  components: {
    priceActions,
    CreateUpdateModal,
  },
};
</script>
