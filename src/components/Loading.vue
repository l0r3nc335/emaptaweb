<template>
  <v-dialog v-model="show" persistent width="300">
    <v-card color="secondary">
      <v-card-text>
        <div class="py-3 white--text"><b>Please stand by</b></div>
        <div class="pb-3">
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: "loading",
  data: function () {
    return {
      show: false,
    };
  },
  methods: {
    open() {
      this.show = true;
    },
    close() {
      this.show = false;
    },
    loading(trols) {
      this.show = trols;
    },
  },
};
</script>