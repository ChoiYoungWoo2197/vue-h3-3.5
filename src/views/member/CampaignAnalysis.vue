<template>
  <div class="d-flex m-h-100 dashboard">
    <big-menu-2 :pMenu="'campaignAnalysis'" @mountedMain="activeMain" class="pc" ></big-menu-2>
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
          <h2 class="">캠페인그룹 분석</h2>
          <div class="search d-flex">
            <select class="form-control" id="media" v-model="media" @change="clickMedia">
              <option selected value="naver">{{getMediaNew("naver")}}</option>
              <option value="kakaosa">{{getMediaNew("kakaosa")}}</option>
              <option value="naverda">{{getMediaNew("naverda")}}</option>
              <option value="kakaomo">{{getMediaNew("kakaomo")}}</option>
              <option value="google">{{getMediaNew("google")}}</option>              
            </select>
            <date-range-picker ref="dateRangePicker" class="form-control" :pStart="start" :pEnd="end" :pDisabled="false" @changedDate="handleChangedDateRange" > </date-range-picker>
            <button type="submit" class="btn submit" @click.prevent="clickSearchBtn"> 조회하기 </button>
          </div>
        </div>
        <div class="select-btn">
          <button type="button" class="btn select" :class="[activeKpi.cst === true ? 'active' : '']" @click="clickKpiBtn($event, 'cst')" > 광고비 </button>
          <button type="button" class="btn select" :class="[activeKpi.im === true ? 'active' : '']" @click="clickKpiBtn($event, 'im')" > 노출수 </button>
          <button type="button" class="btn select" :class="[activeKpi.clk === true ? 'active' : '']" @click="clickKpiBtn($event, 'clk')" > 클릭수 </button>
          <button type="button"  class="btn select" :class="[activeKpi.cv === true ? 'active' : '']" @click="clickKpiBtn($event, 'cv')" > 전환수 </button>
        </div>
        <article>
          <div class="title"><h3>캠페인 일별 추이</h3></div>
          <line-period-graph
            ref="linePeriodGraph"
            :pHeight="'300px'"
            :pLegend="activeKpi"
            :pPeriodUnit="activeBtn.periodUnit"
            :pCustom="{
              series: { textStyle: { fontSize: '15', fontWeight: 'bold', }, },
              xAxis: { name: '', axisLabel: { fontSize: '15' } },
              yAxis: { name: '', axisLabel: { fontSize: '15' } },
              grid: { left: 'center', bottom: '17%', width: '90%', containLabel: true, },
              legend: { show: false, left: 'right', top: 'middle', orient: 'vertical', },
            }"
            @expireSession="handleExpireSession"
            @showMask="handleShowMask"
            @hideMask="handleHideMask"
          >
          </line-period-graph>
        </article>
        <article>
          <div class="title d-flex justify-content-between align-items-center">
            <h3>그룹별 리포트</h3>
            <div class="indicator d-flex align-items-center dropdown">
              <button type="button" class="btn shadow-none p-0" data-toggle="dropdown" aria-expanded="false" >
                <i class="bi bi-gear m-0"></i>
              </button>
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
          <table class="report nshop">
            <thead>
              <tr>
                <td width="20px" class="text-left fold-icon"></td>
                <td width="20%" class="text-left">캠페인 (광고그룹목록)</td>
                <template v-for="(k,i) in ['im','clk','ctr','cpc','cst','cv','cr','cpa','cvr','roas']">
                  <td :key="i+getUuidv4()" v-if="kpi[k].check">{{getKpiName(k)}}</td>
                </template>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(data, index) in getDatas" :key="index + '-' + getUuidv4()" :class=" data.isMainData === true ? ['maindata', 'collapsed'] : ['subdata', 'collapse', data.campain] " 
              :data-toggle="data.isMainData === true ? 'collapse' : ''" :data-target="data.isMainData === true ? '.' + data.campain : ''" :aria-expanded="data.isMainData === true ? 'false' : ''" >
                <template v-if="data.isMainData === true">
                  <td class="text-left fold-icon"></td>
                  <td :class=" data.haschild === true ? ['text-left fold-btn'] : ['text-left'] " > {{ data.campaign_name }} </td>
                </template>
                <template v-else>
                  <td></td>
                  <td class="text-left">
                      <p class="d-flex align-items-center">
                        {{ data.campaign_name }}
                        <a class="btn-modal" data-toggle="modal" data-target="#keyword-modal" @click="clickCampaignAnalysisModal(data.campaign_id)" ><span>더보기</span></a>
                      </p>
                  </td>
                </template>
                <template v-for="(k,i) in ['im','clk','ctr','cpc','cst','cv','cr','cpa','cvr','roas']">
                  <td :key="i+getUuidv4()" v-if="kpi[k].check">{{priceToString(data[k])+getUnit(k)}}</td>
                </template>                
              </tr>
            </tbody>
            <tfoot>
              <tr v-for="data in total" :key="data.cst + getUuidv4 + 'L'" class="total bg-white">
                <td></td>
                <td class="text-left">총 합계</td>
                <template v-for="(d, i) in getObject(kpi)">
                  <td :key="d + i + getUuidv4" v-if="kpi[d.k].check">
                    <a href="#" class="d-flex align-items-center justify-content-end">
                      <template v-if="data[d.k] === 0">{{'-'}}</template>
                      <template v-else>
                        <span>{{ priceToString(data[d.k]) + getUnit(d.k) }}</span>
                        <small v-if="total2[0].per[d.k] !== 0" class="ml-1" :class="[total2[0].per[d.k].indexOf('-') > -1 ? 'down' : 'up']"> 
                          {{total2[0].per[d.k] +'%'}} 
                          <i v-if="total2[0].per[d.k] !== 0" :class="[total2[0].per[d.k].indexOf('-') > -1 ? 'bi bi-graph-down-arrow ' : 'bi bi-graph-up-arrow ']" class="ml-1 mr-0"></i>
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
              <li class="nav-item">
                <button class="nav-link media active" id="" type="button" data-toggle="collapse" data-target="#mediaBtnBoxContainerCollapse" aria-expanded="false" aria-controls="mediaBtnBoxContainerCollapse" >
                  {{ getMedia }}
                  <i class="bi bi-arrow-down text-white mr-0"></i>
                </button>
              </li>
              <li class="nav-item"> <button class="nav-link" :class="[activeKpi.cst === true ? 'active' : '']" id="" @click="clickKpiBtn($event, 'cst')" > 광고비 </button> </li>
              <li class="nav-item"> <button class="nav-link" :class="[activeKpi.im === true ? 'active' : '']" id="" @click="clickKpiBtn($event, 'im')" > 노출수 </button> </li>
              <li class="nav-item"> <button class="nav-link" :class="[activeKpi.clk === true ? 'active' : '']" id="" @click="clickKpiBtn($event, 'clk')" > 클릭수 </button> </li>
              <li class="nav-item"> <button class="nav-link" :class="[activeKpi.cv === true ? 'active' : '']" id="" @click="clickKpiBtn($event, 'cv')" > 전환수 </button> </li>
            </ul>
          </div>
          <button class="allow" @click="clickAllowBtn">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="9" viewBox="0 0 12 8" >
              <path fill="none" fill-rule="evenodd" stroke="#1e1e23" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M1 6L6 1 11 6" transform="translate(0 1)" ></path>
            </svg>
          </button>
        </div>
        <article class="collapse" id="mediaBtnBoxContainerCollapse">
          <ul class="media-btn-box-container">
            <li @click="clickMedia($event, 'naver')">
              <input type="checkbox" />
              <label for="" :class="media === 'naver' ? 'active' : ''"> {{getMediaNew("naver")}} <span> <i class="bi" :class="media === 'naver' ? 'bi-check active' : 'bi-plus'" ></i> </span> </label>
            </li>
            <li @click="clickMedia($event, 'kakaosa')">
              <input type="checkbox" />
              <label for="" :class="media === 'kakaosa' ? 'active' : ''">{{getMediaNew("kakaosa")}} <span> <i class="bi" :class="media === 'kakaosa' ? 'bi-check active' : 'bi-plus'" ></i> </span> </label>
            </li>
            <li @click="clickMedia($event, 'google')">
              <input type="checkbox" />
              <label for="" :class="media === 'google' ? 'active' : ''">{{getMediaNew("google")}} <span> <i class="bi" :class="media === 'google' ? 'bi-check active' : 'bi-plus'" ></i> </span> </label>
            </li>            
            <li @click="clickMedia($event, 'naverda')">
              <input type="checkbox" />
              <label for="" :class="media === 'naverda' ? 'active' : ''">{{getMediaNew("naverda")}} <span> <i class="bi" :class="media === 'naverda' ? 'bi-check active' : 'bi-plus'" ></i> </span> </label>
            </li>
            <li @click="clickMedia($event, 'kakaomo')">
              <input type="checkbox" />
              <label for="" :class="media === 'kakaomo' ? 'active' : ''">{{getMediaNew("kakaomo")}} <span> <i class="bi" :class="media === 'kakaomo' ? 'bi-check active' : 'bi-plus'" ></i> </span> </label>
            </li>
          </ul>
        </article>
        <article class="dashboard-card">
          <div class="title"><h3>캠페인 일별 추이</h3></div>
          <line-period-graph
            ref="linePeriodGraph2"
            :pHeight="'280px'"
            :pLegend="activeKpi"
            :pPeriodUnit="activeBtn.periodUnit"
            :pCustom="{
              series: { textStyle: { fontSize: '15', fontWeight: 'bold', }, },
              xAxis: { name: '', axisLabel: { fontSize: '15' }, show: false },
              yAxis: { name: '', axisLabel: { fontSize: '15' }, show: false },
              grid: { right: '10%', bottom: '5%', width: '100%', containLabel: true, },
              legend: { show: false, left: 'right', top: 'middle', orient: 'vertical', },
              mobile: true,
            }"
            @expireSession="handleExpireSession"
            @showMask="handleShowMask"
            @hideMask="handleHideMask"
          >
          </line-period-graph>
        </article>
        <article class="statistics-report">
          <div class="title d-flex justify-content-between align-items-center">
            <h3>그룹별 리포트</h3>
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
          <template v-for="(data, index) in getDatas">
            <div v-if="data.isMainData === true" class="m-table" :key="index + '-' + getUuidv4()" >
              <ul>
                <div class="m-table-title">
                  <div class="w-100"> <li class="font-weight-bold">{{ getType(data.campaign_type) }}</li> </div>
                </div>
                <div class="m-table-content">
                  <div class="w-100 d-flex flex-wrap">
                    <template v-for="(k,i) in ['im','clk','ctr','cpc','cst','cv','cr','cr','cpa','cvr','roas']">
                      <li class="col-4" v-if="kpi[k].check" :key="i+getUuidv4()">
                        <label for="">{{getKpiName(k)}}</label>
                        <div>{{ priceToString(data[k]) + getUnit(k)}}</div>  
                      </li>
                    </template>
                  </div>
                </div>
                <template v-for="(data2, index2) in getDatas">
                  <div v-if=" data2.isSubdata === true && data.campaign_type === data2.campaign_type " class="m-table-content" :key="index2 + '-' + getUuidv4()" >
                    <div class="w-100 d-flex flex-wrap">
                      <li class="col-12 d-flex align-items-center">
                        {{ getType(data.campaign_type) + " &#62;" + data2.campaign_name }}
                        <router-link class="btn" :to="{ path: '/m-group-analysis', query: { id: data2.campaign_id, media: media, name: data2.campaign_name, type: data2.campaign_type, start: start, end: end, }, }">
                          <span>더보기</span>
                        </router-link>
                      </li>
                      <template v-for="(k,i) in ['im','clk','ctr','cpc','cst','cv','cr','cpa','cvr','roas']">
                        <li class="col-4" v-if="kpi[k].check" :key="i+getUuidv4()">
                          <label>{{getKpiName(k)}}</label>
                           <div>{{ priceToString(data[k]) + getUnit(k)}}</div>
                        </li>
                      </template>
                    </div>
                  </div>
                </template>
              </ul>
            </div>
          </template>
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
    <campaign-analysis-modal ref="campaignAnalysisModal" style="display: none" ></campaign-analysis-modal>
    <div class="hidden-print"><campaign-pdf ref="campaignPdf" :key="pdfKey"></campaign-pdf></div>
    <!-- <pdf-campaign-analysis ref="pdfCampaignAnalysis" :pFromdate="start" :pTodate="end" :pLegend="activeKpi" :pPeriodUnit="activeBtn.periodUnit" :pActiveKpi="kpi" :pMedia="media" style="display: none" @showMask="handleShowMask" @hideMask="handleHideMask" > </pdf-campaign-analysis> -->
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
import {  isMobile,  priceToString,  getMedia,  uuidv4,  getUnit,  getType,  getKpiName} from "@/assets/js/common.js";
import { store } from "@/store/store.js";
import { SHA256 } from "@/assets/js/sha256.js";
import { API_URL, TEMP_KEY, MEDIA_ANALYSIS_SORT } from "@/configs/config.js";
import dateRangePicker from "@/components/common/dateRangePicker.vue";
import expireSessionModal from "@/components/modal/expireSessionModal.vue";
import messageModal from "@/components/modal/messageModal.vue";
import linePeriodGraph from "@/components/graph/linePeriodGraph.vue";
import maskModal from "@/components/modal/maskModal.vue";
import message from "@/components/common/message.vue";
import balance from "@/components/dashboard2/balance.vue";
import bigMenu2 from "@/components/layout/bigMenu2.vue";
import logOutModal from "@/components/modal/logOutModal.vue";
import campaignAnalysisModal from "@/components/modal/campaignAnalysisModal.vue";
import pdfCampaignAnalysis from "@/components/pdf/pdfCampaignAnalysis.vue";
import mheader from "@/components/layout/m/header.vue";
import mfooter from "@/components/layout/m/footer.vue";
import mbigMenu2 from "@/components/layout/m/bigMenu2.vue";
import mdateRangePicker from "@/components/common/m/dateRangePicker.vue";
import mbalance from "@/components/common/m/balance.vue";
import mfmenu from "@/components/common/m/fMenu.vue";
import malarm from "@/components/common/m/alarm.vue";
import mdashboardEdit from "@/components/common/m/dashboardEdit.vue";
import campaignPdf from "@/components/campaignAnalysis/campaignPdf.vue";
export default {
  data() {
    return {
      start: store.state.dateStore.start,
      end: store.state.dateStore.end,
      datas: [],
      responseData: null,
      media: "naver",
      activeMedia: { naver: true, kakaosa: false, kakaomo: false, naverda: false, google: false, type: "media", media: "naver", },
      activeBtn: { period: "", periodUnit: "day", },
      activeKpi: { cst: true, im: true, clk: false, cv: false, },
      kpi: {
        clk: { visible: false, check: true }, //클릭수
        im: { visible: false, check: true }, //노출수
        cst: { visible: false, check: true }, //광고비
        cv: { visible: true, check: false }, //전환수
        cr: { visible: true, check: false }, //전환매출
        ctr: { visible: false, check: true }, //클릭률
        cpc: { visible: false, check: true }, //클릭 당 비용
        cpa: { visible: true, check: false }, //전환 당 비용
        cvr: { visible: true, check: false }, //전환율
        roas: { visible: true, check: false }, //ROAS
      },
      datas: [],
      total: [],
      total2: [],
      graphDatas: [],
      headerSet: {
        common: {
          header: [ { key: "clk", name: "클릭수" }, { key: "im", name: "노출수" }, { key: "cst", name: "광고비" }, { key: "cv", name: "전환수" }, { key: "cr", name: "전환매출" },
          { key: "ctr", name: "클릭률" }, { key: "cpc", name: "클릭당비용" }, { key: "cpa", name: "전환당비용" }, { key: "cvr", name: "전환율" }, { key: "roas", name: "ROAS" }],
        },
        naver: {
          header: [
            { key: "campaign", name: "캠페인" },
            { key: "campaign_type", name: "타입", type: { web_site: "파워링크", shopping: "쇼핑검색", power_contents: "파워컨텐츠", brand_search: "브랜드검색", place: "플레이스", }, },
          ],
        },
        kakaosa: {
          header: [
            { key: "campaign", name: "캠페인" },
            { key: "campaign_type", name: "타입", type: { none: "-", }, },
          ],
        },
        kakaomo: {
          header: [
            { key: "campaign", name: "캠페인" },
            { key: "campaign_type", name: "타입", type: { talk_biz_board: "카카오톡비즈보드", display: "디스플레이", talk_channel: "카카오톡 채널", daum_shopping: "다음쇼핑", video: "동영상", sponsored_board: "스폰서드 보드", }, },
          ],
        },
        naverda: {
          header: [
            { key: "campaign", name: "캠페인" },
            { key: "campaign_type", name: "타입", type: { conversion: "웹사이트 전환", web_site_traffic: "인지도 및 트래픽", install_app: "앱 전환", watch_video: "동영상 조회", catalog: "카탈로그 판매", shopping: "쇼핑 프로모션", lead: "참여 유도", pmax: "ADVoost 쇼핑" }},
          ],
        },
        google: {
          header: [
            { key: "campaign", name: "캠페인"},
            { key: "campaign_type", name: "타입", type: { demand_gen: "디스커버리",display: "디스플레이",hotel: "호텔",local: "지역",local_services: "지역 서비스 광고",multi_channel: "다중 채널",performance_max: "실적 최대화", search: "검색",shopping: "쇼핑",smart: "스마트",
            travel: "여행",video: "동영상",unknown: "기타",unspecified: "미지정" }}
          ]
        },            
      },
      balance: [],
      accountlog: [],
      pdfKey: 0
    };
  },
  computed: {
    getDatas() { return this.datas; },
    getMedia(media) { return getMedia(this.media); },
  },
  components: {
    bigMenu2,logOutModal,balance,messageModal,linePeriodGraph,dateRangePicker,expireSessionModal,maskModal,campaignAnalysisModal,pdfCampaignAnalysis,
    Swiper,SwiperSlide,mheader,mfooter,mbigMenu2,mdateRangePicker,mbalance,mfmenu,malarm,mdashboardEdit,message,campaignPdf
  },
  mounted() {
    $(".main").removeClass("m-h-100");
    this.clickSearchBtn();
    this.getAccountLog();
  },
  methods: {
    click7Day() {
      this.$refs.fromdate.setDate(moment().subtract(7, "d").format("YYYY-MM-DD"));
      this.$refs.todate.setDate(moment().subtract(1, "d").format("YYYY-MM-DD"));
      this.clickSearchBtn();
    },
    clickSearchBtn() {
      var vm = this;
      var date = vm.$refs.dateRangePicker.getDate();
      vm.start = date.start;
      vm.end = date.end;

      vm.activeBtn.period = date.start + " ~ " + date.end;
      vm.findCampaignReport();
    },
    clickMedia(event, media) {
      var vm = this;
      var subdatas = document.querySelectorAll(".subdata");
      subdatas.forEach(function (subdata) { subdata.classList.remove("show"); });

      if (media) vm.media = media;

      vm.datas = [];
      vm.getTotal(vm.responseData, "media", vm.media);
      vm.getGraphDatas(vm.responseData, "media", vm.media);
    },
    clickKpiBtn(event, kpi) {
      var vm = this;
      vm.activeKpi[kpi] = !vm.activeKpi[kpi];

      vm.datas = [];
      vm.getTotal(vm.responseData, vm.activeMedia.type, vm.media);
      vm.getGraphDatas(vm.responseData, vm.activeMedia.type, vm.media);
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
        var options = { common: vm.headerSet.common, header: vm.headerSet[vm.media].header, headProps: "header", };
        // console.log(options);
        vm.exportExcel(vm.responseData, options);
      } else {
        // ajax 통신
      }
    },
    async clickPdf() {
      var date = this.$refs.dateRangePicker.getDate();
      var diff = moment(date.end).diff(moment(date.start), "days");
      var comparefromdate = moment(date.start).subtract(1 + Number(diff), "days").format("YYYY-MM-DD");
      var comparetodate = moment(date.start).subtract(1, "days").format("YYYY-MM-DD");      

      this.handleShowMask();
      await this.$refs.campaignPdf.initPDF({date: date, cdate: {start: comparefromdate, end: comparetodate}, media: this.media});
      var blob = await this.$refs.campaignPdf.generatePDF(); // 렌더링 완료 후 PDF 생성
      window.open(URL.createObjectURL(blob));
      this.pdfKey++;
      this.handleHideMask();
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
    clickCampaignAnalysisModal(campaignId) { this.$refs.campaignAnalysisModal.showModal(campaignId, this.media, this.start, this.end ); },
    handleLogOut() { this.$refs.logOutModal.showModal(); },
    handleExpireSession() { this.$refs.expireSessionModal.showModal(); },
    handleShowMask() { this.$refs.maskModal.showModal(); },
    handleHideMask() { this.$refs.maskModal.hideModal(); },  
    handleChangedBalance(data) {
      this.balance = [];
      this.balance = data.slice();
    },
    handleChangedDateRange(data) {
      this.$refs.dateRangePicker.setDate({ start: data.start, end: data.end, compare: false, });
      this.clickSearchBtn();
    },                  
    getMediaNew(media){return getMedia(media);},
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
    getMediaNew(media) { return getMedia(media);},
    getKpiName(k) {return getKpiName(k);},
    getType(type) { return getType(type); },
    getUuidv4() { return uuidv4(); },
    getUnit(k) { return getUnit(k); },  
    getObject(o) {
      let objs = [];
      var keys = Object.keys(o);
      for (let i = 0; i < keys.length; i++) { objs.push({k: keys[i],s: MEDIA_ANALYSIS_SORT[keys[i]],}); }
      objs.sort(function (a, b) { return a.s < b.s ? -1 : a.s > b.s ? 1 : 0; });
      return objs;
    }, 
    getGraphDatas(data, type, media) {
      var vm = this;
      var date = vm.$refs.dateRangePicker.getDate();
      var graphDatas = {};

      data.data.media[media]["day"]["graph"].forEach(function (graph) {
        graphDatas[graph.daily_dt] = {clk: graph.clk,im: graph.im,cst: graph.cst,cv: graph.cv,time: graph.daily_dt,};
      });

      vm.$refs.linePeriodGraph.setGraph(graphDatas, date.start, date.end);
      vm.$refs.linePeriodGraph2.setGraph(graphDatas, date.start, date.end);
    },
    getTotal(data, type, media) {
      var vm = this;
      var categorys = [];
      var totalDatas = vm.initDatas();
      var total = totalDatas["total"];

      totalDatas[media]["campaign_type"].forEach(function (campaign) { var keys = Object.keys(campaign); categorys.push(keys[0]); });
      categorys.forEach(function (category, index) {
        var datas = data.data.media[media]["group"][category];
        vm.datas.push({
          isMainData: true,
          campaign_id: category,
          campaign_type: category,
          campaign_name: totalDatas[media]["campaign_type"][index][category],
          clk: data.data.media[media]["total"][category]["clk"], //클릭수
          im: data.data.media[media]["total"][category]["im"], //노출수
          cv: data.data.media[media]["total"][category]["cv"], //전환수
          cr: data.data.media[media]["total"][category]["cr"], //전환매출
          cst: data.data.media[media]["total"][category]["cst"], //광고비
          ctr: data.data.media[media]["total"][category]["ctr"], //클릭률
          cpc: data.data.media[media]["total"][category]["cpc"], //클릭 당 비용
          cpa: data.data.media[media]["total"][category]["cpa"], //전환 당 비용
          cvr: data.data.media[media]["total"][category]["cvr"], //전환율
          roas: data.data.media[media]["total"][category]["roas"], //ROAS,
          campain: totalDatas[media]["campaign_type"][index]["class"],
          haschild: datas.length === 0 ? false : true,
        });

        datas.forEach(function (data, index2) {
          vm.datas.push({
            isMainData: false,
            isSubdata: true,
            campaign_id: data.campaign_id,
            campaign_type: data.campaign_type,
            campaign_name: data.campaign_name,
            clk: data.clk, //클릭수
            im: data.im, //노출수
            cv: data.cv, //전환수
            cr: data.cr, //전환매출
            cst: data.cst, //광고비
            ctr: parseFloat(data.ctr).toFixed(2), //클릭률
            cpc: parseFloat(data.cpc).toFixed(2), //클릭 당 비용
            cpa: parseFloat(data.cpa).toFixed(2), //전환 당 비용
            cvr: parseFloat(data.cvr).toFixed(2), //전환율
            roas: parseFloat(data.roas).toFixed(2), //ROAS,
            campain: totalDatas[media]["campaign_type"][index]["class"],
          });

          total.clk += parseFloat(data.clk);
          total.im += parseFloat(data.im);
          total.cv += parseFloat(data.cv);
          total.cr += parseFloat(data.cr);
          total.cst += parseFloat(data.cst);
          total.ctr = parseFloat(total.clk > 0 && total.im > 0 ? (total.clk / total.im) * 100 : 0).toFixed(2);
          total.cpc = parseFloat(total.cst > 0 && total.clk > 0 ? total.cst / total.clk : 0).toFixed(2);
          total.cpa = parseFloat(total.cst > 0 && total.cv > 0 ? total.cst / total.cv : 0).toFixed(2);
          total.cvr = parseFloat(total.cv > 0 && total.clk > 0 ? (total.cv / total.clk) * 100 : 0).toFixed(2);
          total.roas = parseFloat(total.cr > 0 && total.cst > 0 ? (total.cr / total.cst) * 100 : 0).toFixed(2);
        });
      });
      vm.total = [];
      vm.total.push(total);
      vm.total2 = [];
      vm.total2.push({
        "cp": {
          "clk": data.data.media[media]['cp']['cp']['clk'], 
          "im": data.data.media[media]['cp']['cp']['im'], 
          "cv": data.data.media[media]['cp']['cp']['cv'], 
          "cr": data.data.media[media]['cp']['cp']['cr'], 
          "cst": data.data.media[media]['cp']['cp']['cst'], 
          "ctr": data.data.media[media]['cp']['cp']['ctr'],  
          "cpc": data.data.media[media]['cp']['cp']['cpc'],  
          "cpa": data.data.media[media]['cp']['cp']['cpa'],   
          "cvr": data.data.media[media]['cp']['cp']['cvr'],    
          "roas": data.data.media[media]['cp']['cp']['roas'], 
        }, 
        "per": {
          "clk": data.data.media[media]['cp']['per']['clk'], 
          "im": data.data.media[media]['cp']['per']['im'], 
          "cv": data.data.media[media]['cp']['per']['cv'], 
          "cr": data.data.media[media]['cp']['per']['cr'], 
          "cst": data.data.media[media]['cp']['per']['cst'], 
          "ctr": data.data.media[media]['cp']['per']['ctr'],  
          "cpc": data.data.media[media]['cp']['per']['cpc'],  
          "cpa": data.data.media[media]['cp']['per']['cpa'],   
          "cvr": data.data.media[media]['cp']['per']['cvr'],    
          "roas": data.data.media[media]['cp']['per']['roas'],           
        }
      });
    },      
    activeMain(flag) {
      this.$emit("mountedMain", true);
      this.$emit("mountedDasyboad", true);
    },
    priceToString(salse) {
      if (salse === undefined) return "";
      return priceToString(salse);
    },
    initDatas() {
      return {
        naver: {
          campaign_type: [
            { web_site: "파워링크", items: [], class: "campain1" },
            { shopping: "쇼핑검색", items: [], class: "campain2" },
            { power_contents: "파워컨텐츠", items: [], class: "campain3" },
            { brand_search: "브랜드검색", items: [], class: "campain4" },
            { place: "플레이스", items: [], class: "campain5" },
          ],
        },
        kakaosa: { campaign_type: [{ none: "캠페인목록", items: [], class: "campain1" }] },
        kakaomo: {
          campaign_type: [
            { talk_biz_board: "카카오톡비즈보드", items: [], class: "campain1" },
            { display: "디스플레이", items: [], class: "campain2" },
            { talk_channel: "카카오톡 채널", items: [], class: "campain3" },
            { daum_shopping: "다음쇼핑", items: [], class: "campain4" },
            { video: "동영상", items: [], class: "campain5" },
            { sponsored_board: "스폰서드 보드", items: [], class: "campain6" },
          ],
        },
        naverda: {
          campaign_type: [
            { conversion: "웹사이트 전환", items: [], class: "campain1" },
            { web_site_traffic: "인지도 및 트래픽", items: [], class: "campain2" },
            { install_app: "앱 전환", items: [], class: "campain3" },
            { watch_video: "동영상 조회", items: [], class: "campain4" },
            { catalog: "카탈로그 판매", items: [], class: "campain5" },
            { shopping: "쇼핑 프로모션", items: [], class: "campain6" },
            { lead: "참여 유도", items: [], class: "campain7" },
            { pmax: "ADVoost 쇼핑", items: [], class: "campain8" },
          ],
        },
        google: {
          campaign_type: [
            { demand_gen: "디멘드젠 캠페인", items: [], class: "campain1" },
            { display: "디스플레이", items: [], class: "campain2" },
            { hotel: "호텔", items: [], class: "campain3" },
            { local: "지역", items: [], class: "campain4" },
            { local_services: "지역 서비스 광고", items: [], class: "campain5" },
            { multi_channel: "다중 채널", items: [], class: "campain6" },
            { performance_max: "실적 최대화", items: [], class: "campain7" },
            { search: "검색", items: [], class: "campain8" },
            { shopping: "쇼핑", items: [], class: "campain9" },
            { smart: "스마트", items: [], class: "campain10" },
            { travel: "여행", items: [], class: "campain11" },
            { video: "동영상", items: [], class: "campain12" },
            { unknown: "기타", items: [], class: "campain13" },            
            { unspecified: "미지정", items: [], class: "campain14" },                  
          ],
        },        
        total: { clk: 0, im: 0, cst: 0, cv: 0, cr: 0, ctr: 0, cpc: 0, cpa: 0, cvr: 0, roas: 0, },
      };
    },    
    findCampaignReport() {
      var vm = this;
      var date = vm.$refs.dateRangePicker.getDate();
      var diff = moment(date.end).diff(moment(date.start), "days");
      var comparefromdate = moment(date.start).subtract(1 + Number(diff), "days").format("YYYY-MM-DD");
      var comparetodate = moment(date.start).subtract(1, "days").format("YYYY-MM-DD");      
      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/campaignreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {userid: store.state.userStore.userinfo.userid,fromdate: date.start,todate: date.end,comparefromdate: comparefromdate,comparetodate: comparetodate,session: store.state.userStore.session,},
        beforeSend: function (data) { vm.handleShowMask(); },
        success: function (data) {
          vm.datas = [];
          vm.responseData = {};

          if (data.result === "success") {
            var type = "media";
            var media = vm.media;
            vm.responseData = vm.copyObject(data);
            vm.getTotal(data, type, media);
            vm.getGraphDatas(data, type, media);
          } else {
            if (data.status === "0001") { vm.handleExpireSession(); } else { }
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
        complete: function (a, b, c) { vm.handleHideMask(); },
      });
    },    
    exportExcel(data, options) {
      var vm = this;
      var headProps = [];
      var type = vm.headerSet[vm.media].header.filter(function (header) {
        return header.key === "campaign_type";
      })[0].type;

      if (Array.isArray(options.headProps)) {
        headProps = options.headProps;
      } else if (options.headProps === "header") {
        for (var h of vm.headerSet[vm.media].header) {
          headProps.push(h.key);
        }
        for (var c of vm.headerSet.common.header) {
          headProps.push(c.key);
        }
      } else {
        headProps = Object.keys(data[0]);
      }

      this.visibleHeadProps = headProps;
      this.instance = document.createElement("table");

      // Header 세팅
      var rows = [];
      if (!Array.isArray(vm.headerSet[vm.media].header[0])) {
        rows.push(vm.headerSet[vm.media].header);
        for (var c of vm.headerSet.common.header) {
          rows[0].push(c);
        }
      } else {
        rows = vm.headerSet[vm.media].header;
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
      vm.datas
        .filter(function (data) {
          return data.isMainData === false;
        })
        .forEach(function (data, index) {
          var value = Object.assign({}, data);
          var campaign = data["campaign_name"];
          var campaign_type = type[data["campaign_type"]];
          value["media"] = getMedia(vm.media);
          value["campaign"] = campaign;
          value["campaign_type"] = campaign_type;

          excel.push(value);
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

      xlsx.utils.book_append_sheet(wb, ws, getMedia(vm.media));
      const wbout = xlsx.write(wb, { bookType: "xlsx", type: "array" });
      const url = window.URL.createObjectURL(
        new Blob([wbout], { type: "application/octet-stream" })
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = "campaign_report_"+moment().format("YYYYMMDDHHmmss")+".xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },    
    copyObject(object) {return JSON.parse(JSON.stringify(object));},         
  },
};
</script>

