<template>
  <!-- Div Wrapper to Avoid error in Compiling -->
  <div>
    <table class="table table-hover table-bordered table-condensed table-striped">
      <thead class="thead">
        <tr v-for="columns in headers" :class="setClass(columns.class)" :key="columns.id">
          <th
            scope="col"
            v-for="header in columns"
            :rowspan="setSpan(header.rowspan)"
            :colspan="setSpan(header.colspan)"
            :class="setClass(header.class)"
            :key="header.id"
          >{{ header.label }}</th>
        </tr>
      </thead>
      <tbody v-if="rows.length > 0 && !isLoading">
        <tr v-for="row in rows" :key="row.id">
          <td
            v-for="bodycolumn in bodycolumns"
            :rowspan="setSpan(bodycolumn.rowspan)"
            :colspan="setSpan(bodycolumn.colspan)"
            :class="setClass(bodycolumn.class)"
            :key="bodycolumn.id"
          >
            <a
              href
              v-if="row[bodycolumn.name]['func']"
              v-on:click.stop.prevent="parentFunction(row[bodycolumn.name]['func'], row[bodycolumn.name]['id'])"
            >{{ row[bodycolumn.name]['label'] }}</a>
            <span v-else v-html="row[bodycolumn.name]"></span>
          </td>
        </tr>
      </tbody>
      <tbody v-else-if="isLoading">
        <tr class="text-center">
          <td colspan="100%">
            <img src="/bars.svg" style="height: 20px" />
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr class="text-center">
          <td colspan="100%">No Data Found</td>
        </tr>
      </tbody>
    </table>
    <PaginationComponent
      v-if="pagination.last_page > 1"
      :pagination="pagination"
      :offset="offset"
      @paginate="fetchTable()"
    />
  </div>
</template>
<script>
import PaginationComponent from "./Pagination.vue";
export default {
  name: "data-table",
  components: {
    PaginationComponent
  },
  data: function() {
    return {
      apipath: "",
      offset: 5,
      rows: {},
      headers: {},
      bodycolumns: {},
      parameters: "",
      pagination: {
        current_page: 1
      },
      loaderStyle: "dots",
      loaderColor: "#CCCC00",
      isLoading: false
    };
  },
  methods: {
    setPageToFirst() {
      this.pagination.current_page = 1;
    },
    parentFunction(name, id) {
      this.$parent[name](id);
    },
    setApiPath(path) {
      this.apipath = path;
    },
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
    setTableHeaders(data) {
      this.headers = data;
    },
    setTableBodyColumns(data) {
      this.bodycolumns = data;
    },
    setRows(data) {
      this.rows = data;
    },
    setTableData(data) {
      this.setTableHeaders(data.headers);
      this.setTableBodyColumns(data.bodycolumns);
    },
    setSpan(rowValue) {
      if (parseInt(rowValue) > 0) {
        return rowValue;
      } else {
        return "1";
      }
    },
    setClass(classValue) {
      if (classValue != null) {
        return classValue;
      } else {
        return "";
      }
    },
    setVHTML(vhtmlValue) {
      if (vhtmlValue != null) {
        return vhtmlValue;
      } else {
        return "";
      }
    },
    fetchTable() {
      this.isLoading = true;
      var requestUrl = "";
      if (this.apipath.includes("?")) {
        requestUrl =
          this.apipath +
          "&page=" +
          this.pagination.current_page +
          this.parameters;
      } else {
        requestUrl =
          this.apipath +
          "?page=" +
          this.pagination.current_page +
          this.parameters;
      }
      this.$http
        .get(requestUrl)
        .then(response => {
          if (response.data.response.headers) {
            this.setTableHeaders(response.data.response.headers);
          }
          if (response.data.response.bodycolumns) {
            this.setTableBodyColumns(response.data.response.bodycolumns);
          }
          this.setRows(response.data.response.data);
          this.pagination = response.data.response.pagination;
          this.isLoading = false;
        })
        .catch(() => {
          alert("Loading Error Data.");
          this.isLoading = false;
        });
    }
  }
};
</script>