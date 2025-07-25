<template>
  <div
    :class="getUniqueId"
    class="title d-flex justify-content-between align-items-center mt-2"
  >
    <div class="two-btn col-md-6 d-flex justify-content-between">
      <button class="btn select-cancel" type="button" @click="prev">이전</button>
      <button class="btn select-save" type="button" @click="next">다음</button>
    </div>
  </div>
</template>

<script>
import { store } from "../../store/store.js";

export default {
  props: {},
  data() {
    return {
      uniqueId: null,
    };
  },
  computed: {
    getUniqueId() {
      if (!this.uniqueId) {
        this.uniqueId = "vm-" + this._uid;
        return this.uniqueId;
      }
      return this.uniqueId;
    },
  },
  watch: {},
  mounted() {},
  methods: {
    next() {
      this.$emit("next");
    },
    prev() {
      this.$emit("prev");
    },
  },
};
</script>

<style></style>
