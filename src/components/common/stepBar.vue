<template>
  <div :class="getUniqueId" class="step-bar-container">
    <div class="step-bar" :class="{ active: step === 1, done: step > 1 }">
      <span class="step-bar-number">1</span>
    </div>
    <div class="step-bar" :class="{ active: step === 2, done: step > 2 }">
      <span class="step-bar-number">2</span>
    </div>
    <div class="step-bar" :class="{ active: step === 3, done: step > 3 }">
      <span class="step-bar-number">3</span>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import { API_URL, TEMP_KEY } from "../../configs/config.js";
import { SHA256 } from "../../assets/js/sha256.js";

export default {
  props: {
    pStep: Number,
  },
  data() {
    return {
      uniqueId: null,
      step: 1,
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
  watch: {
    pStep() {
      this.step = this.pStep;
    },
  },
  mounted() {},
};
</script>

<style scoped></style>
