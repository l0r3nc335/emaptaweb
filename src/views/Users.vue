<template>
  <v-container>
    <v-toolbar-title><h3>Users Management</h3></v-toolbar-title>

    <!-- SEARCH ROW -->  
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
      <!-- Apply -->
      <v-col cols="4">
        <div class="my-2">
          <v-btn @click="generateTable" depressed large color="primary"> Apply </v-btn>
        </div>
      </v-col>
      <!-- Add -->
      <v-col cols="4">
        <div class="my-2 text-right">
          <v-btn @click="openAdd" depressed large color="primary"> Add </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- DATATABLE --> 
    <data-table
      ref="table"
      :hasEdit="true"
      :hasDelete="true"
      @edit="editItem"
      @delete="deleteItem"
      :path="'/users'"
    />

    <!-- MODAL ROW -->  
    <v-dialog v-model="itemDialog" :width="width" transition="dialog-top-transition">
      <template>
        <v-card>
          <!-- Title -->
          <v-card-title>{{ dialogName }}</v-card-title>
          <v-divider></v-divider>

          <!-- Body -->
          <v-card-text style="margin-top: 12px">

            <!-- Top Alert messages -->
            <v-row v-if="alert.show">
              <v-col cols="12">
                <v-alert :type="alert.type" v-html="alert.message">{{
                  alert.message
                }}</v-alert>
              </v-col>
            </v-row>

            <!-- Form -->
            <v-form v-if="dialogName != 'Delete Confirmations'">

              <v-select
                item-text="name"
                item-value="id"
                v-model="form.project"
                :items="projects"
                label="Select Project"
              />

              <!-- Name -->
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.name"
                    :counter="255"
                    label="Name"
                    @input="$v.form.name.$touch()"
                    @blur="$v.form.name.$touch()"
                    required
                    :error-messages="nameErrors"
                  ></v-text-field>
                </v-col>
              </v-row>
              <!-- Username -->
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.username"
                    :counter="255"
                    label="Username"
                    @input="$v.form.username.$touch()"
                    @blur="$v.form.username.$touch()"
                     :error-messages="usernameErrors"
                  ></v-text-field>
                </v-col>
              </v-row>
              <!-- Email -->
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.email"
                    :counter="255"
                    label="Email"
                    @input="$v.form.email.$touch()"
                    @blur="$v.form.email.$touch()"
                    required
                    :error-messages="emailErrors"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Password -->
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.password"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    @click:append="showPassword = !showPassword"
                    :counter="255"
                    label="Password"
                    @input="$v.form.password.$touch()"
                    @blur="$v.form.password.$touch()"
                    required
                    :error-messages="passwordErrors"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
            
          </v-card-text>

          <!-- Footer -->
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
import Loading from "../components/Loading";
import DataTable from "../components/DataTableV2";
export default {
  name: "users",
  mixins: [validationMixin],
  components: { DataTable, Loading },
  validations: {
    form: {
      name: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(255),
      },
      username: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(255),
      },
      email: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(255),
      },
      password: {
        minLength: minLength(4),
        maxLength: maxLength(255),
      },
    },
  },
  data: () => ({
    showSubmitButton: false,
    showPassword: false,
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
    isLoading: false,
    form: {
      currentProjectId: "",
      name: "",
      username: "",
      email: "",
      password: "",
      project:{
        id: "",
        name: "",
        code: ""
      }
    },
    
    projects:[{
      id: "",
      code: "",
      name: ""
    } ],

    tempString: "",
  }),
  methods: {
    dialogContains(action) {
      return this.dialogName.indexOf(action) > -1
    },

    editItem(item) {
      this.form.project = {};
      this.form.password = "";  
      this.getActiveProjects();
      
      //user has existing project
      if(item.project != null && item.project.hasOwnProperty('id')) { // if user has project
        this.form.currentProjectId = item.project.id;
        this.form.project.id = item.project.id;
        this.form.project.name = item.project.name;
        this.form.project.code = item.project.code;
      } else { //project is null
        this.form.project = item.project;
      }

      this.$v.$reset();
      this.submitLabel = "Update";
      this.showSubmitButton = true;

      this.form.email = item.email;
      this.form.name = item.name;
      this.form.username = item.username;
     
      this.activeId = item.id;
      this.alert.show = false;
      this.itemDialog = true;
      this.dialogName = "Edit: " + item.name;

    },
    deleteItem(item) {
      this.getActiveProjects();
      item.password = "";
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
      this.alert.show = false;
      this.$refs.loading.open();
      let url = this.$api;
       
      if (this.dialogName == "Add User") {
        url += "/users";
      } else if (this.dialogName == "Delete Confirmation") {
        url += "/users/" + this.activeId;
        this.form._method = "DELETE";
      } else {
        url += "/users/" + this.activeId;
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
      }else {
        this.isLoading = false;
 
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
            this.form.password = "";
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
    generateTable() {
      this.$refs.table.setParameters(this.parameters);
      this.$refs.table.generate();
    },
    openAdd() {
      this.getActiveProjects();
      this.$v.$reset();
      this.submitLabel = "Submit";
      this.showSubmitButton = true;
      this.dialogName = "Add User";
      this.alert.show = false;
      this.itemDialog = true;
      
      this.form = {
        name: "",
        username: "",
        email: "",
        password: ""
      }
    },
    getActiveProjects() {
      this.$http
          .get(this.$api + "/active-projects")
          .then((response) => {
            this.projects = response.data.response;
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
    },
   
  },
  computed: {
    usernameErrors() {
      const errors = [];
      if (!this.$v.form.username.$dirty) return errors;
      !this.$v.form.username.required && errors.push("Username is required.");
      !this.$v.form.username.maxLength &&
        errors.push("Username must be at most 350 characters long");
      !this.$v.form.username.minLength &&
        errors.push("Username must be at least 4 characters long");
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
    emailErrors() {
      const errors = [];
      if (!this.$v.form.email.$dirty) return errors;
      !this.$v.form.email.required && errors.push("Email is required.");
      !this.$v.form.email.maxLength &&
        errors.push("Email must be at most 350 characters long");
      !this.$v.form.email.minLength &&
        errors.push("Email must be at least 4 characters long");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.form.password.$dirty) return errors;
      !this.$v.form.password.maxLength &&
        errors.push("Password must be at most 350 characters long");
      !this.$v.form.password.minLength &&
        errors.push("Password must be at least 4 characters long");
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
  mounted() {
    this.generateTable();
  },
};
</script>
<style lang="scss">
.v-application .primary {
  color: #00b4ee !important;
}
</style>
