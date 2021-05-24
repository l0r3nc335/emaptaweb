<template>
  <v-container>
    <v-alert v-if="alert.show" :type="alert.type">{{ alert.message }}</v-alert>
    <v-list-item-title class="headline mb-1">Project Management</v-list-item-title>
    <v-divider class="mt-12 mb-12"></v-divider>

    <loading ref="loading" />
  </v-container>
</template>

<script>
import { validationMixin } from "vuelidate";

import Loading from "../components/Loading";


export default {
  name: "project-management",
  mixins: [validationMixin],
  components: { Loading },

  data: () => ({
    isLoading: false,

   
    alert: {
      show: false,
      message: "",
      type: "error",
    },
  
  }),
};
</script>
<style lang="scss">
.v-application .primary {
  color: #00b4ee !important;
}
</style>
