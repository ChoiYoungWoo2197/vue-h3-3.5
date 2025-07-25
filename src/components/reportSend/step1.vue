<template>
  <form onkeydown="return event.key == 'Enter' ? false : true" :class="getUniqueId">
    <div class="form-group row mb-4">
      <div class="col-xl-6 row align-items-center mb-2">
        <label for="" class="form-label col-xl-3">보고서명</label>
        <div class="col-xl-9">
          <input
            type="text"
            class="form-control"
            id=""
            v-model="reportInfo.name"
            placeholder=""
            @blur="blurResisterName()"
          />
        </div>
        <div
          v-if="error.resisterNameErrorMessage.length > 0"
          class="invalid-feedback d-block"
        >
          {{ error.resisterNameErrorMessage }}
        </div>
      </div>
      <div class="col-xl-6 row align-items-center mb-2">
        <label for="" class="form-label col-xl-3">기간</label>
        <div class="col-xl-9">
          <date-range-picker
            ref="dateRangePicker"
            class="form-control"
            :pStart="reportInfo.start"
            :pEnd="reportInfo.end"
            :pDisabled="false"
            @changedDate="changedDate"
          ></date-range-picker>
        </div>
      </div>
      <div class="col-xl-6 row align-items-center mb-2">
        <label for="" class="form-label col-xl-3">마케터</label>
        <div class="col-xl-9">
          <input
            type="text"
            class="form-control"
            id=""
            v-model="reportInfo.sender"
            placeholder=""
            @blur="blurSender()"
          />
        </div>
        <div
          v-if="error.resisterSenderErrorMessage.length > 0"
          class="invalid-feedback d-block"
        >
          {{ error.resisterSenderErrorMessage }}
        </div>
      </div>
      <div class="col-xl-6 row align-items-center mb-2">
        <label for="" class="form-label col-xl-3">마케터 전화번호</label>
        <div class="col-xl-9">
          <input
            type="text"
            class="form-control"
            id=""
            v-model="reportInfo.number"
            placeholder=""
            @blur="blurNumber()"
          />
        </div>
        <div
          v-if="error.resisterNumberErrorMessage.length > 0"
          class="invalid-feedback d-block"
        >
          {{ error.resisterNumberErrorMessage }}
        </div>
      </div>
      <div class="col-xl-6 row align-items-center mb-2">
        <label for="" class="form-label col-xl-3">발신 이메일</label>
        <div class="col-xl-9">
          <input
            type="text"
            class="form-control"
            id=""
            v-model="reportInfo.email"
            placeholder=""
            @blur="blurEmail()"
          />
        </div>
        <div
          v-if="error.resisterEmailErrorMessage.length > 0"
          class="invalid-feedback d-block"
        >
          {{ error.resisterEmailErrorMessage }}
        </div>
      </div>
      <div class="col-xl-6 row align-items-center mb-2">
        <label for="" class="form-label col-xl-3">광고주 이메일</label>
        <div class="col-xl-9">
          <input
            type="text"
            class="form-control"
            id=""
            v-model="reportInfo.recver"
            placeholder=""
            @blur="blurRecver()"
          />
        </div>
        <div
          v-if="error.resisterRecverErrorMessage.length > 0"
          class="invalid-feedback d-block"
        >
          {{ error.resisterRecverErrorMessage }}
        </div>
      </div>
    </div>
    <two-btn @prev="prev" @next="next"></two-btn>
  </form>
</template>

<script>
import { store } from "../../store/store.js";
import twoBtn from "./twoBtn.vue";
import {
  isMobile,
  priceToString,
  getMedia,
  uuidv4,
  getType,
  isblank,
  isNotEmail,
  isNotTel,
} from "../../assets/js/common.js";
import dateRangePicker from "../common/dateRangePicker.vue";

export default {
  props: {},
  data() {
    return {
      ajax: true,
      uniqueId: null,
      reportInfo: {
        id: 0,
        name: "희일보고서",
        start: store.state.dateStore.start,
        end: store.state.dateStore.end,
        sender: null,
        number: null,
        email: null,
        recver: null,
      },
      error: {
        resisterNameErrorMessage: "",
        resisterSenderErrorMessage: "",
        resisterNumberErrorMessage: "",
        resisterEmailErrorMessage: "",
        resisterRecverErrorMessage: "",
      },
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
  components: {
    twoBtn,
    dateRangePicker,
  },
  watch: {},
  mounted() {},
  methods: {
    blurResisterName() {
      this.error.resisterNameErrorMessage = "";
      if (isblank(this.reportInfo.name)) {
        this.error.resisterNameErrorMessage = "보고서명을 입력해주세요.";
        this.ajax = false;
      }
    },
    blurSender() {
      this.error.resisterSenderErrorMessage = "";
      if (isblank(this.reportInfo.sender)) {
        this.error.resisterSenderErrorMessage = "마케터를 입력해주세요.";
        this.ajax = false;
      }
    },
    blurNumber() {
      this.error.resisterNumberErrorMessage = "";
      if (isblank(this.reportInfo.number)) {
        this.error.resisterNumberErrorMessage = "마케터 전화번호를 입력해주세요.";
        this.ajax = false;
      }
    },
    blurEmail() {
      this.error.resisterEmailErrorMessage = "";
      if (isNotEmail(this.reportInfo.email)) {
        this.error.resisterEmailErrorMessage = "이메일 주소가 올바르지 않습니다.";
        this.ajax = false;
      }
      // console.log(this.ajax, 'blurResisterTel');
    },
    blurRecver() {
      this.error.resisterRecverErrorMessage = "";
      if (isNotEmail(this.reportInfo.recver)) {
        this.error.resisterRecverErrorMessage = "이메일 주소가 올바르지 않습니다.";
        this.ajax = false;
      }
      // console.log(this.ajax, 'blurResisterTel');
    },
    validate() {
      this.blurResisterName();
      this.blurSender();
      this.blurNumber();
      this.blurEmail();
      this.blurRecver();
    },
    getData() {
      return this.reportInfo;
    },
    prev() {
      let vm = this;
      vm.$emit("prev");
    },
    next() {
      let vm = this;
      vm.ajax = true;
      vm.validate();
      vm.ajax ? vm.$emit("next") : "";
    },
    changedDate() {
      let vm = this;
      let date = vm.$refs.dateRangePicker.getDate();
      vm.reportInfo.start = date.start;
      vm.reportInfo.end = date.end;
    },
  },
};
</script>

<style></style>
