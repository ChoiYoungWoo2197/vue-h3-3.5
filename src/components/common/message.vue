<template>
  <div class="message-container" :class="getUniqueId">
    <div class="icon">
      <i class="bi bi-lightbulb m-0"></i>
    </div>
    <div class="message">
      <slot></slot>
      <i class="bi bi-x-circle float-right font-weight-bolder" @click="closeBtn(this)"></i>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import moment from "moment";
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
  watch: {
  },
  mounted() {
  },
  methods: {
    closeBtn() {
      const el = document.querySelector(`.${this.getUniqueId}`);
      if (el) {
        el.classList.add("fade-out");
        setTimeout(() => {
          el.style.display = "none";
        }, 500);
      }
    }
  },
};
</script>

<style scoped>
</style>
