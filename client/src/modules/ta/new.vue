<template>
  <div>
    <BlockUI :blocked="blockedPage">
      <div class="col-p12 card page-body" v-if="!noEmployee">
        <div class="col-p12 loader1" :hidden="!blockedPage">
          <i class="pi pi-spin pi-spinner" style="font-size: 5rem"></i>
          <br />
          <span>{{ $t("FORM.INFO.LOADING") }}</span>
        </div>
        <div class="grid">
          <div class="col-12 lg:col-8 xl:col-8">
            <h4>{{ $t("TREE.TRAVAL_ADVANCE") }}</h4>
          </div>
          <div class="col-12 lg:col-4 xl:col-4">
            <div style="float: right">
              <span class="link" @click="selectProject()"
                >{{ $t("TREE.PROJECT") }}:
                <b
                  >{{ selectedProject.code }} -{{
                    selectedProject.short_name
                  }}</b
                ></span
              >
            </div>
            <br />
            <div style="float: right">
              <span class="link" @click="selectLocation($event)"
                >{{ $t("PRF.LINE.OFFICE") }}:
                <span
                  class="prf_status"
                  v-if="voucher.status.id"
                  :style="
                    'background:' +
                    voucher.status.bg +
                    ';color:' +
                    voucher.status.color
                  "
                  >{{ currentOffice.name }}</span
                >
              </span>
              <Menu
                ref="voucherStatusMenu"
                :model="voucherStatus"
                :popup="true"
              />
            </div>
          </div>
        </div>
        <hr />
        <h6>1. {{ $t("PRF.REQUESTER_SECTION") }}</h6>
        <div class="p-fluid">
          <div class="grid">
            <div class="col-12 lg:col-12 xl:col-12">
              <div class="p-field">
                <label for="firstname">{{ $t("PRF.REQUESTER") }} :</label>
                <span class="text-primary">
                  {{ applicant.displayname }},
                  {{ applicant.position }}
                </span>
              </div>
            </div>

            <div class="col-12 lg:col-4 xl:col-4">
              <div class="p-field">
                <label class="label-required" for="office">
                  {{ $t("TREE.LOCATION") }}
                </label>
                <Help description="HELP.FONCTION_OFFICE" />
                <Dropdown
                  id="office"
                  v-model="selectedOffice"
                  :options="offices"
                  :disabled="ticketBudgetLines.length > 0"
                  @change="validate()"
                  optionLabel="name"
                  :placeholder="$t('PRF.SELECT_OFFICE')"
                  :filter="true"
                >
                </Dropdown>
              </div>
            </div>

            <div class="col-12 lg:col-4 xl:col-4">
              <div class="p-field">
                <label
                  for="approvers"
                  class="label-required"
                  style="font-size: 14px !important"
                  :class="{
                    'p-error': validationErrors.approvers && submitted,
                  }"
                >
                  {{ $t("PRF.BUDGET_HOLDER_NAME") }}
                </label>

                <MultiSelect
                  id="approvers"
                  v-model="selectedApprovers"
                  :options="approvers"
                  @change="validate()"
                  optionLabel="displayname"
                  :placeholder="$t('PRF.SELECT_APPROVER')"
                  :filter="true"
                  display="chip"
                >
                </MultiSelect>
              </div>
            </div>
          </div>
        </div>
        <h6>2. {{ $t("PRF.DELIVERY_SECTION") }}</h6>
        <div class="p-fluid">
          <div class="grid">
            <div class="col-12 lg:col-4 xl:col-4">
              <div class="p-field">
                <label for="lastname" class="label-required">{{
                  $t("TRAVAL_ADVANCE.PASSENGER_NAME")
                }}</label>
                <InputText
                  id="delivery_recipient"
                  v-model="voucher.delivery.recipient"
                  @input="validate()"
                  :class="{
                    'p-invalid':
                      validationErrors.delivery_recipient && submitted,
                  }"
                />
              </div>

              <div class="p-field">
                <label for="delivery_adress">{{
                  $t("PRF.DELIVERY_ADRESS")
                }}</label>
                <InputText
                  id="delivery_adress"
                  v-model="voucher.delivery.address"
                />
              </div>

              <div class="p-field">
                <label
                  class="label-required"
                  for="delivery_expected_date"
                  :class="{
                    'p-error':
                      validationErrors.delivery_expected_date && submitted,
                  }"
                >
                  {{ $t("VOUCHERS.PAYEMENT_DATE") }}
                </label>

                <Calendar
                  id="delivery_expected_date"
                  v-model="voucher.delivery.expected_date"
                  :showButtonBar="true"
                  @date-select="validate()"
                  :minDate="new Date()"
                  :showIcon="true"
                  placeholder="dd/mm/yyyy"
                  dateFormat="dd/mm/yy"
                />
              </div>
            </div>
            <div class="col-12 lg:col-4 xl:col-4">
              <div class="p-field">
                <label for="delivery_phone">{{
                  $t("FORM.LABELS.PHONE")
                }}</label>
                <InputText
                  id="delivery_phone"
                  v-model="voucher.delivery.phone"
                  @input="validate()"
                  :class="{
                    'p-invalid': validationErrors.delivery_phone && submitted,
                  }"
                />
              </div>

              <div class="p-field">
                <label for="email">{{ $t("FORM.LABELS.EMAIL") }}</label>
                <InputText
                  id="delivery_email"
                  v-model="voucher.delivery.email"
                />
              </div>
            </div>

            <div class="col-12 lg:col-4 xl:col-4">
              <div class="p-field">
                <label for="delivery_note">
                  {{ $t("FORM.INFO.NOTE") }}
                </label>

                <Textarea
                  id="delivery_note"
                  rows="4"
                  v-on:input="validate()"
                  v-model="voucher.delivery.note"
                />
              </div>
            </div>
          </div>
        </div>
        <h6>3. {{ $t("PRF.BUDGET_LINES_SECTION") }}</h6>

        <div class="p-fluid">
          <div class="grid">
            <div class="col-12 lg:col-6 xl:col-6">
              <div class="p-field">
                <label
                  for="transport_mean"
                  class="label-required"
                  :class="{
                    'p-error': validationErrors.transport_mean && submitted,
                  }"
                >
                  {{ $t("PRF.TRANSPORT_MEAN") }}
                </label>
                <br />
                <Dropdown
                  id="transport_mean"
                  v-model="transportMean"
                  :options="transportMeans"
                  @update:modelValue="setTransportMean($event)"
                  optionLabel="label"
                >
                </Dropdown>
              </div>

              <div class="p-field">
                <label for="destinations">{{
                  $t("TRAVAL_ADVANCE.DESTINATIONS")
                }}</label>
                <InputText
                  id="destinations"
                  v-model="travalAdvance.destinations"
                  @input="validate()"
                  :class="{
                    'p-invalid': validationErrors.destinations && submitted,
                  }"
                />
              </div>

              <div class="p-field">
                <label for="itinerary">{{
                  $t("TRAVAL_ADVANCE.ITINERARY")
                }}</label>
                <InputText
                  id="itinerary"
                  v-model="travalAdvance.itinerary"
                  @input="validate()"
                  :class="{
                    'p-invalid': validationErrors.itinerary && submitted,
                  }"
                />
              </div>
            </div>
            <div class="col-12 lg:col-6 xl:col-6">
              <div class="p-field">
                <label for="main_contact">{{
                  $t("TRAVAL_ADVANCE.MAIN_CONTACT")
                }}</label>
                <InputText
                  id="main_contact"
                  v-model="travalAdvance.main_contact"
                  @input="validate()"
                />
              </div>

              <div class="p-field">
                <label for="object">{{ $t("TRAVAL_ADVANCE.OBJECT") }}</label>
                <InputText
                  id="object"
                  v-model="travalAdvance.object"
                  @input="validate()"
                  :class="{
                    'p-invalid': validationErrors.object && submitted,
                  }"
                />
              </div>

              <div class="grid">
                <div class="col-12 lg:col-6 xl:col-6">
                  <div class="p-field">
                    <label
                      for="dateFrom"
                      :class="{ 'p-error': validationErrors.dob && submitted }"
                    >
                      {{ $t("TRAVAL_ADVANCE.DATES") }}
                    </label>
                    <Calendar
                      id="dateFrom"
                      v-model="travalAdvance.date_from"
                      :showButtonBar="true"
                      :showIcon="true"
                      @date-select="validateLines()"
                      dateFormat="dd/mm/yy"
                      :placeholder="$t('TRAVAL_ADVANCE.DATE_FROM')"
                    />
                  </div>
                </div>
                <div
                  class="col-12 lg:col-6 xl:col-6"
                  v-if="travalAdvance.date_from"
                >
                  <div class="p-field">
                    <label
                      for="dateTo"
                      :class="{
                        'p-error': validationErrors.date_to && submitted,
                      }"
                    >
                      {{ $t("FORM.LABELS.DATE_TO") }}
                    </label>
                    <Calendar
                      id="dateTo"
                      v-model="travalAdvance.date_to"
                      :showButtonBar="true"
                      :minDate="travalAdvance.date_from"
                      :showIcon="true"
                      @date-select="validateLines()"
                      dateFormat="dd/mm/yy"
                      :placeholder="$t('TRAVAL_ADVANCE.DATE_TO')"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h6>4. {{ $t("TRAVAL_ADVANCE.PLANE_TICKET") }}</h6>
        <Message
          severity="info"
          v-if="this.travalAdvance.transport_mean !== 'air'"
        >
          {{ $t("TRAVAL_ADVANCE.TRANSPORT_NOTE") }}
        </Message>
        <div
          id="ticket_budget_line_grid"
          v-if="this.travalAdvance.transport_mean === 'air'"
        >
          <DataTable
            :value="ticketBudgetLines"
            dataKey="uuid"
            showGridlines
            editMode="cell"
            class="editable-cells-table"
            responsiveLayout="scroll"
          >
            <template #header>
              <div>
                <Button
                  id="newLine"
                  :label="$t('FORM.BUTTONS.ADD')"
                  @click="addTicketBudgetLine()"
                  icon="pi pi-plus"
                  class="p-button-raised p-button-text"
                />
              </div>
            </template>
            <Column field="status" style="width: 1%; padding: 0px">
              <template #body="e">
                <div class="invalid-line" v-if="!e.data.status">&nbsp;</div>
                <div class="valid-line" v-if="e.data.status">&nbsp;</div>
              </template>
            </Column>

            <Column
              field="percentage"
              :header="$t('FORM.LABELS.PERCENTAGE')"
              style="width: 5%"
            >
              <template #body="e">
                <div class="link text-right">
                  <span v-if="e.data.percentage"
                    >{{ e.data.percentage }} %</span
                  >
                  <span :id="'percentage' + e.index" class="cWhite">.</span>
                </div>
              </template>
              <template #editor="{ data, field, index }">
                <InputNumber
                  :id="'percentage_input' + index"
                  :locale="enterprise.currency_intel_number_format"
                  :minFractionDigits="2"
                  v-model="data[field]"
                  v-on:input="
                    onNumberFieldSave(
                      $event.value,
                      data,
                      field,
                      index,
                      ticketBudgetLines
                    )
                  "
                  style="width: 100%"
                />
              </template>
            </Column>

            <Column
              field="budget_line"
              :header="$t('TREE.BUDGET_LINE')"
              style="width: 20%"
            >
              <template #body="e">
                <div
                  class="link"
                  @click="showBudgetLineModal(e.data, 'ticket')"
                >
                  <span v-if="e.data.budgetLine">{{
                    e.data.budgetLine.description
                  }}</span>
                  <span :id="'BL' + e.index" class="cWhite">.</span>
                </div>
              </template>
            </Column>

            <Column
              field="action"
              header="Action"
              bodyStyle="text-align:center; color:red"
              style="width: 2%"
            >
              <template #body="e">
                <div
                  :id="'removeLine' + e.index"
                  class="link"
                  @click="removeRow(e.data, 'ticket')"
                >
                  <i class="pi pi-trash p-text-danger" />
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
        <!-- -----------------------------------------------------Perdiem section START ----------------------------------------------------------------------------------------->
        <h6>5. {{ $t("VOUCHERS.PERDIEM") }}</h6>
        <Message severity="info">{{ $t("TRAVAL_ADVANCE.NOTE") }}</Message>
        <div id="perdiem_budget_line_grid">
          <DataTable
            :value="perdiemBudgetlines"
            v-model:selection="selectedPerdiemLines"
            dataKey="uuid"
            showGridlines
            editMode="cell"
            class="editable-cells-table"
            responsiveLayout="scroll"
          >
            <template #header>
              <div>
                <Button
                  id="newLine"
                  :label="$t('FORM.BUTTONS.ADD')"
                  @click="addBudgetLine2(perdiemBudgetlines, 'perdiem')"
                  icon="pi pi-plus"
                  class="p-button-raised p-button-text"
                />
              </div>
            </template>
            <Column selectionMode="multiple" style="width: 2%"></Column>
            <Column
              field="status"
              :header="$t('FORM.LABELS.STATUS')"
              style="width: 1%; padding: 0px"
            >
              <template #body="e">
                <div class="invalid-line" v-if="!e.data.status">&nbsp;</div>
                <div class="valid-line" v-if="e.data.status">&nbsp;</div>
              </template>
            </Column>

            <Column
              field="place"
              :header="$t('TRAVAL_ADVANCE.PLACE')"
              style="width: 5%"
            >
              <template #body="e">
                <span>{{ $t(e.data.locationObject.name || "") }}</span>
                <span :id="'place' + e.index" class="cWhite">.</span>
              </template>
              <template #editor="{ data, field, index }">
                <Dropdown
                  :id="'place_input' + index"
                  v-model="data[field]"
                  @change="setLocation(index, data, field, perdiemBudgetlines)"
                  :options="locations"
                  :filter="true"
                  style="width: 100%"
                  placeholder="Select a place"
                  optionLabel="name"
                >
                  <template #option="slotProps">
                    <span>
                      {{ slotProps.option.name }}
                    </span>
                  </template>
                </Dropdown>
              </template>
            </Column>

            <Column
              field="date_from"
              :header="$t('FORM.LABELS.DATE_FROM')"
              style="width: 10%"
            >
              <template #body="e">
                <div class="link">
                  <span>{{ formatDate(e.data.date_from) }}</span>
                  <span :id="'bl_date_from' + e.index" class="cWhite">.</span>
                </div>
              </template>

              <template #editor="{ data, field, index }">
                <Calendar
                  :id="'bl_date_from_input' + index"
                  v-model="data[field]"
                  :showIcon="true"
                  :minDate="travalAdvance.date_from"
                  @date-select="
                    onDateSelect(data, field, index, perdiemBudgetlines)
                  "
                  :showButtonBar="true"
                  placeholder="dd/mm/yyyy"
                  dateFormat="dd/mm/yy"
                />
              </template>
            </Column>

            <Column
              field="date_to"
              :header="$t('FORM.LABELS.DATE_TO')"
              style="width: 10%"
            >
              <template #body="e">
                <div class="link">
                  <span>{{ formatDate(e.data.date_to) }}</span>
                  <span :id="'bl_date_to' + e.index" class="cWhite">.</span>
                </div>
              </template>

              <template #editor="{ data, field, index }">
                <Calendar
                  :id="'bl_date_to_input' + index"
                  v-model="data[field]"
                  :showIcon="true"
                  :minDate="data.date_from"
                  :maxDate="travalAdvance.date_to"
                  @date-select="
                    onDateSelect(data, field, index, perdiemBudgetlines)
                  "
                  :showButtonBar="true"
                  placeholder="dd/mm/yyyy"
                  dateFormat="dd/mm/yy"
                />
              </template>
            </Column>

            <Column
              field="quantity"
              :header="'#' + $t('FORM.LABELS.DAYS')"
              style="width: 5%"
            >
              <template #body="e">
                <div class="text-right">{{ e.data.quantity }}</div>
              </template>
            </Column>

            <Column
              field="unit_price"
              :header="$t('FORM.LABELS.RATE')"
              style="width: 5%"
            >
              <template #body="e">
                <div class="text-right">
                  {{
                    formatCurrency(e.data.unit_price, enterprise.currency_id)
                  }}
                </div>
              </template>
            </Column>

            <Column
              field="total"
              :header="$t('FORM.LABELS.TOTAL')"
              style="width: 5%"
            >
              <template #body="e">
                <div class="text-right">
                  {{ formatCurrency(e.data.total, enterprise.currency_id) }}
                </div>
              </template>
            </Column>
            <Column
              field="budget_line"
              :header="$t('TREE.BUDGET_LINE')"
              style="width: 20%"
            >
              <template #body="e">
                <div
                  class="link"
                  @click="showBudgetLineModal(e.data, 'perdiem')"
                >
                  <span v-if="e.data.budgetLine">{{
                    e.data.budgetLine.description
                  }}</span>
                  <span :id="'BL' + e.index" class="cWhite">.</span>
                </div>
              </template>
            </Column>

            <Column
              field="action"
              header="Action"
              bodyStyle="text-align:center; color:red"
              style="width: 2%"
            >
              <template #body="e">
                <div
                  :id="'removeLine' + e.index"
                  class="link"
                  @click="removeRow(e.data, 'perdiem')"
                >
                  <i class="pi pi-trash p-text-danger" />
                </div>
              </template>
            </Column>

            <ColumnGroup type="footer">
              <Row>
                <Column
                  :footer="''"
                  :colspan="4"
                  footerStyle="text-align:right"
                />
                <Column
                  :footer="
                    $t('VOUCHERS.PERDIEM') +
                    ' Total:  ' +
                    formatCurrency(totalPeridem, 1)
                  "
                  :colspan="3"
                  footerStyle="text-align:right"
                />
                <Column :footer="''" :colspan="3" />
              </Row>
            </ColumnGroup>
          </DataTable>
        </div>
        <!-- -----------------------------------------------------Perdiem section END----------------------------------------------------------------------------------------->
        <!-- -----------------------------------------------------Hosting section ----------------------------------------------------------------------------------------->

        <h6>6. {{ $t("VOUCHERS.HOSTING") }}</h6>
        <div id="hosting_budget_line_grid">
          <DataTable
            :value="hostingBudgetlines"
            v-model:selection="selectedHostingLines"
            dataKey="uuid"
            showGridlines
            editMode="cell"
            class="editable-cells-table"
            responsiveLayout="scroll"
          >
            <template #header>
              <div>
                <Button
                  id="newLine"
                  :label="$t('FORM.BUTTONS.ADD')"
                  @click="addBudgetLine2(hostingBudgetlines, 'hosting')"
                  icon="pi pi-plus"
                  class="p-button-raised p-button-text"
                />
                <Button
                  id="importLines"
                  v-if="perdiemBudgetlines.length > 0"
                  :label="$t('FORM.BUTTONS.IMPORT')"
                  @click="importFromPerdiem()"
                  icon="pi pi-plus"
                  class="p-button-raised p-button-secondary"
                />
              </div>
            </template>
            <Column selectionMode="multiple" style="width: 2%"></Column>
            <Column
              field="status"
              :header="$t('FORM.LABELS.STATUS')"
              style="width: 1%; padding: 0px"
            >
              <template #body="e">
                <div class="invalid-line" v-if="!e.data.status">&nbsp;</div>
                <div class="valid-line" v-if="e.data.status">&nbsp;</div>
              </template>
            </Column>

            <Column
              field="place"
              :header="$t('TRAVAL_ADVANCE.PLACE')"
              style="width: 5%"
            >
              <template #body="e">
                <span>{{ $t(e.data.locationObject.name || "") }}</span>
                <span :id="'place' + e.index" class="cWhite">.</span>
              </template>
              <template #editor="{ data, field, index }">
                <Dropdown
                  :id="'place_input' + index"
                  v-model="data[field]"
                  @change="setLocation(index, data, field, hostingBudgetlines)"
                  :options="locations"
                  :filter="true"
                  style="width: 100%"
                  placeholder="Select a place"
                  optionLabel="name"
                >
                  <template #option="slotProps">
                    <span>
                      {{ slotProps.option.name }}
                    </span>
                  </template>
                </Dropdown>
              </template>
            </Column>

            <Column
              field="date_from"
              :header="$t('FORM.LABELS.DATE_FROM')"
              style="width: 10%"
            >
              <template #body="e">
                <div class="link">
                  <span>{{ formatDate(e.data.date_from) }}</span>
                  <span :id="'bl_date_from' + e.index" class="cWhite">.</span>
                </div>
              </template>

              <template #editor="{ data, field, index }">
                <Calendar
                  :id="'bl_date_from_input' + index"
                  v-model="data[field]"
                  :showIcon="true"
                  :minDate="travalAdvance.date_from"
                  @date-select="
                    onDateSelect(data, field, index, hostingBudgetlines)
                  "
                  :showButtonBar="true"
                  placeholder="dd/mm/yyyy"
                  dateFormat="dd/mm/yy"
                />
              </template>
            </Column>

            <Column
              field="date_to"
              :header="$t('FORM.LABELS.DATE_TO')"
              style="width: 10%"
            >
              <template #body="e">
                <div class="link">
                  <span>{{ formatDate(e.data.date_to) }}</span>
                  <span :id="'bl_date_to' + e.index" class="cWhite">.</span>
                </div>
              </template>

              <template #editor="{ data, field, index }">
                <Calendar
                  :id="'bl_date_to_input' + index"
                  v-model="data[field]"
                  :showIcon="true"
                  :minDate="data.date_from"
                  :maxDate="travalAdvance.date_to"
                  @date-select="
                    onDateSelect(data, field, index, hostingBudgetlines)
                  "
                  :showButtonBar="true"
                  placeholder="dd/mm/yyyy"
                  dateFormat="dd/mm/yy"
                />
              </template>
            </Column>

            <Column
              field="quantity"
              :header="'#' + $t('FORM.LABELS.DAYS')"
              style="width: 5%"
            >
              <template #body="e">
                <div class="text-right">{{ e.data.quantity }}</div>
              </template>
            </Column>

            <Column
              field="unit_price"
              :header="$t('FORM.LABELS.RATE')"
              style="width: 5%"
            >
              <template #body="e">
                <div class="text-right">
                  {{
                    formatCurrency(e.data.unit_price, enterprise.currency_id)
                  }}
                </div>
              </template>
            </Column>

            <Column
              field="total"
              :header="$t('FORM.LABELS.TOTAL')"
              style="width: 5%"
            >
              <template #body="e">
                <div class="text-right">
                  {{ formatCurrency(e.data.total, enterprise.currency_id) }}
                </div>
              </template>
            </Column>
            <Column
              field="budget_line"
              :header="$t('TREE.BUDGET_LINE')"
              style="width: 20%"
            >
              <template #body="e">
                <div
                  class="link"
                  @click="showBudgetLineModal(e.data, 'hosting')"
                >
                  <span v-if="e.data.budgetLine">{{
                    e.data.budgetLine.description
                  }}</span>
                  <span :id="'BL' + e.index" class="cWhite">.</span>
                </div>
              </template>
            </Column>

            <Column
              field="action"
              header="Action"
              bodyStyle="text-align:center; color:red"
              style="width: 2%"
            >
              <template #body="e">
                <div
                  :id="'removeLine' + e.index"
                  class="link"
                  @click="removeRow(e.data, 'hosting')"
                >
                  <i class="pi pi-trash p-text-danger" />
                </div>
              </template>
            </Column>

            <ColumnGroup type="footer">
              <Row>
                <Column
                  :footer="''"
                  :colspan="4"
                  footerStyle="text-align:right"
                />
                <Column
                  :footer="
                    $t('VOUCHERS.HOSTING') +
                    ' Total:  ' +
                    formatCurrency(totalHosting, 1)
                  "
                  :colspan="3"
                  footerStyle="text-align:right"
                />
                <Column :footer="''" :colspan="3" />
              </Row>
            </ColumnGroup>
          </DataTable>
        </div>
        <!-- -----------------------------------------------------Hosting section END ----------------------------------------------------------------------------------------->

        <!-- -----------------------------------------------------Expense section START ----------------------------------------------------------------------------------------->

        <h6>7. {{ $t("TRAVAL_ADVANCE.OTHER_EXPENSES") }}</h6>
        <div id="expense_budget_line_grid">
          <DataTable
            :value="expenseBudgetLines"
            v-model:selection="selectedExpenseLines"
            dataKey="uuid"
            showGridlines
            editMode="cell"
            class="editable-cells-table"
            responsiveLayout="scroll"
          >
            <template #header>
              <div>
                <Button
                  id="newLine"
                  :label="$t('FORM.BUTTONS.ADD')"
                  @click="addBudgetLine2(expenseBudgetLines, 'expense')"
                  icon="pi pi-plus"
                  class="p-button-raised p-button-text"
                />
              </div>
            </template>
            <Column selectionMode="multiple" style="width: 2%"></Column>
            <Column
              field="status"
              :header="$t('FORM.LABELS.STATUS')"
              style="width: 1%; padding: 0px"
            >
              <template #body="e">
                <div class="invalid-line" v-if="!e.data.status">&nbsp;</div>
                <div class="valid-line" v-if="e.data.status">&nbsp;</div>
              </template>
            </Column>

            <Column field="description" header="Description" style="width: 20%">
              <template #body="e">
                <div class="link">
                  <span>{{ e.data.description }}</span>
                  <span :id="'description' + e.index" class="cWhite">.</span>
                </div>
              </template>

              <template #editor="{ data, field, index }">
                <Textarea
                  :id="'description_input' + index"
                  rows="1"
                  style="width: 100%"
                  @update:modelValue="
                    onItemUpdated(expenseBudgetLines, $event, field, index)
                  "
                  v-model="data[field]"
                />
              </template>
            </Column>

            <Column
              field="unit_price"
              :header="$t('FORM.LABELS.AMOUNT')"
              style="width: 15%"
            >
              <template #body="e">
                <div class="link text-right">
                  <span v-if="e.data.unit_price">{{
                    formatCurrency(e.data.unit_price, enterprise.currency_id)
                  }}</span>
                  <span :id="'unit_price' + e.index" class="cWhite">.</span>
                </div>
              </template>
              <template #editor="{ data, field, index }">
                <InputNumber
                  :id="'unit_price_input' + index"
                  :locale="enterprise.currency_intel_number_format"
                  :minFractionDigits="2"
                  v-model="data[field]"
                  v-on:input="
                    onNumberFieldSave(
                      $event.value,
                      data,
                      field,
                      index,
                      expenseBudgetLines
                    )
                  "
                  style="width: 100%"
                />
              </template>
            </Column>

            <Column
              field="budget_line"
              :header="$t('TREE.BUDGET_LINE')"
              style="width: 20%"
            >
              <template #body="e">
                <div
                  class="link"
                  @click="showBudgetLineModal(e.data, 'expense')"
                >
                  <span v-if="e.data.budgetLine">{{
                    e.data.budgetLine.description
                  }}</span>
                  <span :id="'BL' + e.index" class="cWhite">.</span>
                </div>
              </template>
            </Column>

            <Column
              field="action"
              header="Action"
              bodyStyle="text-align:center; color:red"
              style="width: 2%"
            >
              <template #body="e">
                <div
                  :id="'removeLine' + e.index"
                  class="link"
                  @click="removeRow(e.data, 'expense')"
                >
                  <i class="pi pi-trash p-text-danger" />
                </div>
              </template>
            </Column>

            <ColumnGroup type="footer">
              <Row>
                <Column
                  :footer="''"
                  :colspan="3"
                  footerStyle="text-align:right"
                />
                <Column
                  :footer="
                    $t('TRAVAL_ADVANCE.OTHER_EXPENSES_SHORT') +
                    ' Total:  ' +
                    formatCurrency(totalOtherExpense, 1)
                  "
                  :colspan="1"
                  footerStyle="text-align:right"
                />
                <Column :footer="''" :colspan="2" />
              </Row>
            </ColumnGroup>
          </DataTable>
        </div>
        <!-- -----------------------------------------------------Expense section END----------------------------------------------------------------------------------------->

        <br />
        <div class="grid">
          <div class="col-12 lg:col-10 xl:col-10"></div>
          <div class="col-12 lg:col-2 xl:col-2">
            <span>{{ $t("TRAVAL_ADVANCE.ADVANCE_TOTAL") }}</span>
            <span>
              :
              <b>{{ formatCurrency(total, enterprise.currency_id) }}</b></span
            >
          </div>
        </div>
        <div class="p-field" v-if="voucherUuid && !clone">
          <label
            class="label-required"
            for="update_note"
            :class="{ 'p-error': validationErrors.update_note && submitted }"
          >
            {{ $t("PRF.UPDATE_NOTE") }}
          </label>

          <Textarea
            id="update_note"
            class="col-12"
            rows="4"
            v-on:input="validate()"
            v-model="voucher.update.note"
          />
        </div>

        <br /><br />
        <div class="grid">
          <div class="col-12 lg:col-9 xl:col-9"></div>
          <div class="col-12 lg:col-3 xl:col-3">
            <Button
              id="submitButton"
              @click="submit"
              :label="
                voucherUuid
                  ? $t('FORM.BUTTONS.UPDATE')
                  : $t('FORM.BUTTONS.SAVE')
              "
              style="float: right"
              :icon="loading ? 'pi pi-spin pi-spinner' : ''"
              class="p-button-raised p-button-primary"
            />

            <Button
              :label="$t('FORM.BUTTONS.CANCEL')"
              @click="cancel()"
              style="float: right; margin-right: 10px"
              class="p-button-text p-button-raised"
            />
          </div>
        </div>

        <BudgetLineModal
          :row="selectedLine"
          :officeCode="selectedOffice.code"
          :close="closeBudgetLineModal"
          :display="displayBudgetLineModal"
        ></BudgetLineModal>

        <OfficeSelectModal
          :close="closeOfficeModal"
          :display="displayOfficeModal"
        ></OfficeSelectModal>

        <ProjectModal
          :close="closeProjectModal"
          :display="displayProjectModal"
        ></ProjectModal>
      </div>

      <div class="col-p12 card page-body" v-if="noEmployee">
        <Message severity="warn" :key="$t('PRF.NO_ACCESS')">
          {{ $t("PRF.NO_ACCESS") }}
        </Message>
      </div>

      <pdfViewer
        :fileName="fileName"
        :downloadFunction="pdfDownloadFunction"
        :display="displayPdfViewerModal"
        :close="closePrfViewer"
      >
      </pdfViewer>
    </BlockUI>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import DocState from "../prf/document_state_service";
import BudgetLineModal from "../prf/modal/budget_line_modal.vue";
import OfficeSelectModal from "../location/LocationSelectModal.vue";
import ProjectModal from "../prf/modal/projectSelectModal.vue";
import TravalAdvanceService from "./ta.service";
import ProjectService from "../project/project.service";
import UuidService from "../../service/uuidService";
import constants from "../../service/constant";
import pdfViewer from "../../components/PdfViewer.vue";
import NotifyService from "../../service/Notify.service";
import InventoryUnit from "../inventory/unit.service";
import officeservice from "../location/office.service";
import EmployeeService from "../employee/employee.service";
import EnterpriseService from "../enterprise/enterprise.service";
import currencyService from "../../service/currencyService";
import LocationService from "../ta_setting/location.service";
import validator from "./new.validation";
import util from "../../service/util";

export default defineComponent({
  name: "new_travalAdvance",
  props: {
    entity: Object,
  },
  data() {
    return {
      submitted: false,
      blockedPage: true,
      loading: false,
      privilegedUser: false,
      validationErrors: {},
      selectedPerdiemLines: [],
      selectedHostingLines: [],
      selectedExpenseLines: [],
      voucherUuid: null,
      total: 0,
      projects: [],
      services: [],
      voucherStatus: [], // menu action of states
      voucherStatusList: [], // diffente states
      selectedApprovers: null,
      selectedOffice: {},
      offices: [],
      approvers: [],
      voucher: { delivery: {} },
      selectedService: {},
      selectedProject: {},
      currentEmployee: {},
      inventoryUnits: [],
      selectedLocation: {},
      locations: [],
      selectedLine: {},
      applicant: {}, // demandeur
      currentGrid: "",
      ticketBudgetLines: [],
      perdiemBudgetlines: [],
      hostingBudgetlines: [],
      expenseBudgetLines: [],
      accounts: [],
      displayBudgetLineModal: false,
      displayProjectModal: false,
      displayPdfViewerModal: false,
      noEmployee: false,
      clone: false,
      displayOfficeModal: false,
      currentOffice: {},
      apply15thDayRole: true,
      server: "",
      lang: "fr",
      fileName: "",
      enterprise: {},
      travalAdvance: {},
      totalHosting: 0,
      totalPeridem: 0,
      totalOtherExpense: 0,
      transportMeans: [],
      transportMean: {},
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.transportMeans = [
        { id: "road", label: this.$t("FORM.LABELS.ROAD") },
        { id: "air", label: this.$t("FORM.LABELS.AIR") },
        { id: "other", label: this.$t("FORM.LABELS.OTHER") },
      ];
      this.voucher = {
        requester: {},
        delivery: {},
        project: {},
        budgetLine: {},
        status: {},
        update: {},
      };
      this.server = this.$store.state.server;
      this.lang = this.$i18n.locale;

      this.connectedUser = this.$store.state.session.user || {};
      if (!this.connectedUser.is_employee) {
        this.noEmployee = true;
        return;
      }
      LocationService.read()
        .then((locations) => {
          this.locations = locations;
          return EnterpriseService.read();
        })
        .then((enterprises) => {
          this.enterprise = enterprises[0] || {};
          return ProjectService.read();
        })
        .then((projects) => {
          this.projects = projects;
          return DocState.read();
        })
        .then((docStatus) => {
          this.voucherStatusList = docStatus;
          const pending = constants.DOCUMENT_STATUS.PENDING;
          this.voucher.status =
            docStatus.filter((ds) => ds.id === pending)[0] || {};
          return officeservice.read();
        })
        .then((offices) => {
          this.offices = offices;
          return EmployeeService.read(null, { is_budget_holder: 1 });
        })
        .then((approvers) => {
          this.approvers = approvers;
          return InventoryUnit.read();
        })
        .then((units) => {
          this.inventoryUnits = units.map((u) => {
            u.text = this.$t(u.text);
            return u;
          });

          this.getUserInformations();
        });
    },
    setTransportMean(transportMean) {
      this.transportMean = transportMean;
      this.travalAdvance.transport_mean = transportMean.id;
      this.validate(true);
    },
    getUserInformations() {
      this.currentEmployee = this.$store.state.session.employee;
      this.voucher.delivery.address = this.currentEmployee.office_address;
      this.voucher.delivery.recipient = this.currentEmployee.displayname;

      const { voucherUuid, clone } = this.$route.query;
      this.clone = clone;
      this.applicant = this.currentEmployee;
      if (!voucherUuid) {
        this.displayProjectModal = true;
        setTimeout(() => {
          this.blockedPage = false;
        }, 1000);
      } else {
        setTimeout(() => {
          this.loadVoucherInfo(voucherUuid);
        }, 1000);
      }
    },
    showBudgetLineModal(line, currentGrid) {
      if (!line.project.uuid) {
        line.project = this.selectedProject;
        line.project_uuid = this.selectedProject.uuid;
      }
      this.selectedLine = line;
      this.displayBudgetLineModal = true;
      this.currentGrid = currentGrid;
    },
    formatCurrency(amount, currecnyId) {
      return currencyService.format(amount, currecnyId);
    },
    viewPDF(voucherUuid) {
      TravalAdvanceService.read(voucherUuid).then((ta) => {
        this.voucherUuid = voucherUuid;
        this.fileName = this.createFileName(ta);
        this.pdfViewerUrl = `export/${voucherUuid}?lang=${this.lang}&stream=1&renderer=pdf`;
        this.displayPdfViewerModal = true;
      });
    },
    createFileName(doc) {
      return `${doc.employee.displayname} ${doc.document.text}  v${doc.voucher.version} ${doc.voucher.submission_date}.pdf`;
    },
    pdfDownloadFunction() {
      return TravalAdvanceService.dowloadPdf(
        `export/${this.voucherUuid}?lang=${this.lang}&stream=1&renderer=pdf`,
        this.fileName,
        true
      );
    },

    closePrfViewer() {
      this.displayPdfViewerModal = false;
      this.$router.push("/ta_registry");
    },
    setOffice() {
      this.voucher.office_uuid = this.selectedOffice.uuid;
      this.validate(true);
    },
    round(num) {
      return util.round(num);
    },
    // editing PRF, let load prf info from it uuid
    loadVoucherInfo(voucherUuid) {
      this.voucherUuid = voucherUuid;
      TravalAdvanceService.read(voucherUuid)
        .then((result) => {
          if (!this.clone) {
            this.applicant = result.employee;
          }

          this.selectedProject = result.project;
          const prfApprovers = result.approvers.map((ap) => ap.employee_uuid);
          this.selectedServices = [];
          this.selectedApprovers = [];
          this.approvers.forEach((approver) => {
            if (prfApprovers.includes(approver.uuid)) {
              this.selectedApprovers.push(approver);
            }
          });
          // office
          this.currentOffice = result.office;
          this.offices.forEach((l) => {
            if (l.uuid === result.voucher.fct_office_uuid) {
              this.selectedOffice = l;
            }
          });
          this.travalAdvance = result.travalAdvance;
          console.log(this.travalAdvance.transport_mean);
          if (this.travalAdvance.transport_mean) {
            this.transportMeans.forEach((t) => {
              if (t.id === this.travalAdvance.transport_mean) {
                this.transportMean = t;
              }
            });
          }
          this.travalAdvance.date_from = new Date(this.travalAdvance.date_from);
          this.travalAdvance.date_to = new Date(this.travalAdvance.date_to);

          this.voucher.usefulness = result.voucher.usefulness;
          this.voucher.additional_info = result.voucher.additional_info;

          // delivery info
          this.voucher.delivery.recipient = result.voucher.delivery_recipient;
          this.voucher.delivery.address = result.voucher.delivery_address;
          this.voucher.delivery.email = result.voucher.delivery_email;
          this.voucher.delivery.phone = result.voucher.delivery_phone;
          this.voucher.delivery.note = result.voucher.delivery_note;
          this.voucher.delivery.expected_date = new Date(
            result.voucher.delivery_expected_date
          );

          this.voucher.update = {};

          // checking the document state, procurement cand edit an approved document, in that case the document state doesn't change
          const stateResult = DocState.getState({
            documentStateId: result.voucher.document_state_id,
            clone: this.clone,
            documentMaker: result.employee.uuid,
            prfStatusList: this.voucherStatusList,
            currentEmployee: this.currentEmployee,
          });

          this.voucher.status = stateResult.state;
          this.privilegedUser = stateResult.privilegedUser;

          this.totalPeridem = result.totalPerdiem;
          this.totalHosting = result.totalHosting;
          this.totalExpense = result.totalExpense;

          const arrayMap = {
            ticket: this.ticketBudgetLines,
            perdiem: this.perdiemBudgetlines,
            hosting: this.hostingBudgetlines,
            expense: this.expenseBudgetLines,
          };
          result.items.forEach((line) => {
            arrayMap[line.type].push({
              uuid: line.uuid,
              description: line.specification,
              unit: line.unit_id,
              quantity: line.quantity,
              reference: line.reference,
              debit: line.debit,
              credit: line.credit,
              unit_price: line.unit_price || 0,
              date_from: new Date(line.date_from),
              date_to: new Date(line.date_to),
              total: this.round(line.unit_price * line.quantity),
              project_uuid: line.project_uuid,
              project: result.project,
              percentage: line.percentage,
              locationObject: {
                uuid: line.location_uuid,
                name: line.location_name,
                per_diem_1_14: line.location_per_diem_1_14,
                per_diem_15_more: line.location_per_diem_15_more,
                lodging: line.location_lodging,
              },
              type: line.type,
              location_uuid: line.location_uuid,

              budgetLine: {
                uuid: line.budget_line_uuid,
                entity_code: line.entity_code,
                function_code: line.function_code,
                funding_source: line.funding_source,
                loc: line.loc,
                project: line.project,
                reporting_office: line.reporting_office,
                description: line.description,
                sub_project: line.sub_project,
                object: line.object,
                activity: line.activity,
              },
              unitObject:
                this.inventoryUnits.filter((iv) => iv.id === line.unit_id)[0] ||
                {},
            });
          });

          Object.keys(arrayMap).forEach((k) => {
            arrayMap[k].forEach((line, index) => {
              this.calculateRate(line, index);
            });
          });

          this.validateLines();
        })
        .finally(() => {
          this.blockedPage = false;
        });
    },
    formatDate(date) {
      if (!date) return;
      return util.formatDate(date, "DD/MM/YYYY");
    },
    onDateSelect(data, field, index, list) {
      this.onFieldSave(list, data, field, index);
    },
    addTicketBudgetLine() {
      const uuid = new UuidService().generate();
      let project = {};
      let projectUuid = null;

      if (this.ticketBudgetLines.length > 0) {
        const lastItem =
          this.ticketBudgetLines[this.ticketBudgetLines.length - 1];
        if (lastItem.project_uuid) {
          project = Object.assign({}, lastItem.project);
          projectUuid = project.uuid;
        }
      }

      this.ticketBudgetLines.push({
        uuid,
        description: null,
        unit: 18,
        quantity: 1,
        unit_price: 0,
        debit: null,
        credit: 0,
        total: null,
        project_uuid: projectUuid,
        project,
        type: "ticket",
        budgetLine: {},
        unitObject: this.inventoryUnits.filter((ivU) => ivU.id === 18)[0],
      });
    },
    importFromPerdiem() {
      this.hostingBudgetlines = [];
      this.perdiemBudgetlines.forEach((item, index) => {
        this.addBudgetLine2(this.hostingBudgetlines, "hosting");
        const HostingLine = this.hostingBudgetlines[index];
        const perdiemLine = this.perdiemBudgetlines[index];
        HostingLine.date_from = perdiemLine.date_from;
        HostingLine.date_to = perdiemLine.date_to;
        HostingLine.locationObject = perdiemLine.locationObject;
        HostingLine.location_uuid = perdiemLine.location_uuid;

        this.calculateRate(HostingLine, index);
        this.validateLines();
      });
    },

    addBudgetLine2(list, currentGrid) {
      const uuid = new UuidService().generate();
      let project = {};
      let bgLine = {};
      let projectUuid = null;

      let dateFrom = null;
      if (list.length > 0) {
        const lastItem = list[list.length - 1];
        if (lastItem.project_uuid) {
          project = Object.assign({}, lastItem.project);
          projectUuid = project.uuid;
        }
        if (lastItem.budgetLine) {
          bgLine = lastItem.budgetLine;
        }
        if (lastItem.date_to) {
          dateFrom = util.nextDay(lastItem.date_to);
        }
      }

      list.push({
        uuid,
        description: null,
        unit: 18,
        quantity: 1,
        debit: null,
        date_from: dateFrom,
        date_to: null,
        credit: 0,
        total: null,
        type: currentGrid,
        project_uuid: projectUuid,
        project,
        budgetLine: bgLine,
        locationObject: {},
        unitObject: this.inventoryUnits.filter((ivU) => ivU.id === 18)[0],
      });
    },
    onItemUpdated(list, val, field, index) {
      const newData = list[index] || {};
      newData[field] = val;
      list[index] = newData;
      this.validateLines();
    },
    onNumberFieldSave(value, data, field, index, list) {
      data[field] = value;
      return this.onFieldSave(list, data, field, index);
    },
    lastDate(line) {
      // the last day is not taken into account
      const _format = "YYYY-MM-DD";
      return (
        util.formatDate(this.travalAdvance.date_to, _format) ===
        util.formatDate(line.date_to, _format)
      );
    },
    calculateRate(line, indice) {
      /** number of days after the 14th */
      let period15th = 0;
      /**number of days in the period from travel_advance.date_from to line.date_to  */
      let periodLong = 0;
      /** Number of days in the period from  line.date_from to line.date_to */
      let dayNumber = 0;

      if (line.date_from && line.date_to) {
        dayNumber = util.dateDiff(line.date_from, line.date_to, "day");
        if(line.type === "hosting") {
          if(this.lastDate(line)) {
            dayNumber -= 1;
          }
        }
        line.quantity = dayNumber;
        // Application du regle de 14em jour
        periodLong = util.dateDiff(
          this.travalAdvance.date_from,
          line.date_to,
          "day"
        );
        if (periodLong > 14) {
          // get the nomber of days after 14em (Fourteenth) days : period15th
          period15th = periodLong - 14;
        }
      }

      // the site to visit
      const place = line.locationObject;

      if (place.uuid) {
        const mapPerdiemType = {
          hosting: place.lodging,
          perdiem: place.per_diem_1_14 || 0,
          perdiem_15: place.per_diem_15_more || place.per_diem_1_14 || 0,
        };
        const typeToFormat = Object.keys(mapPerdiemType).includes(line.type);
        if (typeToFormat) {
          if (line.quantity) {
            if (line.type === "perdiem") {
              const firstAndLastDayPerdiem = indice === 0;

              if (period15th === 0 || !this.apply15thDayRole) {
                // set perdiem for first and last day
                if (firstAndLastDayPerdiem) {
                  line.quantity = line.quantity - 0.25;
                }
                line.unit_price = mapPerdiemType[line.type];
              } else if (this.apply15thDayRole) {
                // applying the 15h role
                let days1To14 = dayNumber - period15th;
                // set perdiem for first and last day
                if (firstAndLastDayPerdiem) {
                  period15th = period15th - 0.25;
                }
                line.quantity = period15th + days1To14;
                const part1 = mapPerdiemType.perdiem_15;
                line.unit_price = util.round(part1);
              }
            } else if (line.type === "hosting") {
              line.unit_price = mapPerdiemType[line.type];
            } else {
              line.unit_price = mapPerdiemType[line.type];
            }
          }
        }
        if (line.quantity) {
          line.total = util.round(line.quantity * line.unit_price);
        }
      }
    },
    onFieldSave(list, data, field, index) {
      const newData = list[index] || {};
      newData[field] = data[field];
      this.calculateRate(newData, index);
      //
      list[index] = newData;
      this.validateLines();
    },
    setProject(index, data, field) {
      const project = data[field];
      const newData = this.ticketBudgetLines[index] || {};
      newData.project = project;
      this.ticketBudgetLines[index] = newData;
      newData[field] = project.uuid;
      newData.budgetLine = {};
    },

    setLocation(index, data, field, list) {
      const _location = data[field];
      const newData = list[index] || {};
      newData.locationObject = _location;
      newData.location_uuid = _location.uuid;
      this.calculateRate(newData);
      list[index] = newData;
      this.validateLines();
    },
    setBudgetLine(index, data, field) {
      const newData = this.ticketBudgetLines[index] || {};
      newData.budgetLine = data[field];
      this.ticketBudgetLines[index] = newData;
      this.validateLines();
    },

    closeProjectModal(project) {
      this.selectedProject = project;
      this.displayProjectModal = false;
      this.selectLocation();
    },
    selectLocation() {
      this.displayOfficeModal = true;
    },
    closeOfficeModal(office) {
      if (office) {
        this.currentOffice = office;
      }
      this.displayOfficeModal = false;
    },

    closeBudgetLineModal(result) {
      if (result) {
        const arrayMap = {
          ticket: this.ticketBudgetLines,
          perdiem: this.perdiemBudgetlines,
          hosting: this.hostingBudgetlines,
          expense: this.expenseBudgetLines,
        };

        let myArray = arrayMap[this.currentGrid];
        // multi lines budget assingment
        if (
          this.selectedPerdiemLines.length > 0 &&
          this.currentGrid === "perdiem"
        ) {
          myArray.forEach((line) => {
            line.budgetLine = result.budgetLine;
          });
          this.selectedPerdiemLines = [];
        } else if (
          this.selectedHostingLines.length > 0 &&
          this.currentGrid === "hosting"
        ) {
          myArray.forEach((line) => {
            line.budgetLine = result.budgetLine;
          });
          this.selectedHostingLines = [];
        } else if (
          this.selectedExpenseLines.length > 0 &&
          this.currentGrid === "expense"
        ) {
          myArray.forEach((line) => {
            line.budgetLine = result.budgetLine;
          });
          this.selectedExpenseLines = [];
        } else {
          const rows = myArray.filter((bl) => result.row.uuid === bl.uuid);
          if (rows.length > 0) {
            rows[0].budgetLine = result.budgetLine;
          }
        }
      }
      this.displayBudgetLineModal = false;
      this.validateLines();
    },
    selectProject() {
      if (this.ticketBudgetLines.length > 0) return;
      this.displayProjectModal = true;
    },
    validate(showErrors) {
      if (!this.submitted) return;
      this.validationError = {};
      validator.init();
      const _approvers = this.selectedApprovers || [];
      // set validation errors
      const requiredCols = {
        delivery: ["expected_date", "recipient"],
        update: ["note"],
      };

      Object.keys(requiredCols).forEach((key) => {
        requiredCols[key].forEach((col) => {
          const errorKey = `${key}_${col}`;
          const result = validator.check(errorKey, !this.voucher[key][col]);
          this.validationErrors[errorKey] = result;
        });
      });

      // check expected date
      const isFutureDate = util.isFutureDate(
        this.voucher.delivery.expected_date
      );
      if (!isFutureDate) {
        this.validationErrors.delivery_expected_date = true;
        validator.check("delivery_expected_date", true);
      }

      if (!this.travalAdvance.transport_mean) {
        this.validationErrors.transport_mean = true;
        validator.check("transport_mean", true);
      } else {
        delete this.validationErrors.transport_mean;
      }

      // some services should be selected
      const approverLength = _approvers.length;
      const correctApproverLength = [1, 2].includes(approverLength);
      this.validationErrors.approvers = !correctApproverLength;

      // ticket budget lines
      // const ticketSpecifiedLines = this.ticketBudgetLines.length; // selected budget lines should not be empty
      const ticketIncorretLines = this.ticketBudgetLines.filter(
        (bl) => !bl.status
      ).length;

      // ticket budget lines
      const perdiemSpecifiedLines = this.perdiemBudgetlines.length; // selected budget lines should not be empty
      const perdiemIncorretLines = this.perdiemBudgetlines.filter(
        (bl) => !bl.status
      ).length;

      // hosting budget lines
      const hostingSpecifiedLines = this.hostingBudgetlines.length; // selected budget lines should not be empty
      const hostingIncorretLines = this.hostingBudgetlines.filter(
        (bl) => !bl.status
      ).length;
      // expenses budget lines
      const expenseSpecifiedLines = this.hostingBudgetlines.length; // selected budget lines should not be empty
      const expenseIncorretLines = this.hostingBudgetlines.filter(
        (bl) => !bl.status
      ).length;

      // other errors

      if (!this.voucherUuid) {
        delete this.validationErrors.update_note;
      }

      validator.check("approvers", !correctApproverLength);
      validator.check("destinations", !this.travalAdvance.destinations);
      validator.check("object", !this.travalAdvance.object);
      validator.check("itinerary", !this.travalAdvance.itinerary);
      validator.check("dateFrom", !this.travalAdvance.date_from);
      validator.check("dateTo", !this.travalAdvance.date_to);
      const goodTravelPeriod = util.isFutureDate(
        this.travalAdvance.date_to,
        this.travalAdvance.date_from
      );
      validator.check("dateTo", !goodTravelPeriod);

      validator.check("ticket_budget_line_grid", ticketIncorretLines !== 0);

      validator.check(
        "perdiem_budget_line_grid",
        perdiemIncorretLines !== 0 || perdiemSpecifiedLines === 0
      );
      validator.check(
        "hosting_budget_line_grid",
        hostingIncorretLines !== 0 || hostingSpecifiedLines === 0
      );
      validator.check(
        "expense_budget_line_grid",
        expenseIncorretLines !== 0 || expenseSpecifiedLines === 0
      );
      validator.check(
        "update_note",
        this.voucherUuid && !this.clone ? !this.voucher.update.note : false
      );

      if (!showErrors) return;
      const validatationResult = validator.process();
      if (!validatationResult) return true;
      NotifyService.danger(
        this,
        "FORM.ERRORS.INVALID",
        validatationResult.text
      );
    },
    changeStatus(event) {
      if (!this.privilegedUser) return;
      this.$refs.voucherStatusMenu.toggle(event);
      this.setStatus();
    },
    setStatus() {
      this.voucherStatus = [];
      this.voucherStatusList.forEach((status) => {
        this.voucherStatus.push({
          label: this.$t(status.label),
          icon: this.voucher.status.id === status.id ? "pi pi-check" : "",
          command: () => {
            this.voucher.status = status;
          },
        });
      });
    },
    validateLines() {
      this.totalPeridem = 0;
      this.totalHosting = 0;
      this.totalOtherExpense = 0;
      let totalPourcetage = 0;
      this.ticketBudgetLines.forEach((bl) => {
        const hasPercentage = util.isCorrectFloat(bl.percentage || "error");
        const hasLine = !!bl.budgetLine.uuid;
        totalPourcetage += bl.percentage || 0;
        bl.status = hasPercentage && hasLine;
      });

      if (totalPourcetage > 100 || totalPourcetage < 0) {
        this.ticketBudgetLines[0].status = false;
      }

      this.expenseBudgetLines.forEach((bl) => {
        const hasUnitPrice = util.isCorrectFloat(bl.unit_price || "error");
        const hasDescription = util.isCorrectString(bl.description);
        const hasLine = !!bl.budgetLine.uuid;
        this.totalOtherExpense += bl.unit_price || 0;
        bl.status = hasUnitPrice && hasLine && hasDescription;
      });

      this.perdiemBudgetlines.forEach((bl) => {
        this.totalPeridem += (bl.quantity || 0) * (bl.unit_price | 0);
      });
      this.hostingBudgetlines.forEach((bl) => {
        this.totalHosting += (bl.quantity || 0) * (bl.unit_price | 0);
      });

      this.total =
        this.totalHosting + this.totalPeridem + this.totalOtherExpense;
      const ListArray = [this.perdiemBudgetlines, this.hostingBudgetlines];

      ListArray.forEach((myArray) => {
        myArray.forEach((bl, index) => {
          const hasDateFrom = !!bl.date_from;
          const hasDateTo = !!bl.date_to;
          const hasLine = !!bl.budgetLine.uuid;
          const hasPlace = !!bl.location_uuid;
          // verify if the user has selected a correct period
          const goodPeriod = util.isFutureDate(bl.date_to, bl.date_from);
          bl.status =
            hasDateTo && hasDateFrom && hasLine && hasPlace && goodPeriod;
          const previous = this.perdiemBudgetlines[index - 1] || null;
          // comparing budgle line info with the previous line.
          if (previous && bl.status) {
            if (previous.date_to) {
              const nextDate = util.formatDate(
                util.nextDay(previous.date_to),
                "YYYY-MM-DD"
              );
              const _date = util.formatDate(bl.date_from, "YYYY-MM-DD");
              bl.status = _date === nextDate;
            }
          }
        });
      });

      // check if the first day of perdiem is less then 15 days
      if (this.apply15thDayRole) {
        if (this.perdiemBudgetlines.length > 0) {
          const firstLine = this.perdiemBudgetlines[0];
          if (firstLine.quantity > 14) {
            firstLine.status = false;
          }
        }
      }
    },
    submit() {
      if (this.loading) return;
      this.submitted = true;
      const isValid = this.validate(true);
      if (!isValid) return;

      this.loading = true;
      this.travalAdvance.duration = util.dateDiff(
        this.travalAdvance.date_from,
        this.travalAdvance.date_to,
        "day"
      );

      const formatedTA = Object.assign({}, this.travalAdvance);
      formatedTA.date_from = util.formatDate(formatedTA.date_from);
      formatedTA.date_to = util.formatDate(formatedTA.date_to);
      const lines = util.dateFormatter(
        [].concat(
          this.ticketBudgetLines,
          this.perdiemBudgetlines,
          this.hostingBudgetlines,
          this.expenseBudgetLines
        )
      );

      TravalAdvanceService.create({
        travalAdvance: formatedTA,
        project_uuid: this.selectedProject.uuid,
        office_uuid: this.currentOffice.uuid,
        fct_office_uuid: this.selectedOffice.uuid,
        status_id: this.voucher.status.id,
        employee: this.applicant,
        parent: !this.clone ? this.voucherUuid : null,
        isEdit: !this.clone && !!this.voucherUuid,
        edited_by: this.currentEmployee.uuid,
        amount: this.total,
        usefulness: this.voucher.usefulness,
        additional_info: this.voucher.additional_info,
        voucher_type_id: constants.voucherTypes.ta,
        update_note: this.voucher.update.note,
        delivery: {
          recipient: this.voucher.delivery.recipient,
          address: this.voucher.delivery.address,
          phone: this.voucher.delivery.phone,
          expected_date: util.formatDate(this.voucher.delivery.expected_date),
          email: this.voucher.delivery.email,
          note: this.voucher.delivery.note,
        },
        lines: lines.map((line) => {
          line.budgetLine.reporting_office = this.currentOffice.code;
          return line;
        }),
        services: [],
        approvers: this.selectedApprovers.map((ap) => ap.uuid),
      })
        .then((response) => {
          NotifyService.success(this, "", null);
          this.voucherUuid = response.uuid;
          this.viewPDF(response.uuid);
        })
        .catch(() => {
          NotifyService.danger(this, "", null);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    removeRow(row, currentGrid) {
      // remove a budget kine row

      if (currentGrid === "ticket") {
        this.ticketBudgetLines = this.ticketBudgetLines.filter(
          (line) => line.uuid !== row.uuid
        );
      } else if (currentGrid === "perdiem") {
        this.perdiemBudgetlines = this.perdiemBudgetlines.filter(
          (line) => line.uuid !== row.uuid
        );
      } else if (currentGrid === "hosting") {
        this.hostingBudgetlines = this.hostingBudgetlines.filter(
          (line) => line.uuid !== row.uuid
        );
      } else if (currentGrid === "expense") {
        this.expenseBudgetLines = this.expenseBudgetLines.filter(
          (line) => line.uuid !== row.uuid
        );
      }
      this.validateLines();
    },
    cancel() {
      this.$router.go(-1);
    },
  },
  components: {
    BudgetLineModal,
    OfficeSelectModal,
    ProjectModal,
    pdfViewer,
  },
});
</script>
  
<style scoped>
.cWhite {
  color: #fff;
}
.p-field label {
  font-size: 14px !important;
}
.loader1 {
  text-align: center;
  width: 100%;
  position: relative;
  z-index: 109;
}
</style>