<template>
  <v-container>
    
    <!-- Page Title-->
    <v-toolbar-title><h3>My Ticket</h3></v-toolbar-title>
      <!-- Menu -->
      <v-row>
        <v-col cols="2">
          <div class="my-2">
            <v-btn
              @click="backToTickets"
              depressed
              large
            :color="'primary'"
            >Back to All Tickets</v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Ticket Data -->
      <v-row>
        <v-col cols="1"> 
          <v-text-field
            label="Ticket ID"
            v-model="ticket.ticket.id"
            readonly
          ></v-text-field>
        </v-col>

        <v-col cols="2">
          <div class="my-2">
            <v-btn
              icon
              @click="viewConversation"
              large
            ><v-icon>mdi-chat</v-icon></v-btn>
          </div>
        </v-col>
      </v-row>

      <v-row>
        
        <v-col cols="2">
          <v-text-field
              class="_black"
              label="Project code"
              v-model="ticket.ticket.project.code"
              readonly
            ></v-text-field>
        </v-col> 
        <v-col cols="2"> 
          <v-text-field
            label="Project name"
            v-model="ticket.ticket.project.name"
            readonly
          ></v-text-field>
        </v-col>
        <v-col cols="1"> 
          <v-text-field
            label="Assignee"
            v-model="ticket.ticket.assigned_to.name"
            readonly
          ></v-text-field>
        </v-col>  
        <v-col cols="2"> 
          <v-text-field
            label="Mobile"
            v-model="ticket.ticket.mobile"
            readonly
          ></v-text-field>
        </v-col>  
      </v-row>

       <v-row>
        <v-col cols="12"> 
          <v-textarea
            label="Message"
            v-model="ticket.ticket.message"
            readonly
            rows="1"
            auto-grow
          ></v-textarea>
        </v-col>
      </v-row>
      
      <!-- Status Dropdown List -->
      <v-row>
        <v-col cols="2"> 
          <v-select
            item-text="name"
            item-value="id"
            v-model="form.status"
            :items="statuses"
            label="Change Status"
            @input="setSelected"
          />
        </v-col>
      </v-row>
    
      <v-row v-if="alert.show">
        <v-col cols="3">
          <v-alert :type="alert.type" v-html="alert.message">
            {{ alert.message }}</v-alert>
        </v-col>
      </v-row>

      <!-- Form Reply -->
      <v-form>  
        <v-row>
          <v-col cols="12"> 
            <v-textarea
              label="Reply Message"
              v-model="form.reply"
              rows="1"
              auto-grow
            ></v-textarea>
          </v-col>
        </v-row>
      </v-form>

      <!-- Submit -->
      <v-row>
        <v-col cols="4">
            <v-btn
              :disabled="isReplyDisabled" 
              :loading="isLoading"
              depressed
              large 
              color="primary"
              @click="submit"
            > Submit 
            </v-btn>
        </v-col>
      </v-row>

      

      <!-- View Conversation Dialog Box -->
      <v-dialog v-model="itemDialog"  :width="width" transition="dialog-top-transition">
        <template>
          <v-card>
            <v-card-title>Conversation</v-card-title>
            <v-divider></v-divider>
            
            <v-card-text style="margin-top: 12px">

              <v-row cols="12">
                  <v-text-field
                  class="_black"
                  label="Ticket Message"
                  v-model="ticket.ticket.message"
                  readonly
                ></v-text-field>
              </v-row><br>
              <h2>Replies</h2><br>  
              <div v-for="convo in conversation" :key="convo">
                <v-row cols="12">
                  <div class="float-right" style="width: 100%!important">
                    <v-alert
                      border="right"
                      colored-border
                      color="deep-purple accent-4"
                      elevation="2"
                    >
                    ID: {{convo.id}}<br>
                    Date: {{convo.created_at}}<br>
                    Message: {{convo.message}}<br>    
                    </v-alert>
                  </div>
                </v-row>
              </div>
              
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="justify-end">
              <v-btn :loading="isLoading" text color="error" @click="itemDialog = false">Close</v-btn>
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
import Loading from "../../components/Loading";
import DataTable from "../../components/DataTableV2";
export default {
  name: "open-ticket",
  mixins: [validationMixin],

          
  components: { DataTable, Loading },
  data: () => ({
    isReplyDisabled: false,
    isLoading: false,
    alert: {
      show: false,
      message: "",
      type: "error",
    },
    statuses: [
      {
        name: "",
        id: ""
      }
    ],
    
    ticket: {},
    form: {
      currentStatusId: "",
      reply: "",
      ticketId: "",
      status: {
        name: "",
        id: 1
      },
      newStatus: "",
      ticketInfo:{}
    },
    itemDialog: false,
    conversation: {}
  }),

  methods: {
    setSelected(value) {
     this.form.newStatus = this.statuses[value].name;
    },
    viewConversation() {
      this.isLoading = true;
      this.itemDialog = true;

     this.form._method = "POST";
        this.$http
            .post(this.$api+"/conversations", this.form)
            .then((response) => {
              this.conversation = response.data.response.data;
              this.$refs.loading.close();
              this.isLoading = false;
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
    backToTickets() {
      this.$router.push({path: 'tickets'});
    },
    getTicketStatuses() {
      this.$http
          .get(this.$api + "/ticket-statuses")
          .then((response) => {
            this.statuses = response.data.response;
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
    submit() {
      //update status
      if(this.form.status.hasOwnProperty('id') == false && this.form.status != this.form.currentStatusId) {
        this.isLoading = true;
        this.isReplyDisabled = true;
         this.form._method = "PUT";
          this.$http
            .post(this.$api+"/tickets/"+ this.form.ticketId , this.form)
            .then((response) => {
              setTimeout(() => {
                this.alert = {
                  show: true,
                  message: response.data.message,
                  type: "success",
                };
                this.$refs.loading.close();
                this.isLoading = false;
                this.form.reply = "";
                this.isReplyDisabled = false;
              }, 10);
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
      
    
      if(this.form.reply != "") {
        this.isLoading = true;
        this.isReplyDisabled = true;
        this.form._method = "POST";
        this.$http
            .post(this.$api+"/replies", this.form)
            .then((response) => {
              setTimeout(() => {
                this.alert = {
                  show: true,
                  message: response.data.message,
                  type: "success",
                };
                this.$refs.loading.close();
                this.isLoading = false;
                this.form.reply = "";
                this.isReplyDisabled = false;
              }, 10);
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
    }
  },
  mounted() {
    if(Object.keys(this.$route.params).length === 0) {
        this.$router.push({path: '/tickets'});
      }
 
    this.ticket = this.$route.params;
    this.form.ticketInfo = this.$route.params;
    this.form.status = this.$route.params.ticket.ticket_statuses;
    this.form.currentStatusId = this.$route.params.ticket.id;
    this.form.ticketId = this.ticket.ticket.id
    this.form.newStatus = this.form.status.name;
    this.getTicketStatuses();
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
