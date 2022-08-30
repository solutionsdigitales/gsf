<template>
  <div class="form-group" data-bh-period-select>
    <label class="form-label">{{ $t("PERIODS.PERIOD_LIMIT") }}</label>
    <p class="form-static">
      <span>{{ $t(period.translateKey || "") }}</span>

      <!-- Exception for ALL time - this is the only period that does not need to be defined -->
      <span
        v-if="
          period.key !== NO_PERIOD_LIMIT_KEY && period.key !== CUSTOM_PERIOD_KEY
        "
      >
        ({{ period.start }}) - ({{ period.end }})
      </span>

      <span v-if="period.customPeriodStart && period.customPeriodEnd">
        ({{ period.customPeriodStart }}) - ({{ period.customPeriodEnd }})
      </span>
    </p>

    <span class="link" @click="toggleSelectionOptions()">
      <i
        class="pi"
        :class="{ 'pi-calendar-plus' : !expanded, 'pi-calendar-minus' : expanded }"
      ></i>
      <span>{{ $t("PERIODS.SELECT_PERIOD") }}</span>
    </span>
    <div v-if="expanded">
      <hr />
      <div class="grid">
        <div class="col-12 lg:col-6 xl:col-6">
          <ul>
            
            <li v-for="period in Periods.categories.THIS" :key="period.key">
              <span
                class="link"
                @click="selectPeriod(period.key)"
                :data-link="period.key"
              >
                <span class="text-primary">{{ $t(period.translateKey || "") }}</span>
              </span>
            </li>
          </ul>
          
        </div>
        <div class="col-12 lg:col-6 xl:col-6">
          <ul>
            <li v-for="period in Periods.categories.LAST" :key="period.key">
              <span
                class="link text-primary"
                @click="selectPeriod(period.key)"
                :data-link="period.key"
              >
                {{ $t(period.translateKey || "") }}
              </span>
            </li>
            </ul>
         
        </div>
      </div>
      <div class="grid">
        <div class="col-12">
          <ul>
            <li v-for="period in Periods.categories.OTHER" :key="period.key">
              <span
                class="link"
                @click="selectPeriod(period.key)"
                data-link="{{period.key}}"
              >
                <span class="text-primary">{{ $t(period.translateKey || "") }}</span>
              </span>
            </li>
          </ul>

          <!-- @TODO move these templates/ logic into a component that can be unit tested -->
          <ul>
            <li>
              <span class="link text-primary" @click="toggleCustomSelection()">
                {{ $t("PERIODS.CUSTOM") }}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="customExpanded">
        <div class="grid">
          <div class="col-12 lg:col-5 xl:col-5">
            <div class="input-group">

               <Calendar
                id="dateFrom"
                v-model="customSelection.from"
                :showButtonBar="false"
                @date-select="customPeriodChanges()"
                :showIcon="false"
                placeholder="dd/mm/yyyy"
                dateFormat="dd/mm/yy"
              />

              
            </div>
          </div>
           <div class="col-12 lg:col-2 xl:col-2"></div>
          
         <div class="col-12 lg:col-5 xl:col-5">
            

              <Calendar
                id="dateTo"
                v-model="customSelection.to"
                :showButtonBar="false"
                @date-select="customPeriodChanges()"
                :showIcon="false"
                placeholder="dd/mm/yyyy"
                dateFormat="dd/mm/yy"
              />
         
            <div
              class="help-block"
              ng-messages="DateIntervalForm.dateTo.$error"
              ng-show="validationTrigger && DateIntervalForm.dateTo.$invalid"
            >
              <div
                ng-messages-include="modules/templates/messages.tmpl.html"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <hr />
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import bhConstants from "../service/constant";
import Periods from "../service/period";
export default defineComponent({
  name: "bhFilters",
  props: {
    filters: Object,
    reload: Boolean,
  },
  data() {
    return {
      DEFAULT_PERIOD: "today",
      NO_PERIOD_LIMIT_KEY: "allTime",
      CUSTOM_PERIOD_KEY: "custom",
      expanded: false,
      customExpanded: false,
      Periods: Periods,
      period: {},
      customSelection: {
        from: new Date(),
        to: new Date(),
      },

      dateFormat: bhConstants.dates.format,
    };
  },
  mounted() {
    this.onInit();
  },

  methods: {
    onInit() {
      this.periodKey = this.defaultPeriod || this.DEFAULT_PERIOD;
      this.period = Periods.definition(this.periodKey);

      // if custom is already defined, use it
      if (this.periodKey === this.CUSTOM_PERIOD_KEY) {
        this.customSelection.from = this.period.customPeriodStart || new Date();
        this.customSelection.to = this.period.customPeriodEnd || new Date();
      }
    },
    toggleSelectionOptions() {
      this.expanded = !this.expanded;
    },

    toggleCustomSelection() {
      this.customExpanded = !this.customExpanded;

      if (this.customExpanded) {
        // we consider the custom dates as the current period
        this.customPeriodChanges();
      } else {
        /*
        when the user closes the custom dates (from and to)
        we select the default period, and we should not close the select period area
        ( this.expanded should remain true,
        so we add a new parameter 'togglable' in this function this.selectPeriod
      */
        this.selectPeriod(this.NO_PERIOD_LIMIT_KEY, true);
      }
    },

    selectPeriod(key, togglable) {
      this.customExpanded = false;
      const period = Periods.definition(key);
      this.$emit("onSelectCallback", period);
      // should not toggle in custom mode , as explained in at this point : this.toggleCustomSelection()
      if (!togglable) {
        this.toggleSelectionOptions();
      }
      this.period = period;
    },
    // custom dates changed, current period should be updated
    customPeriodChanges() {
      const _period = Object.assign({}, Periods.index.custom);
      _period.customPeriodStart = Periods.format(this.customSelection.from);
      _period.customPeriodEnd = Periods.format(this.customSelection.to);
      this.$emit("onSelectCallback",_period);
    },

    selectCustomPeriod(selection) {
      const period = Periods.index.custom;

      // alias start and end;
      period.customPeriodStart = selection.from;
      period.customPeriodEnd = selection.to;

      this.$emit("onSelectCallback", period);
      this.toggleSelectionOptions();

      this.period = period;
    },
  },
});
</script>
