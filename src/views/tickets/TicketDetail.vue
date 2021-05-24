<template>
  <v-container>
    <!-- Page Title-->
    <v-toolbar-title>
      <h3>Ticket Details</h3>
    </v-toolbar-title>
    <!-- Menu -->
    <v-row>
      <v-col cols="2">
        <div class="my-2">
          <v-btn @click="backToTickets" depressed large :color="'primary'">Back to All Tickets</v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="alert.show">
      <v-col cols="3">
        <v-alert :type="alert.type" v-html="alert.message">{{ alert.message }}</v-alert>
      </v-col>
    </v-row>
    <!-- Ticket Data -->
    <v-row>
      <v-col cols="2">
        <v-text-field label="Ticket ID" v-model="form.id" readonly></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field label="Assignee" v-model="form.assigned_to.name" readonly></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field label="Project name" v-model="form.project.name" readonly></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field label="Mobile" v-model="form.mobile" readonly></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field class="_black" label="Project code" v-model="form.project.code" readonly></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-textarea label="Message" v-model="form.message" readonly rows="1" auto-grow></v-textarea>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <h2>Replies</h2>
      </v-col>
    </v-row>

    <div v-for="convo in form.conversation" :key="convo.id">
      <v-row cols="12">
        <div class="float-right" style="width: 100%!important">
          <v-alert
            :border="convo.is_send==1 ? 'right' : 'left'"
            colored-border
            color="deep-purple accent-4"
            elevation="2"
          >
            <p :align="convo.is_send==1 ? 'right' : 'left'">
              <br />
              {{convo.created_at}}
              <br />
              {{convo.message}}
              <br />
            </p>
          </v-alert>
        </div>
      </v-row>
    </div>

    <!-- Status Dropdown List -->
    <v-row>
      <v-col cols="4">
        <v-select
          item-text="name"
          item-value="id"
          v-model="form.status"
          :disabled="form.old_status==3"
          :items="statuses"
          label="Change Status"
        />
      </v-col>
    </v-row>

    <!-- Form Reply -->
    <v-form>
      <v-row>
        <v-col cols="12">
          <v-textarea label="Comment" v-model="form.reply" rows="1" auto-grow></v-textarea>
        </v-col>
      </v-row>
    </v-form>

    <!-- Submit -->
    <v-row>
      <v-col cols="4">
        <v-btn
          :disabled="form.old_status==3"
          :loading="isLoading"
          depressed
          large
          color="primary"
          @click="submit"
        >Reply</v-btn>
      </v-col>
    </v-row>

    <loading ref="loading" />
  </v-container>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import Loading from "../../components/Loading";
import DataTable from "../../components/DataTableV2";
export default {
  name: "ticket-detail",
  mixins: [validationMixin],

  components: { DataTable, Loading },
  data: () => ({
    isLoading: false,
    alert: {
      show: false,
      message: "",
      type: "error"
    },
    statuses: [
      {
        name: "Assigned",
        id: 1
      },
      {
        name: "Pending",
        id: 2
      },
      {
        name: "Closed",
        id: 3
      }
    ],
    form: {
      reply: ""
    },
    itemDialog: false
  }),

  methods: {
    backToTickets() {
      this.$router.push({ name: "tickets" });
    },
    getTicketDetails() {
      this.$http
        .get(this.$api + "/tickets/" + this.$route.params.id)
        .then(response => {
          this.form = response.data.response;
          this.form.old_status = this.form.status;
        });
    },
    submit() {
      //update status
      if (
        this.form.status.hasOwnProperty("id") == false &&
        this.form.status != this.form.currentStatusId
      ) {
        this.isLoading = true;
        this.isReplyDisabled = true;
        this.form._method = "PUT";
        this.$http
          .post(this.$api + "/tickets/" + this.form.id, this.form)
          .then(response => {
            this.alert = {
              show: true,
              message: response.data.message,
              type: "success"
            };
            this.isLoading = false;
            this.getTicketDetails();
          })
          .catch(() => {
            this.$scrollToTop();
            this.alert = {
              show: true,
              message:
                "Something went wrong! Please contact the Administrator.",
              type: "error"
            };
            this.$refs.loading.close();
            this.isLoading = false;
          });
      }
    }
  },
  mounted() {
    if (Object.keys(this.$route.params).length === 0) {
      this.$router.push({ name: "tickets" });
    }
    this.getTicketDetails();
  },
  computed: {
    width() {
      let breakpointName = this.$vuetify.breakpoint.name;
      if (breakpointName == "xs") {
        return "95%";
      } else {
        return "450px";
      }
    }
  }
};
</script>
<style lang="scss">
.v-application .primary {
  color: #00b4ee !important;
}

.input-group--disabled.input-group--select label {
  color: green !important;
}
</style>
