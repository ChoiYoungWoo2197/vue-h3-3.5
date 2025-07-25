<template>
  <section class="row d-flex">
    <big-menu :pMenu="'agency'" @mountedMain="activeMain"></big-menu>
    <div class="full-wrap d-flex flex-column">
      <div class="half-wrap d-flex">
        <!-- <article class="admin-half m-none">
					<div class="admin-title d-flex justify-content-between align-items-center row">
						<h3>최근 발송 리스트</h3>
					</div>
					<div>
						<table>
							<thead>
								<tr>
									<th width="100">업체명</th>
									<th width="100">발송시각</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>스마트성형외과</td>
									<td>2022-03-05 AM 06:00</td>
								</tr>
								<tr>
									<td>스마트성형외과</td>
									<td>2022-03-05 AM 06:00</td>
								</tr>
								<tr>
									<td>스마트성형외과</td>
									<td>2022-03-05 AM 06:00</td>
								</tr>
								<tr>
									<td>스마트성형외과</td>
									<td>2022-03-05 AM 06:00</td>
								</tr>
								<tr>
									<td>스마트성형외과</td>
									<td>2022-03-05 AM 06:00</td>
								</tr>
							</tbody>
						</table>
						<ul class="pagination d-flex justify-content-center align-items-center">
							<li class="page-item">
								<a class="page-link shadow-none" href="#" aria-label="Previous">
									<span aria-hidden="true"><i class="bi bi-chevron-left"></i></span>
								</a>
							</li>
							<li class="page-item"><a class="page-link shadow-none active" href="#">1</a></li>
							<li class="page-item"><a class="page-link shadow-none" href="#">2</a></li>
							<li class="page-item"><a class="page-link shadow-none" href="#">3</a></li>
							<li class="page-item"><a class="page-link shadow-none" href="#">4</a></li>
							<li class="page-item"><a class="page-link shadow-none" href="#">5</a></li>
							<li class="page-item">
								<a class="page-link shadow-none" href="#" aria-label="Next">
									<span aria-hidden="true"><i class="bi bi-chevron-right"></i></span>
								</a>
							</li>
						</ul>
					</div>
				</article> -->
        <article class="admin-list flex-none m-none">
          <div class="admin-title d-flex justify-content-between align-items-center row">
            <h3>통합 알림</h3>
          </div>
          <div class="w991u">
            <table>
              <thead>
                <tr>
                  <td class="text-left" width="15%">알림일시</td>
                  <template v-if="userlevel !== null">
                    <td v-if="userlevel === 99" class="text-left" width="15%"> 마케터 - 광고주ID </td>
                    <td v-else class="text-left" width="15%">광고주ID</td>
                  </template>
                  <td class="text-left" width="20%">유형</td>
                  <td class="text-left" width="*">변경 내용</td>
                </tr>
              </thead>
              <tbody>
                <template v-if=" getDatasForAlarmMain === null || getDatasForAlarmMain.length === 0 " >
                  <tr> <td colspan="5" class="text-center">데이터가 존재하지 않습니다.</td> </tr>
                </template>
                <template v-else>
                  <tr v-for="(data, i) in getDatasForAlarmMain" :key="i + getUuidv4">
                    <td class="text-left">{{ data.daily_dt }}</td>
                    <template v-if="userlevel !== null">
                      <td v-if="userlevel === 99" class="text-left"> {{ data.manager_name + " - " + data.user_id }} </td>
                      <td v-else>{{ data.user_id }}</td>
                    </template>
                    <td class="text-left">{{ data.media + " - " + data.type }}</td>
                    <td class="text-left">{{ data.content }}</td>
                  </tr>
                </template>
              </tbody>
            </table>
            <ul class="pagination d-flex justify-content-center align-items-center mb-30">
              <li class="page-item">
                <a class="page-link shadow-none" href="javascript:;" aria-label="Previous" @click="clickPreviousFirstPageBtnForAlarmMain" >
                  <span aria-hidden="true" ><i class="bi bi-chevron-double-left m-0"></i></span>
                </a>
              </li>
              <li class="page-item" :class="{ disabled: isFirstPageGroupForAlarmMain }">
                <a class="page-link shadow-none" href="javascript:;" aria-label="Previous" @click="clickPreviousPageBtnForAlarmMain" >
                  <span aria-hidden="true"><i class="bi bi-chevron-left"></i></span>
                </a>
              </li>
              <li class="page-item" :class="{ active: page - 1 === alarm.main.start }" v-for="page in alarm.main.pages" :key="page" >
                <a class="page-link shadow-none" href="javascript:;" v-text="page" @click="clickPageBtnForAlarmMain(page - 1)" ></a>
              </li>
              <li class="page-item" :class="{ disabled: isLastPageGroupForAlarmMain }">
                <a class="page-link shadow-none" href="javascript:;" aria-label="Next" @click="clickNextPageBtnForAlarmMain" >
                  <span aria-hidden="true"><i class="bi bi-chevron-right"></i></span>
                </a>
              </li>
              <li class="page-item">
                <a class="page-link shadow-none" href="javascript:;" aria-label="Next" @click="clickNextEndPageBtnForAlarmMain" >
                  <span><i class="bi bi-chevron-double-right m-0"></i></span>
                </a>
              </li>
            </ul>
          </div>
          <div class="w991d">
            <table>
              <thead>
                <tr>
                  <th width="100">업체명</th>
                  <th width="100">알림</th>
                </tr>
              </thead>
              <tbody>
                <tr class="active">
                  <td>스마트성형외과</td>
                  <td>잔액부족</td>
                </tr>
                <tr>
                  <td>스마트성형외과</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>스마트성형외과</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>스마트성형외과</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>스마트성형외과</td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
            <ul class="pagination d-flex justify-content-center align-items-center">
              <li class="page-item">
                <a class="page-link shadow-none" href="#" aria-label="Previous">
                  <span aria-hidden="true"><i class="bi bi-chevron-left"></i></span>
                </a>
              </li>
              <li class="page-item">
                <a class="page-link shadow-none active" href="#">1</a>
              </li>
              <li class="page-item"><a class="page-link shadow-none" href="#">2</a></li>
              <li class="page-item"><a class="page-link shadow-none" href="#">3</a></li>
              <li class="page-item"><a class="page-link shadow-none" href="#">4</a></li>
              <li class="page-item"><a class="page-link shadow-none" href="#">5</a></li>
              <li class="page-item">
                <a class="page-link shadow-none" href="#" aria-label="Next">
                  <span aria-hidden="true"><i class="bi bi-chevron-right"></i></span>
                </a>
              </li>
            </ul>
          </div>
        </article>
      </div>
      <article class="admin-list">
        <div class="admin-title">
          <form class="form-inline multi-search">
            <div class="row">
              <date-range-picker ref="dateRangePicker" class="form-control" :pStart="start" :pEnd="end" :pDisabled="false" @changedDate="clickSearchBtnForMain" > </date-range-picker>
            </div>
            <div class="row">
              <select class="form-control shadow-none rounded-0 mr-2 font-14" v-model="main.field" @change="changeField($event)" >
                <option value="usercompany">업체명</option>
                <option value="userid">광고주ID</option>
                <option value="nd" @click="clickSort('nd')">네이버</option>
                <option value="ksd" @click="clickSort('ksd')">카카오</option>
                <option value="ndad" @click="clickSort('ndad')">네이버 디스플레이</option>
                <option value="kmd" @click="clickSort('kmd')">모먼트</option>
                <option value="googled" @click="clickSort('googled')">구글</option>
              </select>
              <div class="input-group">
                <input class="form-control shadow-none rounded-0 font-14" type="search" placeholder="검색" aria-label="Search" v-model="main.query" />
                <div class="input-group-append">
                  <button class="input-group-text btn shadow-none rounded-0 search" type="submit" @click.prevent="clickSearchBtnForMain" > <i class="bi bi-search"></i> </button>
                </div>
              </div>
            </div>
          </form>
          <div class="admin-title-bottom d-flex justify-content-between align-items-center" >
            <ul class="tabmenu row">
              <li :class="[beShared === false ? 'active' : '']" class="btn d-flex justify-content-center align-items-center font-14" @click="clickNotShared" > 내 광고주 </li>
              <li :class="[beShared === true ? 'active' : '']" class="btn d-flex justify-content-center align-items-center font-14" @click="clickShared" > 공유받은 광고주 </li>
            </ul>
          </div>
        </div>
        <div class="w991u">
          <table>
            <thead>
              <tr>
                <th class="text-left" width="200">업체명</th>
                <th class="text-left" width="200">광고주ID</th>
                <template v-for="(k,i) in [{m:'naver', s:'n'}, {m:'kakaosa', s:'ks'}, {m:'kakaomo', s:'km'}, {m:'naverda', s:'nda'} , {m:'google', s:'google'}]" :key="i+getUuidv4()">
                  <th  class="text-right" width="200">
                    {{getMedia(k.m)}}
                    <template v-if="main.sort === k.s+'a' || main.sort ===  k.s+'d'">
                      <button v-if="main.sort === k.s+'a'" class="active" @click="clickSort(k.s+'d')" > <i class="bi bi-caret-up-fill activeArrow"></i> </button>
                      <button v-if="main.sort === k.s+'d'" class="active" @click="clickSort(k.s+'a')" > <i class="bi bi-caret-down-fill activeArrow"></i> </button>
                    </template>
                    <template v-else>
                      <button class="active" @click="clickSort(k.s+'d')"> <i class="bi bi-caret-down-fill"></i> </button>
                    </template>                    
                  </th>
                </template>
                <th width="200">이동</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="data in getDatasForMain" :key="data.userid + '-' + getUuidv4()">
                <td class="text-left" v-text="data.usercompany"></td>
                <td class="text-left" v-text="data.userid"></td>
                <template v-for="(k,i) in [{m:'naver', s:'n'}, {m:'kakaosa', s:'ks'}, {m:'kakaomo', s:'km'}, {m:'naverda', s:'nda'} , {m:'google', s:'google'}]" :key="i+getUuidv4()">
                  <td  class="text-right">{{data[k.m]}}</td>
                </template>
                <td>
                  <div class="btn-group">
                    <button class="btn shadow-none" @click="clickUserLink(data.userid)"> 바로가기 </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <ul class="pagination d-flex justify-content-center align-items-center">
            <li class="page-item">
              <a class="page-link shadow-none" href="javascript:;" aria-label="Previous" @click="clickPreviousFirstPageBtnForMain" >
                <span aria-hidden="true" ><i class="bi bi-chevron-double-left m-0"></i></span >
              </a>
            </li>
            <li class="page-item" :class="{ disabled: isFirstPageGroupForMain }">
              <a class="page-link shadow-none" href="javascript:;" aria-label="Previous" @click="clickPreviousPageBtnForMain" >
                <span aria-hidden="true"><i class="bi bi-chevron-left"></i></span>
              </a>
            </li>
            <li class="page-item" :class="{ active: page - 1 === main.start }" v-for="page in main.pages" :key="page" >
              <a class="page-link shadow-none" href="javascript:;" v-text="page" @click="clickPageBtnForMain(page - 1)" ></a>
            </li>
            <li class="page-item" :class="{ disabled: isLastPageGroupForMain }">
              <a class="page-link shadow-none" href="javascript:;" aria-label="Next" @click="clickNextPageBtnForMain" >
                <span aria-hidden="true"><i class="bi bi-chevron-right"></i></span>
              </a>
            </li>
            <li class="page-item">
              <a class="page-link shadow-none" href="javascript:;" aria-label="Next" @click="clickNextEndPageBtnForMain" >
                <span><i class="bi bi-chevron-double-right m-0"></i></span>
              </a>
            </li>
          </ul>
        </div>
        <div class="w991d">
          <div class="m-table">
            <ul v-for="data in getDatasForMain" :key="data.userid + '-' + getUuidv4()">
              <div> <li class="p-0"> {{ data.usercompany }}<span>{{ data.userid }}</span> </li> </div>
              <template v-for="(k,i) in [{m:'naver', s:'n'}, {m:'kakaosa', s:'ks'}, {m:'kakaomo', s:'km'}, {m:'naverda', s:'nda'} , {m:'google', s:'google'}]" :key="i+getUuidv4()">
                <div >
                  <li class="p-0 flex-grow-1">
                    <div class="d-flex justify-content-between align-items-center mt-0 pt-0">
                      <div class="mt-0 pt-0"> <img :src="(require(`@/assets/image/icon_${k.m}.png`))" alt="아이콘" class="icon"> </div>
                      <p>{{ priceToString(data[k.m]) }}</p>                      
                    </div>
                  </li>
                </div>
              </template>
              <div class="btn-group" role="group">
                <button type="button" class="btn shadow-none" data-toggle="modal" data-target="#joinApprove" @click="clickUserLink(data.userid)" > 이동 </button>
              </div>
            </ul>
          </div>
          <ul class="pagination d-flex justify-content-center align-items-center">
            <li class="page-item">
              <a class="page-link shadow-none" href="javascript:;" aria-label="Previous" @click="clickPreviousFirstPageBtnForMain" >
                <span aria-hidden="true" ><i class="bi bi-chevron-double-left m-0"></i></span >
              </a>
            </li>
            <li class="page-item" :class="{ disabled: isFirstPageGroupForMain }">
              <a class="page-link shadow-none" href="javascript:;" aria-label="Previous" @click="clickPreviousPageBtnForMain" >
                <span aria-hidden="true"><i class="bi bi-chevron-left"></i></span>
              </a>
            </li>
            <li class="page-item" :class="{ active: page - 1 === main.start }" v-for="page in main.pages" :key="page" >
              <a class="page-link shadow-none" href="javascript:;" v-text="page" @click="clickPageBtnForMain(page - 1)" ></a>
            </li>
            <li class="page-item" :class="{ disabled: isLastPageGroupForMain }">
              <a class="page-link shadow-none" href="javascript:;" aria-label="Next" @click="clickNextPageBtnForMain" >
                <span aria-hidden="true"><i class="bi bi-chevron-right"></i></span>
              </a>
            </li>
            <li class="page-item">
              <a class="page-link shadow-none" href="javascript:;" aria-label="Next" @click="clickNextEndPageBtnForMain" >
                <span><i class="bi bi-chevron-double-right m-0"></i></span>
              </a>
            </li>
          </ul>
        </div>
      </article>
    </div>
    <expire-session-modal ref="expireSessionModal" style="display: none" ></expire-session-modal>
    <mask-modal ref="maskModal" style="display: none"></mask-modal>
  </section>
</template>

<script>
import $ from "jquery";
import { isMobile, priceToString, uuidv4, getMedia } from "@/assets/js/common.js";
import { API_URL, TEMP_KEY } from "@/configs/config.js";
import { store } from "@/store/store.js";
import { SHA256 } from "@/assets/js/sha256.js";
import datePicker from "@/components/common/datePicker.vue";
import dateRangePicker from "@/components/common/dateRangePicker.vue";
import bigMenu from "@/components/layout/bigMenu.vue";
import expireSessionModal from "@/components/modal/expireSessionModal.vue";
import maskModal from "@/components/modal/maskModal.vue";
import moment from "moment";
export default {
  data() {
    return {
      start: moment().subtract(30, "days").format("YYYY-MM-DD"),
      end: moment().subtract(1, "days").format("YYYY-MM-DD"),
      beShared: false,
      main: {
        field: "userid",
        query: null,
        responseData: null,
        data: null,
        start: 0, //현재 페이지
        display: 10, //게시글의 수
        displayPageNum: isMobile() === true ? 5 : 10, // 페이지 번호의 수
        sort: "nd",
        pages: [],
        isFirst: false,
        isEnd: false,
      },
      alarm: {
        main: {
          field: "",
          query: null,
          topads: null,
          responseData: null,
          data: null,
          start: 0, //현재 페이지
          display: 5, //게시글의 수
          displayPageNum: 5, // 페이지 번호의 수
          isTotalCount: "-1",
          sort: "imd",
          pages: [],
          isFirst: false,
          isEnd: false,
        },
      },
      userlevel: store.state.userStore.userinfo === null ? null : store.state.userStore.userinfo.userlevel,
    };
  },
  components: { bigMenu, datePicker, expireSessionModal, maskModal, dateRangePicker},
  computed: {
    getDatasForMain() { return this.main.data; },
    isFirstPageGroupForMain() { return this.main.isFirst; },
    isLastPageGroupForMain() { return this.main.isEnd; },
    getDatasForAlarmMain() { return this.alarm.main.data; },
    isFirstPageGroupForAlarmMain() { return this.alarm.main.isFirst; },
    isLastPageGroupForAlarmMain() { return this.alarm.main.isEnd; },
  },
  watch: {  },
  mounted() {
    this.beShared = false;
    this.getAlarms();
    if (this.beShared === true) { this.searchDataBeShared(); } 
    else { this.searchDataNotShare(); }
  },
  methods: {
    getUuidv4() { return uuidv4(); },
    activeMain(flag) {
      this.$emit("mountedMain", true);
      this.$emit("mountedDasyboad", false);
    },
    clickNotShared() {
      this.beShared = false;
      this.main.start = 0;
      this.alarm.main.start = 0;
      this.alarm.main.isTotalCount = "-1";
      this.getAlarms();
      if (this.beShared === true) { this.searchDataBeShared(); } 
      else { this.searchDataNotShare(); }
    },
    getAlarms() {
      var vm = this;
      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/alarm/alarm",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: "",
          todate: "",
          start: vm.alarm.main.start,
          sort: "",
          display: vm.alarm.main.display,
          totalcount: vm.alarm.main.isTotalCount,
          mode: store.state.userStore.userinfo.userlevel === 99 ? "admin" : "marketer",
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {},
        success: function (data) {
          if (data.result === "success") {
            vm.alarm.main.data = [];
            vm.alarm.main.responseData = null;
            vm.alarm.main.responseData = data;
            vm.alarm.main.data = data.data.alarms.slice();
            vm.getStartAndEndPageForAlarmMain();
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
        complete: function (a, b, c) {},
      });
    },
    clickShared() {
      this.beShared = true;
      this.main.start = 0;
      this.alarm.main.start = 0;
      this.alarm.main.isTotalCount = "-1";
      this.getAlarms();
      if (this.beShared === true) { this.searchDataBeShared(); } 
      else { this.searchDataNotShare(); }
    },
    searchDataBeShared() {
      var vm = this;
      var date = vm.$refs.dateRangePicker.getDate();
      if (this.main.query !== null && this.main.query.length === 1) {
        alert("최소 2글자 이상 입력해주세요.");
        return false;
      }

      $.ajax({
        type: "post", //요청 메소드 방식
        url: API_URL + "/admin/beadv",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          query: vm.main.query,
          field: vm.main.field,
          fromdate: date.start,
          todate: date.end,
          start: vm.main.start,
          sort: vm.main.sort,
          display: vm.main.display,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) { vm.$refs.maskModal.showModal(); },
        success: function (data) {
          if (data.result === "success") {
            vm.main.data = [];
            vm.main.responseData = null;
            vm.main.responseData = data;
            vm.main.data = data.data.users;
            vm.getStartAndEndPageForMain();
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
          vm.$refs.maskModal.hideModal();
        },
      });
    },
    searchDataNotShare() {
      var vm = this;
      var date = vm.$refs.dateRangePicker.getDate();
      if (this.main.query !== null && this.main.query.length === 1) {
        alert("최소 2글자 이상 입력해주세요.");
        return false;
      }

      $.ajax({
        type: "post", //요청 메소드 방식
        url: API_URL + "/admin/adv",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          query: vm.main.query,
          field: vm.main.field,
          fromdate: date.start,
          todate: date.end,
          start: vm.main.start,
          sort: vm.main.sort,
          display: vm.main.display,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) { vm.$refs.maskModal.showModal(); },
        success: function (data) {
          if (data.result === "success") {
            vm.main.data = [];
            vm.main.responseData = null;
            vm.main.responseData = data;
            vm.main.data = data.data.users;
            vm.getStartAndEndPageForMain();
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
        complete: function (a, b, c) { vm.$refs.maskModal.hideModal(); },
      });
    },
    getStartAndEndPageForMain() {
      this.main.pages = [];
      var endPage = Math.ceil((this.main.start + 1) / this.main.displayPageNum) * this.main.displayPageNum;
      var startPage = endPage - this.main.displayPageNum + 1;
      var tempEndPage = Math.ceil(this.main.responseData.totalcount / this.main.display);
      if (endPage > tempEndPage) { endPage = tempEndPage; }

      this.main.isFirst = this.main.start + 1 === 1 ? true : false;
      this.main.isEnd = Math.ceil(this.main.responseData.totalcount / this.main.display) === this.main.start + 1 ? true : false;
      for (var i = startPage; i <= endPage; i++) { this.main.pages.push(i); }
    },
    clickPreviousFirstPageBtnForMain() {
      this.main.start = 0;
      if (this.beShared === true) { this.searchDataBeShared(); } 
      else { this.searchDataNotShare(); }
    },
    clickPreviousPageBtnForMain() {
      this.main.start = this.main.start === 0 ? 0 : this.main.start - 1;
      if (this.beShared === true) { this.searchDataBeShared(); } 
      else { this.searchDataNotShare(); }
    },
    clickNextEndPageBtnForMain() {
      let tempEndPage = Math.ceil(this.main.responseData.totalcount / this.main.display);
      this.main.start = tempEndPage - 1;
      if (this.beShared === true) { this.searchDataBeShared(); } 
      else { this.searchDataNotShare(); }
    },
    clickNextPageBtnForMain() {
      let tempEndPage = Math.ceil(this.main.responseData.totalcount / this.main.display);
      this.main.start = this.main.start > tempEndPage ? tempEndPage : this.main.start + 1;
      if (this.beShared === true) { this.searchDataBeShared(); } 
      else { this.searchDataNotShare(); }
    },
    clickPageBtnForMain(page) {
      this.main.start = page;
      if (this.beShared === true) { this.searchDataBeShared(); } 
      else { this.searchDataNotShare(); }
    },
    clickSearchBtnForMain() {
      this.main.start = 0;
      if (this.beShared === true) { this.searchDataBeShared(); } 
      else { this.searchDataNotShare(); }
    },
    handleExpireSession() { this.$refs.expireSessionModal.showModal(); },
    priceToString(salse) {
      if (salse === undefined || salse === null) return "0" + "원";
      return priceToString(salse) + "원";
    },
    clickYesterDay() {
      this.$refs.fromdate.setDate(moment().subtract(1, "d").format("YYYY-MM-DD"));
      this.$refs.todate.setDate(moment().format("YYYY-MM-DD"));
    },
    clickSevenDay() {
      this.$refs.fromdate.setDate(moment().subtract(7, "d").format("YYYY-MM-DD"));
      this.$refs.todate.setDate(moment().format("YYYY-MM-DD"));
    },
    clickMonth() {
      this.$refs.fromdate.setDate(moment().startOf("month").format("YYYY-MM-DD"));
      this.$refs.todate.setDate(moment().format("YYYY-MM-DD"));
    },
    clickPrevMonth() {
      var prevMonth = moment().subtract(1, "M").format("YYYY-MM-DD");
      this.$refs.fromdate.setDate( moment(prevMonth).startOf("month").format("YYYY-MM-DD") );
      this.$refs.todate.setDate(moment(prevMonth).endOf("month").format("YYYY-MM-DD"));
    },
    changeField(event) {
      let v = event.target.value;
      if (v === "userid" || v === "usercompany") return;
      this.clickSort(v);
    },
    clickSort(sort) {
      this.main.sort = sort;
      this.main.start = 0;
      if (this.beShared === true) { this.searchDataBeShared(); } 
      else { this.searchDataNotShare(); }
    },
    clickUserLink(userId) {
      var vm = this;
      var managerinfo = { userid: store.state.userStore.userinfo.userid, username: store.state.userStore.userinfo.username, userphone: store.state.userStore.userinfo.userphone, useremail: store.state.userStore.userinfo.useremail, };
      $.ajax({
        type: "post", //요청 메소드 방식
        url: API_URL + "/admin/userlink",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: { userid: userId, session: store.state.userStore.session, },
        beforeSend: function (data) {},
        success: function (data) {
          if (data.result === "success") {
            var userinfo = data.data.userinfo;
            var routeUrl = vm.$router.resolve({
              path: "/bdashboard",
              query: {
                session: userinfo.session,
                token: userinfo.token,
                usercompany: userinfo.usercompany,
                useremail: userinfo.useremail,
                userid: userinfo.userid,
                userlevel: userinfo.userlevel,
                username: userinfo.username,
                userpassupdate: userinfo.userpassupdate,
                userphone: userinfo.userphone,
                userregdate: userinfo.userregdate,
                userseq: userinfo.userseq,
                userstatus: userinfo.userstatus,
                managername: managerinfo.username,
                manageruserid: managerinfo.userid,
                manageruserphone: managerinfo.userphone,
                manageruseremail: managerinfo.useremail,
              },
            });
            window.open(routeUrl.href, "_blank");
          } else {
            if (data.status === "0001") {
              vm.handleExpireSession();
            } else if (data.status === "1004") {
              vm.message.title = userId;
              vm.message.content = "광고주에게 접근할 수 없습니다.";
              vm.$refs.messageModal.showModal();
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
        complete: function (a, b, c) {},
      });
    },
    getStartAndEndPageForAlarmMain() {
      this.alarm.main.isTotalCount = this.alarm.main.responseData.totalcount;
      this.alarm.main.pages = [];
      var endPage = Math.ceil((this.alarm.main.start + 1) / this.alarm.main.displayPageNum) * this.alarm.main.displayPageNum;
      var startPage = endPage - this.alarm.main.displayPageNum + 1;
      var tempEndPage = Math.ceil( this.alarm.main.responseData.totalcount / this.alarm.main.display );
      if (endPage > tempEndPage) { endPage = tempEndPage; }

      this.alarm.main.isFirst = this.alarm.main.start + 1 === 1 ? true : false;
      this.alarm.main.isEnd = Math.ceil(this.alarm.main.responseData.totalcount / this.alarm.main.display) === this.alarm.main.start + 1 ? true : false;
      for (var i = startPage; i <= endPage; i++) { this.alarm.main.pages.push(i); }
    },
    clickPreviousFirstPageBtnForAlarmMain() {
      this.alarm.main.start = 0;
      this.getAlarms();
    },
    clickPreviousPageBtnForAlarmMain() {
      this.alarm.main.start = this.alarm.main.start === 0 ? 0 : this.alarm.main.start - 1;
      this.getAlarms();
    },
    clickNextEndPageBtnForAlarmMain() {
      let tempEndPage = Math.ceil( this.alarm.main.responseData.totalcount / this.alarm.main.display );
      this.alarm.main.start = tempEndPage - 1;
      this.getAlarms();
    },
    clickNextPageBtnForAlarmMain() {
      let tempEndPage = Math.ceil( this.alarm.main.responseData.totalcount / this.alarm.main.display );
      this.alarm.main.start = this.alarm.main.start > tempEndPage ? tempEndPage : this.alarm.main.start + 1;      
      this.getAlarms();
    },
    clickPageBtnForAlarmMain(page) {
      this.alarm.main.start = page;
      this.getAlarms();
    },
    getMedia(media) { return getMedia(media); },
  },
};
</script>

<style scoped>
.activeArrow {
  color: #7186d3;
}
</style>
