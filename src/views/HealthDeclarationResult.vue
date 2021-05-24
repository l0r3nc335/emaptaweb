<template>
  <v-container>
    <v-row>
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
              <div align="center" v-if="hdfmessage != ''">
                <v-icon v-if="hdfispassed == 'passed'" size="120" color="success">
                  mdi-checkbox-marked-circle
                </v-icon>
                <v-icon v-else size="120" color="error"> mdi-close-circle </v-icon>
                <p
                  class="message p-30 my-12 mx-6 font-weight-bold"
                  v-html="hdfmessage"
                ></p>
              </div>
              <div v-else>
                <v-row>
                  <v-col clos="12" sm="12" align="center">
                    <div class="my-2">
                      <v-btn
                        :to="{ name: 'health-declaration-form' }"
                        depressed
                        large
                        color="primary"
                      >
                        Fill Up Health Declaration Form
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "health-declaration-result",
  data: () => ({}),
  computed: {
    hdfispassed: function () {
      return this.$store.getters.hdfispassed;
    },
    hdfmessage: function () {
      return this.$store.getters.hdfmessage;
    },
  },
};
</script>
<style lang="scss" scoped>
.message {
  line-height: 1.8;
}
</style>
