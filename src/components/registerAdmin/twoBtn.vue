<template>
  <div :class="getUniqueId" class="form-group row step-two-button">
    <div class="col-sm-3 align-items-center mb-2 mr-2">
      <button class="form-control mt-0" type="button" @click="prev">이전</button>
    </div> 
    <div class="col-sm-3 align-items-center mb-2 mr-2">
      <button class="form-control mt-0 active" type="button" @click="next">다음</button>
    </div> 
  </div>
</template>

<script>
import { store } from "@/store/store.js";

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
