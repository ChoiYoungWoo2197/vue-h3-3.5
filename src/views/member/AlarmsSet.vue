<template>
  <div class="d-flex m-h-100 dashboard">
    <big-menu-2 :pMenu="'alarmsSet'" @mountedMain="activeMain" class="pc"></big-menu-2>
    <div class="pc wrap">
      <balance @logOut="handleLogOut" @changeData="handleChangedBalance"></balance>
      <section class="userinfo-edit">
        <div class="title d-flex justify-content-between align-items-center">
          <h2>알림설정</h2>
        </div>
        <date-range-picker
          ref="dateRangePicker"
          class="form-control"
          :pStart="start"
          :pEnd="end"
          :pDisabled="false"
          @changedDate="handleChangedDateRange"
          hidden
        >
        </date-range-picker>
        <article class="alarm-setting">
          <div class="row">
            <div class="col-xl-12">
              <div class="form-group">
                <div
                  class="btn-group select-btn m-0"
                  role="group"
                  aria-label="Basic example"
                >
                  <button
                    type="button"
                    class="btn m-0"
                    :class="[range.type.isAccount ? 'active' : '']"
                    @click="range.type.isAccount = true"
                  >
                    계정
                  </button>
                  <button
                    type="button"
                    class="btn m-0"
                    :class="[range.type.isAccount ? '' : 'active']"
                    @click="range.type.isAccount = false"
                  >
                    캠페인
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-xl-6">
              <div class="form-group">
                <label
                  for="imRange"
                  class="d-flex justify-content-between align-items-center"
                >
                  <h3>
                    노출수
                    <span class="text-primary">{{ range.im.day }}</span
                    >일 전
                  </h3>
                  <div
                    class="btn-group select-btn m-0"
                    role="group"
                    aria-label="Basic example"
                  >
                    <button
                      type="button"
                      class="btn m-0"
                      :class="[range.im.isplus === true ? 'active' : '']"
                      @click="range.im.isplus = true"
                    >
                      인상률
                    </button>
                    <button
                      type="button"
                      class="btn m-0"
                      :class="[range.im.isplus === true ? '' : 'active']"
                      @click="range.im.isplus = false"
                    >
                      인하율
                    </button>
                  </div>
                </label>
                <input
                  type="range"
                  class="form-control-range"
                  id="imRange"
                  v-model="range.im.day"
                  min="0"
                  max="100"
                />
              </div>
              <div class="form-group">
                <label
                  for="clkRange"
                  class="d-flex justify-content-between align-items-center"
                >
                  <h3>
                    클릭수
                    <span class="text-primary"> {{ range.clk.day }}</span
                    >일 전
                  </h3>
                  <div
                    class="btn-group select-btn m-0"
                    role="group"
                    aria-label="Basic example"
                  >
                    <button
                      type="button"
                      class="btn m-0"
                      :class="[range.clk.isplus === true ? 'active' : '']"
                      @click="range.clk.isplus = true"
                    >
                      인상률
                    </button>
                    <button
                      type="button"
                      class="btn m-0"
                      :class="[range.clk.isplus === true ? '' : 'active']"
                      @click="range.clk.isplus = false"
                    >
                      인하율
                    </button>
                  </div>
                </label>
                <input
                  type="range"
                  class="form-control-range"
                  v-model="range.clk.day"
                  id="clkRange"
                  min="0"
                  max="100"
                />
              </div>
            </div>
            <div class="col-xl-6">
              <div class="form-group">
                <label
                  for="cvRange"
                  class="d-flex justify-content-between align-items-center"
                >
                  <h3>
                    전환수
                    <span class="text-primary">{{ range.cv.day }}</span
                    >일 전
                  </h3>
                  <div
                    class="btn-group select-btn m-0"
                    role="group"
                    aria-label="Basic example"
                  >
                    <button
                      type="button"
                      class="btn m-0"
                      :class="[range.cv.isplus === true ? 'active' : '']"
                      @click="range.cv.isplus = true"
                    >
                      인상률
                    </button>
                    <button
                      type="button"
                      class="btn m-0"
                      :class="[range.cv.isplus === true ? '' : 'active']"
                      @click="range.cv.isplus = false"
                    >
                      인하율
                    </button>
                  </div>
                </label>
                <input
                  type="range"
                  class="form-control-range"
                  v-model="range.cv.day"
                  id="cvRange"
                  min="0"
                  max="100"
                />
              </div>
              <div class="form-group">
                <label
                  for="crRange"
                  class="d-flex justify-content-between align-items-center"
                >
                  <h3>
                    전환매출
                    <span class="text-primary">{{ range.cr.day }}</span
                    >일 전
                  </h3>
                  <div
                    class="btn-group select-btn m-0"
                    role="group"
                    aria-label="Basic example"
                  >
                    <button
                      type="button"
                      class="btn m-0"
                      :class="[range.cr.isplus === true ? 'active' : '']"
                      @click="range.cr.isplus = true"
                    >
                      인상률
                    </button>
                    <button
                      type="button"
                      class="btn m-0"
                      :class="[range.cr.isplus === true ? '' : 'active']"
                      @click="range.cr.isplus = false"
                    >
                      인하율
                    </button>
                  </div>
                </label>
                <input
                  type="range"
                  class="form-control-range"
                  id="crRange"
                  v-model="range.cr.day"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>
          <div class="alert alert-warning mb-0" role="alert">
            ※ 선택한 기준일 대비 인상률(또는 인하율)이 알림창에 반영됩니다. (평균 20분
            소요) <br />
            ※ '0'일로 설정된 경우 알림기능이 해제됩니다.
          </div>
        </article>
        <div class="two-btn float-right">
          <button type="submit" class="btn select-cancel" @click="cancelForm">
            취소
          </button>
          <button type="submit" class="btn select-save" @click="submitForm">저장</button>
        </div>
      </section>
    </div>
    <div class="m m-wrap">
      <mheader ref="mHeader" :pMenu="'dashboard'"></mheader>
      <mfooter ref="mFooter" :pMenu="'dashboard'"></mfooter>
      <section>
        <article class="statisticst-report">
          <div class="title d-flex justify-content-between align-items-center">
            <h2>알림설정</h2>
          </div>
          <div class="alarm-setting">
            <div class="row">
              <div class="col-xl-12">
                <div class="form-group">
                  <div
                    class="btn-group select-btn m-0"
                    role="group"
                    aria-label="Basic example"
                  >
                    <button
                      type="button"
                      class="btn m-0"
                      :class="[range.type.isAccount ? 'active' : '']"
                      @click="range.type.isAccount = true"
                    >
                      계정
                    </button>
                    <button
                      type="button"
                      class="btn m-0"
                      :class="[range.type.isAccount ? '' : 'active']"
                      @click="range.type.isAccount = false"
                    >
                      캠페인
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-xl-6">
                <div class="form-group">
                  <label
                    for="imRange"
                    class="d-flex justify-content-between align-items-center"
                  >
                    <h3>
                      노출수
                      <span class="text-primary">{{ range.im.day }}</span
                      >일 전
                    </h3>
                    <div
                      class="btn-group select-btn m-0"
                      role="group"
                      aria-label="Basic example"
                    >
                      <button
                        type="button"
                        class="btn m-0"
                        :class="[range.im.isplus === true ? 'active' : '']"
                        @click="range.im.isplus = true"
                      >
                        인상률
                      </button>
                      <button
                        type="button"
                        class="btn m-0"
                        :class="[range.im.isplus === true ? '' : 'active']"
                        @click="range.im.isplus = false"
                      >
                        인하율
                      </button>
                    </div>
                  </label>
                  <input
                    type="range"
                    class="form-control-range"
                    id="imRange"
                    v-model="range.im.day"
                    min="0"
                    max="100"
                  />
                </div>
                <div class="form-group">
                  <label
                    for="clkRange"
                    class="d-flex justify-content-between align-items-center"
                  >
                    <h3>
                      클릭수
                      <span class="text-primary"> {{ range.clk.day }}</span
                      >일 전
                    </h3>
                    <div
                      class="btn-group select-btn m-0"
                      role="group"
                      aria-label="Basic example"
                    >
                      <button
                        type="button"
                        class="btn m-0"
                        :class="[range.clk.isplus === true ? 'active' : '']"
                        @click="range.clk.isplus = true"
                      >
                        인상률
                      </button>
                      <button
                        type="button"
                        class="btn m-0"
                        :class="[range.clk.isplus === true ? '' : 'active']"
                        @click="range.clk.isplus = false"
                      >
                        인하율
                      </button>
                    </div>
                  </label>
                  <input
                    type="range"
                    class="form-control-range"
                    v-model="range.clk.day"
                    id="clkRange"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              <div class="col-xl-6">
                <div class="form-group">
                  <label
                    for="cvRange"
                    class="d-flex justify-content-between align-items-center"
                  >
                    <h3>
                      전환수
                      <span class="text-primary">{{ range.cv.day }}</span
                      >일 전
                    </h3>
                    <div
                      class="btn-group select-btn m-0"
                      role="group"
                      aria-label="Basic example"
                    >
                      <button
                        type="button"
                        class="btn m-0"
                        :class="[range.cv.isplus === true ? 'active' : '']"
                        @click="range.cv.isplus = true"
                      >
                        인상률
                      </button>
                      <button
                        type="button"
                        class="btn m-0"
                        :class="[range.cv.isplus === true ? '' : 'active']"
                        @click="range.cv.isplus = false"
                      >
                        인하율
                      </button>
                    </div>
                  </label>
                  <input
                    type="range"
                    class="form-control-range"
                    v-model="range.cv.day"
                    id="cvRange"
                    min="0"
                    max="100"
                  />
                </div>
                <div class="form-group">
                  <label
                    for="crRange"
                    class="d-flex justify-content-between align-items-center"
                  >
                    <h3>
                      전환매출
                      <span class="text-primary">{{ range.cr.day }}</span
                      >일 전
                    </h3>
                    <div
                      class="btn-group select-btn m-0"
                      role="group"
                      aria-label="Basic example"
                    >
                      <button
                        type="button"
                        class="btn m-0"
                        :class="[range.cr.isplus === true ? 'active' : '']"
                        @click="range.cr.isplus = true"
                      >
                        인상률
                      </button>
                      <button
                        type="button"
                        class="btn m-0"
                        :class="[range.cr.isplus === true ? '' : 'active']"
                        @click="range.cr.isplus = false"
                      >
                        인하율
                      </button>
                    </div>
                  </label>
                  <input
                    type="range"
                    class="form-control-range"
                    id="crRange"
                    v-model="range.cr.day"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
            <div class="alert alert-warning mb-0" role="alert">
              ※ 선택한 기준일 대비 인상률(또는 인하율)이 알림창에 반영됩니다. (평균 20분
              소요) <br />
              ※ '0'일로 설정된 경우 알림기능이 해제됩니다.
            </div>
            <div class="itle d-flex justify-content-between align-items-center mt-2">
              <div class="two-btn col-md-6 d-flex justify-content-between">
                <button type="submit" class="btn select-cancel" @click="cancelForm">
                  취소
                </button>
                <button type="submit" class="btn select-save" @click="submitForm">
                  저장
                </button>
              </div>
            </div>
          </div>
        </article>
      </section>
      <mbig-menu-2
        ref="mBigMenu2"
        @closeBtn="$refs.mFooter.setFooter('home')"
      ></mbig-menu-2>
      <mdate-range-picker
        ref="mDateRangePicker"
        :pStart="start"
        :pEnd="end"
        :pCstart="''"
        :pCend="''"
        @changedDate="handleChangedDateRange"
        @closeBtn="$refs.mFooter.setFooter('home')"
      >
      </mdate-range-picker>
      <mbalance
        ref="mBalance"
        :pBalance="balance"
        @closeBtn="$refs.mFooter.setFooter('home')"
      ></mbalance>
      <malarm ref="mFmenu" @closeBtn="$refs.mFooter.setFooter('home')"></malarm>
      <mfmenu
        ref="mFmenu"
        @logout="handleLogOut"
        @dbedit="$refs.mFooter.clickDbEdit('dashboard-edit')"
        @closeBtn="$refs.mFooter.setFooter('home')"
      ></mfmenu>
      <mdashboard-edit
        ref="mDashboardEdit"
        @closeBtn="$refs.mFooter.setFooter('home')"
      ></mdashboard-edit>
    </div>
    <log-out-modal ref="logOutModal" style="display: none"></log-out-modal>
    <expire-session-modal
      ref="expireSessionModal"
      style="display: none"
    ></expire-session-modal>
    <mask-modal ref="maskModal" style="display: none"></mask-modal>
  </div>
</template>

<script>
import $ from "jquery";
import moment from "moment";
import { isMobile, priceToString, getMedia } from "../../assets/js/common.js";
import dateRangePicker from "../../components/common/dateRangePicker.vue";
import expireSessionModal from "../../components/modal/expireSessionModal.vue";
import messageModal from "../../components/modal/messageModal.vue";
import maskModal from "../../components/modal/maskModal.vue";
import { store } from "../../store/store.js";
import { SHA256 } from "../../assets/js/sha256.js";
import { API_URL, TEMP_KEY } from "../../configs/config.js";
import balance from "../../components/dashboard2/balance.vue";
import bigMenu2 from "../../components/layout/bigMenu2.vue";
import logOutModal from "../../components/modal/logOutModal.vue";
import mheader from "../../components/layout/m/header.vue";
import mfooter from "../../components/layout/m/footer.vue";
import mbigMenu2 from "../../components/layout/m/bigMenu2.vue";
import mdateRangePicker from "../../components/common/m/dateRangePicker.vue";
import mbalance from "../../components/common/m/balance.vue";
import mfmenu from "../../components/common/m/fMenu.vue";
import malarm from "../../components/common/m/alarm.vue";
import mdashboardEdit from "../../components/common/m/dashboardEdit.vue";

export default {
  data() {
    return {
      start: store.state.dateStore.start,
      end: store.state.dateStore.end,
      range: {
        type: { isAccount: true }, //계정/캠페인
        im: { isplus: true, day: 0 }, //노출수
        clk: { isplus: true, day: 0 }, //클릭수
        cv: { isplus: true, day: 0 }, //전환수
        cr: { isplus: true, day: 0 }, //전환매출
      },
      balance: [],
    };
  },
  computed: {},
  components: {
    bigMenu2,
    logOutModal,
    balance,
    dateRangePicker,
    expireSessionModal,
    messageModal,
    maskModal,
    mheader,
    mfooter,
    mbigMenu2,
    mdateRangePicker,
    mbalance,
    mfmenu,
    malarm,
    mdashboardEdit,
  },
  mounted() {
    $(".main").removeClass("m-h-100");
    this.clickSearchBtn();
  },
  methods: {
    activeMain(flag) {
      this.$emit("mountedMain", true);
      this.$emit("mountedDasyboad", true);
    },
    handleLogOut() {
      this.$refs.logOutModal.showModal();
    },
    handleExpireSession() {
      this.$refs.expireSessionModal.showModal();
    },
    handleShowMask() {
      this.$refs.maskModal.showModal();
    },
    handleHideMask() {
      this.$refs.maskModal.hideModal();
    },
    cancelForm() {
      this.$router.push("/dashboard");
    },
    clickSearchBtn() {
      this.getRange();
    },
    getRange() {
      var vm = this;

      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/alarm/alarmset",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          mode: "get",
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {
          vm.handleShowMask();
          // vm.showMaskPannelForReport = true;
        },
        success: function (data) {
          if (data.result === "success") {
            if (data.data.alarmset.length > 0) {
              var keys = Object.keys(data.data.alarmset[0]);
              for (var i = 0; i < keys.length; i++) {
                var value = data.data.alarmset[0][keys[i]];
                if (keys[i] === "type") {
                  vm.range[keys[i]].isAccount = value;
                } else if (value.length === 0 || value.indexOf("+") > -1) {
                  vm.range[keys[i]].isplus = true;
                  vm.range[keys[i]].day =
                    value.length === 0 ? 0 : value.substr(1, value.length);
                } else {
                  vm.range[keys[i]].isplus = false;
                  vm.range[keys[i]].day = value.substr(1, value.length);
                }
              }
            }
          } else {
            if (data.status === "0001") {
              vm.handleExpireSession();
            } else {
            }
          }
        },
        error: function (a, b, c) {
          if (a.status === 403) {
            vm.$store.commit("logout");
            vm.$store.commit("logoutActivedMdias");
            vm.$store.commit("logoutKakaoSa");
            vm.$router.push("/");
          }
        },
        complete: function (a, b, c) {
          vm.handleHideMask();
          // vm.showMaskPannelForReport = false;
        },
      });
    },
    submitForm() {
      // console.log(this.range);
      var vm = this;
      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/alarm/alarmset",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          type: vm.range.type.isAccount ? 1 : 0,
          im: vm.range.im.isplus === true ? "+" + vm.range.im.day : "-" + vm.range.im.day,
          clk:
            vm.range.clk.isplus === true
              ? "+" + vm.range.clk.day
              : "-" + vm.range.clk.day,
          cv: vm.range.cv.isplus === true ? "+" + vm.range.cv.day : "-" + vm.range.cv.day,
          cr: vm.range.cr.isplus === true ? "+" + vm.range.cr.day : "-" + vm.range.cr.day,
          mode: "upsert",
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {
          vm.$refs.maskModal.showModal();
        },
        success: function (data) {
          if (data.result === "success") {
          } else if (data.status === "0001") {
            vm.handleExpireSession();
          }
        },
        error: function (a, b, c) {
          if (a.status === 403) {
            vm.$store.commit("logout");
            vm.$store.commit("logoutActivedMdias");
            vm.$store.commit("logoutKakaoSa");
            vm.$router.push("/");
          }
        },
        complete: function (a, b, c) {
          vm.$refs.maskModal.hideModal();
        },
      });
    },
    handleChangedDateRange(data) {
      this.$refs.dateRangePicker.setDate({
        start: data.start,
        end: data.end,
        compare: false,
      });
    },
    handleChangedBalance(data) {
      this.balance = [];
      this.balance = data.slice();
    },
  },
};
</script>

<style scoped></style>
