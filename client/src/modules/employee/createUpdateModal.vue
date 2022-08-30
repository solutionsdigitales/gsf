<template>
  <Dialog
    v-if="display"
    :header="$t('TREE.EMPLOYEE')"
    :closable="false"
    position="top"
    :style="{ width: '60vw' }"
    :modal="true"
    :visible="display"
    footer="Footer"
  >
    <form @submit.prevent="submit()" class="p-fluid">
      <div class="grid">
        <div class="col-12 lg:col-6 xl:col-6">
          <div class="p-field">
            <label
              for="displayname"
              class="label-required"
              :class="{ 'p-error': validationErrors.displayname && submitted }"
            >
              {{ $t("FORM.LABELS.NAME") }}
            </label>
            <InputText
              id="displayname"
              v-on:input="validate()"
              v-model="selectedEmployee.displayname"
              :class="{
                'p-invalid': validationErrors.displayname && submitted,
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
              optionLabel="label"
              :class="{
                'p-invalid': validationErrors.gender && submitted,
              }"
            />
          </div>

          <div class="p-field">
            <label for="dob">
              {{ $t("FORM.LABELS.DOB") }}
            </label>

            <Calendar
              id="dob"
              v-model="selectedEmployee.dob"
              :showButtonBar="true"
              :maxDate="new Date()"
              @date-select="validate()"
              :showIcon="true"
              placeholder="dd/mm/yyyy"
              dateFormat="dd/mm/yy"
            />
          </div>

          <div class="p-field">
            <label for="phone">
              {{ $t("FORM.LABELS.PHONE") }}
            </label>

            <InputText
              id="phone"
              v-on:input="validate()"
              v-model="selectedEmployee.phone"
              :class="{
                'p-invalid': validationErrors.phone && submitted,
              }"
            />
          </div>

          <div class="p-field">
            <label
              for="email"
              class="label-required"
              :class="{ 'p-error': validationErrors.email && submitted }"
            >
              {{ $t("FORM.LABELS.EMAIL") }}
            </label>

            <InputText
              id="email"
              v-on:input="validate()"
              v-model="selectedEmployee.email"
              :class="{
                'p-invalid': validationErrors.email && submitted,
              }"
            />
          </div>

          <div class="p-field">
            <label
              for="address"
              :class="{ 'p-error': validationErrors.address && submitted }"
            >
              {{ $t("FORM.LABELS.ADDRESS") }}
            </label>

            <InputText
              id="address"
              v-on:input="validate()"
              v-model="selectedEmployee.address"
              :class="{
                'p-invalid': validationErrors.address && submitted,
              }"
            />
          </div>

          <div class="p-field">
            <label
              for="location"
              class="label-required"
              :class="{ 'p-error': validationErrors.location && submitted }"
            >
              {{ $t("TREE.LOCATION") }}
            </label>
            <Dropdown
              id="location"
              :filter="true"
              v-model="selectedLocation"
              @change="setLocation()"
              :options="locations"
              optionLabel="name"
              :class="{
                'p-invalid': validationErrors.office_uuid && submitted,
              }"
            />
          </div>
          <div class="p-field">
            <label
              for="projects"
              :class="{ 'p-error': validationErrors.projects && submitted }"
            >
              {{ $t("TREE.PROJECT") + "s" }}
            </label>
            <MultiSelect
              id="projects"
              v-model="selectedProjects"
              :options="projects"
              @change="validate()"
              optionLabel="name"
              :placeholder="$t('PRF.SELECT_PROJECT')"
              :filter="true"
            >
            </MultiSelect>
          </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-6">
          <div class="p-field">
            <label for="position" class="label-required">
              {{ $t("FORM.LABELS.POSITION") }}
            </label>

            <InputText
              id="position"
              v-on:input="validate()"
              v-model="selectedEmployee.position"
              :class="{
                'p-invalid': validationErrors.position && submitted,
              }"
            />
          </div>

          <div class="p-field">
            <label
              for="grade"
              :class="{ 'p-error': validationErrors.grade && submitted }"
            >
              {{ $t("FORM.LABELS.GRADE") }}
            </label>

            <InputText
              id="grade"
              v-on:input="validate()"
              v-model="selectedEmployee.grade"
              :class="{
                'p-invalid': validationErrors.grade && submitted,
              }"
            />
          </div>

          <div class="p-field">
            <label
              for="sevice"
              :class="{ 'p-error': validationErrors.service && submitted }"
            >
              {{ $t("FORM.LABELS.SERVICE") }}
            </label>

            <Dropdown
              id="service"
              v-model="selectedService"
              @change="setService()"
              :options="services"
              optionLabel="name"
              :class="{
                'p-invalid': validationErrors.service && submitted,
              }"
            />
          </div>

          <div class="p-field">
            <label
              for="category"
              class="label-required"
            >
              {{ $t("TREE.CATEGORY") }}
            </label>
            <Dropdown
              id="category"
              :filter="true"
              v-model="selectedCategory"
              @change="setCategory()"
              :options="categories"
              optionLabel="name"
            />
          </div>
          <br />
          <div class="p-field-checkbox">
            <Checkbox
              id="is_expatriate"
              :binary="true"
              name="is_expatriate"
              v-model="selectedEmployee.is_expatriate"
            />
            <label class="link" for="is_expatriate">
              {{ $t("PRF.IS_EXPATRIATE") }}
            </label>
          </div>

          <br />
          <div class="p-field-checkbox link">
            <Checkbox
              id="is_budget_holder"
              :binary="true"
              name="is_budget_holder"
              v-model="selectedEmployee.is_budget_holder"
            />
            <label id="is_budget_holderLabel" for="is_budget_holder">
              {{ $t("PRF.IS_BUDGET_HOLDER") }}
            </label>
          </div>

          <div class="authInfo">
            {{ $t("FORM.LABELS.AUTHENTIFICATION_INFO") }}
          </div>
          <div class="col-p12">
            <div class="p-field">
              <label
                for="userName"
                class="label-required"
                :class="{ 'p-error': validationErrors.name && submitted }"
              >
                {{ $t("FORM.LABELS.USERNAME") }}
              </label>
              <InputText
                id="userName"
                v-on:input="validate()"
                v-model="selectedUser.name"
                :class="{
                  'p-invalid': validationErrors.name && submitted,
                }"
              />
            </div>
          </div>

          <div class="col-p12" v-if="!selectedEmployee.user_id">
            <div class="p-field">
              <label
                for="password"
                class="label-required"
                :class="{
                  'p-error': validationErrors.password && submitted,
                }"
                >{{ $t("FORM.LABELS.PASSWORD") }}</label
              >

              <Password
                id="password"
                v-model="selectedUser.pwd"
                :feedback="false"
                v-on:input="validate()"
                :class="{
                  'p-invalid': validationErrors.password && submitted,
                }"
                toggleMask
              >
              </Password>
            </div>
          </div>

          <div class="authInfo">
            {{ $t("VOUCHERS.DOCUMENTS_ACCESS") }}
          </div>
          <div class="p-field">
            <label
              for="projectsAccess"
              :class="{ 'p-error': validationErrors.projects && submitted }"
            >
              {{ $t("TREE.PROJECT") + "s" }}
            </label>
            <MultiSelect
              id="projectsAccess"
              v-model="selectedProjectsAccess"
              :options="projects"
              @change="validate()"
              optionLabel="name"
              :placeholder="$t('PRF.SELECT_PROJECT')"
              :filter="true"
            >
            </MultiSelect>
          </div>
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
        @click="submit()"
        :label="
          selectedEmployee.uuid
            ? $t('FORM.BUTTONS.UPDATE')
            : $t('FORM.BUTTONS.SAVE')
        "
      />
    </template>
  </Dialog>
</template>


<script>
import { defineComponent } from "vue";
import GenderService from "./gender.service";
import serviceService from "../service/service.service";
import divisionService from "../division/division.service";
import EmployeeService from "./employee.service";
import UserService from "../user/user.service";
import NotifyService from "../../service/Notify.service";
import UtilService from "../../service/util";
import OfficeService from "../location/office.service";
import ProjectService from "../project/project.service";

export default defineComponent({
  name: "CreateUpdateModal",
  props: {
    employee: Object,
    close: Function,
    display: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      items: [],
      selectedEmployee: {},
      selectedUser: {},
      selectedGender: {},
      selectedCategory: {},
      selectedProjects: [],
      selectedProjectsAccess: [],
      selectedLocation: {},
      selectedService: {},
      selectedDivision: {},
      validationErrors: {},
      submitted: false,
      genders: [],
      projects: [],
      locations: [],
      services: [],
      categories: [],
      divisions: [],
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
      this.selectedEmployee = {};
      this.selectedGender = {};
      this.selectedLocation = {};
      this.selectedProjects = [];
      this.selectedProjectsAccess = [];
      this.submitted = false;
      this.close(false);
    },
    submit() {
      if (this.loading) return;
      this.submitted = true;
      const isValid = this.validate();
      if (!isValid) {
        NotifyService.danger(this, "", "FORM.ERRORS.INVALID");
        return;
      }
      const formated = Object.assign({}, this.selectedEmployee);
      if (formated.dob) {
        formated.dob = UtilService.formatDate(formated.dob);
      }

      this.loading = true;
      const _projects = [].concat(this.selectedProjects).map((p) => p.uuid);

      const _projectsAccess = []
        .concat(this.selectedProjectsAccess)
        .map((p) => p.uuid);
      const operation = this.employee.uuid
        ? EmployeeService.update(this.employee.uuid, {
            employee: formated,
            user: this.selectedUser,
            projects: _projects,
            projectsAccess: _projectsAccess,
          })
        : EmployeeService.create({
            employee: formated,
            user: this.selectedUser,
            projects: _projects,
            projectsAccess: _projectsAccess,
          });

      operation
        .then(() => {
          NotifyService.success(this, "", null);
          this.selectedEmployee = {};
          this.close(true);
        })
        .catch(() => {
          NotifyService.danger(this, "", null);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onInputChange(change) {
      this.selectedEmployee[change.uuid] = change.value;
    },
    find() {
      this.selectedService = {};
      this.selectedGender = {};
      this.selectedLocation = {};
      let employeeProjects = [];
      let employeeProjectsAccess = [];

      EmployeeService.categories
        .read()
        .then((cats) => {
          this.categories = cats.map(c => {
            c.name = this.$t(c.translation_key);
            return c; 
          });
          return ProjectService.read();
        })
        .then((projects) => {
          this.projects = projects;
          return OfficeService.read();
        })
        .then((locations) => {
          this.locations = locations;
          return divisionService.read();
        })
        .then((divisions) => {
          this.divisions = divisions;
          return serviceService.read();
        })
        .then((services) => {
          this.services = services;
          return EmployeeService.projects(this.employee.uuid);
        })
        .then((_projects) => {
          employeeProjects = _projects;
          return EmployeeService.voucherAccess(this.employee.uuid);
        })
        .then((_projectAcces) => {
          employeeProjectsAccess = _projectAcces;
          return GenderService.read();
        })
        .then((genders) => {
          this.genders = genders.map((g) => {
            g.label = this.$t(g.label);
            return g;
          });

          if (this.employee.uuid) {
            return EmployeeService.read(this.employee.uuid);
          } else {
            return new Promise(
              () => {},
              () => {}
            );
          }
        })
        .then((e) => {
          if (e.dob) {
            e.dob = new Date(e.dob);
          }
          this.selectedEmployee = e;

          this.selectedEmployee.is_expatriate = !!e.is_expatriate;
          this.selectedEmployee.is_budget_holder = !!e.is_budget_holder;
          this.getUser(e.user_id);

          this.locations.forEach((loc) => {
            if (loc.uuid === e.office_uuid) {
              this.selectedLocation = loc;
            }
          });

          this.selectedProjects = [];
          this.selectedProjectsAccess = [];

          this.projects.forEach((p) => {
            employeeProjects.forEach((ep) => {
              if (ep.uuid === p.uuid) {
                this.selectedProjects.push(p);
              }
            });
            employeeProjectsAccess.forEach((ep) => {
              if (ep.uuid === p.uuid) {
                this.selectedProjectsAccess.push(p);
              }
            });
          });

          this.categories.forEach(c => {
            if(c.id === e.category_id) {
              this.selectedCategory = c;
            }
          });
          this.genders.forEach((g) => {
            if (g.id === e.gender) {
              this.selectedGender = g;
            }
          });

          this.services.forEach((s) => {
            if (s.uuid === e.service_uuid) {
              this.selectedService = s;
            }
          });

          this.divisions.forEach((d) => {
            if (d.uuid === e.division_uuid) {
              this.selectedDivision = d;
            }
          });
        });
    },

    getUser(id) {
      if (!id) return {};
      UserService.read(id).then((user) => {
        this.selectedUser = user;
      });
    },
    validate() {
      if (!this.submitted) return;

      const requiredCols = [
        "displayname",
        "email",
        "office_uuid",
        "gender",
        "position",
      ];

      requiredCols.forEach((col) => {
        if (this.selectedEmployee[col]) {
          delete this.validationErrors[col];
        } else {
          this.validationErrors[col] = true;
        }
      });

      if (this.selectedUser.name) {
        delete this.validationErrors.name;
      } else {
        this.validationErrors.name = true;
      }

      if (!this.selectedEmployee.user_id) {
        if (this.selectedUser.pwd) {
          delete this.validationErrors.password;
        } else {
          this.validationErrors.password = true;
        }
      }

      return Object.keys(this.validationErrors).length === 0;
    },
    setLocation() {
      this.selectedEmployee.office_uuid = this.selectedLocation.uuid;
      this.validate();
    },
    setCategory() {
      this.selectedEmployee.category_id = this.selectedCategory.id;
      this.validate();
    },
    setGender() {
      this.selectedEmployee.gender = this.selectedGender.id;
      this.validate();
    },
    setProject() {
      this.selectedEmployee.project_uuid = this.selectedProject.uuid;
      this.validate();
    },
    setService() {
      this.selectedEmployee.service_uuid = this.selectedService.uuid;
      this.validate();
    },
    setDivision() {
      this.selectedEmployee.division_uuid = this.selectedDivision.uuid;
      this.validate();
    },
  },
});
</script>
<style scoped>
.p-field {
  padding-top: 20px;
}
.authInfo {
  padding: 10px;
  width: 100%;
  margin-top: 30px;
  background: #ddd;
  text-decoration: underline;
}
</style>
