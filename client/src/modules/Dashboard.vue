<template>
  <div class="grid">
    <div class="col-12 lg:col-6 xl:col-4">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Revenue</span>
            <div class="text-900 font-medium text-xl">
              USD <span class="text-primary">{{ revenue.USD }}</span
              >, CDF <span class="text-primary">{{ revenue.CDF }}</span>
            </div>
          </div>
          <div
            class="
              flex
              align-items-center
              justify-content-center
              bg-orange-100
              border-round
            "
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-map-marker text-orange-500 text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium"></span>
        <span class="text-500"></span>
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-4">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Membres</span>
            <div class="text-900 font-medium text-xl">
              {{ customerNumber }}
            </div>
          </div>
          <div
            class="
              flex
              align-items-center
              justify-content-center
              bg-cyan-100
              border-round
            "
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-inbox text-cyan-500 text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium"></span>
        <span class="text-500"></span>
      </div>
    </div>

    <div class="col-12 lg:col-6 xl:col-4">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Transactions</span>
            <div class="text-900 font-medium text-xl">
              {{ transactionNumber }}
            </div>
          </div>
          <div
            class="
              flex
              align-items-center
              justify-content-center
              bg-blue-100
              border-round
            "
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-shopping-cart text-blue-500 text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium"> </span>
        <span class="text-500"></span>
      </div>
    </div>
    <div class="col-12 xl:col-12">
      <div class="card">
        <h5>Revenue par type de paiement</h5>
        <div v-html="revenueByPaymentMethod"></div>
      </div>
    </div>
    <!--
    <div class="col-12 xl:col-6">
      <div class="card">
        <h5>Ventes recentes</h5>
        <DataTable
          :value="resetTransactions"
          :rows="5"
          :paginator="true"
          responsiveLayout="scroll"
        >
          <Column
            field="card_number"
            header="Carte"
            :sortable="true"
            style="width: 35%"
          ></Column>
          <Column
            field="quantity"
            header="Quantité"
            :sortable="true"
            style="width: 35%"
          ></Column>
          <Column
            field="amount"
            header="Amount"
            :sortable="true"
            style="width: 35%"
          >
            <template #body="{ data }">
              {{ data.currency }}
              {{ data.amount }}
            </template>
          </Column>
          <Column style="width: 15%">
            <template #header> View </template>
            <template #body>
              <Button
                icon="pi pi-search"
                type="button"
                class="p-button-text"
              ></Button>
            </template>
          </Column>
        </DataTable>
      </div>
      <div class="card">
        <div class="flex justify-content-between align-items-center mb-5">
          <h5>Produits les plus vendus</h5>
          <div>
            <Button
              icon="pi pi-ellipsis-v"
              class="p-button-text p-button-plain p-button-rounded"
              @click="$refs.menu2.toggle($event)"
            ></Button>
            <Menu ref="menu2" :popup="true" :model="items"></Menu>
          </div>
        </div>
        <ul class="list-none p-0 m-0">
          <li
            class="
              flex flex-column
              md:flex-row md:align-items-center md:justify-content-between
              mb-4
            "
          >
            <div>
              <span class="text-900 font-medium mr-2 mb-1 md:mb-0"
                >Activation</span
              >
              <div class="mt-1 text-600">cartes</div>
            </div>
            <div class="mt-2 md:mt-0 flex align-items-center">
              <div
                class="
                  surface-300
                  border-round
                  overflow-hidden
                  w-10rem
                  lg:w-6rem
                "
                style="height: 8px"
              >
                <div
                  class="bg-orange-500 h-full"
                  :style="'width:' + activationTendance + '%'"
                ></div>
              </div>
              <span class="text-orange-500 ml-3 font-medium"
                >% {{ activationTendance }}</span
              >
            </div>
          </li>
          <li
            class="
              flex flex-column
              md:flex-row md:align-items-center md:justify-content-between
              mb-4
            "
          >
            <div>
              <span class="text-900 font-medium mr-2 mb-1 md:mb-0"
                >Recharge</span
              >
              <div class="mt-1 text-600">cartes</div>
            </div>
            <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
              <div
                class="
                  surface-300
                  border-round
                  overflow-hidden
                  w-10rem
                  lg:w-6rem
                "
                style="height: 8px"
              >
                <div
                  class="bg-cyan-500 h-full"
                  :style="'width:' + rechargeTendance + '%'"
                ></div>
              </div>
              <span class="text-cyan-500 ml-3 font-medium"
                >%{{ rechargeTendance }}</span
              >
            </div>
          </li>
          <li
            class="
              flex flex-column
              md:flex-row md:align-items-center md:justify-content-between
              mb-4
            "
          >
            <div>
              <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Achat</span>
              <div class="mt-1 text-600">cartes</div>
            </div>
            <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
              <div
                class="
                  surface-300
                  border-round
                  overflow-hidden
                  w-10rem
                  lg:w-6rem
                "
                style="height: 8px"
              >
                <div
                  class="bg-pink-500 h-full"
                  :style="'width:' + cardSellTendance + '%'"
                ></div>
              </div>
              <span class="text-pink-500 ml-3 font-medium"
                >%{{ cardSellTendance }}</span
              >
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="col-12 xl:col-6">
      <div class="card">
        <h5>Vue d'ensemble des ventes</h5>
        <Chart type="line" :data="lineData" />
      </div>
      <div class="card">
        <div class="flex align-items-center justify-content-between mb-4">
          <h5>Volume vendu</h5>
          <div>
            <Button
              icon="pi pi-ellipsis-v"
              class="p-button-text p-button-plain p-button-rounded"
              @click="$refs.menu1.toggle($event)"
            ></Button>
            <Menu ref="menu1" :popup="true" :model="items"></Menu>
          </div>
        </div>

        <span class="block text-600 font-medium mb-3">Cette semaine</span>
        <ul class="p-0 mx-0 mt-0 mb-4 list-none">
          <li
            class="flex align-items-center py-2 border-bottom-1 surface-border"
          >
            <span class="text-900 line-height-3">
              {{ thisWeekLeterNumber }}
              <span class="text-700"> littres d'eau vendus </span>
            </span>
          </li>
        </ul>

        <span class="block text-600 font-medium mb-3">La semaine passée</span>
        <ul class="p-0 m-0 list-none">
          <li
            class="flex align-items-center py-2 border-bottom-1 surface-border"
          >
            <span class="text-900 line-height-3"
              >{{ lastWeekLeterNumber }}
              <span class="text-700">littres d'eau vendus </span>
            </span>
          </li>
        </ul>
      </div>
    </div>
    -->
  </div>
</template>

<script>
import { defineComponent } from "vue";
import ProductService from "../service/ProductService";
import TransactionService from "./payment/payment.service";
import customerService from "./member/member.service";

import util from "../service/util";
import CurrencyService from "../service/currencyService";

export default defineComponent({
  data() {
    return {
      products: null,
      lineData: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
        ],
        datasets: [
          {
            label: "Revenue",
            data: [0, 0, 0, 0, 0, 0, 0],
            fill: false,
            backgroundColor: "#2f4860",
            borderColor: "#2f4860",
            tension: 0.4,
          },
          {
            label: "Sales",
            data: [0, 0, 0, 0, 0, 0, 0],
            fill: false,
            backgroundColor: "#00bb7e",
            borderColor: "#00bb7e",
            tension: 0.4,
          },
        ],
      },
      items: [
        { label: "Add New", icon: "pi pi-fw pi-plus" },
        { label: "Remove", icon: "pi pi-fw pi-minus" },
      ],
      revenue: { USD: 0, CDF: 0 },
      revenueByPaymentMethod: "",
      transactionNumber: 0,
      customerNumber: 0,
      thisWeekLeterNumber: 0,
      lastWeekLeterNumber: 0,
      cardSellTendance: 0,
      activationTendance: 0,
      rechargeTendance: 0,
    };
  },
  productService: null,
  created() {
    this.productService = new ProductService();

    customerService.count().then((result) => (this.customerNumber = result.nbr));
    TransactionService.count().then((data) => {
      this.transactionNumber = data.nbr;      
    });

    TransactionService.summery().then((rows) => {
      let html = `
      <table class="table table-bordered" style="width:100%; border : 1px solid #ddd">
       
        <tbody>
      `;

      // let group rows by payment_mode and currency
      /*
      {
        ORANGE_MONEY: {USD: 58}
        PEPELE_MOBILE: {CDF: 10100, USD: 11}
      }
      
      */
      let modeMap = {};
      let currencyMap = {};
      for (const row of rows) {
        if (!modeMap[row.transaction_type]) {
          modeMap[row.transaction_type] = {};
        }
        modeMap[row.transaction_type][row.currency] = row.amount;
      }
      const paymentModes = Object.keys(modeMap);
      for (const row of rows) {
        let total = 0;
        if(!currencyMap[row.currency]) {
          currencyMap[row.currency] = {};
          total = row.amount;
        }else {
          total = currencyMap[row.currency] + row.amount;
        }
        currencyMap[row.currency] = total;
      }

      const bottomLine = "style = 'border-bottom:1px solid #ddd'";
      for (const key of paymentModes) {
        const usdAmount = util.round(modeMap[key]["USD"] || 0);
        const cdfAmount = util.round(modeMap[key]["CDF"] || 0);
        html += `
        <tr>
          <td ${bottomLine}>${key}</td>
          <td ${bottomLine} class='text-right'>${this.formatCurrency(usdAmount, 1)}</td>
          <td ${bottomLine} class='text-right'>${this.formatCurrency(cdfAmount,2)}</td>
        </tr>
        `;
      }
      const totals = {
        usd : util.round(currencyMap['USD'] || 0),
        cdf :util.round(currencyMap['CDF'] || 0)
      }

      this.revenue = {
        USD:  util.round(currencyMap['USD'] || 0),
        CDF: util.round(currencyMap['CDF'] || 0)
      };

      html += `
      </tbody>
      <tfooter>
        <tr>
          <th>TOTAL</th>
          <td class='text-right text-primary'>
          <b>${this.formatCurrency(totals.usd, 1)}</b>
          </td>
          <td class='text-right text-primary'>
    
            <b>${this.formatCurrency(totals.cdf, 2)}</b>
          </td>
        </tr>

      </tfooter>
      
      `
      this.revenueByPaymentMethod = html;
    });

  },
  methods: {
    pourcentage(total, part) {
      var t = 100 * (part / (total || 1));
      return t.toFixed(2);
    },
    formatCurrency(value, id) {
      return CurrencyService.format(value, id);
    }
  },
});
</script>

<style scoped>
.table {
  width: 100%;
  background: var(--main-table-color);

  margin-top: 1px;
}

.table th,
.table td {
  background: #fff;
  vertical-align: top;
}
</style>