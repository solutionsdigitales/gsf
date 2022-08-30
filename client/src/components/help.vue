<template>
  <span  v-tooltip="$t(description)" class="help-text">?</span>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Help",
  props: {
    description: String,
  },
  data() {
    return {
    };
  },
});
</script>

<style scoped>
.help-text {
    color: #001;
    border-radius: 50%;
    background-color: #cecdcd;
    padding: 2px;
    cursor: pointer;
    margin-left: 4px;
    width: 20px!important;
    font-size: 12px;
    text-align: center;
    float: right;
}
</style>
