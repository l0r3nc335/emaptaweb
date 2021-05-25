<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :expand-on-hover="true"
      :mini-variant="true"
      :right="false"
      app
    >
      <v-list dense nav class="py-0">
        <!-- Title -->
        <v-list-item two-line class="px-0">
          <v-list-item-avatar v-if="drawer">
            <img src="/favicon.ico" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>Emapta</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>

        <!-- Logout -->
        <v-list-item v-if="isLoggedIn" @click="logout" link>
          <v-list-item-icon>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        

      </v-list>
      <!-- Login -->
    </v-navigation-drawer>

    <!-- main -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    drawer: true,
  }),
  methods: {
    logout() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/");
      });
    },
    goTo(routeName) {
      this.$router.push({ name: routeName });
    },
  },
  computed: {
    isLoggedIn: function () {
      return this.$store.getters.isLoggedIn;
    },
    displayname: function () {
      return this.$store.getters.displayname;
    },
    isAdmin: function () {
      return this.$store.getters.isAdmin;
    },
  },
};
</script>
<style lang="scss">
.theme--dark.v-btn.v-btn--icon {
  color: #000 !important;
}
</style>
