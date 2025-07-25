<template>
  <nav :id="getUniqueId" class="w991u">
    <div class="profile d-flex flex-column justify-content-center">
      <div
        class="circle d-flex justify-content-center align-self-center align-items-center mb-2"
      >
        <i class="bi bi-person"></i>
      </div>
      <h2 class="align-self-center mb-1">{{ username }}</h2>
      <h5 class="align-self-center">{{ userid }}</h5>
    </div>
    <!-- <template v-if="menu === 'dashboard' || menu === 'advadd'"> -->
    <template v-if="userlevel === 1">
      <balance ref="balance"></balance>
      <ul class="dashboard-menu">
        <li class="menu">
          <router-link
            to="/dashboard"
            class="row d-flex justify-content-between align-items-center"
            @click.native="activeUl('dashboard')"
          >
            <span>통합대시보드</span>
            <i v-if="true === true" class="bi bi-chevron-right"></i>
            <i v-else-if="menu === 'dashboard'" class="bi bi-chevron-up"></i>
            <i v-else class="bi bi-chevron-down"></i>
          </router-link>
        </li>
        <li class="menu">
          <a href="#" class="row d-flex justify-content-between align-items-center">
            <span>광고효과분석</span>
            <!-- <i v-if="false === true" class="bi bi-chevron-right"></i>
						<i v-else-if="menu === 'mediaAnalysis' || menu === 'campaignAnalysis' || menu === 'periodAnalysis'" class="bi bi-chevron-up"></i>
						<i v-else class="bi bi-chevron-down"></i> -->
            <i class="bi bi-chevron-up"></i>
          </a>
          <ul
            class="dash-menu active"
            :class="{
              active:
                menu === 'mediaAnalysis' ||
                menu === 'campaignAnalysis' ||
                menu === 'periodAnalysis',
            }"
          >
            <li class="sub-link">
              <router-link to="/media-analysis" @click.native="activeUl('mediaAnalysis')">
                광고매체분석
              </router-link>
            </li>
            <li class="sub-link">
              <router-link
                to="/campaign-analysis"
                @click.native="activeUl('campaignAnalysis')"
              >
                캠페인그룹분석
              </router-link>
            </li>
            <li class="sub-link">
              <router-link
                to="/period-analysis"
                @click.native="activeUl('periodAnalysis')"
              >
                기간별분석
              </router-link>
            </li>
            <li class="sub-link">
              <router-link
                to="/keyword-analysis"
                @click.native="activeUl('keywordAnalysis')"
              >
                키워드분석
              </router-link>
            </li>
            <li class="sub-link">
              <router-link
                to="/keywordre-analysis"
                @click.native="activeUl('keywordReAnalysis')"
              >
                추천키워드
              </router-link>
            </li>
            <li class="sub-link">
              <router-link to="/ad-analysis" @click.native="activeUl('adAnalysis')">
                소재별분석
              </router-link>
            </li>
            <li class="sub-link">
              <router-link
                to="/target-analysis"
                @click.native="activeUl('targetAnalysis')"
              >
                타겟팅분석
              </router-link>
            </li>
          </ul>
        </li>
        <!-- <li class="menu">
					<a href="#" class="row d-flex justify-content-between align-items-center">
						<span>리포트발송</span>
						<i class="bi bi-chevron-right"></i>
					</a>
				</li>
				<li class="menu">
					<a href="#" class="row d-flex justify-content-between align-items-center">
						<span>N쇼핑검색광고</span>
						<i class="bi bi-chevron-right"></i>
					</a>
				</li>
				<li class="menu">
					<a href="#" class="row d-flex justify-content-between align-items-center">
						<span>알림</span>
						<i class="bi bi-chevron-right"></i>
					</a>
				</li> -->
        <li class="menu">
          <router-link
            to="/adv-add"
            class="row d-flex justify-content-between align-items-center"
          >
            <span>광고계정등록</span>
            <i class="bi bi-chevron-right"></i>
          </router-link>
        </li>
      </ul>
    </template>
    <template v-else>
      <ul>
        <li v-if="userlevel === 2 || userlevel === 99" class="menu">
          <a href="#" class="row d-flex justify-content-between align-items-center">
            <i class="bi bi-bar-chart"></i>
            <span>에이전시홈</span>
            <i v-if="false === true" class="bi bi-chevron-right"></i>
            <i v-else-if="menu === 'agency'" class="bi bi-chevron-up"></i>
            <i v-else class="bi bi-chevron-down"></i>
          </a>
          <ul :class="{ active: menu === 'agency' }">
            <li @click="activeUl('agency')">
              <router-link to="/agency">에이전시홈</router-link>
            </li>
          </ul>
        </li>
        <li v-if="userlevel === 2 || userlevel === 99" class="menu">
          <a href="#" class="row d-flex justify-content-between align-items-center">
            <i class="bi bi-diagram-3"></i>
            <span>계정통합관리</span>
            <i v-if="false === true" class="bi bi-chevron-right"></i>
            <i v-else-if="menu === 'membermng'" class="bi bi-chevron-up"></i>
            <i v-else class="bi bi-chevron-down"></i>
          </a>
          <ul :class="{ active: menu === 'membermng' }">
            <li @click="activeUl('membermng')">
              <router-link to="/membermng">계정통합관리</router-link>
            </li>
          </ul>
        </li>
        <li v-if="userlevel === 99" class="menu">
          <a href="#" class="row d-flex justify-content-between align-items-center">
            <i class="bi bi-person-check"></i>
            <span>가입승인</span>
            <i v-if="false === true" class="bi bi-chevron-right"></i>
            <i v-else-if="menu === 'membership'" class="bi bi-chevron-up"></i>
            <i v-else class="bi bi-chevron-down"></i>
          </a>
          <ul :class="{ active: menu === 'membership' }">
            <li @click="activeUl('membership')">
              <router-link to="/membership">가입승인 리스트</router-link>
            </li>
          </ul>
        </li>
        <li v-if="userlevel === 99" class="menu">
          <a href="#" class="row d-flex justify-content-between align-items-center">
            <i class="bi bi-list-check"></i>
            <span>계정연동</span>
            <i v-if="false === true" class="bi bi-chevron-right"></i>
            <i v-else-if="menu === 'memberlnk'" class="bi bi-chevron-up"></i>
            <i v-else class="bi bi-chevron-down"></i>
          </a>
          <ul :class="{ active: menu === 'memberlnk' }">
            <li @click="activeUl('memberlnk')">
              <router-link to="/memberlnk">사내이관</router-link>
            </li>
          </ul>
        </li>
        <li v-if="userlevel === 99" class="menu">
          <a href="#" class="row d-flex justify-content-between align-items-center">
            <i class="bi bi-people"></i>
            <span>에이전트관리</span>
            <i v-if="false === true" class="bi bi-chevron-right"></i>
            <i v-else-if="menu === 'agencylst'" class="bi bi-chevron-up"></i>
            <i v-else class="bi bi-chevron-down"></i>
          </a>
          <ul :class="{ active: menu === 'agencylst' || menu === 'agencyadd' }">
            <li @click="activeUl('agencylst')">
              <router-link to="/agency-lst">에이전트리스트</router-link>
            </li>
            <li @click="activeUl('agencyadd')">
              <router-link to="/agency-add">에이전트 등록</router-link>
            </li>
          </ul>
        </li>
        <li v-if="userlevel === 2 || userlevel === 99" class="menu">
          <a href="#" class="row d-flex justify-content-between align-items-center">
            <i class="bi bi-images"></i>
            <span>배너관리</span>
            <i v-if="false === true" class="bi bi-chevron-right"></i>
            <i v-else-if="menu === 'banner'" class="bi bi-chevron-up"></i>
            <i v-else class="bi bi-chevron-down"></i>
          </a>
          <ul :class="{ active: menu === 'banner' }">
            <li @click="activeUl('banner')">
              <router-link to="/banner">배너관리</router-link>
            </li>
          </ul>
        </li>
      </ul>
    </template>
  </nav>
</template>

<script>
import $ from "jquery";
import { clearBody, addClassMain } from "../../assets/js/common.js";
import { API_URL } from "../../configs/config.js";
import { store } from "../../store/store.js";
import balance from "../dashboard2/balance.vue";

export default {
  props: {
    pMenu: null,
  },
  components: {
    balance,
  },
  data() {
    return {
      menu: null,
      uniqueId: null,
      username: null,
      userid: null,
      userlevel: null,
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
  mounted() {
    this.menu = this.pMenu;
    clearBody();
    addClassMain();
    this.username = store.state.userStore.userinfo.username;
    this.userid = store.state.userStore.userinfo.userid;
    this.userlevel = store.state.userStore.userinfo.userlevel;
    this.$emit("mountedMain", true);
  },
  methods: {
    activeUl(menu) {
      // console.log(menu);
      this.menu = menu;
    },
    existUl(event) {
      return true;
    },
  },
};
</script>

<style>
/* *{box-sizing: border-box !important; list-style: none; font-size: 14px;} */
/* body{margin: 0 auto; padding: 0; min-width: 360px; } */
/* body::-webkit-scrollbar{display: none;} */
</style>
