<template>
  <div class="d-flex m-h-100">
    <big-menu-2 :pMenu="'targetAnalysis'" @mountedMain="activeMain" class="pc"></big-menu-2>
    <div class="pc wrap">
      <balance @logOut="handleLogOut" @changeData="handleChangedBalance"></balance>
      <section>
        <message ref="message" class="mb-4">
          <span>
            <span>최근 집계 완료 시간(오늘) |
              <template v-for="(k,i) in accountlog" >
                <template v-if="media === k.media">
                  <span v-if="k.campaign !== undefined && k.campaign !== ''" class="ml-1" :key="k+i+getUuidv4()"><span>{{"캠페인: "}}</span> {{k.campaign.split(" ")[1]}}</span>
                  <span v-if="k.adgroup !== undefined && k.adgroup !== ''" class="ml-1" :key="k+i+getUuidv4()"><span>{{"그룹: "}}</span> {{k.adgroup.split(" ")[1]}}</span>
                  <span v-if="k.keyword !== undefined && k.keyword !== ''" class="ml-1" :key="k+i+getUuidv4()"><span>{{"키워드: "}}</span> {{k.keyword.split(" ")[1]}}</span>
                  <span v-if="k.ad !== undefined && k.ad !== ''" class="ml-1" :key="k+i+getUuidv4()"><span>{{"소재: "}}</span> {{k.ad.split(" ")[1]}}</span>
                  <span v-if="k.shopping !== undefined && k.shopping !== ''" class="ml-1" :key="k+i+getUuidv4()"><span>{{"쇼핑: "}}</span> {{k.shopping.split(" ")[1]}}</span>
                </template>
              </template>              
            </span>
          </span>
        </message>          
        <div class="title d-flex justify-content-between align-items-center">
          <h2>타겟팅 분석</h2>
          <div class="search d-flex">
            <!-- <select class="form-control" id="media" v-model="media" @change="changeMediaSelect">
              <option selected value="naver">{{getMediaNew("naver")}}</option>
              <option value="kakaosa">{{getMediaNew("kakaosa")}}</option>
              <option value="kakaomo">{{getMediaNew("kakaomo")}}</option>
            </select> -->
            <date-range-picker ref="dateRangePicker" class="form-control" :pStart="start" :pEnd="end" :pDisabled="false" @changedDate="handleChangedDateRange"></date-range-picker>
            <button type="submit" class="btn submit" @click.prevent="clickSearchBtn">조회하기</button>
          </div>
        </div>
        <div class="top10">
          <div class="col-4">
            <div class="top10-card">
              <v-jstree :data="structure.data" @item-click="activeVueJstree"></v-jstree>              
            </div>
          </div>
          <div class="col">
            <div class="top10-card">
              <div class="select-btn">
                <button type="button" class="btn select" :class="[level === k ? 'active' : '']" @click="clickTopBtn(k, i)" v-for="(k, i) in Object.keys(selectBtn)" :key="k + i + '-' + getUuidv4()">{{ getTarget(k) }}</button>
              </div>
              <div>
                <table>
                  <colgroup>
                      <col style="width:20%;">
                      <col style="width:16%;">
                      <col style="width:16%;">
                      <col style="width:16%;">
                      <col style="width:16%;">
                  </colgroup>
                  <thead>
                    <tr>
                      <template v-for="(k, i) in ['im','clk','cst','cv', 'cr']" :key="k+i+getUuidv4()">
                        <td class="text-center" >{{`총 ${getKpiName(k)}`}}</td>
                      </template>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <template v-for="(k, i) in ['im','clk','cst','cv', 'cr']">
                        <template v-if="main.top10 !== null">
                            <td :key="k+i+getUuidv4()">
                              <div class="p-2">
                                <p class="text-center">{{`${priceToString(main.top10[k].total+getUnit(k))}`}}</p>
                                <ul class="p-2" style="margin: 10px 0 5px; border-top: 1px dotted #A9A9A9;">
                                  <li>
                                    <div class="d-flex justify-content-between">
                                      <span>pc</span>
                                      <span>{{`${priceToString(main.top10[k].p+getUnit(k))}`}}</span>
                                    </div>
                                  </li>
                                  <li>
                                    <div class="d-flex justify-content-between">
                                      <span>mobile</span>
                                      <span>{{`${priceToString(main.top10[k].m+getUnit(k))}`}}</span>
                                    </div>
                                  </li>                                                                     
                                </ul>
                              </div>
                            </td>
                        </template>
                      </template>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <template v-if="level === 'hours'"><toastgrid-hours ref="toastgridHours"></toastgrid-hours></template>
        <template v-if="level === 'location'"><toastgrid-location ref="toastgridLocation"></toastgrid-location></template>        
      </section>
    </div>
    <div class="m m-wrap">
      <mheader ref="mHeader" :pMenu="'dashboard'"></mheader>
      <mfooter ref="mFooter" :pMenu="'dashboard'"></mfooter>
      <section>
      </section>
      <mbig-menu-2 ref="mBigMenu2" @closeBtn="$refs.mFooter.setFooter('home')"></mbig-menu-2>
      <mdate-range-picker ref="mDateRangePicker" :pStart="start" :pEnd="end" :pCstart="''" :pCend="''" @changedDate="handleChangedDateRange" @closeBtn="$refs.mFooter.setFooter('home')"></mdate-range-picker>
      <mbalance ref="mBalance" :pBalance="balance" @closeBtn="$refs.mFooter.setFooter('home')"></mbalance>
      <mbalance ref="mBalance" :pBalance="balance" @closeBtn="$refs.mFooter.setFooter('home')"></mbalance>
      <malarm ref="mFmenu" @closeBtn="$refs.mFooter.setFooter('home')"></malarm>
      <mfmenu ref="mFmenu" @logout="handleLogOut" @dbedit="$refs.mFooter.clickDbEdit('dashboard-edit')" @closeBtn="$refs.mFooter.setFooter('home')"></mfmenu>
      <mdashboard-edit ref="mDashboardEdit" @closeBtn="$refs.mFooter.setFooter('home')"></mdashboard-edit>
    </div>
    <log-out-modal ref="logOutModal" style="display: none"></log-out-modal>
    <expire-session-modal ref="expireSessionModal" style="display: none"></expire-session-modal>
    <mask-modal ref="maskModal" style="display: none"></mask-modal>
  </div>
</template>

<script>
import $ from "jquery";
import xlsx from "xlsx";
import moment from "moment";
import VJstree from 'vue-jstree';
import {  isMobile,  priceToString,  getMedia,  uuidv4,  getLevel,  getTarget, getKpiName, getUnit, getStructure} from "@/assets/js/common.js";
import expireSessionModal from "@/components/modal/expireSessionModal.vue";
import messageModal from "@/components/modal/messageModal.vue";
import maskModal from "@/components/modal/maskModal.vue";
import { store } from "@/store/store.js";
import { SHA256 } from "@/assets/js/sha256.js";
import { API_URL, TEMP_KEY } from "@/configs/config.js";
import message from "@/components/common/message.vue";
import balance from "@/components/dashboard2/balance.vue";
import bigMenu2 from "@/components/layout/bigMenu2.vue";
import logOutModal from "@/components/modal/logOutModal.vue";
import dateRangePicker from "@/components/common/dateRangePicker.vue";
import toastgridHours from "@/components/targetAnalysis/toastgridHours.vue";
import toastgridLocation from "@/components/targetAnalysis/toastgridLocation.vue";
import mheader from "@/components/layout/m/header.vue";
import mfooter from "@/components/layout/m/footer.vue";
import mbigMenu2 from "@/components/layout/m/bigMenu2.vue";
import mdateRangePicker from "@/components/common/m/dateRangePicker.vue";
import mbalance from "@/components/common/m/balance.vue";
import mfmenu from "@/components/common/m/fMenu.vue";
import malarm from "@/components/common/m/alarm.vue";
import mdashboardEdit from "@/components/common/m/dashboardEdit.vue";
import ToastgridLocation from '../../components/targetAnalysis/toastgridLocation.vue';
export default {
  data() {
    return {
      start: store.state.dateStore.start,
      end: store.state.dateStore.end,
      media: "naver",
      level: "hours",
      structure: { data: [], id: null },
      main: { data: [], top10: null },
      // selectBtn: { hours: { visible: false, check: true }, location: { visible: false, check: true }, age: { visible: false, check: true }, gender: { visible: false, check: true } },
      selectBtn: { hours: { visible: false, check: true }, location: { visible: false, check: true }},
      balance: [],
      accountlog: [],
      lastCheckedNodeId: null
    };
  },
  computed: {},
  watch: {},
  components: { bigMenu2, logOutModal, balance, expireSessionModal, messageModal, maskModal, dateRangePicker, mheader, mfooter, mbigMenu2, mdateRangePicker, mbalance, 
  mfmenu, malarm, mdashboardEdit, message, VJstree, toastgridHours, toastgridLocation },
  mounted() {
    $(".main").removeClass("m-h-100");
    this.getAccountLog();
    this.getStructure();
  },
  updated() {},
  methods: {
    activeMain(flag) {
      this.$emit("mountedMain", true);
      this.$emit("mountedDasyboad", true);
    },
    priceToString(salse) {
      if (salse === undefined) return "";
      return priceToString(salse);
    },    
    clickSearchBtn() {
      var date = this.$refs.dateRangePicker.getDate();
      this.start = date.start;
      this.end = date.end;
      this.searchNew();
    },    
    searchNew() {
      var vm = this;
      vm.handleShowMask();
      var targetreportForTop = $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/targetreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: { userid: store.state.userStore.userinfo.userid, fromdate: vm.start, todate: vm.end, id: vm.structure.id, md: {naver:"N", kakaosa: "D"}[vm.media], level: vm.level, kpi: "top",
          session: store.state.userStore.session },
        beforeSend: function (data) {},
        success: function (data) {},
        error: function (a, b, c) {},
        complete: function (a, b, c) {},
      });

      var targetreport = $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/targetreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: { userid: store.state.userStore.userinfo.userid, fromdate: vm.start, todate: vm.end, id: vm.structure.id, md: {naver:"N", kakaosa: "D"}[vm.media], level: vm.level,
          session: store.state.userStore.session },
        beforeSend: function (data) {},
        success: function (data) {},
        error: function (a, b, c) {},
        complete: function (a, b, c) {},
      });      

      $.when(targetreportForTop, targetreport).done(function(targetreportForTop, targetreport) {
        if(targetreportForTop && targetreportForTop[1] === "success") {
          var data = targetreportForTop[0];
          vm.main.top10 = null;
          vm.main.top10 = data.data.kpis;
          //Object.keys(data.data.kpis).forEach(function (key) { vm.main.top10.push({kpi: key, data: data.data.kpis[key]});})
        }

        if(targetreport && targetreport[1] === "success") {
          var data = targetreport[0];
          vm.main.data = [];
          Object.keys(data.data.targets).forEach(function (key) { vm.main.data.push({date: key, data: data.data.targets[key]}); });          
          vm.main.data.sort((a, b) => new Date(a.date) - new Date(b.date));

          if(vm.level === "hours") vm.$refs.toastgridHours.resetToastGrid(vm.main.data);
          if(vm.level === "location") vm.$refs.toastgridLocation.resetToastGrid(vm.main.data);
          
        }
      }).then(function(data) { vm.handleHideMask(); });
    },
    changeMediaSelect(event, ismobile, media) { this.clickSearchBtn(); },    
    clickTopBtn(level, i) {
      this.level = level;
      this.clickSearchBtn();
    },    
    handleLogOut() { this.$refs.logOutModal.showModal(); },
    handleExpireSession() { this.$refs.expireSessionModal.showModal(); },
    handleShowMask() { this.$refs.maskModal.showModal(); },
    handleHideMask() { this.$refs.maskModal.hideModal(); },
    handleChangedBalance(data) {
      this.balance = [];
      this.balance = data.slice();
    },
    handleChangedDateRange(data) {
      this.$refs.dateRangePicker.setDate({ start: data.start, end: data.end });
      this.clickSearchBtn();
    },
    getMediaNew(media) { return getMedia(media); },
    getKpiName(k) {return getKpiName(k);},
    getUnit(kpi) { return getUnit(kpi); },
    getTarget(t) { return getTarget(t); },
    getAccountLog() {
      var vm = this;
      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/dashboard/accountlog",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {},
        success: function (data) {
          vm.accountlog = data.data.slice();
        },
        error: function (a, b, c) { vm.handleExpireSession();},
        complete: function (a, b, c) {},
      });      
    },   
    async getStructure() {
      var vm = this;
      var data = await getStructure(API_URL, TEMP_KEY, store.state.userStore.userinfo.userid, store.state.userStore.session, {"naver":"N"}[vm.media]);
      if(data === undefined) return false;
      
      var mapped = data.data.adstructure.c.map(campaign => {
        var adgroups = data.data.adstructure.g.filter(group => group.campaign_id === campaign.campaign_id).map(group => ({
            id: group.adgroup_id, text: group.adgroup_name, icon: "", opened: false, selected: false, disabled: false, loading: false,  
          }));

        return {
          id: campaign.campaign_id, text: campaign.campaign_name, children: [], icon: "", opened: false, selected: false, disabled: false, loading: false
        };
      }); 

      vm.structure.data = [];
      vm.structure.data = mapped.slice();
    },  
    activeVueJstree(node) { 
      var vm = this;
      document.querySelectorAll(".tree-node, .tree-anchor").forEach(function(node) { node.style.background = "#fff"; }) //초기화

      node.$el.style.background = "#14aee0"; //li
      node.$el.lastElementChild.style.background = "#14aee0";
      vm.structure.id = node.model.id;
      vm.clickSearchBtn();
    },    
    getUuidv4() { return uuidv4(); },   
  },
};
</script>

<style scoped>
</style>
