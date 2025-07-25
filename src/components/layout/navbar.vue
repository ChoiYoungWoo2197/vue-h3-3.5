<template>
  <nav :id="getUniqueId" class="navbar w991d">
    <div class="d-flex justify-content-between align-items-center">
      <button
        class="navbar-toggler d-flex align-items-center close"
        type="button"
        data-toggle="offcanvas"
        data-target="#m-nav"
        aria-controls="m-nav"
        aria-expanded="false"
        aria-label="Toggle navigation"
        @click="clickBiList"
      >
        <i class="bi bi-list"></i>
      </button>
      <img
        src="../../assets/image/h3.png"
        alt="h3"
        data-toggle="offcanvas"
        data-target="#m-nav"
        aria-controls="m-nav"
        aria-expanded="false"
        aria-label="Toggle navigation"
        class="navbar-toggler close"
      />
      <div class="setting d-flex">
        <button type="button" id="setting" data-toggle="dropdown" aria-expanded="false">
          <i class="bi bi-gear"></i>
        </button>
        <div class="dropdown-menu" aria-labelledby="setting">
          <button
            class="dropdown-item"
            data-toggle="modal"
            data-target="#edit"
            @click="clickRegisterEdit"
          >
            정보수정
          </button>
          <button
            class="dropdown-item"
            data-toggle="modal"
            data-target="#edit"
            @click="clickMMode"
          >
            모바일 버전
          </button>
          <button class="dropdown-item" @click="clickLogOutModal">로그아웃</button>
        </div>
      </div>
    </div>
    <div class="navbar-collapse offcanvas-collapse no-scroll" id="m-nav">
      <div class="width90 no-scroll">
        <div class="profile d-flex justify-content-between">
          <div class="d-flex align-items-center">
            <div class="circle d-flex justify-content-center align-items-center">
              <i class="bi bi-person"></i>
            </div>
            <div class="flex-column">
              <h2>{{ username }}</h2>
              <h5>{{ userid }}</h5>
            </div>
          </div>
          <button
            class="navbar-toggler d-flex"
            type="button"
            data-toggle="offcanvas"
            data-target="#m-nav"
            aria-controls="m-nav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            @click="clickXlg"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <!-- <template v-if="dasyboard === true"> -->
        <template v-if="userlevel === 1">
          <balance ref="balance"></balance>
          <ul class="navbar-nav mr-auto dashboard-menu">
            <li class="nav-item">
              <!-- <a class="nav-link d-flex justify-content-between align-items-center" href="dashboard1-1.html"><span>통합대시보드</span><i class="bi bi-chevron-right"></i></a> -->
              <router-link
                to="/dashboard"
                class="nav-link d-flex justify-content-between align-items-center"
                @click.native="clickRouter"
              >
                <span>통합대시보드</span>
                <i class="bi bi-chevron-right"></i>
              </router-link>
            </li>
            <li class="nav-item">
              <a
                class="nav-link d-flex justify-content-between align-items-center"
                href="#"
              >
                <span>광고효과분석</span>
                <i class="bi bi-chevron-right"></i>
              </a>
              <ul>
                <li class="sub-link">
                  <router-link to="/media-analysis" @click.native="clickRouter"
                    >광고매체분석</router-link
                  >
                </li>
                <li class="sub-link">
                  <router-link to="/campaign-analysis" @click.native="clickRouter"
                    >캠페인그룹분석</router-link
                  >
                </li>
                <li class="sub-link">
                  <router-link to="/period-analysis" @click.native="clickRouter"
                    >기간별분석</router-link
                  >
                </li>
                <li class="sub-link">
                  <router-link to="/keyword-analysis" @click.native="clickRouter"
                    >키워드분석</router-link
                  >
                </li>
                <li class="sub-link">
                  <router-link to="/keywordre-analysis" @click.native="clickRouter"
                    >추천키워드</router-link
                  >
                </li>
                <li class="sub-link">
                  <router-link to="/ad-analysis" @click.native="clickRouter"
                    >소재별분석</router-link
                  >
                </li>
                <li class="sub-link">
                  <router-link to="/target-analysis" @click.native="clickRouter"
                    >타겟팅분석</router-link
                  >
                </li>
              </ul>
            </li>
            <!-- <li class="nav-item">
							<a class="nav-link d-flex justify-content-between align-items-center" href="#"><span>리포트발송</span><i class="bi bi-chevron-right"></i></a>
						</li>
						<li class="nav-item">
							<a class="nav-link d-flex justify-content-between align-items-center" href="#"><span>N쇼핑검색광고</span><i class="bi bi-chevron-right"></i></a>
						</li>
						<li class="nav-item">
							<a class="nav-link d-flex justify-content-between align-items-center" href="#"><span>알림</span><i class="bi bi-chevron-right"></i></a>
						</li> -->
            <li class="nav-item">
              <router-link
                to="/adv-add"
                class="nav-link d-flex justify-content-between align-items-center"
                @click.native="clickRouter"
              >
                <span>광고계정등록</span>
                <i class="bi bi-chevron-right"></i>
              </router-link>
            </li>
          </ul>
        </template>
        <template v-else>
          <ul class="navbar-nav mr-auto">
            <li
              v-if="userlevel === 2 || userlevel === 3 || userlevel === 99"
              class="nav-item"
              :class="[menu === 'agency' ? 'active' : '']"
            >
              <a class="nav-link" href="#"> <i class="bi bi-bar-chart"></i>에이전시홈 </a>
              <ul>
                <li>
                  <router-link to="/agency" class="sub-link" @click.native="clickRouter"
                    >에이전시홈</router-link
                  >
                </li>
              </ul>
            </li>
            <li
              v-if="userlevel === 2 || userlevel === 3 || userlevel === 99"
              class="nav-item"
              :class="[menu === 'membermng' ? 'active' : '']"
            >
              <a class="nav-link" href="#"><i class="bi bi-diagram-3"></i>계정통합관리</a>
              <ul>
                <li>
                  <router-link
                    to="/membermng"
                    class="sub-link"
                    @click.native="clickRouter"
                    >계정통합관리</router-link
                  >
                </li>
              </ul>
            </li>
            <li
              v-if="userlevel === 99"
              class="nav-item"
              :class="[menu === 'membership' ? 'active' : '']"
            >
              <a class="nav-link" href="#"><i class="bi bi-diagram-3"></i>가입승인</a>
              <ul>
                <li>
                  <router-link
                    to="/membership"
                    class="sub-link"
                    @click.native="clickRouter"
                    >가입승인 리스트</router-link
                  >
                </li>
              </ul>
            </li>
            <li
              v-if="userlevel === 99"
              class="nav-item"
              :class="[menu === 'memberlnk' ? 'active' : '']"
            >
              <a class="nav-link" href="#"><i class="bi bi-list-check"></i>계정연동</a>
              <ul>
                <li>
                  <router-link
                    to="/memberlnk"
                    class="sub-link"
                    @click.native="clickRouter"
                    >사내이관</router-link
                  >
                </li>
              </ul>
            </li>
            <li
              v-if="userlevel === 99"
              class="nav-item"
              :class="[
                menu === 'agencylst' ? 'active' : '',
                menu === 'agencyadd' ? 'active' : '',
              ]"
            >
              <a class="nav-link" href="#"><i class="bi bi-people"></i>에이전트관리</a>
              <ul>
                <li>
                  <router-link
                    to="/agency-lst"
                    class="sub-link"
                    @click.native="clickRouter"
                    >에이전트리스트</router-link
                  >
                </li>
                <li>
                  <router-link
                    to="/agency-add"
                    class="sub-link"
                    @click.native="clickRouter"
                    >에이전트 등록</router-link
                  >
                </li>
              </ul>
            </li>
            <li
              v-if="userlevel === 99"
              class="nav-item"
              :class="[
                menu === 'banner' ? 'active' : '',
                menu === 'banner' ? 'active' : '',
              ]"
            >
              <a class="nav-link" href="#"><i class="bi bi-images"></i>배너관리</a>
              <ul>
                <li>
                  <router-link to="/banner" class="sub-link" @click.native="clickRouter"
                    >배너관리</router-link
                  >
                </li>
              </ul>
            </li>
          </ul>
        </template>
      </div>
    </div>
    <log-out-modal ref="logOutModal" style="display: none"></log-out-modal>
  </nav>
</template>

<script>
import $ from "jquery";
import { store } from "../../store/store.js";
import { isMobile } from "../../assets/js/common.js";
import logOutModal from "../../components/modal/logOutModal.vue";
import balance from "../../components/dashboard2/balance.vue";

export default {
  props: {
    pDasyboard: false,
    pMenu: null,
  },
  data() {
    return {
      uniqueId: null,
      username: null,
      userid: null,
      userlevel: null,
      isMobile: isMobile() === true ? true : false,
      dasyboard: false,
      menu: null,
    };
  },
  components: {
    logOutModal,
    balance,
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
    pDasyboard() {
      this.dasyboard = this.pDasyboard;
      this.username = store.state.userStore.userinfo.username;
      this.userid = store.state.userStore.userinfo.userid;
      this.userlevel = store.state.userStore.userinfo.userlevel;
    },
  },
  mounted() {
    // console.log(store.state.userStore.userinfo.username);
    this.menu = this.pMenu;
    this.dasyboard = this.pDasyboard;
    this.username = store.state.userStore.userinfo.username;
    this.userid = store.state.userStore.userinfo.userid;
    this.userlevel = store.state.userStore.userinfo.userlevel;
  },
  methods: {
    clickRouter() {
      this.clickXlg();
    },
    clickBiList() {
      $(".offcanvas-collapse").toggleClass("open");
      $(".screen-darken").toggleClass("active");
    },
    clickXlg() {
      $(".screen-darken").toggleClass("active");
      $(".offcanvas-collapse").toggleClass("open");
    },
    clickLogOutModal() {
      this.$refs.logOutModal.showModal();
    },
    clickMMode() {
      document.cookie = "DesktopMode=false";
      window.scrollTo(0, 0);
      this.$router.go();
    },
    clickRegisterEdit() {
      this.$router.replace("/register-edit");
    },
    activeUl(menu) {
      this.menu = menu;
    },
  },
};
</script>

<style scoped></style>
