<template>
  <v-container>
    <v-toolbar-title><h3>Project Report</h3></v-toolbar-title>
    <!-- Table Parameters -->
    <v-row>
      <!-- Search -->
      <v-col cols="2">
        <v-select
          item-text="name"
          item-value="id"
          v-model="project"
          :items="projects"
          return-object
          label="Select Project"
        />
      </v-col>
      <v-col cols="1">
        <v-select
          item-text="name"
          item-value="id"
          v-model="year"
          :items="years"
          label="Select Year"
        />
      </v-col>
      <v-col cols="1">
        <v-select
          item-text="name"
          item-value="count"
          v-model="month"
          :items="months"
          label="Select Month"
          return-object
        />
      </v-col>
      <v-col cols="4">
        <div class="my-2">
          <v-btn @click="generateTable" depressed large color="primary"> Apply </v-btn>
        </div>
      </v-col>
    </v-row>

    <data-table
      :hasDownloadExcel="true"
      ref="table"
      :path="'/projects-report'"
      :downloadFileName="'ticket-report'"
      :downloadPath="'/projects-report/download'"
    />

    <loading ref="loading"/>
  </v-container>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import DataTable from "../components/DataTableV2";
import Loading from "../components/Loading";
export default {
  name: "projects-report",
  mixins: [validationMixin],
  components: { DataTable, Loading },
  data: () => ({
    parameters: {
      searchYear: "",
      searchMonth: "",
      projectId: ""
    },
    year: "2021",
    years: [
    ],
    month: {
      name: "April",
      count: "4"
    },
    months: [
      {
        name: "January",
        count: "1"
      },
      {
        name: "February",
        count: "2"
      },
      {
        name: "March",
        count: "3"
      },
      {
        name: "April",
        count: "4"
      },
      {
        name: "May",
        count: "5"
      },
      {
        name: "June",
        count: "6"
      },
      {
        name: "July",
        count: "7"
      },
      {
        name: "August",
        count: "8"
      },
      {
        name: "September",
        count: "9"
      },
      {
        name: "October",
        count: "10"
      },
      {
        name: "November",
        count: "11"
      },
      {
        name: "December",
        count: "12"
      },
    ],

    projects: [],
    project: {}
  }),
  methods: {
    generateTable() {
      this.parameters.searchYear = this.year;
      this.parameters.searchMonth = this.month.count;
      this.projectId = this.project.id;
      this.$refs.table.setParameters(this.parameters);
      this.$refs.table.generate();
    },

    getExisitingYearAndMonth(){

      this.$http
          .get(this.$api+"/project-year-month")
          .then((response) => {
            this.year = response.data.response.data.year;
            this.years = response.data.response.data.ticketYears;
            this.month.name = response.data.response.data.monthName;
            this.month.count = response.data.response.data.month;
          })
          .catch(() => {
            setTimeout(() => {
              this.alert = {
                show: true,
                message: "Something went wrong! Please contact the Administrator.",
                type: "error",
              };
            }, 1000);
          });
    },

    getProjects(){

      this.$http
          .get(this.$api+"/projects")
          .then((response) => {
            this.projects = response.data.response.data;
            this.project = response.data.response.data[0];
          })
          .catch(() => {
            setTimeout(() => {
              this.alert = {
                show: true,
                message: "Something went wrong! Please contact the Administrator.",
                type: "error",
              };
            }, 1000);
          });
    },
  },
  mounted() {
    this.getProjects();
    this.getExisitingYearAndMonth();
    this.generateTable();
  },
  computed: {
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