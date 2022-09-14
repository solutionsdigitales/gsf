
<template>
  <Dialog
    v-if="display"
    :header="$t('TREE.MEMBERS')"
    :closable="false"
    position="top"
    :style="{ width: '60vw' }"
    :modal="true"
    :visible="display"
    footer="Footer"
  >
    <form @submit.prevent="submit()" class="p-fluid">
      <div class="grid">
        <div class="col-12 lg:col-6 xl:col-6" style="margin-top: 15px">

        <div class="p-field">
          <label
            for="lastname"
            class="label-required"
            :class="{ 'p-error': validationErrors.lastname && submitted }"
          >
            {{ $t("FORM.LABELS.NAME") }}
          </label>

          <InputText
            id="lastname"
            v-on:input="validate()"
            v-model="selectedMember.lastname"
            :class="{
              'p-invalid': validationErrors.lastname && submitted,
            }"
          />
        </div>

        <div class="p-field">
          <label
            for="middlename"
            :class="{ 'p-error': validationErrors.middlename && submitted }"
          >
            {{ $t("FORM.LABELS.MIDDLE_NAME") }}
          </label>

          <InputText
            id="middlename"
            v-on:input="validate()"
            v-model="selectedMember.middlename"
          />
        </div>

        <div class="p-field">
          <label
            for="firstname"
            class="label-required"
            :class="{ 'p-error': validationErrors.firstname && submitted }"
          >
            {{ $t("FORM.LABELS.FIRST_NAME") }}
          </label>

          <InputText
            id="firstname"
            v-on:input="validate()"
            v-model="selectedMember.firstname"
            :class="{
              'p-invalid': validationErrors.firstname && submitted,
            }"
          />
        </div>

        <div class="p-field">
          <label
            for="gender"
            class="label-required"
            :class="{ 'p-error': validationErrors.gender && submitted }"
          >
            {{ $t("FORM.LABELS.GENDER") }}
          </label>
          <Dropdown
            id="gender"
            v-model="selectedGender"
            @change="setGender()"
            :options="genders"
            optionLabel="id"
            :class="{
              'p-invalid': validationErrors.gender && submitted,
            }"
          />
        </div>

        <div class="p-field">
          <label for="phone">
            {{ $t("FORM.LABELS.PHONE") }}
          </label>

          <InputText
            id="phone"
            v-on:input="validate()"
            v-model="selectedMember.phone"
            :class="{
              'p-invalid': validationErrors.phone && submitted,
            }"
          />
        </div>

        </div>
      <div class="col-12 lg:col-6 xl:col-6" style="margin-top: 15px">
        <div class="p-field">
          <label for="address" class="label-required">
            {{ $t("FORM.LABELS.ADDRESS") }}
          </label>

          <InputText
            id="address"
            v-on:input="validate()"
            v-model="selectedMember.address"
            :class="{
              'p-invalid': validationErrors.address && submitted,
            }"
          />
        </div>

        <div class="p-field">
            <label
              for="town_id"
              :class="{ 'p-error': validationErrors.town_id && submitted }"
            >
              {{ $t("TREE.TOWN") }}
            </label>

            <Dropdown
              id="town_id"
              v-model="selectedTown"
              @change="setTown()"
              :options="towns"
              :filter="true"
              optionLabel="name"
              :class="{
                'p-invalid': validationErrors.town_id && submitted,
              }"
            />
          </div>
        
        <div class="p-field">
          <label
            for="profession"
          >
            {{ $t("FORM.LABELS.PROFESSION") }}
          </label>

          <InputText
            id="profession"
            v-on:input="validate()"
            v-model="selectedMember.profession"
          />
        </div>

        <div class="p-field">
          <label
            for="cellule_uuid"
            :class="{ 'p-error': validationErrors.cellule_uuid && submitted }"
          >
            {{ $t("TREE.CELLULE") }}
          </label>

          <Dropdown
            id="cellule_uuid"
            v-model="selectedCellule"
            @change="setCellule()"
            :options="cellules"
            :filter="true"
            optionLabel="name"
            :class="{
              'p-invalid': validationErrors.cellule_uuid && submitted,
            }"
          />
        </div>

        
          <div class="p-field">
            <label for="joining_date"
            :class="{
              'p-error': validationErrors.joining_date && submitted,
            }"
            >
              {{ $t("FORM.LABELS.JOINING_DATE") }}
            </label>

            <Calendar
              id="joining_date"
              v-model="selectedMember.joining_date"
              :showButtonBar="true"
              :maxDate="new Date()"
              @date-select="validate()"
              :showIcon="true"
              placeholder="dd/mm/yyyy"
              dateFormat="dd/mm/yy"
            />
          </div>
      </div>
      </div>
    </form>
    <template #footer>
      <Button
        :label="$t('FORM.BUTTONS.CANCEL')"
        @click="closeDialog"
        class="p-button-text"
      />
      <Button
        type="submit"
        @click="submit"
        :label="
          selectedMember.uuid
            ? $t('FORM.BUTTONS.UPDATE')
            : $t('FORM.BUTTONS.SAVE')
        "
      />
    </template>
  </Dialog>
</template>

<script>
import { defineComponent } from "vue";

import MemberService from "./member.service";
import TownService from "../town/town.service";
import CelluleService from "../cellule/cellule.service";
import NotifyService from "../../service/Notify.service";

export default defineComponent({
  name: "CreateUpdateModal",
  props: {
    member: Object,
    close: Function,
    display: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      items: [],
      cellules: [],
      genders: [{ id: "M" }, { id: "F" }],
      selectedMember: {},
      selectedCellule: {},
      selectedTown: {},
      validationErrors: {},
      submitted: false,
      selectedGender: null,
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
      this.selectedMember = {};
      this.close(false);
    },
    setGender() {
      this.selectedMember.gender = this.selectedGender.id;
    },
     setTown() {
      this.selectedMember.town_id = this.selectedTown.id;
      this.validate();
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
      const operation = this.member.uuid
        ? MemberService.update(this.member.uuid, this.selectedMember)
        : MemberService.create(this.selectedMember);

      operation
        .then(() => {
          NotifyService.success(this, "", null);
          this.selectedMember = {};
          this.close(true);
        })
        .catch(() => {
          NotifyService.danger(this, "", null);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    async find() {
      this.selectedMember = {};
      this.towns = await TownService.read();
      const _cellules = await CelluleService.read();
      this.cellules = _cellules.map(c => {
        c.name = `${c.number} - ${c.name}`;
        return c;
      })
      if (!this.member.uuid) return;
      MemberService.read(this.member.uuid).then((member) => {
        member.joining_date = new Date(member.joining_date);
        this.selectedGender = { id : member.gender};
        this.selectedMember = member;
         this.towns.forEach(t=> {
          if(t.id === member.town_id) {
            this.selectedTown = t;
          }
        });
         this.cellules.forEach(c=> {
          if(c.uuid === member.cellule_uuid) {
            this.selectedCellule = c;
          }
        });
       
      });
    },
    setCellule() {
      this.selectedMember.cellule_uuid = this.selectedCellule.uuid;
      this.validate();
    },
    validate() {
      if (!this.submitted) return;
      const fields = ["lastname",
       "firstname", 'gender', "address", "cellule_uuid", 'town_id', 'joining_date'];
      fields.forEach((field) => {
        if (this.selectedMember[field]) {
          delete this.validationErrors[field];
        } else {
          this.validationErrors[field] = true;
        }
      });

      return Object.keys(this.validationErrors).length === 0;
    },
  },
});
</script>