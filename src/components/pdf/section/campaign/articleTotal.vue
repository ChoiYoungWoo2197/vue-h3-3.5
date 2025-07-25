<template>
  <div :class="getUniqueId">
    <template v-for="(index, i) in main.campaignAnalysis.total[0].total.pdf.end" :key="index + i + '-' + getUuidv4()">
      <div  class="pdf-a4-l campaignAnalysis">
        <section class="d-flex pdf-card pdf-card-1">
          <div class="sub-title"> <h2>{{ "캠페인그룹분석" + " - " + "전체" }}</h2> </div>
          <div class="d-flex justify-content-between">
            <div class="b-l"></div>
            <template v-if="report">
              <div> {{ report.reportInfo.start + " ~ " + report.reportInfo.end + "" }} </div>
            </template>
          </div>
        </section>
        <section class="d-flex pdf-card pdf-card-2 naver">
          <div v-show="index === 1" class="row justify-content-between">
            <div class="col crossGraphCampaignTotalOne d-flex justify-content-center">
              <div id="crossGraphCampaignTotalOne" class="crossGraphCampaignTotalOne" ></div>
            </div>
            <div class="col crossGraphCampaignTotalTwo d-flex justify-content-center">
              <div id="crossGraphCampaignTotalTwo" class="crossGraphCampaignTotalTwo" ></div>
            </div>
          </div>
          <div class="report">
            <table class="report">
              <thead>
                <tr>
                  <td width="25%" class="text-center">캠페인 (광고그룹목록)</td>
                  <template v-for="(k, i) in Object.keys(sortDraggable())">
                    <td :key="k+i+getUuidv4()" v-if="report.activeBtn[k]" class="text-center">{{getKpiName(k)}}</td>
                  </template>
                </tr>
              </thead>
              <tbody v-if="main.campaignAnalysis.responseData !== null">
                <tr v-for="(data, index2) in getDatasForCampaignTotal(index)"
                  :key="data.cst + '-' + index2"
                  :class=" data.isMainData === true ? ['maindata', 'collapsed'] : ['subdata', 'show', 'collapse', data.campain] "
                  :data-toggle="data.isMainData === true ? '' : ''"
                  :data-target="data.isMainData === true ? '.' + data.campain : ''"
                  :aria-expanded="data.isMainData === true ? 'false' : ''" >
                  <template v-if="data.isMainData === true">
                    <td :class=" data.haschild === true ? ['text-left fold-btn'] : ['text-left'] " > {{ data.campaign_name }} </td>
                  </template>
                  <template v-else>
                    <td class="text-left"> {{ data.campaign_name }} </td>
                  </template>
                  <template v-for="(k,i) in Object.keys(sortDraggable())">
                    <td :key="k + i + getUuidv4()" v-if="report.activeBtn[k]">{{priceToString(data[k]) + getUnits(k)}}</td>
                  </template>   
                </tr>
                <template v-if="index === main.campaignAnalysis.total[0].total.pdf.end">
                  <tr v-for="data in main.campaignAnalysis.total[0].total.total" :key="data.cst + 'L'" class="total bg-white" >
                    <td class="text-left">총 합계</td>
                    <template v-for="(k,i) in Object.keys(sortDraggable())">
                      <td :key="k + i + getUuidv4()" v-if="report.activeBtn[k]">{{priceToString(data[k]) + getUnits(k)}}</td>
                    </template>                    
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </section>
        <section class="d-flex pdf-card pdf-card-3">
          <div class="footer">
            <div class="d-flex justify-content-between">
              <img alt="" src="@/assets/image/pdf_logo.png" height="35" />
              <div></div>
            </div>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>

<script>
import $ from "jquery";
import moment from "moment";
import * as echarts from "echarts";
import { isBanner, clearBody, addClassDashboard, priceToString, getMedia, getApp, uuidv4, sortWeekDay, isEmptyObject, getDateStr2, downloadImage, toDataURL, sortDraggable, getKpiName } from "@/assets/js/common.js";
import { store } from "@/store/store.js";
import { SHA256 } from "@/assets/js/sha256.js";
import { API_URL, TEMP_KEY, SUMMARY_SORT, MEDIA_SORT, UNITS,} from "@/configs/config.js";
import "@/assets/css/pdf.total.main.css";
import noimg from "@/assets/image/noimg.png";

export default {
  props: { pReport: Object, },
  data() {
    return {
      // mediaAnalysis: this.copyObject(this.pMediaAnalysis),
      report: this.copyObject(this.pReport),
      main: {
        campaignAnalysis: {
          pages: [
            {
              naver: {
                graph: { crossGraphCampaignOne: null, crossGraphCampaignTwo: null },
                report: [],
                total: [],
                pdf: { d: 30, start: 0, end: 0, spare: 20 },
              },
            },
            {
              kakaosa: {
                graph: { crossGraphCampaignOne: null, crossGraphCampaignTwo: null },
                report: [],
                total: [],
                pdf: { d: 30, start: 0, end: 0, spare: 20 },
              },
            },
            {
              kakaomo: {
                graph: { crossGraphCampaignOne: null, crossGraphCampaignTwo: null },
                report: [],
                total: [],
                pdf: { d: 30, start: 0, end: 0, spare: 20 },
              },
            },
            {
              naverda: {
                graph: { crossGraphCampaignOne: null, crossGraphCampaignTwo: null },
                report: [],
                total: [],
                pdf: { d: 30, start: 0, end: 0, spare: 20 },
              },
            },    
            {
              google: {
                graph: { crossGraphCampaignOne: null, crossGraphCampaignTwo: null },
                report: [],
                total: [],
                pdf: { d: 30, start: 0, end: 0, spare: 20 },
              },
            },                      
          ],
          responseData: null,
          periodUnit: null,
          media: null,
          datas: [],
          total: [
            {
              total: {
                graph: {
                  crossGraphCampaignTotalOne: null,
                  crossGraphCampaignTotalTwo: null,
                },
                report: [],
                total: [],
                pdf: { d: 30, start: 0, end: 0, spare: 20 },
              },
            },
          ],
          graphDatas: [],
          update: false,
          pdf: {
            d: 20,
            start: 0,
            end: 0,
            spare: 15,
          },
          mediaSet: {
            naver: "네이버 검색광고",
            kakaosa: "카카오 검색광고",
            kakaomo: "카카오 모먼트",
            naverda: "GFA",
            google: "구글",
          },
        },        
        start: 0, //현재 페이지
        display: 20, //게시글의 수 
        medias: ["naver", "kakaosa", "kakaomo", "naverda", "google"],        
      },
      pdf: {
        search: { d: 15, start: 0, end: 0, spare: 5 },
        banner: { d: 15, start: 0, end: 0, spare: 12 },
      }, 
          
    };
  },
  created() {
    this.setCampaignAnalysis();
    this.getReport();
  },
  mounted() {
    // this.report = this.copyObject(this.pReport);
  },
  watch: {
    pMediaAnalysis: {
      deep: true,
      handler(value) {
        this.mediaAnalysis = this.copyObject(value);
      },
    },
    pReport: {
      deep: true,
      handler(value) {
        this.report = this.copyObject(value);
      },
    },
  },
  computed: {
    getUniqueId() {
      if (!this.uniqueId) {
        this.uniqueId = "vm-modal-" + this._uid;
        return this.uniqueId;
      }
      return this.uniqueId;
    },
    getMedia(media) {
      return (media) => getMedia(media);
    },    
  },
  methods: {
    sortDraggable() { return sortDraggable(this.report.draggable); },
    getKpiName(kpi) { return getKpiName(kpi); },         
    copyObject(object) { return Object.assign({}, object); },
    isEmptyObject(obj) { return isEmptyObject(obj); },
    priceToString(salse) {
      if (salse === undefined) return "";
      return priceToString(salse);
    },
    getUuidv4() { return uuidv4(); },
    getUnits(unit) { return UNITS[unit]; }, 
    handleNoImg(e) { e.target.src = noimg; },    
    getSum(arr) {
      var result = arr.reduce(function add(sum, currValue) { return parseFloat(sum) + parseFloat(currValue); }, 0);
      return result;
    },  
    isOneMedia() {
      let vm = this;
      let v = 0;
      var keys = Object.keys(vm.report.activeMedia);
      for (let k = 0; k < keys.length; k++) { if (vm.report.activeMedia[keys[k]]) v++; }
      return v === 1 ? true : false;
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
        kakaosa: {
          campaign_type: [{ none: "캠페인목록", items: [], class: "campain1" }],
        },
        kakaomo: {
          campaign_type: [
            {
              talk_biz_board: "카카오톡비즈보드",
              items: [],
              class: "campain1",
            },
            { display: "디스플레이", items: [], class: "campain2" },
            { talk_channel: "카카오톡 채널", items: [], class: "campain3" },
            { daum_shopping: "다음쇼핑", items: [], class: "campain4" },
            { video: "동영상", items: [], class: "campain5" },
            { sponsored_board: "스폰서드 보드", items: [], class: "campain6" },
          ],
        },
        naverda: {
          campaign_type: [
            { conversion: "웹사이트 전환", items: [], class: "campain1"},
            { web_site_traffic: "인지도 및 트래픽", items: [], class: "campain2" },
            { install_app: "앱 설치", items: [], class: "campain3" },
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
        total: {
          clk: 0, //클릭수
          im: 0, //노출수
          cst: 0, //광고비
          cv: 0, //전환수
          cr: 0, //전환매출
          ctr: 0, //클릭률
          cpc: 0, //클릭 당 비용
          cpa: 0, //전환 당 비용
          cvr: 0, //전환율
          roas: 0, //ROAS
        },
      };
    },    
    getTotalForCampaignAnalysis(data, type, media, index) {
      var vm = this;
      var report = [];
      var categorys = [];
      var totalDatas = vm.initDatas();
      var total = totalDatas["total"];

      totalDatas[media]["campaign_type"].forEach(function (campaign) {
        var keys = Object.keys(campaign);
        categorys.push(keys[0]);
      });

      // vm.campaignAnalysis.pages[index][media].report = [];
      categorys.forEach(function (category, index) {
        //isMainData : true
        var datas = data.data.media[media]["group"][category];
        var count = 0;
        report.push({
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

        // isMainData : false

        datas.forEach(function (data, index2) {
          // if (data.im <= 0) return;
          // if (count > 7) return;
          report.push({
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
            cpc: parseFloat(data.cpc).toFixed(0), //클릭 당 비용
            cpa: parseFloat(data.cpa).toFixed(0), //전환 당 비용
            cvr: parseFloat(data.cvr).toFixed(2), //전환율
            roas: parseFloat(data.roas).toFixed(0), //ROAS,
            campain: totalDatas[media]["campaign_type"][index]["class"],
          });

          total.clk += parseFloat(data.clk);
          total.im += parseFloat(data.im);
          total.cv += parseFloat(data.cv);
          total.cr += parseFloat(data.cr);
          total.cst += parseFloat(data.cst);
          total.ctr = parseFloat( total.clk > 0 && total.im > 0 ? (total.clk / total.im) * 100 : 0 ).toFixed(2);
          total.cpc = parseFloat( total.cst > 0 && total.clk > 0 ? total.cst / total.clk : 0 ).toFixed(0);
          total.cpa = parseFloat( total.cst > 0 && total.cv > 0 ? total.cst / total.cv : 0 ).toFixed(0);
          total.cvr = parseFloat( total.cv > 0 && total.clk > 0 ? (total.cv / total.clk) * 100 : 0 ).toFixed(2);
          total.roas = parseFloat( total.cr > 0 && total.cst > 0 ? (total.cr / total.cst) * 100 : 0 ).toFixed(0);
          count += 1;
        });
      });

      vm.main.campaignAnalysis.pages[index][media].report = [];
      vm.main.campaignAnalysis.pages[index][media].report = report.slice();
      vm.main.campaignAnalysis.pages[index][media].total = [];
      vm.main.campaignAnalysis.pages[index][media].total.push(total);
    },   
    getGraphDatasForCampaignAnalysis(data, type, media, index) {
      var vm = this;
      var graphDatas = {};

      data.data.media[media]["day"]["graph"].forEach(function (graph) {
        graphDatas[graph.daily_dt] = { clk: graph.clk, im: graph.im, cst: graph.cst, cv: graph.cv, time: graph.daily_dt, };
      });

      return graphDatas;
    },    
    getDatasForCampaignTotal(index) {
      var vm = this;
      var arr = [];
      // console.log(media, arrindex, index, vm.campaignAnalysis.pages[arrindex][media]);

      var start = (index - 1) * vm.main.campaignAnalysis.total[0].total.pdf.d;
      var count = vm.main.campaignAnalysis.total[0].total.pdf.d;
      var spare = vm.main.campaignAnalysis.total[0].total.pdf.spare;

      if (index === 1) {
        count = spare;
      } else if (index > 1) {
        start = index - 2 > 0 ? vm.main.campaignAnalysis.total[0].total.pdf.spare + vm.main.campaignAnalysis.total[0].total.pdf.d * (index - 2) : vm.main.campaignAnalysis.total[0].total.pdf.spare;
      }

      for (let i = 0; i < count; i++) {
        if (!vm.main.campaignAnalysis.total[0].total.report) continue;
        if (!vm.main.campaignAnalysis.total[0].total.report.at(start + i)) continue;

        arr.push(vm.main.campaignAnalysis.total[0].total.report.at(start + i));
      }
      // console.log(index, arr);
      return arr;
    },    
    setCampaignAnalysis() {
      var vm = this;
      vm.main.campaignAnalysis.datas = [];
      vm.main.campaignAnalysis.responseData = {};
    },        
    getReport() {
      let vm = this;
      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/campaignreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: vm.report.reportInfo.start,
          todate: vm.report.reportInfo.end,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {},
        success: function (data) {
          if (data.result === "success") {
            // console.log(campaignreport);
            var isData = false;
            var type = "media";
            var obj2 = {};
            var obj3 = { clk: {}, cr: {}, cst: {}, cv: {}, im: {} };
            let periods = [];
            var diff = moment(vm.report.reportInfo.end).diff(moment(vm.report.reportInfo.start),"days");
            for (var i = 1; i <= diff; i++) { periods.push(moment(vm.report.reportInfo.end).subtract(i, "days").format("YYYY-MM-DD"));}
            periods.reverse().push(vm.report.reportInfo.end);

            vm.main.campaignAnalysis.responseData = data;
            vm.main.medias.forEach(function (media, index) { 
              if (vm.report.activePage.campaignAnalysis && vm.report.activeMedia[media]) { 
                isData = true;
                var media = media;
                var type = isBanner(media) ? "dsp" : "sa";
                var values = { cst: [], cv: [], clk: [], im: [] };
                vm.getTotalForCampaignAnalysis(data, type, media, index);
                var graphDatas = vm.getGraphDatasForCampaignAnalysis(data,type,media,index);
                obj2[media] = graphDatas;
                Object.keys(graphDatas).forEach(function (date, index) {
                  values.cst.push(graphDatas[date].cst);
                  values.cv.push(graphDatas[date].cv);
                  values.clk.push(graphDatas[date].clk);
                  values.im.push(graphDatas[date].im);
                });                

            }});

            if (isData) {
              vm.main.campaignAnalysis.total[0].total.report = [];
              if (vm.isOneMedia()) {
              } else {
                vm.main.medias.forEach(function (media, index) {
                  if (vm.report.activePage.campaignAnalysis && vm.report.activeMedia[media]) {
                    var media = media;
                    var type = isBanner(media) ? "dsp" : "sa";
                    vm.main.campaignAnalysis.total[0].total.report.push(...vm.main.campaignAnalysis.pages[index][media].report.slice());

                    Object.keys(obj2[media]).forEach(function (date, index2) {
                      ["clk", "cst", "cv", "im"].forEach(function (kpi, index4) {
                        if (!obj3[kpi][date]) obj3[kpi][date] = [];

                        var v;
                        typeof obj2[media][date][kpi] === "string" ? (v = obj2[media][date][kpi].replace(",", "")) : (v = obj2[media][date][kpi]);
                        obj3[kpi][date].push(v);
                      });
                    });
                  }
                });

                var values = { clk: [], cr: [], cst: [], cv: [], im: [] };
                var obj = vm.main.campaignAnalysis.total[0].total.report.filter(function (e) { return e.isMainData; });
                Object.keys(obj).forEach(function (i, index) {
                  values.cst.push(obj[i].cst);
                  values.cv.push(obj[i].cv);
                  values.clk.push(obj[i].clk);
                  values.im.push(obj[i].im);
                  values.cr.push(obj[i].cr);
                });

                vm.main.campaignAnalysis.total[0].total.total = [];
                vm.main.campaignAnalysis.total[0].total.total.push({
                  clk: vm.getSum(values.clk),
                  cr: vm.getSum(values.cr),
                  cst: vm.getSum(values.cst),
                  cv: vm.getSum(values.cv),
                  im: vm.getSum(values.im),
                  ctr: vm.getSum(values.clk) > 0 && vm.getSum(values.im) > 0 ? ((vm.getSum(values.clk) / vm.getSum(values.im)) * 100).toFixed(2) : 0,          
                  cpc: vm.getSum(values.cst) > 0 && vm.getSum(values.clk) > 0 ? (vm.getSum(values.cst) / vm.getSum(values.clk)).toFixed(0) : 0,
                  cpa: vm.getSum(values.cst) > 0 && vm.getSum(values.cv) > 0 ? (vm.getSum(values.cst) / vm.getSum(values.cv)).toFixed(0) : 0,
                  cvr: vm.getSum(values.cv) > 0 && vm.getSum(values.clk) > 0 ? ((vm.getSum(values.cv) / vm.getSum(values.clk)) * 100).toFixed(2) : 0,
                  roas: vm.getSum(values.cr) > 0 && vm.getSum(values.cst) > 0 ? ((vm.getSum(values.cr) / vm.getSum(values.cst)) * 100).toFixed(0) : 0,
                });

                var length = vm.main.campaignAnalysis.total[0].total.report.length - vm.main.campaignAnalysis.total[0].total.pdf.spare;
                vm.main.campaignAnalysis.total[0].total.pdf.end = Math.floor(length / vm.main.campaignAnalysis.total[0].total.pdf.d);
                var n = length % vm.main.campaignAnalysis.total[0].total.pdf.d;
                if (vm.main.campaignAnalysis.total[0].total.pdf.end <= 0) vm.main.campaignAnalysis.total[0].total.pdf.end += 1;
                else if (n > 0) vm.main.campaignAnalysis.total[0].total.pdf.end += 1;
                vm.main.campaignAnalysis.total[0].total.pdf.end += 1; //12개용 페이지 추가

                var values = { cst: [], cv: [], clk: [], im: [] };
                Object.keys(values).forEach(function (kpi, index) {
                  Object.keys(obj3[kpi]).forEach(function (date, index2) {
                    values[kpi].push(vm.getSum(obj3[kpi][date]));
                  });
                });

                Object.keys(vm.main.campaignAnalysis.total[0].total.graph).forEach(
                  function (graph, index2) {
                    if (vm.main.campaignAnalysis.total[0].total.graph[graph])
                      vm.main.campaignAnalysis.total[0].total.graph[graph].dispose();

                    vm.$nextTick(function () {
                      if(document.querySelector(".campaignAnalysis " + " ." + "naver" + " #" + graph)) {
                        vm.main.campaignAnalysis.total[0].total.graph[graph] = echarts.init(document.querySelector(".campaignAnalysis " + " ." + "naver" + " #" + graph));
                        var option = {
                          color: ["#1795F0", "#6664DA", "#4EDF9F", "#4DC6DF"],
                          tooltip: { trigger: "axis", axisPointer: { type: "cross", crossStyle: { color: "#999" }, }, },
                          toolbox: { feature: {} },
                          grid: { width: "80%", height: "auto" },
                          legend: {
                            show: true,
                            data: !index2 ? ["노출수", "클릭수"] : ["광고비", "전환수"],
                            top: "93%",
                            left: "center",
                            orient: "horizontal",
                            textStyle: { fontSize: "12", fontWeight: "normal" },
                          },
                          xAxis: [
                            {
                              type: "category",
                              data: periods,
                              axisPointer: { type: "shadow" },
                              axisLabel: { fontSize: "12" },
                            },
                          ],
                          yAxis: [
                            {
                              type: "value",
                              name: !index2 ? "노출수" : "광고비",
                              axisLabel: { formatter: "{value}" },
                              axisLabel: { fontSize: "12" },
                            },
                            {
                              type: "value",
                              name: !index2 ? "클릭수" : "전환수",
                              axisLabel: { formatter: "{value}" },
                              axisLabel: { fontSize: "12" },
                            },
                          ],
                          series: [
                            {
                              name: !index2 ? "노출수" : "광고비",
                              type: "bar",
                              tooltip: { valueFormatter: function (value) { return value; }, },
                              data: !index2 ? values.im : values.cst,
                              label: {
                                show: false,
                                position: "top",
                                textStyle: { fontSize: "12", fontWeight: "bold" },
                                formatter: function (value) { return priceToString(value.value); },
                              },
                              barWidth: 20,
                            },
                            {
                              name: !index2 ? "클릭수" : "전환수",
                              type: "line",
                              yAxisIndex: 1,
                              tooltip: { valueFormatter: function (value) { return value; }, },
                              data: !index2 ? values.clk : values.cv,
                            },
                          ],
                        };
                        vm.main.campaignAnalysis.total[0].total.graph[graph].setOption(option);
                        vm.main.campaignAnalysis.total[0].total.graph[graph].on("finished", function () { vm.$emit("finished", {graph: graph, status: true});});
                      }
                    });
                  }
                );
              }
            }
          } else {
          }
        },
        error: function (a, b, c) {},
        complete: function (a, b, c) {
          
        },
      });      
    }
  },
};
</script>

<style scoped></style>

