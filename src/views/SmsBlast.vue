<template>
  <v-container>
    <v-toolbar-title><h3></h3></v-toolbar-title>
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
          <v-btn @click="openAdd" depressed large color="primary"> Create </v-btn>
        </div>
      </v-col>
    </v-row>
    <data-table
      ref="table"
      :path="'/sms-blasts'"
      :has-vue-json-excel="true"
      :download-file-name="'sms-blast'"
    />
    <v-dialog
      :persistent="isLoading"
      v-model="itemDialog"
      :width="width"
      transition="dialog-top-transition"
    >
      <template>
        <v-card>
          <v-card-title>Create Blast</v-card-title>
          <v-divider></v-divider>
          <v-card-text style="margin-top: 12px">
            <v-row v-if="alert.show">
              <v-col cols="12">
                <v-alert :type="alert.type" v-html="alert.message"></v-alert>
              </v-col>
            </v-row>
            <v-form>
              <v-row>
                <v-col cols="12">
                  <v-textarea
                    :loading="isLoading"
                    :readonly="isLoading"
                    class="mx-2"
                    label="Message"
                    rows="5"
                    prepend-icon="mdi-comment"
                    :counter="150"
                    outlined
                    required
                    v-model="form.message"
                    @input="$v.form.message.$touch()"
                    @blur="$v.form.message.$touch()"
                    :error-messages="messageErrors"
                  ></v-textarea>
                </v-col>
              </v-row>
              <!-- Upload Number -->
              <v-row>
                <v-col cols="12">
                  <v-file-input
                    id="file"
                    :loading="isLoading"
                    small-chips
                    label="Select CSV File Numbers"
                    ref="file"
                    accept=".csv"
                    outlined
                    v-model="form.file"
                    required
                    @input="$v.form.file.$touch()"
                    @blur="$v.form.file.$touch()"
                    :error-messages="fileErrors"
                  ></v-file-input
                ></v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="justify-end">
            <v-btn :loading="isLoading" text color="primary" @click="submit">
              Submit
            </v-btn>
            <v-btn :loading="isLoading" text color="error" @click="itemDialog = false">
              Close
            </v-btn>
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

const isCSV = (value, vm) => {
  if (value == null) {
    return false;
  }
  let extension = value["name"].split(".").pop();
  return extension == "csv";
};
export default {
  name: "sms-blasts",
  mixins: [validationMixin],
  components: { DataTable, Loading },
  validations: {
    form: {
      message: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(150),
      },
      file: {
        required,
        isCSV,
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
    form: { file: "", message: "" },
  }),
  methods: {
    onFileChange(e) {
      this.form.file = this.$refs.file.files[0];
    },
    openAdd() {
      this.itemDialog = true;
      this.alert.show = false;
      this.form.file = null;
      this.form.message = "";
      this.$v.$reset();
    },
    generateTable() {
      this.$refs.table.setParameters(this.parameters);
      this.$refs.table.generate();
    },
    submit() {
      this.isLoading = true;
      this.$refs.loading.open();
      this.$v.$touch();
      if (this.$v.$invalid) {
        setTimeout(() => {
          this.$scrollToTop();
          this.alert = {
            show: true,
            message: "Please complete the form, see errors below.",
            type: "error",
          };
          this.$v.$reset();
          this.$refs.loading.close();
          this.isLoading = false;
        }, 1000);
      } else {
        let url = this.$api + "/sms-blasts";
        let formData = new FormData();
        formData.append("message", this.form.message);
        formData.append("file", this.form.file);
        let headers = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
        this.$http
          .post(url, formData, headers)
          .then((response) => {
            setTimeout(() => {
              this.alert = {
                show: true,
                message: response.data.message,
                type: response.data.response.alert_type,
              };
              this.form.file = null;
              this.form.message = "";
              this.generateTable();
              this.$refs.loading.close();
              this.isLoading = false;
            }, 1000);
          })
          .catch(() => {
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
    messageErrors() {
      const errors = [];
      if (!this.$v.form.message.$dirty) return errors;
      !this.$v.form.message.required && errors.push("Message is required.");
      !this.$v.form.message.maxLength &&
        errors.push("Message must be at most 150 characters long");
      !this.$v.form.message.minLength &&
        errors.push("Message must be at least 4 characters long");
      return errors;
    },
    fileErrors() {
      const errors = [];
      if (!this.$v.form.file.$dirty) return errors;
      !this.$v.form.file.required && errors.push("CSV File is required.");
      !this.$v.form.file.isCSV && errors.push("File is not CSV.");
      return errors;
    },
    width() {
      let breakpointName = this.$vuetify.breakpoint.name;
      if (breakpointName == "xs") {
        return "95%";
      } else {
        return "500px";
      }
    },
  },
};
</script>
