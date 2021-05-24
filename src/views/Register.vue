<template>
  <v-container
    ><header class="text-h4">Registration</header>
    <form>
      <v-row v-if="alert.show">
        <v-col cols="12">
          <v-alert :type="alert.type">{{ alert.message }}</v-alert>
        </v-col>
      </v-row>
      <v-row align="center">
        <!-- Full Name -->
        <v-col cols="12" sm="12" md="6" lg="5" xl="5">
          <v-text-field
            v-model="form.fullname"
            label="Full Name"
            @input="$v.form.fullname.$touch()"
            @blur="$v.form.fullname.$touch()"
            :error-messages="nameErrors"
            required
          ></v-text-field>
        </v-col>
        <!-- E-Mail -->
        <v-col cols="12" sm="12" md="6" lg="6" xl="6">
          <v-text-field
            v-model="form.email"
            label="E-Mail Address"
            type="mail"
            @input="$v.form.email.$touch()"
            @blur="$v.form.email.$touch()"
            :error-messages="emailErrors"
            required
          ></v-text-field>
        </v-col>
        <!-- Password -->
        <v-col cols="12" sm="12" md="6" lg="4" xl="4">
          <v-text-field
            v-model="form.password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
            label="Password"
            @input="$v.form.password.$touch()"
            @blur="$v.form.password.$touch()"
            @keyup.enter="submit"
            :error-messages="passwordErrors"
            :disabled="isLoading"
            required
          ></v-text-field>
        </v-col>
        <!-- Confirm Password -->
        <v-col cols="12" sm="12" md="6" lg="4" xl="4">
          <v-text-field
            v-model="form.confirm_password"
            :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showConfirmPassword ? 'text' : 'password'"
            @click:append="showConfirmPassword = !showConfirmPassword"
            label="Confirm Password"
            @input="$v.form.confirm_password.$touch()"
            @blur="$v.form.confirm_password.$touch()"
            @keyup.enter="submit"
            :error-messages="confirmPasswordErrors"
            :disabled="isLoading"
            required
          ></v-text-field>
        </v-col>
        <!-- Mobile Number -->
        <v-col cols="12" sm="6" md="3" lg="3" xl="3">
          <v-text-field
            v-model="form.mobile_number"
            label="Mobile Number"
            @input="$v.form.mobile_number.$touch()"
            @blur="$v.form.mobile_number.$touch()"
            :error-messages="mobileErrors"
            required
          ></v-text-field>
        </v-col>
        <!-- Age -->
        <v-col cols="12" sm="6" md="3" lg="2" xl="2">
          <v-text-field
            v-model="form.age"
            label="Age"
            @input="$v.form.age.$touch()"
            @blur="$v.form.age.$touch()"
            :error-messages="ageErrors"
            required
          ></v-text-field>
        </v-col>
        <!-- Gender -->
        <v-col cols="12" sm="6" md="3" lg="2" xl="2">
          <v-select
            v-model="form.gender"
            :items="genders"
            label="Gender"
            @input="$v.form.gender.$touch()"
            @blur="$v.form.gender.$touch()"
            :error-messages="genderErrors"
          ></v-select>
        </v-col>
        <!-- Employee Number -->
        <v-col cols="12" sm="6" md="3" lg="2" xl="2">
          <v-text-field
            label="Employee Number"
            v-model="form.employee_number"
            @input="$v.form.employee_number.$touch()"
            @blur="$v.form.employee_number.$touch()"
            :error-messages="employeeNumberErrors"
          ></v-text-field>
        </v-col>
        <!-- Status -->
        <v-col cols="12" sm="6" md="3" lg="2" xl="2">
          <v-select
            :items="statuses"
            label="Status"
            v-model="form.visitor_type"
            @input="$v.form.visitor_type.$touch()"
            @blur="$v.form.visitor_type.$touch()"
            :error-messages="statusErrors"
            required
          ></v-select>
        </v-col>
        <!-- Status Specify if Others is selected -->
        <v-col cols="12" sm="6" md="3" lg="2" xl="2">
          <v-text-field
            v-model="form.visitor_type_others"
            :disabled="form.visitor_type != 'Others'"
            label="Specify Status"
            @input="$v.form.visitor_type_others.$touch()"
            @blur="$v.form.visitor_type_others.$touch()"
            :error-messages="statusOthersErrors"
          ></v-text-field>
        </v-col>
        <!-- Department -->
        <v-col cols="12" sm="6" md="6" lg="4" xl="4">
          <v-select
            :items="departments"
            label="Department"
            v-model="form.department"
            @input="$v.form.department.$touch()"
            @blur="$v.form.department.$touch()"
            :error-messages="departmentErrors"
            required
          ></v-select>
        </v-col>
        <!-- Site -->
        <v-col cols="12" sm="6" md="2" lg="2" xl="2">
          <v-select
            :items="sites"
            label="Site"
            v-model="form.site"
            @input="$v.form.site.$touch()"
            @blur="$v.form.site.$touch()"
            :error-messages="siteErrors"
            required
          ></v-select>
        </v-col>
        <!-- Nature of Visit -->
        <v-col cols="12" sm="6" md="3" lg="2" xl="2">
          <v-select
            :items="purposes"
            label="Nature of Visit"
            v-model="form.nature_of_visit"
            @input="$v.form.nature_of_visit.$touch()"
            @blur="$v.form.nature_of_visit.$touch()"
            :error-messages="natureErrors"
            required
          ></v-select>
        </v-col>
        <!-- Nature of Visit Specify if Others is selected -->
        <v-col cols="12" sm="6" md="3" lg="2" xl="2">
          <v-text-field
            v-model="form.nature_of_visit_others"
            label="Specify Nature of Visit"
            :disabled="form.nature_of_visit != 'Others'"
            @input="$v.form.nature_of_visit_others.$touch()"
            @blur="$v.form.nature_of_visit_others.$touch()"
            :error-messages="natureOthersErrors"
          ></v-text-field>
        </v-col>
        <!-- Household Headcount -->
        <v-col cols="12" sm="5" md="4" lg="3" xl="3">
          <v-text-field
            label="How many are you in the house?"
            v-model="form.household_headcount"
            @input="$v.form.household_headcount.$touch()"
            @blur="$v.form.household_headcount.$touch()"
            :error-messages="householdHeadcountErrors"
          ></v-text-field>
        </v-col>
        <!-- Home Address -->
        <v-col cols="12" sm="7" md="10" lg="5" xl="5">
          <v-text-field
            label="Home Address"
            v-model="form.home_address"
            @input="$v.form.home_address.$touch()"
            @blur="$v.form.home_address.$touch()"
            :error-messages="homeAddressErrors"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="12" md="12" lg="3" xl="3">
          <v-btn color="primary" :loading="isLoading" @click="submit">Submit</v-btn>
        </v-col>
      </v-row>
    </form>
    <loading ref="loading" />
  </v-container>
</template>

<script>
import { validationMixin } from "vuelidate";
import {
  required,
  email,
  minLength,
  maxLength,
  between,
  numeric,
  minValue,
  maxValue,
  requiredIf,
  decimal,
  sameAs
} from "vuelidate/lib/validators";
import Loading from "../components/Loading";
export default {
  name: "home",
  mixins: [validationMixin],
  components: { Loading },
  validations: {
    form: {
      password: {
        required,
        sameAsPassword: sameAs("confirm_password"),
        minLength: minLength(8),
        maxLength: maxLength(60),
      },
      confirm_password: {
        required,
        sameAsPassword: sameAs("password"),
      },
      fullname: {
        required,
        maxLength: maxLength(250),
        minLength: minLength(4),
      },
      email: { required, email },
      mobile_number: {
        required,
        maxLength: maxLength(11),
        minLength: minLength(11),
        numeric,
      },
      age: {
        required,
        numeric,
        between: between(1, 200),
      },
      gender: { required },
      visitor_type: { required },
      visitor_type_others: {
        required: requiredIf(function () {
          return this.form.visitor_type == "Others";
        }),
      },
      department: { required },
      site: { required },
      nature_of_visit: { required },
      nature_of_visit_others: {
        required: requiredIf(function () {
          return this.form.nature_of_visit == "Others";
        }),
      },
      employee_number: { required },
      home_address: { required },
      household_headcount: {
        required,
        numeric,
        minValue: (value) => value > 0,
      },
    },
  },
  data: () => ({
    isLoading: false,
    showPassword: false,
    showConfirmPassword: false,
    sites: [],
    departments: [],
    genders: ["Male", "Female"],
    statuses: [
      "Employee",
      "Applicant",
      "Visitor",
      "Housekeeping",
      "Security Guard",
      "Others",
    ],
    purposes: [
      "Work",
      "Personal Visit",
      "Official Visit",
      "Official Visit",
      "Pick up  / Delivery",
      "Interview / Orientation",
      "Appointment",
      "Others",
    ],
    menu: false,
    alert: {
      show: false,
      message: "",
      type: "error",
    },
    form: {},
  }),
  methods: {
    submit() {
      this.isLoading = true;
      this.alert.show = false;
      this.$refs.loading.open();
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$scrollToTop();
        this.alert = {
          show: true,
          message: "Please complete the form, see errors below.",
          type: "error",
        };
        this.$refs.loading.close();
        this.isLoading = false;
      } else {
        this.$http
          .post(this.$api + "/register", this.form)
          .then((response) => {
            this.$scrollToTop();
            this.alert = {
              show: true,
              message: response.data.message,
              type: "success",
            };
            // this.setForm();
            this.$refs.loading.close();
            this.isLoading = false;

            let form = {
              username: this.form.email,
              password: this.form.password,
            };
            this.$store
              .dispatch("login", form)
              .then((response) => {
                this.$router.push({ name: "health-declaration-form" });
                this.isLoading = false;
              })
              .catch((err) => {
                let msg = "";
                if (err.response.data.message) {
                  msg = err.response.data.message;
                } else {
                  msg = "Something went wrong. Please contact the administrator";
                }
                this.alert = {
                  show: true,
                  type: "error",
                  message: msg,
                };
              });
          })
          .catch((error) => {
            this.$scrollToTop();
            if (error.response.data.message !== undefined) {
              this.alert = {
                show: true,
                message: error.response.data.message,
                type: "error",
              };
            } else {
              this.alert = {
                show: true,
                message: "Something went wrong! Please contact the Administrator.",
                type: "error",
              };
            }
            this.$refs.loading.close();
            this.isLoading = false;
          });
      }
    },
    getDropDowns() {
      this.$http
        .get(this.$api + "/declarations/dropdowns")
        .then((resp) => {
          this.sites = resp.data.response.sites;
          this.departments = resp.data.response.departments;
        })
        .catch((err) => {
          alert("Something Went Wrong.");
          console.log(err);
        });
    },
    setForm() {
      this.$v.$reset();
      this.form = {
        date: new Date().toISOString().substr(0, 10),
        fullname: "",
        password: "",
        confirm_password: "",
        mobile_number: "",
        email: "",
        age: "",
        gender: "",
        visitor_type: "",
        visitor_type_others: "",
        nature_of_visit: "",
        nature_of_visit_others: "",
        temperature: "",
        department: "",
        site: "",
        employee_number: "",
        home_address: "",
        household_headcount: "",
      };
    },
  },
  computed: {
    passwordErrors() {
      const errors = [];
      if (!this.$v.form.password.$dirty) return errors;
      !this.$v.form.password.required &&
        errors.push("New Password is required");
      !this.$v.form.password.minLength &&
        errors.push("Password minimum length is 8");
      !this.$v.form.password.maxLength &&
        errors.push("Password minimum length is 60");
      !this.$v.form.confirm_password.sameAsPassword &&
        errors.push("New Password must same as Confirm Password");
      return errors;
    },
    confirmPasswordErrors() {
      const errors = [];
      if (!this.$v.form.confirm_password.$dirty) return errors;
      !this.$v.form.confirm_password.required &&
        errors.push("Confirm Password is required");
      !this.$v.form.confirm_password.sameAsPassword &&
        errors.push("Confirm Password must same as New Password");
      return errors;
    },
    declarationErrors() {
      const errors = [];
      if (!this.$v.form.declaration.$dirty) return errors;
      !this.$v.form.declaration.checked && errors.push("You must agree to continue!");
      return errors;
    },
    dateErrors() {
      const errors = [];
      if (!this.$v.form.date.$dirty) return errors;
      !this.$v.form.date.required && errors.push("Date is required.");
      !this.$v.form.date.minValue && errors.push("Date must be today or future date");
      return errors;
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.form.fullname.$dirty) return errors;
      !this.$v.form.fullname.required && errors.push("Full Name is required.");
      !this.$v.form.fullname.maxLength &&
        errors.push("Full Name must be at most 250 characters long");
      !this.$v.form.fullname.minLength &&
        errors.push("Full Name must be at least 4 characters long");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.form.email.$dirty) return errors;
      !this.$v.form.email.email && errors.push("Must be valid e-mail");
      !this.$v.form.email.required && errors.push("E-mail is required");
      return errors;
    },
    mobileErrors() {
      const errors = [];
      if (!this.$v.form.mobile_number.$dirty) return errors;
      !this.$v.form.mobile_number.required && errors.push("Mobile Number is required.");
      !this.$v.form.mobile_number.numeric &&
        errors.push("Mobile Number must be numeric.");
      !this.$v.form.mobile_number.maxLength &&
        errors.push("Mobile Number must be 11 characters long");
      !this.$v.form.mobile_number.minLength &&
        errors.push("Mobile Number must be 11 characters long");
      return errors;
    },
    ageErrors() {
      const errors = [];
      if (!this.$v.form.age.$dirty) return errors;
      !this.$v.form.age.required && errors.push("Age is required.");
      !this.$v.form.age.numeric && errors.push("Age must be numeric.");
      !this.$v.form.age.between && errors.push("Age must be 1 to 200 number");
      return errors;
    },
    genderErrors() {
      const errors = [];
      if (!this.$v.form.gender.$dirty) return errors;
      !this.$v.form.gender.required && errors.push("Gender is required.");
      return errors;
    },
    statusErrors() {
      const errors = [];
      if (!this.$v.form.visitor_type.$dirty) return errors;
      !this.$v.form.visitor_type.required && errors.push("Status is required");
      return errors;
    },
    statusOthersErrors() {
      const errors = [];
      if (!this.$v.form.visitor_type_others.$dirty) return errors;
      !this.$v.form.visitor_type_others.required && errors.push("Please specify status");
      return errors;
    },
    natureErrors() {
      const errors = [];
      if (!this.$v.form.nature_of_visit.$dirty) return errors;
      !this.$v.form.nature_of_visit.required &&
        errors.push("Nature of Visit is required");
      return errors;
    },
    natureOthersErrors() {
      const errors = [];
      if (!this.$v.form.nature_of_visit_others.$dirty) return errors;
      !this.$v.form.nature_of_visit_others.required && errors.push("Please specify");
      return errors;
    },
    siteErrors() {
      const errors = [];
      if (!this.$v.form.site.$dirty) return errors;
      !this.$v.form.site.required && errors.push("Site is required.");
      return errors;
    },
    departmentErrors() {
      const errors = [];
      if (!this.$v.form.department.$dirty) return errors;
      !this.$v.form.department.required && errors.push("Department is required");
      return errors;
    },
    employeeNumberErrors() {
      const errors = [];
      if (!this.$v.form.employee_number.$dirty) return errors;
      !this.$v.form.employee_number.required &&
        errors.push("Employee Number is required");
      return errors;
    },
    homeAddressErrors() {
      const errors = [];
      if (!this.$v.form.home_address.$dirty) return errors;
      !this.$v.form.home_address.required && errors.push("Home Address is required");
      return errors;
    },
    householdHeadcountErrors() {
      const errors = [];
      if (!this.$v.form.household_headcount.$dirty) return errors;
      !this.$v.form.household_headcount.required && errors.push("This is required");
      !this.$v.form.household_headcount.numeric && errors.push("This must be numeric");
      !this.$v.form.household_headcount.minValue &&
        errors.push("This minimum value is 1");
      return errors;
    },
  },
  mounted() {
    this.setForm();
    this.getDropDowns();
  },
};
</script>
