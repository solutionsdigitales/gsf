<template>
  <div class="col-p12 card page-body">
    <div style="float: right; width: 400px">
      <Button
        v-on:click="onenSearchModal()"
        :label="$t('FORM.BUTTONS.SEARCH')"
        icon="pi pi-search"
      />
      <Button
        v-on:click="Add()"
        :label="$t('FORM.BUTTONS.ADD')"
        icon="pi pi-plus"
      />

      <Button
        v-on:click="downloadExcel()"
        class="p-button-secondary"
        :label="$t('FORM.BUTTONS.EXPORT')"
        icon="pi pi-file-excel"
      />
    </div>
    <br />
    <br />
    <div style="height: calc(73vh)">
      <DataTable
        @rowSelect="onRowSelect"
        :value="members"
        showGridlines
        stripedRows
        filterDisplay="row"
        v-model:filters="filter2"
        v-model:selection="selectedMember"
        dataKey="uuid"
        :resizableColumns="true"
        :scrollable="true"
        columnResizeMode="fit"
        scrollHeight="flex"
        responsiveLayout="scroll"
        :loading="loading"
      >
        <template #header>
          {{ $t("TREE.MEMBERS") }}
          <div class="col-12 noLeft">
            <bhFilters
              :filters="latestViewFilters"
              @onRemoveFilter="onRemoveFilter"
            >
            </bhFilters>
          </div>
        </template>

        <template #empty>
          {{ $t("FORM.SELECT.EMPTY") }}
        </template>

        <Column selectionMode="single" style="max-width: 20px"></Column>
        <Column field="number" :header="$t('FORM.LABELS.NUMBER')">
          <template #body="{ data }">
            {{ data.number }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              type="text"
              v-model="filterModel.value"
              @input="filterCallback()"
              class="p-column-filter"
              placeholder="Recherche par numéro"
            />
          </template>
        </Column>
        <Column
          field="fullname"
          :header="$t('FORM.LABELS.LAST_NAME')"
          style="min-width: 250px"
        >
          <template #body="{ data }">
            {{ data.fullname }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              type="text"
              v-model="filterModel.value"
              @input="filterCallback()"
              class="p-column-filter"
              placeholder="Recherche par noms"
            />
          </template>
        </Column>
        <Column field="gender" :header="$t('FORM.LABELS.GENDER')"></Column>
        <Column field="address" :header="$t('FORM.LABELS.ADDRESS')"></Column>
        <Column
          field="profession"
          :header="$t('FORM.LABELS.PROFESSION')"
        ></Column>
        <Column field="town_id" :header="$t('TREE.TOWN')"></Column>
        <Column field="phone" :header="$t('FORM.LABELS.PHONE')"></Column>
        <Column field="email" :header="$t('FORM.LABELS.EMAIL')"></Column>
        <Column field="cellule" :header="$t('TREE.CELLULE')">
          <template #body="e">
            <span>{{ e.data.cellule }}</span>
          </template>

          <template #filter="{ filterModel, filterCallback }">
            <InputText
              type="text"
              v-model="filterModel.value"
              @input="filterCallback()"
              class="p-column-filter"
              placeholder="Recherche par cellule"
            />
          </template>
        </Column>

        <Column field="action" header="Action" style="width: 100px">
          <template #body="e">
            <memberActions
              :entity="e.data"
              v-on:reloadMemberRegistry="getMembers()"
            />
          </template>
        </Column>
      </DataTable>

      <CreateUpdateModal
        :member="member"
        ref="addmemberModal"
        :close="closeDialog"
        :display="displayCreateModal"
      >
      </CreateUpdateModal>
      <SearchModal
        :filters="latestViewFilters"
        :display="displaySearchModal"
        :close="closeModal"
      >
      </SearchModal>
    </div>
    <div>{{ members.length }} {{ $t("FORM.INFO.ROWS") }}</div>
  </div>
</template>

<script>
import MemberService from "./member.service";
import { FilterMatchMode } from "primevue/api";
import memberActions from "./actions";
import bhFilters from "../../components/filters.vue";
import CreateUpdateModal from "./createUpdateModal";
import AppCache from "../../service/appCache";
import UtilService from "../../service/util";
import SearchModal from "./modal/searchModal.vue";

export default {
  data() {
    return {
      members: [],
      member: {},
      items: [],
      server: "",
      selectedMember: null,
      displayCreateModal: false,
      loading: false,
      lang: "fr",
      displaySearchModal: false,
      cashKey: 'memberList',
      latestViewFilters: {},
      filters: [],
      filter2: {
        fullname: { value: null, matchMode: FilterMatchMode.CONTAINS },
        number: { value: null, matchMode: FilterMatchMode.CONTAINS },
        cellule: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
    };
  },
  created() {
    const cache = AppCache.get("session") || {};
    this.server = this.$store.state.server;
    this.lang = this.$i18n.locale;
    const searchParams = Object.keys(this.$route.params);
    this.lang = this.$i18n.locale;
    this.filters = MemberService.filters;
    this.latestViewFilters = this.filters.formatView();

    if (cache.token) {
      if (searchParams.length > 0) {
        this.filters._resetCustomFilters();
        this.filters.updateKeys(
          this,
          "latestViewFilters",
          JSON.parse(this.$route.params.filters),
          () => {
            this.getMembers();
            this.filters.cachFilters(this.cashKey);
          }
        );
      } else {
        this.filters.loadCache(this, "latestViewFilters", this.cashKey, () => {
          this.getMembers();
        });
      }
    } else {
      this.$router.push("/auth");
    }
  },
  methods: {
    getMembers() {
      this.loading = true;
      const params = this.filters.formatHTTP(true) || {};
      MemberService.read(null, params)
        .then((members) => {
          this.members = members.map((m) => {
            m.fullname = `${m.lastname} ${m.middlename || ""} ${m.firstname}`;
            m.cellule = `${m.cellule_number} - ${m.cellule_name}`;
            return m;
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onRowSelect($event) {
      console.log($event.data);
    },
    Add() {
      this.displayCreateModal = true;
      this.member = {};
    },
     onRemoveFilter(filter) {
      this.filters.resetFilterState(filter._key);
      this.latestViewFilters = this.filters.formatView();
      this.filters.cachFilters(this.cashKey);
      return this.getMembers();
    },
    closeModal(changes) {
      this.displaySearchModal = false;
      if (!changes) return;
      this.filters.updateKeys(this, "latestViewFilters", changes, () => {
        this.getMembers();
        this.filters.cachFilters(this.cashKey);
      });
    },
    closeDialog(result) {
      if (result) {
        this.getMembers();
      }
      this.displayCreateModal = false;
    },
    onenSearchModal() {
      this.displaySearchModal = true;
    },

    downloadExcel() {
      const uri = `${this.server}members/download/excel?lang=${this.lang}`;
      UtilService.downloadURI(uri);
    },
    toggleAction(event) {
      this.$refs.cm.show(event.originalEvent);
      this.items = [
        {
          label: "delete",
          icon: "pi pi-check",
          command: () => {},
        },
      ];
    },
  },
  components: {
    memberActions,
    CreateUpdateModal,
    bhFilters,
    SearchModal,
  },
};
</script>
