<template>
  <v-container>
    <v-row v-if="alert.show">
      <v-col clos="12" sm="12">
        <v-alert :type="alert.type">{{ alert.message }}</v-alert>
      </v-col>
    </v-row>
    <header class="text-h4">EMPLOYEE-VISITOR'S DECLARATION FORM</header>
    <v-form>
      <v-row>
        <!-- Date of Visit -->
        <v-col cols="12" sm="2">
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
            :disabled="true"
            required
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="form.date"
                label="Visit Date"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
                @input="$v.form.date.$touch()"
                @blur="$v.form.date.$touch()"
                :error-messages="dateErrors"
                required
              ></v-text-field>
            </template>
            <v-date-picker v-model="form.date" @input="menu = false"></v-date-picker>
          </v-menu>
        </v-col>
        <!-- Fullname -->
        <v-col cols="12" sm="3">
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
        <v-col cols="12" sm="2">
          <v-text-field
            v-model="form.email"
            label="E-Mail Address"
            @input="$v.form.email.$touch()"
            @blur="$v.form.email.$touch()"
            :error-messages="emailErrors"
            required
          ></v-text-field>
        </v-col>
        <!-- Mobile Number -->
        <v-col cols="12" sm="2">
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
        <v-col cols="12" sm="1">
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
        <v-col cols="12" sm="2">
          <v-select
            v-model="form.gender"
            :items="genders"
            label="Gender"
            @input="$v.form.gender.$touch()"
            @blur="$v.form.gender.$touch()"
            :error-messages="genderErrors"
          ></v-select>
        </v-col>
      </v-row>
      <v-row align="center">
        <!-- Employee Number -->
        <v-col cols="12" sm="2">
          <v-text-field
            label="Employee Number"
            v-model="form.employee_number"
            @input="$v.form.employee_number.$touch()"
            @blur="$v.form.employee_number.$touch()"
            :error-messages="employeeNumberErrors"
          ></v-text-field>
        </v-col>
        <!-- Status -->
        <v-col cols="12" sm="2">
          <v-select
            :items="statuses"
            label="Status"
            v-model="form.visitor_type"
            @input="$v.form.visitor_type.$touch()"
            @blur="$v.form.visitor_type.$touch()"
            :error-messages="statusErrors"
            :dense="true" 
            required
          ></v-select>
        </v-col>
        <!-- Status Specify if Others is selected -->
        <v-col cols="12" sm="2">
          <v-text-field
            v-model="form.visitor_type_others"
            :disabled="form.visitor_type != 'Others'"
            label="Specify Status"
            @input="$v.form.visitor_type_others.$touch()"
            @blur="$v.form.visitor_type_others.$touch()"
            :error-messages="statusOthersErrors"
          ></v-text-field>
        </v-col>
        <!-- Nature of Visit -->
        <v-col cols="12" sm="2">
          <v-select
            :items="purposes"
            label="Nature of Visit"
            v-model="form.nature_of_visit"
            @input="$v.form.nature_of_visit.$touch()"
            @blur="$v.form.nature_of_visit.$touch()"
            :error-messages="natureErrors"
            :dense="true" 
            required
          ></v-select>
        </v-col>
        <!-- Nature of Visit Specify if Others is selected -->
        <v-col cols="12" sm="2">
          <v-text-field
            v-model="form.nature_of_visit_others"
            label="Specify Nature of Visit"
            :disabled="form.nature_of_visit != 'Others'"
            @input="$v.form.nature_of_visit_others.$touch()"
            @blur="$v.form.nature_of_visit_others.$touch()"
            :error-messages="natureOthersErrors"
          ></v-text-field>
        </v-col>
        <!-- Temperature -->
        <v-col cols="12" sm="2">
          <v-text-field
            label="Temperature"
            v-model="form.temperature"
            @input="$v.form.temperature.$touch()"
            @blur="$v.form.temperature.$touch()"
            :error-messages="temperatureErrors"
            required
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row align="center">
        <!-- Department -->
        <v-col cols="12" sm="3">
          <v-select
            :items="departments"
            label="Department"
            v-model="form.department"
            @input="$v.form.department.$touch()"
            @blur="$v.form.department.$touch()"
            :error-messages="departmentErrors"
            :dense="true" 
            required
          ></v-select>
        </v-col>
        <!-- Site -->
        <v-col cols="12" sm="2">
          <v-select
            :items="sites"
            label="Site"
            v-model="form.site"
            @input="$v.form.site.$touch()"
            @blur="$v.form.site.$touch()"
            :error-messages="siteErrors"
            :dense="true" 
            required
          ></v-select>
        </v-col>
        <!-- Home Address -->
        <v-col cols="12" sm="7">
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
        <v-col cols="12" sm="12">
          <header class="text-h6">PLEASE ANSWER THE FOLLOWING HEALTH-RELATED QUESTIONS</header>
        </v-col>
      </v-row>
      <!-- Personal Condition Checklist -->
      <v-row align="center">
        <v-col cols="12" sm="3">
          <header>1. Are You Experiencing any of the following. Please Check.</header>
        </v-col>
        <v-col cols="12" sm="2" v-for="experience in experiences" :key="experience">
          <v-checkbox
            v-model="form.health_check"
            :label="experience"
            :value="experience"
            hide-details
          ></v-checkbox>
        </v-col>
      </v-row>
      <!-- Contact COVID-19 Positive -->
      <v-row align="center">
        <v-col cols="12" sm="8">
          <header>2. Have you been in contact or stayed in a closed environment with a person potentially exposed to COVID-19 and/or confirmed COVID-19 person, or anyone related or had contact with a confirmed COVID-19 patient? (Friend, Relative, Neighbor, Colleague)</header>
        </v-col>
        <v-col cols="12" sm="2">
          <v-radio-group v-model="form.contact_covid" row>
            <v-radio label="Yes" :value="true"></v-radio>
            <v-radio label="No" :value="false"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <!-- Contact With Flu Person -->
      <v-row align="center">
        <v-col cols="12" sm="8">
          <header>3. Did you have any contact with someone with fever, cough, colds, sore throat in the past 3 weeks?</header>
        </v-col>
        <v-col cols="12" sm="2">
          <v-radio-group v-model="form.contact_flu" row>
            <v-radio label="Yes" :value="true"></v-radio>
            <v-radio label="No" :value="false"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <!-- Travelled Outside PH 14 days-->
      <v-row align="center">
        <v-col cols="12" sm="8">
          <header>4. Have you travelled outside the Philippines in the past 14 days?</header>
        </v-col>
        <v-col cols="12" sm="2">
          <v-radio-group v-model="form.travelled_outside_ph" row>
            <v-radio label="Yes" :value="true"></v-radio>
            <v-radio label="No" :value="false"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <!-- Travelled Around NCR 14 days -->
      <v-row align="center">
        <v-col cols="12" sm="8">
          <header>5. Have you ever travelled to any area in your Region aside from your home in the last 14 days?</header>
        </v-col>
        <v-col cols="12" sm="2">
          <v-radio-group v-model="form.travelled_ncr" row>
            <v-radio label="Yes" :value="true"></v-radio>
            <v-radio label="No" :value="false"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <!-- List of places you've been to yesterday -->
      <v-row>
        <v-col cols="12" sm="12">
          <v-text-field
            label="6. List the places you've been to yesterday. (For Contact Tracing)"
            v-model="form.places_yesterday"
            @input="$v.form.places_yesterday.$touch()"
            @blur="$v.form.places_yesterday.$touch()"
            :error-messages="placesYesterdayErrors"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="12">
          <header class="text-h6">ADDITIONAL SAFETY AND HEALTH CHECKLIST</header>
        </v-col>
      </v-row>
      <!-- 1. Household Headcount -->
      <v-row>
        <v-col cols="12" sm="5">
          <v-text-field
            label="1. How many are you in the house?"
            v-model="form.household_headcount"
            @input="$v.form.household_headcount.$touch()"
            @blur="$v.form.household_headcount.$touch()"
            :error-messages="householdHeadcountErrors"
          ></v-text-field>
        </v-col>
      </v-row>
      <!-- 2. Ill in the household -->
      <v-row align="center">
        <v-col cols="12" sm="4">
          <header>2. Is there anyone currently ill in the household?</header>
        </v-col>
        <v-col cols="12" sm="2">
          <v-radio-group v-model="form.ill_in_household" row>
            <v-radio label="Yes" :value="true"></v-radio>
            <v-radio label="No" :value="false"></v-radio>
          </v-radio-group>
        </v-col>
        <!-- Ill in the household Symptoms -->
        <v-col cols="12" sm="3">
          <v-text-field
            label="If Yes, what are the symptoms?"
            v-model="form.ill_in_household_symptoms"
            :disabled="!form.ill_in_household"
            @input="$v.form.ill_in_household_symptoms.$touch()"
            @blur="$v.form.ill_in_household_symptoms.$touch()"
            :error-messages="householdSymptomsErrors"
          ></v-text-field>
        </v-col>
        <!-- I'll in the household How Long? -->
        <v-col cols="12" sm="3">
          <v-text-field
            label="3. How long has the symptoms existed?"
            v-model="form.ill_in_household_how_long"
            :disabled="!form.ill_in_household"
            @input="$v.form.ill_in_household_how_long.$touch()"
            @blur="$v.form.ill_in_household_how_long.$touch()"
            :error-messages="householdHowLongErrors"
          ></v-text-field>
        </v-col>
      </v-row>
      <!-- 4. Ill Examined by Doctor-->
      <v-row align="center">
        <v-col cols="12" sm="4">
          <header>4. Has a medical Worker/Doctor examined the patient?</header>
        </v-col>
        <v-col cols="12" sm="2">
          <v-radio-group v-model="form.ill_in_household_is_examined" row>
            <v-radio label="Yes" :value="true"></v-radio>
            <v-radio label="No" :value="false"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="12" sm="5">
          <v-text-field
            label="5. Can you give an overview of the examination result?"
            v-model="form.ill_in_household_exam_result"
            :disabled="!form.ill_in_household_is_examined"
            @input="$v.form.ill_in_household_exam_result.$touch()"
            @blur="$v.form.ill_in_household_exam_result.$touch()"
            :error-messages="householdExaminedResultErrors"
          ></v-text-field>
        </v-col>
      </v-row>
      <!-- 6. Personal Condition Checklist Question -->
      <v-row align="center">
        <v-col cols="12" sm="12">
          <header>6. Do you manifest any of the following symptoms. Please Check.</header>
        </v-col>
      </v-row>
      <!-- 6. Personal Condition Checklist Answers -->
      <v-row align="center">
        <v-col cols="12" sm="3" v-for="symptom in symptoms" :key="symptom">
          <v-checkbox v-model="form.symptoms_check" :label="symptom" :value="symptom" hide-details></v-checkbox>
        </v-col>
      </v-row>
      <!-- 6a. Pre Existing Health Conditions -->
      <v-row align="center">
        <v-col cols="12" sm="4">
          <header>6a. Do you have any pre existing health conditions that may put you at high risk of COVID-19?</header>
        </v-col>
        <v-col cols="12" sm="2">
          <v-radio-group v-model="form.pre_existing_conditions" row>
            <v-radio label="Yes" :value="true"></v-radio>
            <v-radio label="No" :value="false"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="12" sm="6">
          <v-select
            :items="pre_existing_conditions"
            :dense="true" 
            label="If yes, select one."
            v-model="form.pre_existing_conditions_yes"
            :disabled="!form.pre_existing_conditions"
            @input="$v.form.pre_existing_conditions_yes.$touch()"
            @blur="$v.form.pre_existing_conditions_yes.$touch()"
            :error-messages="preExistingConditionsErrors"
            required
          ></v-select>
        </v-col>
      </v-row>
      <!-- 7. Attended Mass Gathering -->
      <v-row align="center">
        <v-col cols="12" sm="4">
          <header>7. Have you attended a mass gathering/meeting in the last 14 days?</header>
        </v-col>
        <v-col cols="12" sm="2">
          <v-radio-group v-model="form.mass_gathering" row>
            <v-radio label="Yes" :value="true"></v-radio>
            <v-radio label="No" :value="false"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            label="If Yes, where and when?"
            v-model="form.mass_gathering_yes"
            :disabled="!form.mass_gathering"
            @input="$v.form.mass_gathering_yes.$touch()"
            @blur="$v.form.mass_gathering_yes.$touch()"
            :error-messages="massGatheringYesErrors"
          ></v-text-field>
        </v-col>
      </v-row>
      <!-- 8. Household Attended Mass Gathering-->
      <v-row align="center">
        <v-col cols="12" sm="4">
          <header>8. Did anyone from your household attended a mass gathering/meeting in the last 14 days?</header>
        </v-col>
        <v-col cols="12" sm="2">
          <v-radio-group v-model="form.household_mass_gathering" row>
            <v-radio label="Yes" :value="true"></v-radio>
            <v-radio label="No" :value="false"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            label="If Yes, where and when?"
            v-model="form.household_mass_gathering_yes"
            :disabled="!form.household_mass_gathering"
            @input="$v.form.household_mass_gathering_yes.$touch()"
            @blur="$v.form.household_mass_gathering_yes.$touch()"
            :error-messages="householdMassGatheringYesErrors"
          ></v-text-field>
        </v-col>
      </v-row>
      <!-- DECLARTION (I AGREE ...) -->
      <v-row>
        <v-col cols="12" sm="12">
          <span class="red--text">DECLARATION:</span>
          <v-checkbox
            v-model="form.declaration"
            label="I hereby certify that the above information is true and complete. I understand that my failure to answer, or any false or misleading information given by me may be used as a ground for disciplinary action."
            :value="true"
            @change="$v.form.declaration.$touch()"
            @blur="$v.form.declaration.$touch()"
            :error-messages="declarationErrors"
          ></v-checkbox>
        </v-col>
      </v-row>
      <!-- Submit Button -->
      <v-row>
        <v-col clos="12" sm="12">
          <div class="my-2">
            <v-btn :loading="isLoading" @click="submit" depressed large color="primary">Submit</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
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
} from "vuelidate/lib/validators";
import Loading from "../components/Loading";
export default {
  name: "health-declaration-form",
  mixins: [validationMixin],
  components: { Loading },
  validations: {
    form: {
      date: {
        required,
        minValue: (value) => value >= new Date().toISOString().substr(0, 10),
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
      temperature: { required, decimal, between: between(30, 50) },
      employee_number: { required },
      home_address: { required },
      places_yesterday: { required },
      household_headcount: {
        required,
        numeric,
        minValue: (value) => value > 0,
      },
      ill_in_household_symptoms: {
        required: requiredIf(function () {
          return this.form.ill_in_household;
        }),
      },
      ill_in_household_how_long: {
        required: requiredIf(function () {
          return this.form.ill_in_household;
        }),
      },
      ill_in_household_exam_result: {
        required: requiredIf(function () {
          return this.form.ill_in_household_is_examined;
        }),
      },
      pre_existing_conditions_yes: {
        required: requiredIf(function () {
          return this.form.pre_existing_conditions;
        }),
      },
      mass_gathering_yes: {
        required: requiredIf(function () {
          return this.form.mass_gathering;
        }),
      },
      household_mass_gathering_yes: {
        required: requiredIf(function () {
          return this.form.household_mass_gathering;
        }),
      },
      declaration: {
        checked(val) {
          return val;
        },
      },
    },
  },
  data: () => ({
    sites: [],
    departments: [],
    genders: ["Male", "Female"],
    statuses: ["Employee", "Applicant", "Visitor", "Housekeeping", "Security Guard", "Others"],
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
    pre_existing_conditions: [
      "Asthma (moderate-to-severe)",
      "Cerebrovascular disease (affects blood vessels and blood supply to the brain)",
      "Chronic kidney disease",
      "COPD (chronic obstructive pulmonary disease)",
      "Cystic fibrosis",
      "Hypertension or high blood pressure",
      "Immunocompromised state (weakened immune system) from blood or bone marrow transplant, immune deficiencies, HIV, use of corticosteroids, or use of other immune weakening medicines",
      "Immunocompromised state (weakened immune system) from solid organ transplant",
      "Liver disease",
      "Neurologic conditions, such as dementia",
      "Obesity (body mass index [BMPI] of 30 or higher)",
      "Pregnancy",
      "Pulmonary fibrosis (having damaged or scarred lung tissues)",
      "Serious heart conditions, such as heart failure, coronary artery disease, or cardiomyopathies",
      "Sickle cell disease",
      "Thalassemia (a type of blood disorder)",
      "Type 1 diabetes mellitus",
      "Type 2 diabetes mellitus",
    ],
    experiences: [
      "Sore Throat",
      "Headache",
      "Body Pains",
      "Fever for the past few days",
    ],
    symptoms: [
      "Fever",
      "Dry Cough",
      "Headache",
      "Head or muscle ache",
      "Sore throat",
      "Loss of taste or smell",
      "Chills",
      "Nausea, Diarrhea, Vomiting",
      "Difficulty breathing or shortness of breath",
    ],
    menu: false,
    alert: {
      show: false,
      message: "",
      type: "error",
    },
    isLoading: false,
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
          .post(this.$api + "/declarations", this.form)
          .then((response) => {
            this.$scrollToTop();
            this.alert = {
              show: true,
              message:
                "Submit form success, please wait for the confirmation email or message. Thank you!",
              type: "success",
            };
            this.setForm();
            this.$refs.loading.close();
            this.isLoading = false;
            this.$store.dispatch('setResult', response.data.response);
            setTimeout(() => {
              this.$router.push({
                name: "health-declaration-result",
              });
            }, 1000);
          })
          .catch((error) => {
            console.log(error)
            this.$scrollToTop();
            this.alert = {
              show: true,
              message:
                "Something went wrong! Please contact the Administrator.",
              type: "error",
            };
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
    getAutoFills() {
      this.$http
        .get(this.$api + "/autofill")
        .then((resp) => {
          this.form.fullname = resp.data.response.fullname;
          this.form.email = resp.data.response.email;
          this.form.mobile_number = resp.data.response.mobile_number;
          this.form.age = resp.data.response.age;
          this.form.gender = resp.data.response.gender;
          const resultStatus = this.statuses.filter(status => status == resp.data.response.visitor_type);
          if (resultStatus.length > 0) {
            this.form.visitor_type = resp.data.response.visitor_type;
          } else {
            this.form.visitor_type = 'Others';
            this.form.visitor_type_others = resp.data.response.visitor_type;
          }
          const textNoT = resp.data.response.nature_of_visit;
          const resultPurpose = this.purposes.filter(NoT => NoT == textNoT);
          if (resultPurpose.length > 0) {
            this.form.nature_of_visit = textNoT;
          } else {
            this.form.nature_of_visit = 'Others';
            this.form.nature_of_visit_others = textNoT;
          }

          this.form.department = resp.data.response.department;
          this.form.site = resp.data.response.site;
          this.form.employee_number = resp.data.response.employee_number;
          this.form.home_address = resp.data.response.home_address;
          this.form.household_headcount = resp.data.response.household_headcount;
        })
    },
    setForm() {
      this.$v.$reset();
      this.form = {
        date: new Date().toISOString().substr(0, 10),
        fullname: "",
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
        health_check: [], //1
        contact_covid: true, //2
        contact_flu: true, //3
        travelled_outside_ph: true, //4
        travelled_ncr: true, //5
        places_yesterday: "", //6
        household_headcount: "",
        ill_in_household: true,
        ill_in_household_symptoms: "",
        ill_in_household_how_long: "",
        ill_in_household_is_examined: true,
        ill_in_household_exam_result: "",
        symptoms_check: [],
        pre_existing_conditions: true, //6a
        pre_existing_conditions_yes: "", //6
        mass_gathering: true,
        mass_gathering_yes: "",
        household_mass_gathering: true,
        household_mass_gathering_yes: "",
        declaration: false,
      };
    },
  },
  computed: {
    declarationErrors() {
      const errors = [];
      if (!this.$v.form.declaration.$dirty) return errors;
      !this.$v.form.declaration.checked &&
        errors.push("You must agree to continue!");
      return errors;
    },
    dateErrors() {
      const errors = [];
      if (!this.$v.form.date.$dirty) return errors;
      !this.$v.form.date.required && errors.push("Date is required.");
      !this.$v.form.date.minValue &&
        errors.push("Date must be today or future date");
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
      !this.$v.form.mobile_number.required &&
        errors.push("Mobile Number is required.");
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
      !this.$v.form.visitor_type_others.required &&
        errors.push("Please specify status");
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
      !this.$v.form.nature_of_visit_others.required &&
        errors.push("Please specify");
      return errors;
    },
    temperatureErrors() {
      const errors = [];
      if (!this.$v.form.temperature.$dirty) return errors;
      !this.$v.form.temperature.required &&
        errors.push("Temperature is required.");
      !this.$v.form.temperature.decimal &&
        errors.push("Temperature must be digit.");
      !this.$v.form.temperature.between &&
        errors.push("Temperature must be 30 to 50 digit");
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
      !this.$v.form.department.required &&
        errors.push("Department is required");
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
      !this.$v.form.home_address.required &&
        errors.push("Home Address is required");
      return errors;
    },
    placesYesterdayErrors() {
      const errors = [];
      if (!this.$v.form.places_yesterday.$dirty) return errors;
      !this.$v.form.places_yesterday.required &&
        errors.push("This is required");
      return errors;
    },
    householdHeadcountErrors() {
      const errors = [];
      if (!this.$v.form.household_headcount.$dirty) return errors;
      !this.$v.form.household_headcount.required &&
        errors.push("This is required");
      !this.$v.form.household_headcount.numeric &&
        errors.push("This must be numeric");
      !this.$v.form.household_headcount.minValue &&
        errors.push("This minimum value is 1");
      return errors;
    },
    householdSymptomsErrors() {
      const errors = [];
      if (!this.$v.form.ill_in_household_symptoms.$dirty) return errors;
      !this.$v.form.ill_in_household_symptoms.required &&
        errors.push("This is required");
      return errors;
    },
    householdHowLongErrors() {
      const errors = [];
      if (!this.$v.form.ill_in_household_how_long.$dirty) return errors;
      !this.$v.form.ill_in_household_how_long.required &&
        errors.push("This is required");
      return errors;
    },
    householdExaminedResultErrors() {
      const errors = [];
      if (!this.$v.form.ill_in_household_exam_result.$dirty) return errors;
      !this.$v.form.ill_in_household_exam_result.required &&
        errors.push("This is required");
      return errors;
    },
    preExistingConditionsErrors(){
      const errors = [];
      if (!this.$v.form.pre_existing_conditions_yes.$dirty) return errors;
      !this.$v.form.pre_existing_conditions_yes.required &&
        errors.push("This is required");
      return errors;
    },
    massGatheringYesErrors() {
      const errors = [];
      if (!this.$v.form.mass_gathering_yes.$dirty) return errors;
      !this.$v.form.mass_gathering_yes.required &&
        errors.push("This is required");
      return errors;
    },
    householdMassGatheringYesErrors() {
      const errors = [];
      if (!this.$v.form.household_mass_gathering_yes.$dirty) return errors;
      !this.$v.form.household_mass_gathering_yes.required &&
        errors.push("This is required");
      return errors;
    },
  },
  mounted() {
    this.$store.dispatch("unsetResult");
    this.setForm();
    this.getDropDowns();
    this.getAutoFills();
  },
};
</script>
<style lang="scss">
.v-btn.v-btn--depressed.theme--light.v-size--large.primary {
  color: #00b4ee;
}
</style>