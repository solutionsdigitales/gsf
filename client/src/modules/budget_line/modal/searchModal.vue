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
                <label for="entity_code">{{ $t("PRF.LINE.ENTITY_CODE") }}</label>
                <InputText
                  id="entity_code"
                  class="col-12"
                  v-model="search.customFilters.entity_code"
                />
              </div>
              <br />
               <div class="p-field">
                <label for="loc">{{ $t("PRF.LINE.LOC") }}</label>
                <InputText
                  id="loc"
                  class="col-12"
                  v-model="search.customFilters.loc"
                />
              </div>
             
              <br />
              <div class="p-field">
                <label for="reference">{{ $t("PRF.LINE.FUNDING_SOURCE") }}</label>
                <InputText
                  id="funding_source"
                  class="col-12"
                  v-model="search.customFilters.funding_source"
                />
              </div>
              <br />
                <div class="p-field">
                <label for="project">
                  {{ $t("TREE.PROJECT") }}
                </label>
                <Dropdown
                  inputId="project"
                  :filter="true"
                  style="padding: 2px"
                  class="col-12"
                  v-model="selectedProject"
                  @change="setProject()"
                  :options="projects"
                  optionLabel="name"
                >
                  <template #option="slotProps">
                    <span>
                      {{ slotProps.option.code }} - {{ slotProps.option.name }}
                    </span>
                  </template>
                </Dropdown>
              </div>
               <br />
              <div class="p-field">
                <label for="location">
                  {{ $t("PRF.LINE.OFFICE") }}
                </label>
                <Dropdown
                  inputId="location"
                  :filter="true"
                  class="col-12"
                  style="padding: 2px"
                  v-model="selectedLocation"
                  @change="setLocation()"
                  :options="locations"
                  optionLabel="name"
                />
              </div>
              <br />
              <div class="p-field">
                <label for="function_code">{{ $t("PRF.LINE.FUNCTION_CODE") }}</label>
                <InputText
                  id="function_code"
                  class="col-12"
                  v-model="search.customFilters.function_code"
                />
              </div>
              <br/>
              <div class="p-field">
                <label for="sub_project">{{ $t("PRF.LINE.SUB_PROJECT") }}</label>
                <InputText
                  id="sub_project"
                  class="col-12"
                  v-model="search.customFilters.sub_project"
                />
              </div>
              <br/>


               <div class="p-field">
                <label for="activity">{{ $t("PRF.LINE.ACTIVITY") }}</label>
                <InputText
                  id="activity"
                  class="col-12"
                  v-model="search.customFilters.activity"
                />
              </div>
              
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
import OfficeService from "../../location/office.service";
import ProjectService from "../../project/project.service";

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
  mounted() {
    this.getLocations();
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
         'entity_code',"reporting_office",
         "project", 'activity', 'loc',
        'function_code', 'sub_project', 'funding_source'
      ];

      searchUtil.setFilters(this, _defaults, "defaultFilters");
      searchUtil.setFilters(this, _customs, "customFilters");

      searchUtil.setDropDownValue(
        this,
        "reporting_office",
        this.locations,
        "selectedLocation",
        "code",
        "name"
      );
      searchUtil.setDropDownValue(
        this,
        "project",
        this.projects,
        "selectedProject",
        "code",
        "name"
      );
    },

    getLocations() {
      OfficeService.read().then((locs) => {
        this.locations = locs;
      });
      ProjectService.read().then((p) => {
        this.projects = p;
      });
    },
    setLocation() {
      const { code, name } = this.selectedLocation;
      this.search.customFilters.reporting_office = code;
      this.displayValues.reporting_office = name;
    },
    setProject() {
      const { code, name } = this.selectedProject;
      const shortName = this.selectedProject.short_name;
      this.search.customFilters.project = code;
      this.displayValues.project = `${code} - ${shortName || name}`;
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
      this.selectedLocation = {};
      this.selectedProject = {};
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