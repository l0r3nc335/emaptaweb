<template>
  <v-container>
    <v-toolbar-title>
      <h3>Ticket Management</h3>
    </v-toolbar-title>
    <!-- Table Parameters -->
    <v-row>
      <v-col cols="2">
        <div class="my-2">
          <v-btn
            @click="assignment(1)"
            depressed
            large
            :color="parameters.open===1 ? 'secondary' : 'primary'"
          >My Open Ticket</v-btn>
        </div>
      </v-col>
      <v-col cols="2">
        <div class="my-2">
          <v-btn
            @click="assignment(2)"
            depressed
            large
            :color="parameters.closed===1 ? 'secondary' : 'primary'"
          >My Closed Ticket</v-btn>
        </div>
      </v-col>
      <v-col cols="2">
        <div class="my-2">
          <v-btn
            @click="assignment(0)"
            depressed
            large
            :color="parameters.unassigned===1 ? 'secondary' : 'primary'"
          >Unassigned Ticket</v-btn>
        </div>
      </v-col>
    </v-row>

    <data-table v-if="showtable"
      ref="table"
      :hasRoute="(parameters.open + parameters.closed)==1 ? true : false"
      :hasAssigned="parameters.unassigned==1 ? true : false"
      @assigned="assignedItem"
      @route="routeItem"
      :path="'/tickets'"
    />

    <v-dialog v-model="itemDialog" :width="width" transition="dialog-top-transition">
      <template>
        <v-card>
          <v-card-title>{{ dialogName }}</v-card-title>
          <v-divider></v-divider>
          <v-card-text style="margin-top: 12px">
            <v-row v-if="alert.show">
              <v-col cols="12">
                <v-alert :type="alert.type" v-html="alert.message">
                  {{
                  alert.message
                  }}
                </v-alert>
              </v-col>
            </v-row>
            <v-form v-if="dialogName != 'Delete Confirmation' && dialogName != 'Ticket Assignment'">
              <!-- Code -->
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.message"
                    :counter="155"
                    label="Message"
                    @input="$v.form.message.$touch()"
                    @blur="$v.form.message.$touch()"
                    required
                    :error-messages="messageErrors"
                  ></v-text-field>
                </v-col>
              </v-row>
              <!-- Name -->
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.mobile"
                    :counter="14"
                    label="Mobile"
                    @input="$v.form.mobile.$touch()"
                    @blur="$v.form.mobile.$touch()"
                    required
                    :error-messages="mobileErrors"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
            <v-row v-if="dialogName == 'Delete Confirmation'">
              <v-col cols="12" v-if="showSubmitButton">
                <p v-html="'Are you sure you want to delete ' + form.name + '?'"></p>
              </v-col>
            </v-row>
            <v-row v-if="dialogName == 'Ticket Assignment'">
              <v-col cols="12" v-if="showSubmitButton">
                <p v-html="'Are you sure you want to assigned ticket from ' + form.mobile + ' to yourself?'"></p>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="justify-end">
            <v-btn
              v-if="showSubmitButton"
              :loading="isLoading"
              text
              color="primary"
              @click="submit"
              v-html="submitLabel"
            ></v-btn>
            <v-btn :loading="isLoading" text color="error" @click="itemDialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <loading ref="loading"/>
  </v-container>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import DataTable from "../components/DataTableV2";
import Loading from "../components/Loading";
export default {
  name: "ticket",
  mixins: [validationMixin],
  components: { DataTable, Loading },
  validations: {
    form: {
      message: {
        required,
        minLength: minLength(1),
        maxLength: maxLength(1000)
      },
      mobile: {
        required,
        minLength: minLength(11),
        maxLength: maxLength(14)
      },
    }
  },
  data: () => ({
    showtable: true,
    activeId: "",
    showSubmitButton: false,
    submitLabel: "",
    isLoading: false,
    alert: {
      show: false,
      message: "",
      type: "error"
    },
    parameters: {
      open: 1,
      unassigned: 0,
      closed: 0
    },
    itemDialog: false,
    dialogName: "",
    form: {
      message: "",
      mobile: "",
    }
  }),
  methods: {
    openAdd() {
      this.$v.$reset();
      this.submitLabel = "Submit";
      this.showSubmitButton = true;
      this.dialogName = "Add Project";
      this.alert.show = false;
      this.itemDialog = true;
      this.form = {
        message: "",
        mobile: "",
      };
    },
    generateTable() {
      this.$refs.table.setParameters(this.parameters);
      this.$refs.table.generate();
    },
    assignment(value) {
      this.showtable = true;
      switch (value) {
        case 0:
          this.parameters.unassigned = 1;
          this.parameters.open = 0;
          this.parameters.closed = 0;
          
          break;
        case 1:
          this.parameters.unassigned = 0;
          this.parameters.open = 1;
          this.parameters.closed = 0;
          break;
        case 2:
          this.parameters.unassigned = 0;
          this.parameters.open = 0;
          this.parameters.closed = 1;
          break;
      }
      this.showtable = true;
      this.generateTable();
      this.showtable = true;
      
    },
    routeItem(item) {
      this.$router.push({name: 'ticket-detail', params: { id: item.id }})
    },
    assignedItem(item) {
      this.$v.$reset();
      this.submitLabel = "Yes";
      this.showSubmitButton = true;
      this.activeId = item.id;
      this.form = item;
      this.dialogName = "Ticket Assignment";
      this.alert.show = false;
      this.itemDialog = true;
    },
    submit() {
      this.isLoading = true;
      this.$refs.loading.open();
      let url = this.$api;
      if (this.dialogName == "Add Ticket") {
        url += "/tickets";
      } else if (this.dialogName == "Delete Confirmation") {
        url += "/tickets/" + this.activeId;
        this.form._method = "DELETE";
      } else {
        url += "/tickets/" + this.activeId;
        this.form._method = "PUT";
      }
      this.$v.$touch();
      if (this.$v.$invalid) {
        setTimeout(() => {
          this.$scrollToTop();
          this.alert = {
            show: true,
            message: "Please complete the form, see errors below.",
            type: "error"
          };
          this.$refs.loading.close();
          this.isLoading = false;
        }, 1000);
      } else {
        this.$http
          .post(url, this.form)
          .then(response => {
            setTimeout(() => {
              this.alert = {
                show: true,
                message: response.data.message,
                type: "success"
              };
              this.showSubmitButton = false;
              this.generateTable();
              this.$scrollToTop();
              this.$refs.loading.close();
              this.isLoading = false;
            }, 1000);
          })
          .catch(error => {
            setTimeout(() => {
              this.$scrollToTop();
              this.alert = {
                show: true,
                message:
                  "Something went wrong! Please contact the Administrator.",
                type: "error"
              };
              this.$refs.loading.close();
              this.isLoading = false;
            }, 1000);
          });
      }
    }
  },
  mounted() {
    this.showtable = true;
    this.generateTable();
    this.showtable = true;
  },
  computed: {
    messageErrors() {
      const errors = [];
      if (!this.$v.form.message.$dirty) return errors;
      !this.$v.form.message.required && errors.push("Message is required.");
      !this.$v.form.message.maxLength &&
        errors.push("Message must be at most 155 characters long");
      !this.$v.form.message.minLength &&
        errors.push("Message must be at least 1 characters long");
      return errors;
    },
    mobileErrors() {
      const errors = [];
      if (!this.$v.form.mobile.$dirty) return errors;
      !this.$v.form.mobile.required && errors.push("Mobile is required.");
      !this.$v.form.mobile.maxLength &&
        errors.push("Mobile must be at most 11 characters long");
      !this.$v.form.mobile.minLength &&
        errors.push("Mobile must be at least 13 characters long");
      return errors;
    },
    width() {
      let breakpointName = this.$vuetify.breakpoint.name;
      if (breakpointName == "xs") {
        return "95%";
      } else {
        return "450px";
      }
    }
  }
};
</script>
