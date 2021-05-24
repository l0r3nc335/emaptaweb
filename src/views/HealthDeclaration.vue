<template>
  <v-container>
    <!-- Table Parameters -->
    <v-row>
      <!-- Date From -->
      <v-col cols="12" sm="2">
        <v-menu
          v-model="date_from_menu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
          required
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="parameters.date_from"
              label="Start Date"
              prepend-icon="event"
              readonly
              v-bind="attrs"
              v-on="on"
              required
            ></v-text-field>
          </template>
          <v-date-picker v-model="parameters.date_from" @input="date_from_menu = false"></v-date-picker>
        </v-menu>
      </v-col>
      <!-- Date To -->
      <v-col cols="12" sm="2">
        <v-menu
          v-model="date_to_menu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
          required
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="parameters.date_to"
              label="End Date"
              prepend-icon="event"
              readonly
              v-bind="attrs"
              v-on="on"
              required
            ></v-text-field>
          </template>
          <v-date-picker v-model="parameters.date_to" @input="date_to_menu = false"></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="2">
        <v-select :items="conditions" label="Status" v-model="parameters.condition"></v-select>
      </v-col>
      <!-- Site -->
      <v-col cols="12" sm="2">
        <v-select :items="sites" label="Site" v-model="parameters.site"></v-select>
      </v-col>
      <!-- Full Name -->
      <v-col cols="12" sm="2">
        <v-text-field v-model="parameters.fullname" label="Full Name"></v-text-field>
      </v-col>
      <v-col clos="12" sm="2">
        <div class="my-2">
          <v-btn @click="generateTable" depressed large color="primary">Apply</v-btn>
        </div>
      </v-col>
    </v-row>
    <data-table
      ref="table"
      :hasDownloadExcel="true"
      :hasPrint="true"
      :hasView="true"
      @print="print"
      @view="view"
      :path="'/declarations'"
      :downloadFileName="'health-declarations'"
      :downloadPath="'/declarations/download'"
    />
    <v-dialog v-model="itemDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <!-- <v-toolbar-title>Settings</v-toolbar-title> -->
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon dark @click="itemDialog = false">
              Close
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list three-line subheader>
          <v-container>
            <header class="text-h4">EMPLOYEE-VISITOR'S DECLARATION FORM</header>
            <v-form>
              <v-row>
                <!-- Date of Visit -->
                <v-col cols="12" sm="2">
                  <v-text-field
                    v-model="form.date"
                    label="Visit Date"
                    prepend-icon="event"
                    readonly
                  ></v-text-field>
                </v-col>
                <!-- Fullname -->
                <v-col cols="12" sm="3">
                  <v-text-field v-model="form.fullname" label="Full Name" readonly></v-text-field>
                </v-col>
                <!-- E-Mail -->
                <v-col cols="12" sm="2">
                  <v-text-field v-model="form.email" label="E-Mail Address" readonly></v-text-field>
                </v-col>
                <!-- Mobile Number -->
                <v-col cols="12" sm="2">
                  <v-text-field v-model="form.mobile_number" label="Mobile Number" readonly></v-text-field>
                </v-col>
                <!-- Age -->
                <v-col cols="12" sm="1">
                  <v-text-field v-model="form.age" label="Age" readonly></v-text-field>
                </v-col>
                <!-- Gender -->
                <v-col cols="12" sm="2">
                  <v-text-field v-model="form.gender" label="Gender" readonly></v-text-field>
                </v-col>
              </v-row>
              <v-row align="center">
                <!-- Employee Number -->
                <v-col cols="12" sm="2">
                  <v-text-field label="Employee Number" v-model="form.employee_number" readonly></v-text-field>
                </v-col>
                <!-- Status Specify -->
                <v-col cols="12" sm="2">
                  <v-text-field v-model="form.visitor_type" label="Specify Status" readonly></v-text-field>
                </v-col>
                <!-- Nature of Visit -->
                <v-col cols="12" sm="2">
                  <v-text-field
                    v-model="form.nature_of_visit"
                    label="Specify Nature of Visit"
                    readonly
                  ></v-text-field>
                </v-col>
                <!-- Department -->
                <v-col cols="12" sm="3">
                  <v-text-field label="Department" v-model="form.department" readonly></v-text-field>
                </v-col>
                <!-- Site -->
                <v-col cols="12" sm="2">
                  <v-text-field label="Site" v-model="form.site" readonly></v-text-field>
                </v-col>
              </v-row>

              <v-row align="center">
                <!-- Temperature -->
                <v-col cols="12" sm="2">
                  <v-text-field label="Temperature" v-model="form.temperature" readonly></v-text-field>
                </v-col>
                <!-- Home Address -->
                <v-col cols="12" sm="9">
                  <v-text-field label="Home Address" v-model="form.home_address" readonly></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12">
                  <header class="text-h6">PLEASE ANSWER THE FOLLOWING HEALTH-RELATED QUESTIONS</header>
                </v-col>
              </v-row>
              <!-- 1. Personal Condition Checklist -->
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
                    readonly
                  ></v-checkbox>
                </v-col>
              </v-row>
              <!-- 2. Contact COVID-19 Positive -->
              <v-row align="center">
                <v-col cols="12" sm="8">
                  <header>2. Have you been in contact or stayed in a closed environment with a person potentially exposed to COVID-19 and/or confirmed COVID-19 person, or anyone related or had contact with a confirmed COVID-19 patient? (Friend, Relative, Neighbor, Colleague)</header>
                </v-col>
                <v-col cols="12" sm="2">
                  <v-radio-group v-model="form.contact_covid" row readonly>
                    <v-radio label="Yes" :value="true"></v-radio>
                    <v-radio label="No" :value="false"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
              <!-- 3. Contact With Flu Person -->
              <v-row align="center">
                <v-col cols="12" sm="8">
                  <header>3. Did you have any contact with someone with fever, cough, colds, sore throat in the past 3 weeks?</header>
                </v-col>
                <v-col cols="12" sm="2">
                  <v-radio-group v-model="form.contact_flu" row readonly>
                    <v-radio label="Yes" :value="true"></v-radio>
                    <v-radio label="No" :value="false"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
              <!-- 4. Travelled Outside PH 14 days-->
              <v-row align="center">
                <v-col cols="12" sm="8">
                  <header>4. Have you travelled outside the Philippines in the past 14 days?</header>
                </v-col>
                <v-col cols="12" sm="2">
                  <v-radio-group v-model="form.travelled_outside_ph" row readonly>
                    <v-radio label="Yes" :value="true"></v-radio>
                    <v-radio label="No" :value="false"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
              <!-- 5. Travelled Around NCR 14 days -->
              <v-row align="center">
                <v-col cols="12" sm="8">
                  <header>5. Have you ever travelled to any area in your Region aside from your home in the last 14 days?</header>
                </v-col>
                <v-col cols="12" sm="2">
                  <v-radio-group v-model="form.travelled_ncr" row readonly>
                    <v-radio label="Yes" :value="true"></v-radio>
                    <v-radio label="No" :value="false"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
              <!-- 6. List of places you've been to yesterday -->
              <v-row>
                <v-col cols="12" sm="12">
                  <v-text-field
                    label="6. List the places you've been to yesterday. (For Contact Tracing)"
                    v-model="form.places_yesterday"
                    readonly
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
                    readonly
                  ></v-text-field>
                </v-col>
              </v-row>
              <!-- 2. Ill in the household -->
              <v-row align="center">
                <v-col cols="12" sm="4">
                  <header>2. Is there anyone currently ill in the household?</header>
                </v-col>
                <v-col cols="12" sm="2">
                  <v-radio-group v-model="form.ill_in_household" row readonly>
                    <v-radio label="Yes" :value="true"></v-radio>
                    <v-radio label="No" :value="false"></v-radio>
                  </v-radio-group>
                </v-col>
                <!-- Ill in the household Symptoms -->
                <v-col cols="12" sm="3">
                  <v-text-field
                    label="If Yes, what are the symptoms?"
                    v-model="form.ill_in_household_symptoms"
                    readonly
                  ></v-text-field>
                </v-col>
                <!-- I'll in the household How Long? -->
                <v-col cols="12" sm="3">
                  <v-text-field
                    label="3. How long has the symptoms existed?"
                    v-model="form.ill_in_household_how_long"
                    readonly
                  ></v-text-field>
                </v-col>
              </v-row>
              <!-- 4. Ill Examined by Doctor-->
              <v-row align="center">
                <v-col cols="12" sm="4">
                  <header>4. Has a medical Worker/Doctor examined the patient?</header>
                </v-col>
                <v-col cols="12" sm="2">
                  <v-radio-group v-model="form.ill_in_household_is_examined" row readonly>
                    <v-radio label="Yes" :value="true"></v-radio>
                    <v-radio label="No" :value="false"></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col cols="12" sm="5">
                  <v-text-field
                    label="5. Can you give an overview of the examination result?"
                    v-model="form.ill_in_household_exam_result"
                    readonly
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
                  <v-checkbox
                    v-model="form.symptoms_check"
                    :label="symptom"
                    :value="symptom"
                    hide-details
                    readonly
                  ></v-checkbox>
                </v-col>
              </v-row>
              <!-- 6a. Pre Existing Health Conditions -->
              <v-row align="center">
                <v-col cols="12" sm="4">
                  <header>6a. Do you have any pre existing health conditions that may put you at high risk of COVID-19?</header>
                </v-col>
                <v-col cols="12" sm="2">
                  <v-radio-group v-model="form.pre_existing_conditions" row readonly>
                    <v-radio label="Yes" :value="true"></v-radio>
                    <v-radio label="No" :value="false"></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="If yes, select one."
                    v-model="form.pre_existing_conditions_yes"
                    readonly
                  ></v-text-field>
                </v-col>
              </v-row>
              <!-- 7. Attended Mass Gathering -->
              <v-row align="center">
                <v-col cols="12" sm="4">
                  <header>7. Have you attended a mass gathering/meeting in the last 14 days?</header>
                </v-col>
                <v-col cols="12" sm="2">
                  <v-radio-group v-model="form.mass_gathering" row readonly>
                    <v-radio label="Yes" :value="true"></v-radio>
                    <v-radio label="No" :value="false"></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="If Yes, where and when?"
                    v-model="form.mass_gathering_yes"
                    readonly
                  ></v-text-field>
                </v-col>
              </v-row>
              <!-- 8. Household Attended Mass Gathering-->
              <v-row align="center">
                <v-col cols="12" sm="4">
                  <header>8. Did anyone from your household attended a mass gathering/meeting in the last 14 days?</header>
                </v-col>
                <v-col cols="12" sm="2">
                  <v-radio-group v-model="form.household_mass_gathering" row readonly>
                    <v-radio label="Yes" :value="true"></v-radio>
                    <v-radio label="No" :value="false"></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="If Yes, where and when?"
                    v-model="form.household_mass_gathering_yes"
                    readonly
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-list>
      </v-card>
    </v-dialog>
    <div style="display: none" id="printForm">
      <div class="printable">
        <h3>
          {{ form.passed }}_{{ form.site }}_{{ form.fullname }}_{{ form.department }}_{{ form.employee_number }}_HDF
        </h3>
        <h4>EMPLOYEE-VISITOR'S DECLARATION FORM</h4>
        <b>Date:</b> {{ form.date }} <br />
        <b>Full Name:</b> {{ form.fullname }} <br />
        <b>Email:</b> {{ form.email }} <br />
        <b>Mobile Number:</b> {{ form.mobile_number }} <br />
        <b>Age:</b> {{ form.age }} <br />
        <b>Gender:</b> {{ form.gender }} <br />
        <b>Employee Number:</b> {{ form.employee_number }} <br />
        <b>Status:</b> {{ form.visitor_type }} <br />
        <b>Nature of Visit:</b> {{ form.nature_of_vist }} <br />
        <b>Temperature:</b> {{ form.temperature }} <br />
        <b>Department:</b> {{ form.department }} <br />
        <b>Site:</b> {{ form.site }} <br />
        <b>Home Address:</b> {{ form.home_address }} <br />
        <h4>PLEASE ANSWER THE FOLLOWING HEALTH-RELATED QUESTIONS</h4>
        <b>1. Are you experiencing any of the following? Please check:</b> {{ form.health_check }} <br />
        <b>2. Have you been in contact or stayed in a closed environment with a person potentially exposed to<br>COVID-19 and/or confirmed COVID-19 person, or anyone related or had contact with<br> a confirmed COVID-19 patient? (Friend, Relative, Neighbor, Colleague):</b> {{ form.contact_covid ? 'Yes' : 'No' }} <br />
        <b>3. Did you have any contact with someone with fever, cough, colds, sore throat in the past 3 weeks?:</b> {{ form.contact_flu ? 'Yes' : 'No' }} <br />
        <b>4. Have you travelled outside the Philippines in the past 14 days?:</b> {{ form.travelled_outside_ph ? 'Yes' : 'No' }} <br />
        <b>5. Have you ever travelled to any area in your Region aside from your home in the last 14 days?:</b> {{ form.travelled_ncr ? 'Yes' : 'No' }} <br />
        <b>6. List the places you've been to yesterday. (For Contact Tracing):</b> {{ form.places_yesterday }} <br />
        <h4>ADDITIONAL SAFETY AND HEALTH CHECKLIST</h4>
        <b>1. How many are you in the house?:</b> {{ form.household_headcount }} <br />
        <b>2. Is there anyone currently ill in the household?:</b> {{ form.ill_in_household ? 'Yes' : 'No' }} | &nbsp; <b>If Yes, What are the symptoms?:</b> {{ form.ill_in_household_symptoms }} <br />
        <b>3 How long has the symptoms existed?:</b> {{ form.ill_in_household_how_long }} <br />
        <b>4. Has a medical Worker/Doctor examined the patient? :</b> {{ form.ill_in_household_is_examined ? 'Yes' : 'No' }} <br />
        <b>5. Can you give an overview of the examination result?:</b> {{ form.ill_in_household_exam_result }} <br />
        <b>6. Do you manifest any of the following symptoms. Please Check. :</b> {{ form.symptoms_check }} <br />
        <b>6a. Do you have any pre-existing health conditions related to list<br>
         below that may put you at high risk of COVID-19?:</b> {{ form.pre_existing_conditions ? 'Yes' : 'No' }} <br>
        <b>If yes, select one?:</b> {{ form.pre_existing_conditions_yes }} <br />
        <b>7. Have you attended a mass gathering/meeting in the last 14 days?:</b> {{ form.mass_gathering  ? 'Yes' : 'No' }} &nbsp; <b>If yes, where and when?:</b> {{ form.mass_gathering_yes }} <br />
        <b>8. Did anyone from your household attended a mass gathering/meeting in the last 14 days?: </b> {{ form.household_mass_gathering ? 'Yes' : 'No' }}, &nbsp; <b>If yes, where and when? :</b> {{ form.household_mass_gathering_yes }} <br />
      </div>
    </div>
  </v-container>
</template>
<script>
import DataTable from "../components/DataTableV2";
export default {
  name: "health-declarations",
  components: { DataTable },
  data: () => ({
    printView: false,
    sites: ["All"],
    departments: [],
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
    date_from_menu: false,
    date_to_menu: false,
    conditions: ["All", "Passed", "Failed"],
    parameters: {
      date_from: new Date().toISOString().substr(0, 10),
      date_to: new Date().toISOString().substr(0, 10),
      condition: "All",
      fullname: "",
      site: "All",
    },
    itemDialog: false,
    form: {},
  }),
  methods: {
    generateTable() {
      this.$refs.table.setParameters(this.parameters);
      this.$refs.table.generate();
    },
    getDropDowns() {
      this.$http
        .get(this.$api + "/declarations/dropdowns")
        .then((resp) => {
          let sites = resp.data.response.sites;
          sites.forEach(e => {
            this.sites.push(e)
          });

          this.departments = resp.data.response.departments;
        })
        .catch((err) => {
          alert("Something Went Wrong.");
          console.log(err);
        });
    },
    print(item) {
      this.form = item;
      this.$nextTick(function () {
        this.$htmlToPaper("printForm");
      });
    },
    view(item) {
      this.form = item;
      this.itemDialog = true;
    },
  },
  mounted() {
    if (!this.isAdmin) {
      this.$router.push({ name: 'home' })
    }
    this.generateTable();
    this.getDropDowns();
  },
  computed: {
    isLoggedIn: function () {
      return this.$store.getters.isLoggedIn;
    },
    isAdmin: function () {
      return this.$store.getters.isAdmin;
    },
  },
};
</script>