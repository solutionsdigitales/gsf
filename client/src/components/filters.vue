<template>
  <div class="filters-container">
    <div v-if="!filters" class="text-muted" data-bh-filter-bar-no-filters>
      <i class="pi pi-filter"></i>
      <span>{{ $t("FORM.INFO.NO_FILTERS_APPLIED") }}</span>
    </div>

    <ul v-if="filters.defaultFilters" class="list-inline filter-list">
      <li v-for="filter in filters.defaultFilters" :key="filter._key">
        <!--
      TODO: these should be a custom CSS class.  Label is just too small!
    -->
        <bhFilter :myFilter="filter" v-on:onRemove="remove"> </bhFilter>
      </li>
    </ul>

    <!-- Separator between filter types -->
    <div
      v-if="filters.defaultFilters.length && filters.customFilters.length"
      style="
        display: inline-block;
        width: 1px;
        height: 25px;
        vertical-align: top;
        background-color: #ccc;
      "
    ></div>

    <ul
      v-if="filters.customFilters.length"
      class="list-inline filter-list"
      data-bh-filter-bar-custom-filters
    >
      <li v-for="filter in filters.customFilters" :key="filter._key">
        <!-- on-remove is passing an object containing 'locals' (variables) as part of the Angular -->
        <!-- component callback structure - these methods are not directly called but are wrapper methods -->
        <bhFilter :myFilter="filter" v-on:onRemove="remove"></bhFilter>
      </li>
    </ul>
    <br/>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import bhFilter from "./filter.vue";

export default defineComponent({
  name: "bhFilters",
  props: {
    filters: Object,
    reload: Boolean,
  },
  data() {
    return {
      DEFAULT_FILTER_COMPARITOR: ":",
    };
  },
  mounted() {
    this.load();
  },

  methods: {
    load() {
      const filters = this.filters || {};
      if (!filters) {
        return;
      }
      filters.defaultFilters.forEach(this.mapDisplayValues);
      filters.customFilters.forEach(this.mapDisplayValues);
    },
    mapDisplayValues(filter) {
      filter.displayValue = filter._displayValue || filter._value;
      if (filter._valueFilter) {
        if (filter._valueFilter === "boolean") {
          filter.displayValue = this.$t(
            filter._value ? "FORM.LABELS.YES" : "FORM.LABELS.NO"
          );
        } else {
          filter.displayValue = filter._valueFilter || filter.displayValue;
        }
      }
    },
    remove(f) {
      this.$emit("onRemoveFilter", f);
    },
  },
  components: {
    bhFilter,
  },
});
</script>

<style scoped>
.list-inline {
  list-style: none;
  margin: 0px !important;
  padding: 0px !important;
}
.filters-container {
  width: 100%;
}
</style>