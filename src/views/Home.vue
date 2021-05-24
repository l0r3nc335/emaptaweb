<template>
  <v-container>
    <v-row > 
      <v-col
        offset-sm="2"
        offset-md="3"
        offset-lg="4"
        offset-xl="4"
        xs="12"
        sm="8"
        md="6"
        lg="4"
        xl="4"
        class="mt-10"
      >
        <v-card class="mx-auto" outlined>
          <v-list-item three-line>
            <v-list-item-content>
              <form>
                <v-list-item-title class="headline mb-1">Login</v-list-item-title>
                
                <v-row v-if="alert.show">
                  <v-col clos="12" sm="12">
                    <v-alert :type="alert.type">{{ alert.message }}</v-alert>
                  </v-col>
                </v-row>
                
                <v-row>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      v-model="form.username"
                      label="E-Mail"
                      @input="$v.form.username.$touch()"
                      @blur="$v.form.username.$touch()"
                      @keyup.enter="submit"
                      :error-messages="usernameErrors"
                      :disabled="isLoading"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
                
                <v-row>
                  <v-col cols="12" sm="12">
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
                </v-row>
                
              </form>
            </v-list-item-content>
          </v-list-item>

          <v-container>
            <v-row>
              <v-col cols="12" align="right">
                <v-btn color="primary" :loading="isLoading" @click="submit">Login</v-btn>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" align="center">
                <v-divider></v-divider>
              </v-col>
            </v-row>
          </v-container>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
export default {
  name: "home",
  mixins: [validationMixin],
  validations: {
    form: {
      password: { required },
      username: { required },
    },
  },
  data: () => ({
    isLoading: false,
    showPassword: false,
    form: {
      username: "",
      password: "",
    },
    alert: {
      show: false,
      message: "",
      type: "error",
    },
  }),
  methods: {
    submit() {
      this.isLoading = true;
      this.alert.show = false;
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$scrollToTop();
        this.isLoading = false;
      } else {
        this.$store
          .dispatch("login", this.form)
          .then((response) => {
            setTimeout(() => {
              this.$router.push({
                name: "projects",
              });
              this.isLoading = false;
            }, 2000);
          })
          .catch((err) => {
            console.log(err)
            setTimeout(() => {
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
              this.isLoading = false;
            }, 2000);
          });
      }
    },
  },
  computed: {
    usernameErrors() {
      const errors = [];
      if (!this.$v.form.username.$dirty) return errors;
      !this.$v.form.username.required && errors.push("E-mail is required");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.form.password.$dirty) return errors;
      !this.$v.form.password.required && errors.push("Password is required");
      return errors;
    },
  },
};
</script>
<style lang="scss">
.v-application .primary {
  color: #00b4ee !important;
}
</style>
