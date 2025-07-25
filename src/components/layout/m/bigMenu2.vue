<template>
  <!-- 상단 메뉴 -->
  <div class="offcanvas navbar-collapse offcanvas-collapse big-menu-2" id="nav" :class="getUniqueId">
    <div class="offcanvas-header">
      <nav class="d-flex justify-content-between align-items-center">
        <div class="menu-info d-flex align-items-center">
          <div class="logo d-flex justify-content-center align-items-center">
            <router-link to="/dashboard" class="d-flex justify-content-center align-items-center" @click.native="activeUl('dashboard')">
              <img src="@/assets/image/icon_heeil.png" alt="희일커뮤니케이션" class="icon"/>
            </router-link>
          </div>
        </div>
        <div class="title"><h2>메뉴</h2></div>
        <div class="menu-icon d-flex justify-content-center align-items-center">
          <button type="button" class="btn d-flex justify-content-center align-items-center" data-bs-dismiss="offcanvas" aria-label="Close" @click="clickSubmit">
            <i class="bi bi-x-lg icon"></i>
          </button>
        </div>
      </nav>
    </div>
    <div class="offcanvas-body">
      <div class="d-flex align-items-start mh-100">
        <div class="nav flex-column nav-pills" id="submenu" role="tablist" aria-orientation="vertical">
          <button class="nav-link" :class="[activeMenu === 'dashboard' ? 'active' : '']" id="submenu1-tab" 
          data-bs-toggle="pill" data-bs-target="#submenu1" type="button" role="tab" aria-controls="submenu1" 
          aria-selected="false" tabindex="-1" @click="clickMenu('dashboard', 'dashboard')">
          통합대시보드
          </button>
          <button class="nav-link" :class="[activeMenu === 'analysis' ? 'active' : '']" id="submenu2-tab" 
          data-bs-toggle="pill" data-bs-target="#submenu2" type="button" role="tab" aria-controls="submenu2" 
          aria-selected="true" @click="clickMenu('analysis', 'media-analysis')">
            광고효과분석
          </button>
          <button class="nav-link" :class="[activeMenu === 'report-send' ? 'active' : '']" id="submenu2-tab" 
          data-bs-toggle="pill" data-bs-target="#submenu2" type="button" role="tab" aria-controls="submenu2" 
          aria-selected="true" @click="clickMenu('report-send', 'report-send')">            
          리포트발송
          </button>
          <!-- <button class="nav-link" :class="[activeMenu === 'shopping-analysis' ? 'active' : '']" id="submenu2-tab" 
          data-bs-toggle="pill" data-bs-target="#submenu2" type="button" role="tab" aria-controls="submenu2" 
          aria-selected="true" @click="clickMenu('shopping-analysis', 'shopping-analysis')">
            쇼핑검색분석
          </button> -->
          <button class="nav-link" :class="[activeMenu === 'adv-add' ? 'active' : '']" id="submenu2-tab" 
          data-bs-toggle="pill" data-bs-target="#submenu2" type="button" role="tab" aria-controls="submenu2" 
          aria-selected="true" @click="clickMenu('adv-add', 'adv-add')">
            광고계정등록
          </button>
        </div>
        <div class="tab-content" id="submenuContent">
          <div class="tab-pane fade show active" id="submenu1" role="tabpanel" aria-labelledby="submenu1-tab" tabindex="0">
            <template v-for="(menu, index) in menu">
              <ul v-if="menu.key === activeMenu" :key="index">
                <li v-for="(submenu, index2) in menu.submenu" :key="index2 + '-' + getUuidv4()" class="nav-link d-flex align-items-center" :class="[submenu.key === activeSubMenu ? 'active' : '']" @click="clickSubMenu(submenu.key)">
                  <a href="#" class="d-flex align-items-center">{{ submenu.value }}</a>
                </li>
              </ul>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import { clearBody, addClassDashboard, isMobile, uuidv4, priceToString, hideLayout, showLayout, hideOffcanvas} from "@/assets/js/common.js";
import moment from "moment";

export default {
  props: {
    pMenu: null,
    pDasyboard: false,
  },
  data() {
    return {
      activeMenu: "dashboard",
      activeSubMenu: "dashboard",
      menu: [
        { key: "dashboard", submenu: [{ key: "dashboard", value: "통합대시보드" }] },
        {
          key: "analysis",
          submenu: [
            { key: "media-analysis", value: "광고매체분석" },
            { key: "campaign-analysis", value: "캠페인그룹분석" },
            { key: "period-analysis", value: "기간별분석" },
            { key: "keyword-analysis", value: "키워드분석" },
            { key: "shopping-analysis", value: "쇼핑검색분석" },
            { key: "ad-analysis", value: "소재별분석" },
            { key: "target-analysis", value: "타겟팅분석" },
            { key: "keywordre-analysis", value: "추천키워드" },
          ],
        },
        {
          key: "report-send",
          submenu: [{ key: "report-send", value: "리포트내역" }],
        },
        // {
        //   key: "shopping-analysis",
        //   submenu: [{ key: "shopping-analysis", value: "N쇼핑검색광고" }],
        // },
        {
          key: "adv-add",
          submenu: [{ key: "adv-add", value: "광고계정등록" }],
        },
      ],
      uniqueId: null,
    };
  },
  components: {},
  mounted() {
    clearBody();
    addClassDashboard();
    this.$emit("mountedMain", true);
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
  methods: {
    setMenu(menu) {
      this.activeMenu = menu;
    },
    setSubMenu(submenu) {
      this.activeSubMenu = submenu;
    },
    clickSubMenu(submenu) {
      this.activeSubMenu = submenu;
      "/" + submenu !== this.$router.currentRoute.path ? this.$router.push("/" + submenu) : "";
    },
    clickMenu(menu, submenu) {
      this.activeMenu = menu;
      this.activeSubMenu = submenu;
    },
    getUuidv4() { return uuidv4(); },
    copyObject(object) { return JSON.parse(JSON.stringify(object)); },
    priceToString(salse) {
      if (salse === undefined) return "";
      return priceToString(salse);
    },
    clickSubmit() {
      let top = document.querySelector(".m-wrap > .m-top");
      let footer = document.querySelector(".m-wrap > .m-footer");
      let section = document.querySelector(".m-wrap > section");

      top.classList.remove("d-none");
      footer.classList.remove("d-none");
      section.classList.remove("d-none");

      let bigMenu2 = document.querySelector(".m-wrap > .big-menu-2");
      bigMenu2.classList.remove("open");
      this.$emit("closeBtn");
    },
  },
};
</script>

<style></style>
