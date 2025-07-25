<template>
  <header
    :id="getUniqueId"
    class="row d-flex w991u"
    :class="[dasyboard === true ? 'justify-content-end' : '']"
  >
    <!-- <template v-if="dasyboard === true">
			<div class="alarm d-flex align-items-center">
				<button type="button" id="alarm" data-toggle="dropdown" aria-expanded="false"><i class="bi bi-bell"></i></button>
				<ul class="dropdown-menu" aria-labelledby="alarm">
					<li class="dropdown-title d-flex justify-content-between align-items-center">
						<h5>통합 알림</h5>
						<button>전체 보기</button>
					</li>
					<div class="dropdown-bundle">
						<li class="dropdown-item d-flex flex-column new">
							<button>
								<p>3월 21일 21:15</p>
								<p>
									<span><img src="image/naver.png">검색</span>
									<span>광고정지(잔액부족)</span>
								</p>
							</button>
						</li>
					</div>
				</ul>
			</div>
		</template> -->
    <!-- <div class="setting d-flex align-items-center justify-content-end"> -->

    <div
      class="setting d-flex align-items-center"
      :class="[dasyboard === true ? 'justify-content-end' : '']"
    >
      <div v-if="dasyboard === false" class="input-group">
        <button type="button" class="mr-2" @click="clickMemberLnkModal">
          <i class="bi bi-diagram-3"></i>
        </button>
      </div>

      <button type="button" id="setting" data-toggle="dropdown" aria-expanded="false">
        <i class="bi bi-gear"></i>
      </button>
      <div class="dropdown-menu" aria-labelledby="setting">
        <button class="dropdown-item" data-toggle="modal" data-target="#edit">
          <router-link to="/register-edit">정보수정</router-link>
        </button>
        <button v-if="isMobile === true" class="dropdown-item" @click="clickDmMode">
          모바일 버전
        </button>
        <button class="dropdown-item" @click="clickLogOutModal">로그아웃</button>
      </div>
    </div>
    <log-out-modal ref="logOutModal" style="display: none"></log-out-modal>
    <memberlnk-modal
      ref="memberLnkModal"
      style="display: none"
      @expireSession="handleExpireSession"
    ></memberlnk-modal>
    <expire-session-modal
      ref="expireSessionModal"
      style="display: none"
    ></expire-session-modal>
  </header>
</template>

<script>
import $ from "jquery";
import { store } from "../../store/store.js";
import { isMobile } from "../../assets/js/common.js";
import memberlnkModal from "../../components/modal/memberlnkModal.vue";
import expireSessionModal from "../../components/modal/expireSessionModal.vue";
import logOutModal from "../../components/modal/logOutModal.vue";

export default {
  props: {
    pDasyboard: false,
  },
  data() {
    return {
      uniqueId: null,
      isMobile: isMobile() === true ? true : false,
      dasyboard: false,
      userlevel: null,
    };
  },
  components: {
    logOutModal,
    memberlnkModal,
    expireSessionModal,
  },
  mounted() {
    this.dasyboard = this.pDasyboard;
    this.userlevel = store.state.userStore.userinfo.userlevel;
    // console.log(this.userlevel);
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
    },
  },
  methods: {
    clickLogOutModal() {
      this.$refs.logOutModal.showModal();
    },
    clickDmMode() {
      document.cookie = "DesktopMode=false";
      window.scrollTo(0, 0);
      this.$router.go();
    },
    clickMemberLnkModal() {
      this.$refs.memberLnkModal.showModal();
    },
    handleExpireSession() {
      this.$refs.expireSessionModal.showModal();
    },
  },
};
</script>

<style scoped></style>
