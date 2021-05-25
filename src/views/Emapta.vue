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
      :path="'/agile'"
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
              <!-- Description -->
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.description"
                    :counter="350"
                    label="Description"
                    @input="$v.form.description.$touch()"
                    @blur="$v.form.description.$touch()"
                    required
                    :error-messages="descriptionErrors"
                  ></v-text-field>
                </v-col>
              </v-row>
              <!-- type -->
              <v-row>
                <v-col cols="12">
                  <!--v-text-field
                    v-model="form.type"
                    :counter="350"
                    label="Type"
                    @input="$v.form.type.$touch()"
                    @blur="$v.form.type.$touch()"
                    required
                    :error-messages="typeErrors"
                  ></v-text-field-->

                  <v-select
                    item-text="name"
                    item-value="name"
                    v-model="form.type"
                    :items="types"
                    label="Select a type"
                  />
                </v-col>
              </v-row>

            </v-form>
            <v-row v-if="dialogName == 'Delete Confirmation'">
              <v-col cols="12" v-if="showSubmitButton">
                <p v-html="'Are you sure you want to delete ' + form.description + '?'"></p>
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
      description: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(350),
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
      description: "",
      type:""
    },

    types: [
      {
        name: "principle",
      },
      {
        name: "values",
      }
    ]
  }),
  methods: {
    openAdd() {
      this.$v.$reset();
      this.submitLabel = "Submit";
      this.showSubmitButton = true;
      this.dialogName = "Add Data";
      this.alert.show = false;
      this.itemDialog = true;
      this.form = {
        description: "",
        type: "",
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
      console.log(item);
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
      if (this.dialogName == "Add Data") {
        url += "/agile";
      } else if (this.dialogName == "Delete Confirmation") {
        url += "/agile/" + this.activeId;
        this.form._method = "DELETE";
      } else {
        url += "/agile/" + this.activeId;
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
            console.log(this.form);
            console.log(response);
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
    descriptionErrors() {
      const errors = [];
      if (!this.$v.form.description.$dirty) return errors;
      !this.$v.form.description.required && errors.push("Description is required.");
      !this.$v.form.description.maxLength &&
        errors.push("Description must be at most 350 characters long");
      !this.$v.form.description.minLength &&
        errors.push("Description must be at least 4 characters long");
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