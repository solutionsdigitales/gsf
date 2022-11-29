<template>
  <Dialog
    v-if="display"
    :header="$t('FORM.BUTTONS.SEARCH')"
    :closable="false"
    position="top"
    :style="{ width: '35vw' }"
    :modal="true"
    :visible="display"
    footer="Footer"
  >
    <div>
      <div style="height: 360px; padding-top: 20px">
        <TabView>
          <TabPanel :header="$t('FORM.LABELS.SEARCH_QUERIES')">
            <div class="col-p12 padding0">
              <div class="p-field">
                <label for="membre_number">{{ $t("TREE.MEMBERS") }}</label>
                <InputText
                  id="membre_number"
                  class="col-12"
                   placeholder="Numero"
                  v-model="search.customFilters.membre_number"
                />
              </div>
              <br />
            </div>
          </TabPanel>
          <TabPanel :header="$t('FORM.LABELS.DEFAULTS')">
            <div class="col-p12 padding0">
              <periodSelect @onSelectCallback="onSelectPeriod"></periodSelect>
              <br />
              <div class="p-field">
                <label for="limit">{{ $t("FORM.LABELS.LIMIT") }}</label>
                <InputText
                  id="limit"
                  class="col-12"
                  v-model="search.defaultFilters.limit"
                />
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </div>
    <template #footer>
      <div>
        <Button
          :label="$t('FORM.BUTTONS.CANCEL')"
          @click="closeDialog"
          class="p-button-text"
        />

        <Button
          :label="$t('FORM.BUTTONS.SUBMIT')"
          @click="submit"
          class="p-button-raised p-button-text"
        />
      </div>
    </template>
  </Dialog>
</template>

<script>
import { defineComponent } from "vue";
import Store from "../../../service/store";
import searchUtil from "../../../service/searchModalUtil";
import PeriodUtil from "../../../service/period";
import periodSelect from "../../../components/periodSelect.vue";

export default defineComponent({
  number: "SearchModal",
  props: {
    filters: Object,
    close: Function,
    display: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      displayValues: {},
      lastDisplayValues: {},
      selectedEmployee : {},
      filterMap: {},
      search: {
        defaultFilters: {},
        changes: null,
        searchQueries: {},
      },
      selectedLocation: null,
      selectedProject: {},
      locations: [],
      projects: [],
      employees: [],
    };
  },
  watch: {
    display(newVal) {
      if (newVal) {
        this.reset();
        this.loadFilters();
      }
    },
  },
  methods: {
    submit() {
      const loggedChanges = searchUtil.getChanges(
        Object.assign(
          {},
          this.search.defaultFilters,
          this.search.customFilters
        ),
        this.changes,
        this.displayValues,
        this.lastDisplayValues
      );
      this.close(loggedChanges);
    },
    loadFilters() {
      this.changes = new Store({ identifier: "key" });
      const _defaults = ["limit", "period"];
      const _customs = [
        "membre_number",
      ];

      searchUtil.setFilters(this, _defaults, "defaultFilters");
      searchUtil.setFilters(this, _customs, "customFilters");

      searchUtil.setDropDownValue(
        this,
        "location",
        this.locations,
        "selectedLocation",
        "uuid",
        "name"
      );
      searchUtil.setDropDownValue(
        this,
        "employee_uuid",
        this.employees,
        "selectedEmployee",
        "uuid",
        "displayname"
      );
      searchUtil.setDropDownValue(
        this,
        "project",
        this.projects,
        "selectedProject",
        "uuid",
        "name"
      );
    },

    setLocation() {
      this.search.customFilters.location = this.selectedLocation.uuid;
      this.displayValues.location = this.selectedLocation.name;
    },
    setProject() {
      this.search.customFilters.project = this.selectedProject.uuid;
      this.displayValues.project = this.selectedProject.name;
    },
    onSelectPeriod(period) {
      const periodKeys = PeriodUtil.processFilterChanges(period);
      periodKeys.forEach((filter) => {
        this.search.defaultFilters[filter.key] = filter.value;
        this.displayValues[filter.key] = filter.displayValue;
      });
    },
    reset() {
      this.search = {
        defaultFilters: {},
        customFilters: {},
      };
    },
    closeDialog() {
      this.reset();
      this.close(false);
    },
  },
  components: {
    periodSelect,
  },
});
</script>
<style scoped>
.padding0 {
  padding: 0px !important;
}
</style>