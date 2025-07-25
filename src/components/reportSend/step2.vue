<template>
  <form onkeydown="return event.key == 'Enter' ? false : true" :class="getUniqueId">
    <div class="form-group row mb-4">
      <div class="col-xl-6 row align-items-center mb-2">
        <label for="" class="form-label col-xl-3">매체</label>
        <div class="col-xl-9">
          <article class="collapse show m-0 p-0" id="mediaBtnBoxContainerCollapse">
            <ul class="media-btn-box-container">
              <li
                v-for="(m, i) in medias"
                :key="i + '-' + getUuidv4()"
                @click="clickMedia(m.key)"
              >
                <input type="checkbox" />
                <label for="" :class="m.check ? 'active' : ''">
                  {{ m.name }}
                  <span>
                    <i class="bi" :class="m.check ? 'bi-check active' : 'bi-plus'"></i>
                  </span>
                </label>
              </li>
            </ul>
          </article>
          <div v-if="error.mediaErrorMsg.length > 0" class="invalid-feedback d-block">
            {{ error.mediaErrorMsg }}
          </div>
        </div>
      </div>
      <div class="col-xl-6 row align-items-center mb-2">
        <label for="" class="form-label col-xl-3">광고정보</label>
        <div class="col-xl-9">
          <article class="collapse show m-0 p-0" id="pageBtnBoxContainerCollapse">
            <ul class="media-btn-box-container">
              <li
                v-for="(p, i) in pages"
                :key="i + '-' + getUuidv4()"
                @click="clickPage(p.key)"
              >
                <input type="checkbox" />
                <label for="" :class="p.check ? 'active' : ''">
                  {{ p.name }}
                  <span>
                    <i class="bi" :class="p.check ? 'bi-check active' : 'bi-plus'"></i>
                  </span>
                </label>
              </li>
            </ul>
          </article>
        </div>
        <div v-if="error.pageErrorMsg.length > 0" class="invalid-feedback d-block">
          {{ error.pageErrorMsg }}
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
} from "../../assets/js/common.js";

export default {
  props: {},
  data() {
    return {
      ajax: {
        media: true,
        page: true,
      },
      uniqueId: null,
      step: 2,
      medias: [
        { name: "네이버검색광고", key: "naver", check: false },
        { name: "카카오검색광고", key: "kakaosa", check: false },
        { name: "카카오모먼트", key: "kakaomo", check: false },
        { name: "GFA", key: "naverda", check: false },
      ],
      pages: [
        { name: "통합대시보드", key: "dashboard", check: true },
        { name: "광고매체분석", key: "mediaAnalysis", check: false },
        { name: "캠페인그룹분석", key: "campaignAnalysis", check: false },
        { name: "기간별분석", key: "periodAnalysis", check: false },
        { name: "키워드분석", key: "keywordAnalysis", check: false },
        { name: "소재별분석", key: "adAnalysis", check: false },
        { name: "N쇼핑검색광고", key: "shoppingAnalysis", check: false },
      ],
      error: {
        mediaErrorMsg: "",
        pageErrorMsg: "",
      },
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
  },
  watch: {},
  mounted() {},
  methods: {
    getUuidv4() {
      return uuidv4();
    },
    prev() {
      let vm = this;
      vm.$emit("prev");
    },
    next() {
      let vm = this;
      vm.ajax.media = true;
      vm.ajax.page = true;
      vm.validate();
      vm.ajax.media && vm.ajax.page ? vm.$emit("next") : "";
    },
    getData() {
      let vm = this;
      return {
        medias: vm.medias,
        pages: vm.pages,
      };
    },
    validate() {
      this.checkMedia();
      this.checkPage();
    },
    checkMedia() {
      let vm = this;
      vm.ajax.media = false;
      this.medias.forEach(function (m) {
        if (m.check) vm.ajax.media = true;
      });

      !vm.ajax.media
        ? (vm.error.mediaErrorMsg = "매체를 1개이상 선택하세요.")
        : (vm.error.mediaErrorMsg = "");
    },
    checkPage() {
      let vm = this;
      vm.ajax.page = false;
      this.pages.forEach(function (p) {
        if (p.check) vm.ajax.page = true;
      });

      !vm.ajax.page
        ? (vm.error.pageErrorMsg = "광고정보를 1개이상 선택하세요.")
        : (vm.error.pageErrorMsg = "");
    },
    clickMedia(key) {
      this.medias.forEach(function (m) {
        if (m.key === key) m.check = !m.check;
      });
    },
    clickPage(key) {
      if (key === "dashboard") return false;
      this.pages.forEach(function (p) {
        if (p.key === key) p.check = !p.check;
      });
    },
  },
};
</script>

<style></style>
