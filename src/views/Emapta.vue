<template>
  <v-container>
    <v-toolbar-title><h3>Agile Values and Principles</h3></v-toolbar-title>
    <!-- Table Parameters -->
    <v-row>
      <!-- Search -->
      <v-col cols="4">
        <v-text-field
          label="Search"
          prepend-inner-icon="mdi-magnify"
          hide-details
          v-model="parameters.search"
        ></v-text-field>
      </v-col>
      <v-col cols="4">
        <div class="my-2">
          <v-btn @click="generateTable" depressed large color="primary"> Apply </v-btn>
        </div>
      </v-col>
      <v-col cols="4">
        <div class="my-2 text-right">
          <v-btn @click="openAdd" depressed large color="primary"> Add </v-btn>
        </div>
      </v-col>
    </v-row>
    <data-table
      ref="table"
      :hasEdit="true"
      :hasDelete="true"
      @edit="editItem"
      @delete="deleteItem"
      :path="'/projects'"
    />
    
    <v-dialog v-model="itemDialog" :width="width" transition="dialog-top-transition">
      <template>
        <v-card>
          <v-card-title>{{ dialogName }}</v-card-title>
          <v-divider></v-divider>
          <v-card-text style="margin-top: 12px">
            <v-row v-if="alert.show">
              <v-col cols="12">
                <v-alert :type="alert.type" v-html="alert.message">{{
                  alert.message
                }}</v-alert>
              </v-col>
            </v-row>
            <v-form v-if="dialogName != 'Delete Confirmation'">
              <!-- Code -->
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.code"
                    :counter="350"
                    label="Code"
                    @input="$v.form.code.$touch()"
                    @blur="$v.form.code.$touch()"
                    required
                    :error-messages="codeErrors"
                  ></v-text-field>
                </v-col>
              </v-row>
              <!-- Name -->
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.name"
                    :counter="350"
                    label="Name"
                    @input="$v.form.name.$touch()"
                    @blur="$v.form.name.$touch()"
                    required
                    :error-messages="nameErrors"
                  ></v-text-field>
                </v-col>
              </v-row>
              <!-- Dinstar URL -->
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.configuration.dinstar_url"
                    :counter="100"
                    label="Dinstar URL"
                    @input="$v.form.configuration.dinstar_url.$touch()"
                    @blur="$v.form.configuration.dinstar_url.$touch()"
                    required
                    :error-messages="dinstarUrlErrors"
                  ></v-text-field>
                </v-col>
              </v-row>
              <!-- Receive Ports -->
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.configuration.receive_ports"
                    :counter="100"
                    label="Receive Ports"
                    @input="$v.form.configuration.receive_ports.$touch()"
                    @blur="$v.form.configuration.receive_ports.$touch()"
                    required
                    :error-messages="receivePortsErrors"
                  ></v-text-field>
                </v-col>
              </v-row>
              <!-- Globe Ports -->
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.configuration.smart_ports"
                    :counter="100"
                    label="Smart Ports"
                    @input="$v.form.configuration.smart_ports.$touch()"
                    @blur="$v.form.configuration.smart_ports.$touch()"
                    required
                    :error-messages="smartPortsErrors"
                  ></v-text-field>
                </v-col>
              </v-row>
              <!-- Smart Ports -->
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.configuration.globe_ports"
                    :counter="100"
                    label="Globe Ports"
                    @input="$v.form.configuration.globe_ports.$touch()"
                    @blur="$v.form.configuration.globe_ports.$touch()"
                    required
                    :error-messages="globePortsErrors"
                  ></v-text-field>
                </v-col>
              </v-row>
              <!-- Token -->
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.configuration.token"
                    :counter="100"
                    label="Token"
                    @input="$v.form.configuration.token.$touch()"
                    @blur="$v.form.configuration.token.$touch()"
                    required
                    :error-messages="tokenErrors"
                  ></v-text-field>
                </v-col>
              </v-row>
              <!-- Auto Response -->
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.configuration.auto_response"
                    :counter="255"
                    label="Auto Response"
                    @input="$v.form.configuration.auto_response.$touch()"
                    @blur="$v.form.configuration.auto_response.$touch()"
                    required
                    :error-messages="autoResponseErrors"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
            <v-row v-if="dialogName == 'Delete Confirmation'">
              <v-col cols="12" v-if="showSubmitButton">
                <p v-html="'Are you sure you want to delete ' + form.name + '?'"></p>
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
            >
            </v-btn>
            <v-btn :loading="isLoading" text color="error" @click="itemDialog = false"
              >Close</v-btn
            >   
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <loading ref="loading" />
  </v-container>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import DataTable from "../components/DataTableV2";
import Loading from "../components/Loading";
export default {
  name: "emapta",
  mixins: [validationMixin],
  components: { DataTable, Loading },
  validations: {
    form: {
      code: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(350),
      },
      name: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(350),
      },
      configuration: {
        dinstar_url: {
          required,
          minLength: minLength(4),
          maxLength: maxLength(100),
        },
        receive_ports: {
          required,
          minLength: minLength(1),
          maxLength: maxLength(100),
        },
        smart_ports: {
          required,
          minLength: minLength(1),
          maxLength: maxLength(100),
        },
        globe_ports: {
          required,
          minLength: minLength(1),
          maxLength: maxLength(100),
        },
        token: {
          required,
          minLength: minLength(4),
          maxLength: maxLength(100),
        },
        auto_response: {
          minLength: minLength(0),
          maxLength: maxLength(255),
        },
      },
    },
  },
  data: () => ({
    activeId: "",
    showSubmitButton: false,
    submitLabel: "",
    isLoading: false,
    alert: {
      show: false,
      message: "",
      type: "error",
    },
    parameters: {
      search: "",
    },
    itemDialog: false,
    dialogName: "",
    form: {
      code: "",
      name: "",
      configuration: {
        dinstar_url: "",
        receive_ports: "",
        smart_ports: "",
        globe_ports: "",
        token: "",
        auto_response: "",
      },
    },
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
        code: "",
        name: "",
        configuration: {
          dinstar_url: "",
          receive_ports: "",
          smart_ports: "",
          globe_ports: "",
          token: "",
          auto_response: "",
        },
      };
    },
    generateTable() {
      this.$refs.table.setParameters(this.parameters);
      this.$refs.table.generate();
    },
    editItem(item) {
      this.$v.$reset();
      this.submitLabel = "Update";
      this.showSubmitButton = true;
      this.form = item;
      this.activeId = item.id;
      this.alert.show = false;
      this.itemDialog = true;
      this.dialogName = "Edit: " + item.name;
    },
    deleteItem(item) {
      this.$v.$reset();
      this.submitLabel = "Yes";
      this.showSubmitButton = true;
      this.activeId = item.id;
      this.form = item;
      this.dialogName = "Delete Confirmation";
      this.alert.show = false;
      this.itemDialog = true;
    },
    submit() {
      this.isLoading = true;
      this.$refs.loading.open();
      let url = this.$api;
      if (this.dialogName == "Add Project") {
        url += "/projects";
      } else if (this.dialogName == "Delete Confirmation") {
        url += "/projects/" + this.activeId;
        this.form._method = "DELETE";
      } else {
        url += "/projects/" + this.activeId;
        this.form._method = "PUT";
      }
      this.$v.$touch();
      if (this.$v.$invalid) {
        setTimeout(() => {
          this.$scrollToTop();
          this.alert = {
            show: true,
            message: "Please complete the form, see errors below.",
            type: "error",
          };
          this.$refs.loading.close();
          this.isLoading = false;
        }, 1000);
      } else {
        this.$http
          .post(url, this.form)
          .then((response) => {
            setTimeout(() => {
              this.alert = {
                show: true,
                message: response.data.message,
                type: "success",
              };
              this.showSubmitButton = false;
              this.generateTable();
              this.$scrollToTop();
              this.$refs.loading.close();
              this.isLoading = false;
            }, 1000);
          })
          .catch((error) => {
            setTimeout(() => {
              this.$scrollToTop();
              this.alert = {
                show: true,
                message: "Something went wrong! Please contact the Administrator.",
                type: "error",
              };
              this.$refs.loading.close();
              this.isLoading = false;
            }, 1000);
          });
      }
    },
  },
  mounted() {
    this.generateTable();
  },
  computed: {
    codeErrors() {
      const errors = [];
      if (!this.$v.form.code.$dirty) return errors;
      !this.$v.form.code.required && errors.push("Code is required.");
      !this.$v.form.code.maxLength &&
        errors.push("Code must be at most 350 characters long");
      !this.$v.form.code.minLength &&
        errors.push("Code must be at least 4 characters long");
      return errors;
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.form.name.$dirty) return errors;
      !this.$v.form.name.required && errors.push("Name is required.");
      !this.$v.form.name.maxLength &&
        errors.push("Name must be at most 350 characters long");
      !this.$v.form.name.minLength &&
        errors.push("Name must be at least 4 characters long");
      return errors;
    },
    dinstarUrlErrors() {
      const errors = [];
      if (!this.$v.form.configuration.dinstar_url.$dirty) return errors;
      !this.$v.form.configuration.dinstar_url.required &&
        errors.push("Dinstar URL is required.");
      !this.$v.form.configuration.dinstar_url.maxLength &&
        errors.push("Dinstar URL must be at most 100 characters long");
      !this.$v.form.configuration.dinstar_url.minLength &&
        errors.push("Dinstar URL must be at least 4 characters long");
      return errors;
    },
    receivePortsErrors() {
      const errors = [];
      if (!this.$v.form.configuration.receive_ports.$dirty) return errors;
      !this.$v.form.configuration.receive_ports.required &&
        errors.push("Receive Ports is required.");
      !this.$v.form.configuration.receive_ports.maxLength &&
        errors.push("Receive Ports must be at most 100 characters long");
      !this.$v.form.configuration.receive_ports.minLength &&
        errors.push("Receive Ports must be at least 1 characters long");
      return errors;
    },
    smartPortsErrors() {
      const errors = [];
      if (!this.$v.form.configuration.smart_ports.$dirty) return errors;
      !this.$v.form.configuration.smart_ports.required &&
        errors.push("Smart Ports is required.");
      !this.$v.form.configuration.smart_ports.maxLength &&
        errors.push("Smart Ports must be at most 100 characters long");
      !this.$v.form.configuration.smart_ports.minLength &&
        errors.push("Smart Ports must be at least 1 characters long");
      return errors;
    },
    globePortsErrors() {
      const errors = [];
      if (!this.$v.form.configuration.globe_ports.$dirty) return errors;
      !this.$v.form.configuration.globe_ports.required &&
        errors.push("Globe Ports is required.");
      !this.$v.form.configuration.globe_ports.maxLength &&
        errors.push("Globe Ports must be at most 100 characters long");
      !this.$v.form.configuration.globe_ports.minLength &&
        errors.push("Globe Ports must be at least 1 characters long");
      return errors;
    },
    tokenErrors() {
      const errors = [];
      if (!this.$v.form.configuration.token.$dirty) return errors;
      !this.$v.form.configuration.token.required && errors.push("Token is required.");
      !this.$v.form.configuration.token.maxLength &&
        errors.push("Token must be at most 100 characters long");
      !this.$v.form.configuration.token.minLength &&
        errors.push("Token must be at least 4 characters long");
      return errors;
    },
    autoResponseErrors() {
      const errors = [];
      if (!this.$v.form.configuration.auto_response.$dirty) return errors;
      !this.$v.form.configuration.auto_response.maxLength &&
        errors.push("Auto Response must be at most 255 characters long");
      return errors;
    },
    width() {
      let breakpointName = this.$vuetify.breakpoint.name;
      if (breakpointName == "xs") {
        return "95%";
      } else {
        return "450px";
      }
    },
  },
};
</script>