
<template>

  <Dialog
    v-if="display"
    :header="$t('TREE.CELLULE')"
    position="top"
    :style="{ width: '30vw' }"
    :modal="true"
    :visible="display"
    footer="Footer"
  >
  <form @submit.prevent="submit()">
    <div class="grid">
      <div class="col-12" style="margin-top: 5px">
        <div class="p-flield">
          <label
            for="name"
            :class="{ 'p-error': validationErrors.name && submitted }"
          >
            {{ $t("FORM.LABELS.NAME") }}
          </label>

          <InputText
            id="name"
            v-on:input="validate()"
            v-model="selectedCellule.name"
            :class="{
              'p-invalid': validationErrors.name && submitted,
            }"
          />
          
        </div>
        </div>
        <div class="col-12" style="margin-top: 5px">
        <div class="p-field">
            <label
              for="sevice"
              :class="{ 'p-error': validationErrors.service && submitted }"
            >
              {{ $t("TREE.TOWN") }}
            </label>

            <Dropdown
              id="service"
              v-model="selectedTown"
              @change="setTown()"
              :options="towns"
              optionLabel="name"
              :class="{
                'p-invalid': validationErrors.service && submitted,
              }"
            />
          </div>

          </div>
          <div class="col-12" style="margin-top: 5px">
        
          <div class="p-field">
            <label for="creation_date"
            :class="{
              'p-error': validationErrors.creation_date && submitted,
            }"
            >
              {{ $t("FORM.LABELS.CREATED_AT") }}
            </label>
          </div>
            <Calendar
              id="creation_date"
              v-model="selectedCellule.creation_date"
              :showButtonBar="true"
              :maxDate="new Date()"
              @date-select="validate()"
              :showIcon="true"
              placeholder="dd/mm/yyyy"
              dateFormat="dd/mm/yy"
            />
          
    
          
      </div>
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
        :label="$t('FORM.BUTTONS.SAVE')"
      />
    </template>
  </Dialog>
</template>

<script>
import { defineComponent } from "vue";

import celluleService from "./cellule.service";
import TownService from "../town/town.service";
import NotifyService from "../../service/Notify.service";
import util from "../../service/util";

export default defineComponent({
  number: "CreateUpdateModal",
  props: {
    cellule: Object,
    close: {
      type: Function,
      default: ()=> {},
    },
    display: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      items: [],
      towns:[],
      selectedCellule: {},
      selectedTown: {},
      validationErrors: {},
      submitted: false,
      loading: false
    };
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
      this.selectedCellule = {};
      this.close(false);
    },
    setTown() {
      this.selectedCellule.town_id = this.selectedTown.id;
      this.validate();
    },
    submit() {

      if(this.loading) return;
      this.submitted = true;
      const isValid = this.validate();
      if (!isValid) {
        NotifyService.danger(
          this,
          "",
          "FORM.ERRORS.INVALID"
        );
        return;
      }
      this.loading = true;
      const formated = this.selectedCellule;
      // formated.creation_date = util.formatDate(formated.creation_date, 'YYYY-MM-DD');
      const operation = this.cellule.uuid
        ? celluleService.update(this.cellule.uuid, formated)
        : celluleService.create(formated);

      operation
        .then(() => {
          NotifyService.success(this, "", null);
          this.selectedCellule = {};
          this.close(true);
        })
        .catch((e) => {
          console.log(e);
           NotifyService.danger(this, "", null);
        }).finally(() => {
          this.loading = false;
        })
    },
    async find() {
      this.selectedTown = {};
      this.towns = await TownService.read();

      if (!this.cellule.uuid) return;
      celluleService.read(this.cellule.uuid).then((cel) => {

        cel.creation_date = cel.creation_date ? new Date(cel.creation_date): null; 
        this.selectedCellule = cel;
        this.towns.forEach(t=> {
          if(t.id === cel.town_id) {
            this.selectedTown = t;
          }
        });
      });
    },
    validate() {
      if (!this.submitted) return;
      if (this.selectedCellule.name) {
        delete this.validationErrors.name;
      } else {
        this.validationErrors.name = true;
      }
      return Object.keys(this.validationErrors).length === 0;
    },
  },
});
</script>