<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="rows"
      :loading="isLoading"
      loading-text="Loading... Please wait."
      class="elevation-1"
      hide-default-footer
      disable-pagination
    >
      <template
        v-if="
          hasEdit ||
          hasDelete ||
          hasPrint ||
          hasView ||
          hasRoute ||
          hasAssigned ||
          hasChangePassword ||
          hasTask ||
          hasAdd ||
          hasTaskMangement
        "
        v-slot:item.actions="{ item }"
      >
        <v-icon v-if="hasRoute" medium class="mr-2" @click="routeItem(item)" >
          mdi-file-eye
        </v-icon>
        <v-icon v-if="hasView" medium class="mr-2" @click="viewItem(item)" >
          mdi-file-eye
        </v-icon>
        &nbsp;
        <v-icon v-if="hasPrint" medium class="mr-2" @click="printItem(item)">
          mdi-printer
        </v-icon>
        &nbsp;
        <v-icon v-if="hasEdit" medium class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        &nbsp;
        <v-icon v-if="hasUser" medium class="mr-2" @click="userItem(item)">
          mdi-account-child
        </v-icon>
        &nbsp;
        <v-icon v-if="hasTask" medium class="mr-2" @click="taskItem(item)">
          mdi-account-clock
        </v-icon>
        &nbsp;
        <v-icon v-if="hasAssigned" medium @click="assignedItem(item)">
          mdi-account-child
        </v-icon>
        &nbsp;
        <v-icon
          v-if="hasChangePassword"
          medium
          class="mr-2"
          @click="changePasswordItem(item)"
        >
          mdi-lock-alert
        </v-icon>
        &nbsp;
        <v-icon v-if="hasDelete" medium @click="deleteItem(item)">mdi-delete</v-icon>
        &nbsp;
        <v-icon v-if="hasAdd" medium @click="addItem(item)">mdi-playlist-plus</v-icon>
        &nbsp;
        <v-icon
          v-if="hasTaskMangement && item.status == 2"
          medium
          @click="pauseItem(item)"
          >mdi-pause</v-icon
        >
        &nbsp;
        <v-icon
          v-if="hasTaskMangement && (item.status == 0 || item.status == 3)"
          medium
          @click="startItem(item)"
          >mdi-play</v-icon
        >
        &nbsp;
        <v-icon v-if="hasTaskMangement && item.status == 2" medium @click="stopItem(item)"
          >mdi-stop</v-icon
        >
      </template>
    </v-data-table>
    <v-row class="justify-center align-center">
      <v-col>
        <v-pagination
          v-model="pagination.current_page"
          :length="pagination.last_page"
          @input="onPageChange"
        ></v-pagination>
      </v-col>
      <v-col sm="2">
        <v-btn
          v-if="hasDownloadExcel"
          :loading="isLoading"
          :disabled="isLoading"
          @click.prevent="downloadExcel"
          color="secondary"
        >
          <v-icon left dark>mdi-cloud-download</v-icon>
          {{ downloadLabel }}
        </v-btn>
        <downloadexcel
          v-if="hasVueJsonExcel"
          class="v-btn v-btn--has-bg theme--light v-size--large primary mt-2"
          style="cursor: pointer"
          pointer
          :fetch="fetchExcelData"
          :loading="isLoading"
          :disabled="isLoading"
          type="csv"
          :name="downloadFileName + '.xls'"
        >
          {{ downloadLabel }}
        </downloadexcel>
      </v-col>
      <v-spacer></v-spacer>
      <v-col sm="3" class="text-right float-center">
        {{ pagination.first_item }}
        to {{ pagination.last_item }} of
        {{ pagination.total }}
      </v-col>
    </v-row>
  </div>
</template>

<script>
import downloadexcel from "vue-json-excel";
export default {
  name: "data-table",
  components: { downloadexcel },
  props: {
    path: {
      type: String,
      required: true,
      default: "",
    },
    hasEdit: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasDelete: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasUser: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasTask: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasChangePassword: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasPrint: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasView: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasRoute: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasAdd: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasTaskMangement: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasDownloadExcel: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasAssigned: {
      type: Boolean,
      required: false,
      default: false,
    },
    downloadPath: {
      type: String,
      required: false,
      default: "",
    },
    downloadLabel: {
      type: String,
      required: false,
      default: "Download",
    },
    downloadFileName: {
      type: String,
      required: false,
      default: "report",
    },
    hasVueJsonExcel: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: () => ({
    dialog: false,
    pagination: {
      current_page: 1,
      total: 0,
    },
    headers: [],
    rows: [],
    parameters: [],
    isLoading: false,
  }),
  methods: {
    async fetchExcelData() {
      var requestUrl = "";
      if (this.path.includes("?")) {
        requestUrl = this.$api + this.path + "&isexcel=1" + this.parameters;
      } else {
        requestUrl = this.$api + this.path + "?isexcel=1" + this.parameters;
      }
      const response = await this.$http.get(requestUrl);
      return response.data.response.data;
    },
    /** For General Use. */
    setParameters(param) {
      this.parameters = "";
      if (Object.keys(param).length === 0) {
        this.parameters = "";
      } else {
        for (const key of Object.keys(param)) {
          this.parameters += "&" + key + "=" + param[key];
        }
      }
    },
    /** Generate Table Data Functions */
    generate() {
      this.isLoading = true;
      this.rows = [];
      var requestUrl = "";
      if (this.path.includes("?")) {
        requestUrl =
          this.$api +
          this.path +
          "&page=" +
          this.pagination.current_page +
          this.parameters;
      } else {
        requestUrl =
          this.$api +
          this.path +
          "?page=" +
          this.pagination.current_page +
          this.parameters;
      }
      this.$http
        .get(requestUrl)
        .then((response) => {
          this.headers = response.data.response.headers;
          this.rows = response.data.response.data;
          this.pagination = response.data.response.pagination;
          this.isLoading = false;
        })
        .catch(() => {
          alert("Loading Error Data.");
          this.isLoading = false;
        });
    },
    printItem(item) {
      this.$emit("print", item);
    },
    viewItem(item) {
      this.$emit("view", item);
    },
    routeItem(item) {
       this.$emit("route", item);
    },
    assignedItem(item) {
      this.$emit("assigned", item);
    },
    /** For Future For Editing Record */
    editItem(item) {
      this.$emit("edit", item);
    },
    /** For Future For Editing Record */
    userItem(item) {
      this.$emit("user", item);
    },
    /** For Future For Editing Record */
    taskItem(item) {
      this.$emit("task", item);
    },
    /** For Future for Deleting Record */
    deleteItem(item) {
      this.$emit("delete", item);
    },
    /** For Future for Add Record */
    addItem(item) {
      this.$emit("add", item);
    },
    changePasswordItem(item) {
      this.$emit("changePassword", item);
    },
    onPageChange() {
      this.generate();
    },

    /** Update Task */
    startItem(item) {
      this.$emit("taskStart", item);
    },
    /** For Task Pause */
    pauseItem(item) {
      this.$emit("taskPause", item);
    },
    /** For Task Stop */
    stopItem(item) {
      this.$emit("taskStop", item);
    },
    /** For Download Excel Functions */
    downloadExcel() {
      this.isLoading = true;
      var requestUrl = "";
      if (this.path.includes("?")) {
        requestUrl =
          this.$api +
          this.downloadPath +
          "&filename=" +
          this.downloadFileName +
          this.parameters;
      } else {
        requestUrl =
          this.$api +
          this.downloadPath +
          "?filename=" +
          this.downloadFileName +
          this.parameters;
      }
      this.$http
        .get(requestUrl)
        .then((response) => {
          let filePath = this.$api + "/" + response.data.response.url;
          this.hotDownload(filePath);
        })
        .catch(() => {
          alert("Something Went Wrong. Please Contact the Administrator.");
          this.isloading = false;
        });
    },
    hotDownload(url) {
      this.$http({
        url: url,
        method: "GET",
        responseType: "blob", // important
      })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("target", "_blank");
          link.setAttribute("download", this.fileName + ".xlsx");
          document.body.appendChild(link);
          this.isLoading = false;
          this.$nextTick(function () {
            link.click();
          });
        })
        .catch(() => {
          alert("Something Went Wrong. Please Contact the Administrator.");
          this.isLoading = false;
        });
    },
  },
};
</script>
<style lang="scss">
.theme--light.v-pagination .v-pagination__item--active {
  color: #00b4ee;
}
.v-pagination {
  justify-content: left !important;
  .v-pagination__item--active {
    color: #00b4ee;
  }
}
</style>
