<template>
    <div class="card-step w991d d-flex justify-content-center align-items-center flex-column" :class="getUniqueId">
      <i class="bi bi-check-circle"></i>
      <p>광고주가 등록되었습니다.</p>
      <p>에이전시홈에서 등록된 광고계정을 확인해주세요.
        <span class="text-primary font-weight-bolder" style="display : inline-block;"><router-link to="/agency">에이전시홈 페이지로</router-link></span>
      </p>
    </div>
</template>

<script>
import $ from 'jquery';
import { store } from "@/store/store.js";
import twoBtn from "@/components/registerAdmin/twoBtn.vue";
import { isMobile, priceToString, getMedia, uuidv4, getType} from "@/assets/js/common.js";

export default {
  props: {},
  data() {
    return {
      ajax: true,
      uniqueId: null,
      reportInfo: {},
      error: {},
      step: 3,
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
  components: {twoBtn,},
  watch: {},
  mounted() {},
  methods: {
    validate() {},
    getData() { return this.reportInfo; },
    prev() {
      let vm = this;
      vm.$emit("prev");
    },
    next() {
      let vm = this;
      vm.ajax = true;
      //vm.validate();
      vm.ajax ? vm.$emit("next") : "";
    },
  },
};
</script>

<style>
.card-step {padding: 30px;width: 100%;height: 500px;border: 1px solid #ddd;background: #fff;  text-align: center;}
.card-step i {margin-bottom: 10px;color: green;  font-size: 30px;}
</style>
