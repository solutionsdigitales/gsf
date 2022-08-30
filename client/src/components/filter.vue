<template>
  <span data="filter">
    <span
      class="label"
      :class="{
        'label-primary': filter._isDefault,
        'label-emphasize': !filter._isDefault,
      }"
    >
      <i class="pi pi-filter" style="font-size: 9px"></i>

      <span
        ><b>{{ $t(filter._label || "") }}</b></span
      >
      <span>{{ filter.comparitorLabel }}</span>
      <span>{{ filter._displayValue || filter._value }}</span>

      <!-- optional close button, displayed if this is not a default filter -->
      <span
        v-if="!filter._isDefault"
        @click="removeFilter(filter)"
        class="link"
      >
        <i class="pi pi-times" style="font-size: 12px"></i>
      </span>
    </span>
  </span>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "bhFilter",

  props: {
    myFilter: Object,
  },
  data() {
    return {
      filter: {},
      DEFAULT_FILTER_COMPARITOR: " : ",
    };
  },
  methods: {
    removeFilter(f) {
      this.$emit("onRemove", f);
    },
  },
  mounted() {
    this.filter = Object.assign({}, this.myFilter);
    if (this.myFilter._valueFilter === "translate") {
      this.filter._displayValue = this.$t(
        this.myFilter._displayValue || this.myFilter._value
      );
    }
    // fill in label details required by the template
    this.filter.comparitorLabel =
      this.filter._comparitor || this.DEFAULT_FILTER_COMPARITOR;
  },
});
</script>

<style scoped>
.label-primary {
  background: var(--primary-color);
  color: #fafafa;
}
.label-emphasize {
  color: #ffffff;
    background: #689F38;
}
.label-primary,
.label-emphasize {
  padding: 3px;
  font-size: 12px;
  float: left;
  border-radius: 4px;
  margin-left: 2px;
}

.pi {
  padding: 2px;
}
</style>
