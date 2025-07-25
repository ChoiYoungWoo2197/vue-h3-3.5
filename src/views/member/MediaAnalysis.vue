<template>
  <div class="d-flex m-h-100 dashboard">
    <big-menu-2 :pMenu="'mediaAnalysis'" @mountedMain="activeMain" class="pc" ></big-menu-2>
    <div class="pc wrap">
      <balance @logOut="handleLogOut" @changeData="handleChangedBalance"></balance>
      <section>
        <message ref="message" class="mb-4">
          <span>
            <span>최근 집계 완료 시간(오늘) |
              <template v-for="(k,i) in accountlog" >
                <span v-if="k.campaign !== undefined && k.campaign !== ''" class="ml-1" :key="k+i+getUuidv4()"><span>{{getMedia(k.media)+": "}}</span> {{k.campaign.split(" ")[1]}}</span>
              </template>              
            </span>
          </span>
        </message>        
        <div class="title d-flex justify-content-between align-items-center">
          <h2>광고매체 분석</h2>
          <div class="search d-flex">
            <date-range-picker ref="dateRangePicker" class="form-control" :pStart="start" :pEnd="end" :pDisabled="false" @changedDate="handleChangedDateRange" > </date-range-picker>
            <button type="submit" class="btn submit" @click.prevent="clickSearchBtn"> 조회하기 </button>
          </div>
        </div>
        <div class="select-btn">
          <button type="button" class="btn select" :class="[activeKpi.cst === true ? 'active' : '']" @click="clickBtn($event, 'cst')" > 광고비 </button>
          <button type="button" class="btn select" :class="[activeKpi.im === true ? 'active' : '']" @click="clickBtn($event, 'im')" > 노출수 </button>
          <button type="button" class="btn select" :class="[activeKpi.clk === true ? 'active' : '']" @click="clickBtn($event, 'clk')" > 클릭수 </button>
          <button type="button" class="btn select" :class="[activeKpi.cv === true ? 'active' : '']" @click="clickBtn($event, 'cv')" > 전환수 </button>
        </div>
        <article>
          <div class="title"><h3>매체통합 광고요약</h3></div>
          <line-graph
            ref="lineGraph"
            :pHeight="'300px'"
            :pLegend="activeMedia"
            :pKpi="activeKpi.kpi"
            :pCustom="{
              series: { textStyle: { fontSize: '15', fontWeight: 'bold' } },
              xAxis: { name: '', axisLabel: { fontSize: '15' } },
              yAxis: { name: '', axisLabel: { fontSize: '15' } },
              grid: { left: 'center', bottom: '17%', width: '90%', containLabel: true, },
              legend: { show: false, left: 'right', top: 'middle', orient: 'vertical', },
            }"
            @expireSession="handleExpireSession"
            @showMask="handleShowMask"
            @hideMask="handleHideMask"
          >
          </line-graph>
        </article>
        <article>
          <div class="title d-flex justify-content-between align-items-center">
            <h3>매체별 리포트</h3>
            <div class="indicator d-flex align-items-center dropdown">
              <button type="button" class="btn shadow-none p-0" data-toggle="dropdown" aria-expanded="false" > <i class="bi bi-gear m-0"></i> </button>
              <div class="dropdown-menu dropdown-menu-right">
                <form>
                  <template v-for="(k,i) in ['cst','im','clk','cv','cr','ctr','cpa','cpc','cvr','roas']" :key="i+getUuidv4()">
                    <div class="form-check" >
                      <input class="form-check-input" type="checkbox" :id="'indicator'+i" :value=k :checked="kpi[k].check" :disabled="kpi[k].visible === false" @change="clickCheckpi($event, k)" />
                      <label class="form-check-label" :for="'indicator'+i" ><p class="d-flex align-items-center">{{getKpiName(k)}}</p></label >
                    </div>
                  </template>
                  <button type="button" class="btn indicator-close" data-toggle="dropdown" aria-expanded="false" > 닫기 </button>
                </form>
              </div>
            </div>
          </div>
          <table class="report">
            <thead>
              <tr>
                <td width="20px" class="text-left"></td>
                <td width="20%" lass="text-left" style="min-width: 140px">매체별</td>
                <template v-for="(k,i) in ['im','clk','ctr','cpc','cst','cv','cr','cpa','cvr','roas']">
                  <td :key="i+getUuidv4()" v-if="kpi[k].check">{{getKpiName(k)}}</td>
                </template>
              </tr>
            </thead>
            <tbody>
              <tr class="maindata" data-toggle="collapse" data-target=".data1">
                <td class="text-left fold-icon"></td>
                <td class="text-left fold-btn">검색광고</td>
                <template v-for="(data, i) in getObject('total', datas['sa'])">
                  <td :key="i + getUuidv4" v-if="kpi[data.k].check"> {{ priceToString(data.v) + getUnit(data.k) }} </td>
                </template>
              </tr>
              <tr class="subdata collapse data1">
                <td></td>
                <td class="text-left">{{getMedia("naver")}}</td>
                <td v-for="(data, i) in getObject('naver', datas['sa'])" :key="i + getUuidv4" v-show="kpi[data.k].check" > {{ priceToString(data.v) + getUnit(data.k) }} </td>
              </tr>
              <tr class="subdata collapse data1">
                <td></td>
                <td class="text-left">{{getMedia("kakaosa")}}</td>
                <td v-for="(data, i) in getObject('kakaosa', datas['sa'])" :key="i + getUuidv4" v-show="kpi[data.k].check" > {{ priceToString(data.v) + getUnit(data.k) }} </td>
              </tr>
              <tr class="subdata collapse data1">
                <td></td>
                <td class="text-left">{{getMedia("google")}}</td>
                <td v-for="(data, i) in getObject('google', datas['sa'])" :key="i + getUuidv4" v-show="kpi[data.k].check" > {{ priceToString(data.v) + getUnit(data.k) }} </td>
              </tr>              
              <tr class="maindata" data-toggle="collapse" data-target=".data2">
                <td class="text-left fold-icon"></td>
                <td class="text-left fold-btn">배너광고</td>
                <template v-for="(data, i) in getObject('total', datas['dsp'])">
                  <td :key="i + getUuidv4" v-if="kpi[data.k].check"> {{ priceToString(data.v) + getUnit(data.k) }} </td>
                </template>
              </tr>
              <tr class="subdata collapse data2">
                <td></td>
                <td class="text-left">{{getMedia("naverda")}}</td>
                <td v-for="(data, i) in getObject('naverda', datas['dsp'])" :key="i + getUuidv4" v-show="kpi[data.k].check" > {{ priceToString(data.v) + getUnit(data.k) }} </td>
              </tr>
              <tr class="subdata collapse data2">
                <td></td>
                <td class="text-left">{{getMedia("kakaomo")}}</td>
                <td v-for="(data, i) in getObject('kakaomo', datas['dsp'])" :key="i + getUuidv4" v-show="kpi[data.k].check" > {{ priceToString(data.v) + getUnit(data.k) }} </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="total bg-white">
                <td class=""></td>
                <td class="text-left">총 합계</td>
                <template v-for="(data, i) in getObject('total', datas)">
                  <td :key="i + getUuidv4" v-if="kpi[data.k].check">
                    <a href="#" class="d-flex align-items-center justify-content-end">
                      <template v-if="datas.total[data.k] === null">{{'-'}}</template>
                      <template v-else>
                        <span>{{ priceToString(data.v) + getUnit(data.k) }}</span>
                        <small class="ml-1" :class="[(''+datas.total2[0].per[data.k]).indexOf('-') > -1 ? 'down' : 'up']">
                          {{datas.total2[0].per[data.k] +'%'}}
                          <i :class="[(''+datas.total2[0].per[data.k]).indexOf('-') > -1 ? 'bi bi-graph-down-arrow ' : 'bi bi-graph-up-arrow ']" class="ml-1 mr-0"></i>
                        </small>
                      </template>
                    </a>                         
                  </td>
                </template>
              </tr>
            </tfoot>
          </table>
        </article>
        <div class="d-flex justify-content-end">
          <button type="button" class="ml-3 btn pdf" @click="clickPdf"> PDF 다운받기 </button>
          <button type="button" class="ml-3 btn excel" @click="clickExcel"> 엑셀 다운받기 </button>
        </div>
      </section>
    </div>
    <div class="m m-wrap">
      <mheader ref="mHeader" :pMenu="'dashboard'"></mheader>
      <mfooter ref="mFooter" :pMenu="'dashboard'"></mfooter>
      <section>
        <div class="pills-container-btn">
          <div class="pills-btn pb-0">
            <ul class="d-flex" id="pills-tab" role="tablist">
              <li class="nav-item"> <button class="nav-link" :class="[activeKpi.cst === true ? 'active' : '']" id="" @click="clickBtn($event, 'cst')" > 광고비 </button> </li>
              <li class="nav-item"> <button class="nav-link" :class="[activeKpi.im === true ? 'active' : '']" id="" @click="clickBtn($event, 'im')" > 노출수 </button> </li>
              <li class="nav-item"> <button class="nav-link" :class="[activeKpi.clk === true ? 'active' : '']" id="" @click="clickBtn($event, 'clk')" > 클릭수 </button> </li>
              <li class="nav-item"> <button class="nav-link" :class="[activeKpi.cv === true ? 'active' : '']" id="" @click="clickBtn($event, 'cv')" > 전환수 </button> </li>
            </ul>
          </div>
          <button class="allow" @click="clickAllowBtn">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="9" viewBox="0 0 12 8" >
              <path fill="none" fill-rule="evenodd" stroke="#1e1e23" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M1 6L6 1 11 6" transform="translate(0 1)" ></path>
            </svg>
          </button>
        </div>
        <article class="dashboard-card">
          <div class="title"><h3>매체통합 광고요약</h3></div>
          <line-graph
            ref="mlineGraph"
            :pHeight="'280px'"
            :pLegend="activeMedia"
            :pKpi="activeKpi.kpi"
            :pCustom="{
              series: { textStyle: { fontSize: '12', fontWeight: 'bold' } },
              xAxis: { name: '', axisLabel: { fontSize: '12' }, show: false },
              yAxis: { name: '', axisLabel: { fontSize: '12' }, show: false },
              grid: { right: '10%', bottom: '5%', width: '100%', containLabel: true, },
              legend: { show: false, left: 'right', top: 'middle', orient: 'vertical', },
              mobile: true,
            }"
            @expireSession="handleExpireSession"
            @showMask="handleShowMask"
            @hideMask="handleHideMask"
          >
          </line-graph>
        </article>
        <article class="statistics-report">
          <div class="title d-flex justify-content-between align-items-center">
            <h3>매체별 리포트</h3>
            <div class="indicator d-flex align-items-center dropdown">
              <button type="button" class="btn shadow-none p-0" data-toggle="dropdown" aria-expanded="false" > <i class="bi bi-gear m-0"></i> </button>
              <div class="dropdown-menu dropdown-menu-right">
                <form>
                  <template v-for="(k,i) in ['cst','im','clk','cv','cr','ctr','cpa','cpc','cvr','roas']" :key="i+getUuidv4()">
                    <div class="form-check" >
                      <input class="form-check-input" type="checkbox" :id="'indicator'+i" :value=k :checked="kpi[k].check" :disabled="kpi[k].visible === false" @change="clickCheckpi($event, k)" />
                      <label class="form-check-label" :for="'indicator'+i" ><p class="d-flex align-items-center ml-1">{{getKpiName(k)}}</p></label >
                    </div>

                  </template>
                  <button type="button" class="btn indicator-close" data-toggle="dropdown" aria-expanded="false" > 닫기 </button>
                </form>
              </div>
            </div>
          </div>
          <div class="m-table">
            <ul>
              <div class="m-table-title">
                <div class="w-100"> <li class="font-weight-bold">검색광고</li> </div>
              </div>
              <div class="m-table-content">
                <div class="w-100 d-flex flex-wrap">
                  <li class="col-4" v-for="(data, i) in getObject('total', datas['sa'])" :key="i + getUuidv4" v-show="kpi[data.k].check" >
                    <label for="">{{ getKpiName(data.k) }}</label>
                    <div>{{ priceToString(data.v) + getUnit(data.k) }}</div>
                  </li>
                </div>
              </div>
              <div class="m-table-content">
                <div class="w-100 d-flex flex-wrap">
                  <li class="col-12">검색광고 &#62; {{getMedia("naver")}}</li>
                  <li class="col-4" v-for="(data, i) in getObject('naver', datas['sa'])" :key="i + getUuidv4" v-show="kpi[data.k].check" >
                    <label for="">{{ getKpiName(data.k) }}</label>
                    <div>{{ priceToString(data.v) + getUnit(data.k) }}</div>
                  </li>
                </div>
              </div>
              <div class="m-table-content">
                <div class="w-100 d-flex flex-wrap">
                  <li class="col-12">검색광고 &#62; {{getMedia("kakaosa")}}</li>
                  <li class="col-4" v-for="(data, i) in getObject('kakaosa', datas['sa'])" :key="i + getUuidv4" v-show="kpi[data.k].check" >
                    <label for="">{{ getKpiName(data.k) }}</label>
                    <div>{{ priceToString(data.v) + getUnit(data.k) }}</div>
                  </li>
                </div>
              </div>
              <div class="m-table-content">
                <div class="w-100 d-flex flex-wrap">
                  <li class="col-12">검색광고 &#62; {{getMedia("google")}}</li>
                  <li class="col-4" v-for="(data, i) in getObject('google', datas['sa'])" :key="i + getUuidv4" v-show="kpi[data.k].check" >
                    <label for="">{{ getKpiName(data.k) }}</label>
                    <div>{{ priceToString(data.v) + getUnit(data.k) }}</div>
                  </li>
                </div>
              </div>              
            </ul>
          </div>
          <div class="m-table">
            <ul>
              <div class="m-table-title"> <div class="w-100"> <li class="font-weight-bold">배너광고</li> </div> </div>
              <div class="m-table-content">
                <div class="w-100 d-flex flex-wrap">
                  <div class="w-100 d-flex flex-wrap">
                    <li class="col-4" v-for="(data, i) in getObject('total', datas['dsp'])" :key="i + getUuidv4" v-show="kpi[data.k].check" >
                      <label for="">{{ getKpiName(data.k) }}</label>
                      <div>{{ priceToString(data.v) + getUnit(data.k) }}</div>
                    </li>
                  </div>
                </div>
              </div>
              <div class="m-table-content">
                <div class="w-100 d-flex flex-wrap">
                  <div class="w-100 d-flex flex-wrap">
                    <li class="col-12">배너광고 &#62; {{getMedia("naverda")}}</li>
                    <li class="col-4" v-for="(data, i) in getObject('naverda', datas['dsp'])" :key="i + getUuidv4" v-show="kpi[data.k].check" >
                      <label for="">{{ getKpiName(data.k) }}</label>
                      <div>{{ priceToString(data.v) + getUnit(data.k) }}</div>
                    </li>
                  </div>
                </div>
              </div>
              <div class="m-table-content">
                <div class="w-100 d-flex flex-wrap">
                  <div class="w-100 d-flex flex-wrap">
                    <li class="col-12">배너광고 &#62; {{getMedia("kakaomo")}}</li>
                    <li class="col-4" v-for="(data, i) in getObject('kakaomo', datas['dsp'])" :key="i + getUuidv4" v-show="kpi[data.k].check" >
                      <label for="">{{ getKpiName(data.k) }}</label>
                      <div>{{ priceToString(data.v) + getUnit(data.k) }}</div>
                    </li>
                  </div>
                </div>
              </div>
            </ul>
          </div>
        </article>
        <article>
          <div class="d-flex justify-content-between">
            <button type="button" class="btn pdf" @click="clickPdf">PDF 다운받기</button>
            <button type="button" class="btn excel" @click="clickExcel"> 엑셀 다운받기 </button>
          </div>
        </article>
      </section>
      <mbig-menu-2 ref="mBigMenu2" @closeBtn="$refs.mFooter.setFooter('home')" ></mbig-menu-2>
      <mdate-range-picker ref="mDateRangePicker" :pStart="start" :pEnd="end" :pCstart="''" :pCend="''" @changedDate="handleChangedDateRange" @closeBtn="$refs.mFooter.setFooter('home')" > </mdate-range-picker>
      <mbalance ref="mBalance" :pBalance="balance" @closeBtn="$refs.mFooter.setFooter('home')" ></mbalance>
      <malarm ref="mFmenu" @closeBtn="$refs.mFooter.setFooter('home')"></malarm>
      <mfmenu ref="mFmenu" @logout="handleLogOut" @dbedit="$refs.mFooter.clickDbEdit('dashboard-edit')" @closeBtn="$refs.mFooter.setFooter('home')" ></mfmenu>
      <mdashboard-edit ref="mDashboardEdit" @closeBtn="$refs.mFooter.setFooter('home')" ></mdashboard-edit>
    </div>
    <log-out-modal ref="logOutModal" style="display: none"></log-out-modal>
    <expire-session-modal ref="expireSessionModal" style="display: none" ></expire-session-modal>
    <mask-modal ref="maskModal" style="display: none"></mask-modal>
    <div class="hidden-print"><media-pdf ref="mediaPdf" :key="pdfKey"></media-pdf></div>      
    <!-- <pdf-media-analysis ref="pdfAnalysis" :pLegend="activeMedia" :pKpi="activeKpi.kpi" :pFromdate="start" :pTodate="end" :pActiveKpi="kpi" style="display: none" @showMask="handleShowMask" @hideMask="handleHideMask" > </pdf-media-analysis> -->
  </div>
</template>

<script>
// import "swiper/dist/css/swiper.css";
import 'swiper/css';
import $ from "jquery";
// import xlsx from "xlsx";
import * as xlsx from "xlsx";
import moment from "moment";
// import { swiper, swiperSlide } from "vue-awesome-swiper";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import { priceToString,  getMedia,  getApp,  uuidv4,  getUnit,  getKpiName} from "@/assets/js/common.js";
import message from "@/components/common/message.vue";
import dateRangePicker from "@/components/common/dateRangePicker.vue";
import expireSessionModal from "@/components/modal/expireSessionModal.vue";
import maskModal from "@/components/modal/maskModal.vue";
import bigMenu2 from "@/components/layout/bigMenu2.vue";
import balance from "@/components/dashboard2/balance.vue";
import logOutModal from "@/components/modal/logOutModal.vue";
import naverIcon from "@/assets/image/naver.png";
import kakaoSaIcon from "@/assets/image/daum.png";
import kakaoMomentIcon from "@/assets/image/kakao.png";
import { store } from "@/store/store.js";
import { SHA256 } from "@/assets/js/sha256.js";
import { API_URL, TEMP_KEY, MEDIA_ANALYSIS_SORT } from "@/configs/config.js";
import LineGraph from "@/components/graph/lineGraph.vue";
import pdfMediaAnalysis from "@/components/pdf/pdfMediaAnalysis.vue";
import mheader from "@/components/layout/m/header.vue";
import mfooter from "@/components/layout/m/footer.vue";
import mbigMenu2 from "@/components/layout/m/bigMenu2.vue";
import mdateRangePicker from "@/components/common/m/dateRangePicker.vue";
import mbalance from "@/components/common/m/balance.vue";
import mfmenu from "@/components/common/m/fMenu.vue";
import malarm from "@/components/common/m/alarm.vue";
import mdashboardEdit from "@/components/common/m/dashboardEdit.vue";
import mediaPdf from "@/components/mediaAnalysis/mediaPdf.vue";
export default {
  data() {
    return {
      start: store.state.dateStore.start,
      end: store.state.dateStore.end,
      activeMedia: {naver: { check: true },kakaosa: { check: true },google: {check: true},naverda: { check: true },kakaomo: { check: true }},
      activeKpi: {cst: false,im: true,clk: false,cv: false,kpi: "im"},
      kpi: { clk: { visible: false, check: true }, im: { visible: false, check: true }, cst: { visible: false, check: true }, cv: { visible: true, check: false }, cr: { visible: true, check: false }, 
      ctr: { visible: false, check: true }, cpc: { visible: false, check: true }, cpa: { visible: true, check: false }, cvr: { visible: true, check: false }, roas: { visible: true, check: false }, 
      },
      datas: { total: {},total2: [], sa: {total: {},naver: {},kakaosa: {},google: {}}, dsp: {total: {},naverda: {},kakaomo: {}}, },
      header: [
        { key: "media", name: "매체별" },
        { key: "app", name: "광고" },
        { key: "clk", name: "클릭수" },
        { key: "im", name: "노출수" },
        { key: "cst", name: "광고비" },
        { key: "cv", name: "전환수" },
        { key: "cr", name: "전환매출" },
        { key: "ctr", name: "클릭률" },
        { key: "cpc", name: "클릭당비용" },
        { key: "cpa", name: "전환당비용" },
        { key: "cvr", name: "전환율" },
        { key: "roas", name: "ROAS" },
      ],
      responseData: null,
      balance: [],
      accountlog: [],
      pdfKey: 0
    };
  },
  components: { bigMenu2, balance, logOutModal, dateRangePicker, expireSessionModal, maskModal, LineGraph, pdfMediaAnalysis, Swiper, SwiperSlide, mheader, mfooter, mbigMenu2, 
  mdateRangePicker, mbalance, mfmenu, malarm, mdashboardEdit, message, mediaPdf
  },
  mounted() {
    $(".main").removeClass("m-h-100");
    this.clickSearchBtn();
    this.getAccountLog();
  },
  methods: { 
    clickSearchBtn() {
      var vm = this;
      var date = vm.$refs.dateRangePicker.getDate();
      vm.start = date.start;
      vm.end = date.end;
      vm.findMediaReport();
    },
    clickCheck(event, type) {
      var vm = this;
      var $active = $(event.target);
      var keys = Object.keys(vm.activeMedia);
      var date = vm.$refs.dateRangePicker.getDate();

      for (let i = 0; i < keys.length; i++) {
        if (keys[i].indexOf(type) > -1) {
          vm.activeMedia[keys[i]].check = $active.is(":checked");
          break;
        }
      }
      vm.$refs.lineGraph.setGraph(vm.responseData, date.start, date.end);
      vm.$refs.mlineGraph.setGraph(vm.responseData, date.start, date.end);
    },
    clickBtn(event, type) {
      var vm = this;
      var date = vm.$refs.dateRangePicker.getDate();
      var $btn = $(event.target);
      var keys = Object.keys(vm.activeKpi);
      for (let i = 0; i < keys.length; i++) {keys[i].indexOf("kpi") > -1? (vm.activeKpi["kpi"] = ""): (vm.activeKpi[keys[i]] = false);}

      vm.activeKpi[type] = true;
      vm.activeKpi["kpi"] = type;
      vm.$refs.lineGraph.setGraph(vm.responseData, date.start, date.end);
      vm.$refs.mlineGraph.setGraph(vm.responseData, date.start, date.end);
    },
    clickCheckpi(event, type) {
      var vm = this;
      var $active = $(event.target);
      var keys = Object.keys(vm.kpi);

      for (let i = 0; i < keys.length; i++) {
        if (keys[i].indexOf(type) > -1) {
          vm.kpi[keys[i]].check = $active.is(":checked");
          break;
        }
      }
    },
    clickExcel() {
      var vm = this;
      if (vm.responseData !== null) {
        var options = { header: vm.header, headProps: "header" };
        vm.exportExcel(vm.responseData, options);
      } else { }
    },   
    clickAllowBtn() {
      let pillstab = document.querySelector(".pills-container-btn .pills-btn #pills-tab");
      let svg = document.querySelector(".pills-container-btn .allow svg");
      if (pillstab.classList.contains("flex-wrap")) {
        pillstab.classList.remove("flex-wrap");
        svg.style.transform = "rotate(180deg)";
      } else {
        pillstab.classList.add("flex-wrap");
        svg.style.transform = "rotate(0deg)";
      }
    },    
    async clickPdf() {
      var date = this.$refs.dateRangePicker.getDate();
      var diff = moment(date.end).diff(moment(date.start), "days");
      var comparefromdate = moment(date.start).subtract(1 + Number(diff), "days").format("YYYY-MM-DD");
      var comparetodate = moment(date.start).subtract(1, "days").format("YYYY-MM-DD");      

      this.handleShowMask();
      await this.$refs.mediaPdf.initPDF({date: date, cdate: {start: comparefromdate, end: comparetodate}});
      var blob = await this.$refs.mediaPdf.generatePDF(); // 렌더링 완료 후 PDF 생성
      window.open(URL.createObjectURL(blob));
      this.pdfKey++;
      this.handleHideMask();
    }, 
    getSum(arr) {
      var result = arr.reduce(function add(sum, currValue) {
        return parseFloat(sum) + parseFloat(currValue);
      }, 0);
      return result;
    },
    getTotal(data, type, media) {
      var vm = this;
      var clk = []; //클릭수
      var im = []; //노출수
      var cst = []; //광고비
      var cv = []; //전환수
      var cr = []; //전환매출
      var ctr = []; //클릭률
      var cpc = []; //클릭 당 비용
      var cpa = []; //전환 당 비용
      var cvr = []; //전환율
      var roas = []; //ROAS

      //total
      var keysTotal =media === null? Object.keys(data.data[type]): Object.keys(data.data[type][media]);
      for (let i = 0; i < keysTotal.length; i++) {
        var obj =media === null? data.data[type][keysTotal[i]]: data.data[type][media][keysTotal[i]];
        if (obj.length === 0) continue;
        clk.push(obj.clk);
        im.push(obj.im);
        cst.push(obj.cst);
        cv.push(obj.cv);
        cr.push(obj.cr);
      }
      
      if (!media) {
        vm.datas[type].clk = vm.getSum(clk);
        vm.datas[type].im = vm.getSum(im);
        vm.datas[type].cst = vm.getSum(cst);
        vm.datas[type].cv = vm.getSum(cv);
        vm.datas[type].cr = vm.getSum(cr);
        vm.datas[type].ctr =vm.datas[type].clk > 0 && vm.datas[type].im > 0? ((vm.datas[type].clk / vm.datas[type].im) * 100).toFixed(2): 0;
        vm.datas[type].cpc =vm.datas[type].cst > 0 && vm.datas[type].clk > 0? (vm.datas[type].cst / vm.datas[type].clk).toFixed(0): 0;
        vm.datas[type].cpa =vm.datas[type].cst > 0 && vm.datas[type].cv > 0? (vm.datas[type].cst / vm.datas[type].cv).toFixed(0): 0;
        vm.datas[type].cvr =vm.datas[type].cv > 0 && vm.datas[type].clk > 0? ((vm.datas[type].cv / vm.datas[type].clk) * 100).toFixed(2): 0;
        vm.datas[type].roas =vm.datas[type].cr > 0 && vm.datas[type].cst > 0? ((vm.datas[type].cr / vm.datas[type].cst) * 100).toFixed(0): 0;
      } else {
        vm.datas[type][media].clk = vm.getSum(clk); 
        vm.datas[type][media].im = vm.getSum(im);
        vm.datas[type][media].cst = vm.getSum(cst);
        vm.datas[type][media].cv = (vm.getSum(cv)).toFixed(2);
        vm.datas[type][media].cr = vm.getSum(cr);
        vm.datas[type][media].ctr =vm.datas[type][media].clk > 0 && vm.datas[type][media].im > 0? ((vm.datas[type][media].clk / vm.datas[type][media].im) * 100).toFixed(2): 0;
        vm.datas[type][media].cpc =vm.datas[type][media].cst > 0 && vm.datas[type][media].clk > 0? (vm.datas[type][media].cst / vm.datas[type][media].clk).toFixed(0): 0;
        vm.datas[type][media].cpa =vm.datas[type][media].cst > 0 && vm.datas[type][media].cv > 0? (vm.datas[type][media].cst / vm.datas[type][media].cv).toFixed(0): 0;
        vm.datas[type][media].cvr =vm.datas[type][media].cv > 0 && vm.datas[type][media].clk > 0? ((vm.datas[type][media].cv / vm.datas[type][media].clk) * 100).toFixed(2): 0;
        vm.datas[type][media].roas =vm.datas[type][media].cr > 0 && vm.datas[type][media].cst > 0? ((vm.datas[type][media].cr / vm.datas[type][media].cst) * 100).toFixed(0): 0;
      }
    },
    getTypeTotal(data) {
      var vm = this;
      var count = ["all", "sa", "dsp"];
      var keys = Object.keys(vm.kpi);
      for (let i = 0; i < count.length; i++) {
        for (let k = 0; k < keys.length; k++) {
          count[i] === "all" ? (vm.datas["total"][keys[k]] = data[count[i]][keys[k]]) : (vm.datas[count[i]]["total"][keys[k]] = data[count[i]][keys[k]]);
        }
      }

      vm.datas.total2 = [];
      vm.datas.total2.push(data.all.cp);
    },
    getImageUrl(key) {
      if (key === undefined) return "";

      var url = "";
      if (key === "N") url = naverIcon;
      if (key === "D") url = kakaoMomentIcon;
      if (key === "G") url = kakaoMomentIcon;
      if (key === "K") url = kakaoMomentIcon;
      if (key === "Nda") url = naverIcon;
      return url;
    },    
    getObject(key, o) {
      let objs = [];
      var keys = Object.keys(o[key]);

      for (let i = 0; i < keys.length; i++) {objs.push({k: keys[i],v: o[key][keys[i]],s: MEDIA_ANALYSIS_SORT[keys[i]]});}
      objs.sort(function (a, b) {return a.s < b.s ? -1 : a.s > b.s ? 1 : 0;});
      return objs;
    },
    getMedia(media) {return getMedia(media);},
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
        error: function (a, b, c) {},
        complete: function (a, b, c) {},
      });      
    },     
    getUuidv4() {return uuidv4();},
    getUnit(k) {return getUnit(k);},
    getKpiName(k) {return getKpiName(k);},    
    handleLogOut() {this.$refs.logOutModal.showModal();},
    handleChangedDateRange(data) {
      this.$refs.dateRangePicker.setDate({start: data.start,end: data.end,compare: false});
      this.clickSearchBtn();
    },
    handleChangedBalance(data) {
      this.balance = [];
      this.balance = data.slice();
    },        
    handleShowMask() {this.$refs.maskModal.showModal();},
    handleHideMask() {this.$refs.maskModal.hideModal();},    
    handleExpireSession() {this.$refs.expireSessionModal.showModal();},   
    activeMain(flag) {
      this.$emit("mountedMain", true);
      this.$emit("mountedDasyboad", true);
    },
    findMediaReport() {
      var vm = this;
      var date = vm.$refs.dateRangePicker.getDate();
      var diff = moment(date.end).diff(moment(date.start), "days");
      var comparefromdate = moment(date.start).subtract(1 + Number(diff), "days").format("YYYY-MM-DD");
      var comparetodate = moment(date.start).subtract(1, "days").format("YYYY-MM-DD");

      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/mediareport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {userid: store.state.userStore.userinfo.userid,fromdate: date.start,todate: date.end,comparefromdate: comparefromdate,comparetodate: comparetodate, session: store.state.userStore.session},
        beforeSend: function (data) {vm.handleShowMask();},
        success: function (data) {
          vm.responseData = null;
          vm.datas.total = {};
          vm.datas.sa.naver = {};
          vm.datas.sa.kakaosa = {};
          vm.datas.sa.google = {};          
          vm.datas.dsp.naverda = {};
          vm.datas.dsp.kakaomo = {};

          if (data.result === "success") {
            vm.getTotal(data, "dsp", "naverda");
            vm.getTotal(data, "dsp", "kakaomo");
            vm.getTotal(data, "sa", "naver");
            vm.getTotal(data, "sa", "kakaosa");
            vm.getTotal(data, "sa", "google");
            vm.getTypeTotal(data.data.total.summary);

            vm.responseData = data;
            vm.$refs.lineGraph.setGraph(vm.responseData, date.start, date.end);
            vm.$refs.mlineGraph.setGraph(vm.responseData, date.start, date.end);
          } else {
            if (data.status === "0001") {vm.handleExpireSession();} else {}
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
        complete: function (a, b, c) {vm.handleHideMask();},
      });
    },
    priceToString(salse) {
      if (salse === undefined) return "";
      return priceToString(salse);
    },
    exportExcel(data, options) {
      var vm = this;
      var headProps = [];

      if (Array.isArray(options.headProps)) {
        headProps = options.headProps;
      } else if (options.headProps === "header") {
        for (var h of vm.header) {
          headProps.push(h.key);
        }
      } else {
        headProps = Object.keys(data[0]);
      }

      this.visibleHeadProps = headProps;
      this.instance = document.createElement("table");

      // Header 세팅
      var rows = [];
      if (!Array.isArray(vm.header[0])) {
        rows.push(vm.header);
      } else {
        rows = vm.header;
      }

      var thead = document.createElement("thead");
      for (var row of rows) {
        var tr = document.createElement("tr");
        for (var h of row) {
          var rowspan = h.rowspan || "1";
          var colspan = h.colspan || "1";
          var th = document.createElement("th");
          th.setAttribute("rowspan", rowspan);
          th.setAttribute("colspan", colspan);
          th.innerText = h.name;
          tr.appendChild(th);
        }
        thead.appendChild(tr);
      }
      this.instance.appendChild(thead);

      // Body 세팅
      var tbody = document.createElement("tbody");

      var excel = [];
      ["sa", "dsp"].forEach(function (app, index) {
        var keys = Object.keys(vm.datas["" + app]);
        for (var i = 0; i < keys.length; i++) {
          if (keys[i] === "total") continue;
          var value = Object.assign({}, vm.datas["" + app]["" + keys[i]]);
          value["media"] = getMedia(keys[i]);
          value["app"] = getApp(app);
          excel.push(value);
        }
      });

      for (var row of excel) {
        var tr = document.createElement("tr");
        for (var cellkey of this.visibleHeadProps) {
          var td = document.createElement("td");
          td.innerText = row[cellkey];
          tr.appendChild(td);
        }
        tbody.appendChild(tr);
      }
      this.instance.appendChild(tbody);

      // instance에 만들어진 table을 엑셀파일로 저장
      var config = { raw: true, type: "string" };
      var ws = xlsx.utils.table_to_sheet(this.instance, config);
      var wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "전체");
      const wbout = xlsx.write(wb, { bookType: "xlsx", type: "array" });
      const url = window.URL.createObjectURL(
        new Blob([wbout], { type: "application/octet-stream" })
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = "media_report_"+moment().format("YYYYMMDDHHmmss")+".xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },        
  },
};
</script>


