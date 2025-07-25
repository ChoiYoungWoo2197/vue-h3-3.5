<template>
  <header :id="getUniqueId" class="">
    <div class="profile d-flex align-items-center">
      <div class="circle d-flex justify-content-center align-items-center">
        <i class="bi bi-person m-0"></i>
      </div>
      <div>
        <h4>{{ username }}</h4>
        <h5>{{ userid }}</h5>
      </div>
    </div>
    <nav>
      <ul>
        <li :class="{ active: menu === 'dashboard' }">
          <router-link to="/dashboard" class="d-flex align-items-center" @click.native="activeUl('dashboard')">
            <i class="bi bi-pie-chart pr-1"></i><span>통합대시보드</span>
          </router-link>
        </li>
        <!-- <li :class="{ show: menu === 'mediaAnalysis' || menu === 'campaignAnalysis' || menu === 'periodAnalysis' || menu === 'keywordAnalysis' || menu === 'keywordReAnalysis' || menu === 'adAnalysis' || menu === 'targetAnalysis'}"> -->
        <li class="show">        
          <router-link to="/media-analysis" class="d-flex align-items-center justify-content-between" @click.native="activeUl('mediaAnalysis')">
            <div><i class="bi bi-graph-up-arrow pr-1"></i>광고효과분석</div>
            <i class="bi bi-chevron-down m-0"></i>
          </router-link>
          <ul class="submenu">
            <li :class="{ active: menu === 'mediaAnalysis' }">
              <router-link to="/media-analysis" class="d-flex align-items-center" @click.native="activeUl('mediaAnalysis')">광고매체분석</router-link>
            </li>
            <li :class="{ active: menu === 'campaignAnalysis' }">
              <router-link to="/campaign-analysis" class="d-flex align-items-center" @click.native="activeUl('campaignAnalysis')">캠페인그룹분석</router-link>
            </li>
            <li :class="{ active: menu === 'periodAnalysis' }">
              <router-link to="/period-analysis" class="d-flex align-items-center" @click.native="activeUl('periodAnalysis')">기간별분석</router-link>
            </li>
            <li :class="{ active: menu === 'keywordAnalysis' }">
              <router-link to="/keyword-analysis" class="d-flex align-items-center" @click.native="activeUl('keywordAnalysis')">키워드분석</router-link>
            </li>
            <li :class="{ active: menu === 'adAnalysis' }">
              <router-link to="/ad-analysis" class="d-flex align-items-center" @click.native="activeUl('adAnalysis')">소재별분석</router-link>
            </li>
            <li :class="{ active: menu === 'shoppingAnalysis' }">
              <router-link to="/shopping-analysis" class="d-flex align-items-center" @click.native="activeUl('shoppingAnalysis')">쇼핑검색분석</router-link>
            </li>            
            <li :class="{ active: menu === 'targetAnalysis' }">
              <router-link to="/target-analysis" class="d-flex align-items-center" @click.native="activeUl('targetAnalysis')">타겟팅분석</router-link>
            </li>
            <li :class="{ active: menu === 'keywordReAnalysis' }">
              <router-link to="/keywordre-analysis" class="d-flex align-items-center" @click.native="activeUl('keywordReAnalysis')">추천키워드</router-link>
            </li>            
          </ul>
        </li>
        <li :class="{ active: menu === 'reportSend' }">
          <router-link to="/report-send" class="d-flex align-items-center" @click.native="activeUl('reportSend')">
            <i class="bi bi-envelope pr-1"></i> <span>리포트 발송</span>
          </router-link>
        </li>
        <li :class="{ active: menu === 'reportSendRenew' }">
          <router-link to="/report-send-renew" class="d-flex align-items-center" @click.native="activeUl('reportSendRenew')">
            <i class="bi bi-envelope pr-1"></i> <span>리포트 발송(리뉴얼🔥)</span>
          </router-link>
        </li>        
        <li class="show">
          <router-link to="/alarms" class="d-flex align-items-center justify-content-between" @click.native="activeUl('alarms')">
            <div><i class="bi bi-bell pr-1"></i>알림</div>
            <i class="bi bi-chevron-down m-0"></i>
          </router-link>
          <ul class="submenu">
            <li :class="{ active: menu === 'alarms' }">
              <router-link to="/alarms" class="d-flex align-items-center" @click.native="activeUl('alarms')">알림</router-link>
            </li>
            <li :class="{ active: menu === 'alarmsSet' }">
              <router-link to="/alarms-set" class="d-flex align-items-center" @click.native="activeUl('alarms-set')">알림설정</router-link>
            </li>
          </ul>
        </li>
        <li :class="{ active: menu === 'advadd' }">
          <router-link to="/adv-add" class="d-flex align-items-center" @click.native="activeUl('advadd')">
            <i class="bi bi-person-plus pr-1"></i>광고계정 등록
          </router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import $ from "jquery";
import { clearBody, addClassDashboard, isMobile } from "@/assets/js/common.js";
import { API_URL } from "@/configs/config.js";
import { store } from "@/store/store.js";

export default {
  props: { pMenu: null, pDasyboard: false, },
  data() {
    return {
      menu: null,
      uniqueId: null,
      username: null,
      userid: null,
      userlevel: null,
    };
  },
  components: {},
  mounted() {
    this.menu = this.pMenu;
    clearBody();
    addClassDashboard();
    this.username = store.state.userStore.userinfo.username;
    this.userid = store.state.userStore.userinfo.userid;
    this.userlevel = store.state.userStore.userinfo.userlevel;
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
  watch: {
    pDasyboard() { this.dasyboard = this.pDasyboard; },
  },
  methods: {
    activeUl(menu) { this.menu = menu; },
    existUl(event) { return true; },
  },
};
</script>

<style scoped></style>
