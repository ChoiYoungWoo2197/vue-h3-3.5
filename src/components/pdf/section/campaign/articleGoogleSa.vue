<template>
  <div :class="getUniqueId">
    <template v-for="(index, i) in main.campaignAnalysis.pages[3].google.pdf.end" :key="index + i + '-' + getUuidv4()">
      <div  class="pdf-a4-l campaignAnalysis">
        <section class="d-flex pdf-card pdf-card-1">
          <div class="sub-title"> <h2>캠페인그룹분석 - 구글</h2> </div>
          <div class="d-flex justify-content-between">
            <div class="b-l"></div>
            <template v-if="report">
              <div> {{ report.reportInfo.start + " ~ " + report.reportInfo.end + "" }} </div>
            </template>
          </div>
        </section>
        <section class="d-flex pdf-card pdf-card-2 google">
          <div v-show="index === 1" class="row justify-content-between">
            <div class="col crossGraphCampaignOne d-flex justify-content-center">
              <div id="crossGraphCampaignOne" class="crossGraphCampaignOne"></div>
            </div>
            <div class="col crossGraphCampaignTwo d-flex justify-content-center">
              <div id="crossGraphCampaignTwo" class="crossGraphCampaignTwo"></div>
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
                <tr v-for="(data, index2) in getDatasForCampaign('google', 3, index)"
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
                <template v-if="index === main.campaignAnalysis.pages[3]['google'].pdf.end">
                  <tr v-for="data in main.campaignAnalysis.pages[3].google.total" :key="data.cst + 'L'" class="total bg-white" >
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
import { isBanner, clearBody, addClassDashboard, priceToString, getMedia, getApp, uuidv4, sortWeekDay, isEmptyObject, getDateStr2, downloadImage, toDataURL, sortDraggable, getKpiName } from "../../../../assets/js/common.js";
import { store } from "../../../../store/store.js";
import { SHA256 } from "../../../../assets/js/sha256.js";
import { API_URL, TEMP_KEY, SUMMARY_SORT, MEDIA_SORT, UNITS,} from "../../../../configs/config.js";
import "../../../../assets/css/pdf.total.main.css";
import noimg from "../../../../assets/image/noimg.png";

export default {
  props: {
    pReport: Object,
  },
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
            google: "구글",
          },
        },        
        start: 0, //현재 페이지
        display: 20, //게시글의 수 
        medias: ["naver", "kakaosa", "kakaomo", "google"],        
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
      for (let k = 0; k < keys.length; k++) {
        if (vm.report.activeMedia[keys[k]]) v++;
      }
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
        datas.forEach(function (data, index2) {
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

      data.data.media[media]["day"]["graph"].forEach(function (graph) { graphDatas[graph.daily_dt] = { clk: graph.clk, im: graph.im, cst: graph.cst, cv: graph.cv, time: graph.daily_dt, }; });
      return graphDatas;
    },    
    getDatasForCampaign(media, arrindex, index) {
      var vm = this;
      var arr = [];
      // console.log(media, arrindex, index, vm.campaignAnalysis.pages[arrindex][media]);

      var start = (index - 1) * vm.main.campaignAnalysis.pages[arrindex][media].pdf.d;
      var count = vm.main.campaignAnalysis.pages[arrindex][media].pdf.d;
      var spare = vm.main.campaignAnalysis.pages[arrindex][media].pdf.spare;

      if (index === 1) { count = spare; } 
      else if (index > 1) {
        start = index - 2 > 0 ? vm.main.campaignAnalysis.pages[arrindex][media].pdf.spare + vm.main.campaignAnalysis.pages[arrindex][media].pdf.d * (index - 2) : vm.main.campaignAnalysis.pages[arrindex][media].pdf.spare;
      }

      for (let i = 0; i < count; i++) {
        if (!vm.main.campaignAnalysis.pages[arrindex][media].report) continue;
        if (!vm.main.campaignAnalysis.pages[arrindex][media].report.at(start + i)) continue;
        arr.push(vm.main.campaignAnalysis.pages[arrindex][media].report.at(start + i));
      }
      return arr;
    },    
    getDatasForCampaignTotal(index) {
      var vm = this;
      var arr = [];
      var start = (index - 1) * vm.main.campaignAnalysis.total[0].total.pdf.d;
      var count = vm.main.campaignAnalysis.total[0].total.pdf.d;
      var spare = vm.main.campaignAnalysis.total[0].total.pdf.spare;

      if (index === 1) { count = spare; } 
      else if (index > 1) {
        start = index - 2 > 0 ? vm.main.campaignAnalysis.total[0].total.pdf.spare + vm.main.campaignAnalysis.total[0].total.pdf.d * (index - 2) : vm.main.campaignAnalysis.total[0].total.pdf.spare;
      }

      for (let i = 0; i < count; i++) {
        if (!vm.main.campaignAnalysis.total[0].total.report) continue;
        if (!vm.main.campaignAnalysis.total[0].total.report.at(start + i)) continue;
        arr.push(vm.main.campaignAnalysis.total[0].total.report.at(start + i));
      }
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
                var type = media === "kakaomo" ? "dsp" : "sa";
                let values = { cst: [], cv: [], clk: [], im: [] };
                vm.getTotalForCampaignAnalysis(data, type, media, index);
                var graphDatas = vm.getGraphDatasForCampaignAnalysis(data,type,media,index);
                obj2[media] = graphDatas;
                Object.keys(graphDatas).forEach(function (date, index) {
                  values.cst.push(graphDatas[date].cst);
                  values.cv.push(graphDatas[date].cv);      
                  values.clk.push(graphDatas[date].clk);
                  values.im.push(graphDatas[date].im);
                });  

                var length = vm.main.campaignAnalysis.pages[index][media].report.length - vm.main.campaignAnalysis.pages[index][media].pdf.spare;
                vm.main.campaignAnalysis.pages[index][media].pdf.end = Math.floor( length / vm.main.campaignAnalysis.pages[index][media].pdf.d );
                var n = length % vm.main.campaignAnalysis.pages[index][media].pdf.d;
                if (vm.main.campaignAnalysis.pages[index][media].pdf.end <= 0)
                  vm.main.campaignAnalysis.pages[index][media].pdf.end += 1;
                else if (n > 0) vm.main.campaignAnalysis.pages[index][media].pdf.end += 1;

                vm.main.campaignAnalysis.pages[index][media].pdf.end += 1; //12개용 페이지 추가
                Object.keys(vm.main.campaignAnalysis.pages[index][media].graph).forEach(
                  function (graph, index2) {
                    if (vm.main.campaignAnalysis.pages[index][media].graph[graph])
                      vm.main.campaignAnalysis.pages[index][media].graph[graph].dispose();
   
                    vm.$nextTick(function () {
                      // console.log(vm.report.activePage.campaignAnalysis, vm.report.activeMedia[media]);
                      if(document.querySelector(".campaignAnalysis " + " ." + media + " #" + graph)) {
                        vm.main.campaignAnalysis.pages[index][media].graph[graph] = echarts.init(document.querySelector(".campaignAnalysis " + " ." + media + " #" + graph));
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
                          xAxis: [ { type: "category", data: periods, axisPointer: { type: "shadow" }, axisLabel: { fontSize: "12" }, }, ],
                          yAxis: [
                            { type: "value", name: !index2 ? "노출수" : "광고비", axisLabel: { formatter: "{value}" }, axisLabel: { fontSize: "12" }, },
                            { type: "value", name: !index2 ? "클릭수" : "전환수", axisLabel: { formatter: "{value}" }, axisLabel: { fontSize: "12" }, },
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
                        vm.main.campaignAnalysis.pages[index][media].graph[graph].setOption(option);
                        vm.main.campaignAnalysis.pages[index][media].graph[graph].on("finished", function () { vm.$emit("finished", {graph: graph + media, status: true}); });
                      }
                    });
                  }
                );
            }});
            if (isData) {
              vm.main.campaignAnalysis.total[0].total.report = [];
              if (vm.isOneMedia()) {
                vm.$emit('rendering', {graph: 'crossGraphCampaignTotalOne', status: true});
                vm.$emit('rendering', {graph: 'crossGraphCampaignTotalTwo', status: true});
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
