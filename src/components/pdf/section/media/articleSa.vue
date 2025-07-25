<template>
  <div :class="getUniqueId" class="pdf-a4-l mediaAnalysis">
    <section class="d-flex pdf-card pdf-card-1">
      <div class="sub-title">
        <h2>
          {{ "매체별 리포트" + " - " }}
          <span v-if="report.activeMedia.naver && report.activeMedia.kakaosa && report.activeMedia.google">
            {{ "검색광고(네이버, 카카오, 구글)" }}</span
          >
          <span v-else-if="report.activeMedia.naver">{{ "네이버 검색광고" }}</span>
          <span v-else-if="report.activeMedia.kakaosa">{{ "카카오 검색광고" }}</span>
          <span v-else-if="report.activeMedia.google">{{ "구글" }}</span>
        </h2>
      </div>
      <div class="d-flex justify-content-between">
        <div class="b-l"></div>
        <template v-if="report">
          <div>
            {{ report.reportInfo.start + " ~ " + report.reportInfo.end + "" }}
          </div>
        </template>
      </div>
    </section>
    <template v-if="report.activeMedia.naver">
      <section class="d-flex pdf-card pdf-card-2 naver">
        <div class="row justify-content-between">
          <div class="col crossGraphMediaOne d-flex justify-content-center">
            <div id="crossGraphMediaOne" class="crossGraphMediaOne"></div>
          </div>
          <div class="col crossGraphMediaTwo d-flex justify-content-center">
            <div id="crossGraphMediaTwo" class="crossGraphMediaTwo"></div>
          </div>
        </div>
        <div class="report" v-if="main.mediaAnalysis.responseData !== null">
          <table>
            <thead>
              <tr>
                <td width="25%" class="text-center">매체별</td>
                <template v-for="(k, i) in Object.keys(sortDraggable())">
                  <td :key="k+i+getUuidv4()" v-if="report.activeBtn[k]" class="text-center">{{getKpiName(k)}}</td>
                </template>
              </tr>
            </thead>
            <tbody>
              <tr class="subdata">
                <td class="text-left">네이버 검색광고</td>
                <template v-for="(k,i) in Object.keys(sortDraggable())">
                  <td :key="k + i + getUuidv4()" v-if="report.activeBtn[k]">{{priceToString(main.mediaAnalysis.datas.sa.naver[k]) + getUnits(k)}}</td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>
    <template v-if="report.activeMedia.kakaosa" >
      <section class="d-flex pdf-card pdf-card-2 kakaosa">
        <div class="row justify-content-between">
          <div class="col crossGraphMediaOne d-flex justify-content-center">
            <div id="crossGraphMediaOne" class="crossGraphMediaOne"></div>
          </div>
          <div class="col crossGraphMediaTwo d-flex justify-content-center">
            <div id="crossGraphMediaTwo" class="crossGraphMediaTwo"></div>
          </div>
        </div>
        <div class="report" v-if="main.mediaAnalysis.responseData !== null">
          <table>
            <thead>
              <tr>
                <td width="25%" class="text-center">매체별</td>
                <template v-for="(k, i) in Object.keys(sortDraggable())">
                  <td :key="k+i+getUuidv4()" v-if="report.activeBtn[k]" class="text-center">{{getKpiName(k)}}</td>
                </template>
              </tr>
            </thead>
            <tbody>
              <tr class="subdata">
                <td class="text-left">카카오 검색광고</td>
                <template v-for="(k,i) in Object.keys(sortDraggable())">
                  <td :key="k + i + getUuidv4()" v-if="report.activeBtn[k]">{{priceToString(main.mediaAnalysis.datas.sa.kakaosa[k]) + getUnits(k)}}</td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>
    <template v-if="report.activeMedia.google" >
      <section class="d-flex pdf-card pdf-card-2 google">
        <div class="row justify-content-between">
          <div class="col crossGraphMediaOne d-flex justify-content-center">
            <div id="crossGraphMediaOne" class="crossGraphMediaOne"></div>
          </div>
          <div class="col crossGraphMediaTwo d-flex justify-content-center">
            <div id="crossGraphMediaTwo" class="crossGraphMediaTwo"></div>
          </div>
        </div>
        <div class="report" v-if="main.mediaAnalysis.responseData !== null">
          <table>
            <thead>
              <tr>
                <td width="25%" class="text-center">매체별</td>
                <template v-for="(k, i) in Object.keys(sortDraggable())">
                  <td :key="k+i+getUuidv4()" v-if="report.activeBtn[k]" class="text-center">{{getKpiName(k)}}</td>
                </template>
              </tr>
            </thead>
            <tbody>
              <tr class="subdata">
                <td class="text-left">구글</td>
                <template v-for="(k,i) in Object.keys(sortDraggable())">
                  <td :key="k + i + getUuidv4()" v-if="report.activeBtn[k]">{{priceToString(main.mediaAnalysis.datas.sa.google[k]) + getUnits(k)}}</td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>    
    <section class="d-flex pdf-card pdf-card-3">
      <div class="footer">
        <div class="d-flex justify-content-between">
          <img alt="" src="@/assets/image/pdf_logo.png" height="35" />
          <!-- <div>{{ mediaAnalysis.page }}</div> -->
        </div>
      </div>
    </section>
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
  props: { pMediaAnalysis: Object, pReport: Object, },
  data() {
    return {
      // mediaAnalysis: this.copyObject(this.pMediaAnalysis),
      report: this.copyObject(this.pReport),
      main: {
        mediaAnalysis: {
          page: 1,
          pages: [
            {
              naver: {
                graph: { crossGraphMediaOne: null, crossGraphMediaTwo: null },
                report: {},
              },
            },
            {
              kakaosa: {
                graph: { crossGraphMediaOne: null, crossGraphMediaTwo: null },
                report: {},
              },
            },
            {
              kakaomo: {
                graph: { crossGraphMediaOne: null, crossGraphMediaTwo: null },
                report: {},
              },
            },
            {
              google: {
                graph: { crossGraphMediaOne: null, crossGraphMediaTwo: null },
                report: {},
              },
            },            
          ],
          total: [
            {
              total: {
                graph: { crossGraphMediaTotalOne: null, crossGraphMediaTotalTwo: null },
                report: [],
                pdf: { d: 30, start: 0, end: 0, spare: 20 },
              },
            },
          ],
          datas: {
            total: {},
            sa: {
              //검색광고
              total: {},
              naver: {},
              kakaosa: {},
              google: {},
            },
            dsp: {
              //배너광고
              total: {},
              kakaomo: {},
            },
          },
          graph: {
            crossGraphMediaOne: null,
            crossGraphMediaTwo: null,
          },
          responseData: null,
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
    this.setMediaAnalysis();
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
    sortDraggable() {
      return sortDraggable(this.report.draggable);
    },
    getKpiName(kpi) {
      return getKpiName(kpi);
    },       
    copyObject(object) {
      return Object.assign({}, object);
    },
    isEmptyObject(obj) {
      return isEmptyObject(obj);
    },
    priceToString(salse) {
      // console.log(salse, main.mediaAnalysis.datas.sa.kakaosa);
      if (salse === undefined) return "";

      return priceToString(salse);
    },
    priceByMedia(media, k) {
      let banner = isBanner(media);
      let v = banner ? this.priceToString(this.main.mediaAnalysis.datas.dsp[media][k]) : this.priceToString(this.main.mediaAnalysis.datas.sa[media][k]);
      return v.length ? v : 0;
    },
    getUuidv4() {
      return uuidv4();
    },
    getUnits(unit) {
      return UNITS[unit];
    }, 
    handleNoImg(e) {
      e.target.src = noimg;
    },    
    getSum(arr) {
      var result = arr.reduce(function add(sum, currValue) {
        return parseFloat(sum) + parseFloat(currValue);
      }, 0);

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
      var keysTotal = media === null ? Object.keys(data.data[type]) : Object.keys(data.data[type][media]);
      for (let i = 0; i < keysTotal.length; i++) {
        var obj = media === null ? data.data[type][keysTotal[i]] : data.data[type][media][keysTotal[i]];
        if (obj.length === 0) continue;
        clk.push(obj.clk);
        im.push(obj.im);
        cst.push(obj.cst);
        cv.push(obj.cv);
        cr.push(obj.cr);
      }

      if (!media) {
        vm.main.mediaAnalysis.datas[type].clk = vm.getSum(clk);
        vm.main.mediaAnalysis.datas[type].im = vm.getSum(im);
        vm.main.mediaAnalysis.datas[type].cst = vm.getSum(cst);
        vm.main.mediaAnalysis.datas[type].cv = vm.getSum(cv);
        vm.main.mediaAnalysis.datas[type].cr = vm.getSum(cr);
        vm.main.mediaAnalysis.datas[type].ctr = vm.main.mediaAnalysis.datas[type].clk > 0 && vm.main.mediaAnalysis.datas[type].im > 0 ? ((vm.main.mediaAnalysis.datas[type].clk / vm.main.mediaAnalysis.datas[type].im) * 100).toFixed(2) : 0;
        vm.main.mediaAnalysis.datas[type].cpc = vm.main.mediaAnalysis.datas[type].cst > 0 && vm.main.mediaAnalysis.datas[type].clk > 0 ? (vm.main.mediaAnalysis.datas[type].cst / vm.main.mediaAnalysis.datas[type].clk).toFixed(0) : 0;
        vm.main.mediaAnalysis.datas[type].cpa = vm.main.mediaAnalysis.datas[type].cst > 0 && vm.main.mediaAnalysis.datas[type].cv > 0 ? (vm.main.mediaAnalysis.datas[type].cst / vm.main.mediaAnalysis.datas[type].cv).toFixed(0) : 0;
        vm.main.mediaAnalysis.datas[type].cvr =
          vm.main.mediaAnalysis.datas[type].cv > 0 && vm.main.mediaAnalysis.datas[type].clk > 0
            ? ((vm.main.mediaAnalysis.datas[type].cv / vm.main.mediaAnalysis.datas[type].clk) * 100).toFixed(2) : 0;
        vm.main.mediaAnalysis.datas[type].roas =
          vm.main.mediaAnalysis.datas[type].cr > 0 && vm.main.mediaAnalysis.datas[type].cst > 0
            ? ((vm.main.mediaAnalysis.datas[type].cr / vm.main.mediaAnalysis.datas[type].cst) * 100).toFixed(0) : 0;
      } else {
        vm.main.mediaAnalysis.datas[type][media].clk = vm.getSum(clk);
        vm.main.mediaAnalysis.datas[type][media].im = vm.getSum(im);
        vm.main.mediaAnalysis.datas[type][media].cst = vm.getSum(cst);
        vm.main.mediaAnalysis.datas[type][media].cv = vm.getSum(cv);
        vm.main.mediaAnalysis.datas[type][media].cr = vm.getSum(cr);
        vm.main.mediaAnalysis.datas[type][media].ctr =
          vm.main.mediaAnalysis.datas[type][media].clk > 0 &&
          vm.main.mediaAnalysis.datas[type][media].im > 0
            ? (
                (vm.main.mediaAnalysis.datas[type][media].clk /
                  vm.main.mediaAnalysis.datas[type][media].im) *
                100
              ).toFixed(2)
            : 0;
        vm.main.mediaAnalysis.datas[type][media].cpc =
          vm.main.mediaAnalysis.datas[type][media].cst > 0 &&
          vm.main.mediaAnalysis.datas[type][media].clk > 0
            ? (
                vm.main.mediaAnalysis.datas[type][media].cst /
                vm.main.mediaAnalysis.datas[type][media].clk
              ).toFixed(0)
            : 0;
        vm.main.mediaAnalysis.datas[type][media].cpa =
          vm.main.mediaAnalysis.datas[type][media].cst > 0 &&
          vm.main.mediaAnalysis.datas[type][media].cv > 0
            ? (
                vm.main.mediaAnalysis.datas[type][media].cst /
                vm.main.mediaAnalysis.datas[type][media].cv
              ).toFixed(0)
            : 0;
        vm.main.mediaAnalysis.datas[type][media].cvr =
          vm.main.mediaAnalysis.datas[type][media].cv > 0 &&
          vm.main.mediaAnalysis.datas[type][media].clk > 0
            ? (
                (vm.main.mediaAnalysis.datas[type][media].cv /
                  vm.main.mediaAnalysis.datas[type][media].clk) *
                100
              ).toFixed(2)
            : 0;
        vm.main.mediaAnalysis.datas[type][media].roas =
          vm.main.mediaAnalysis.datas[type][media].cr > 0 &&
          vm.main.mediaAnalysis.datas[type][media].cst > 0
            ? (
                (vm.main.mediaAnalysis.datas[type][media].cr /
                  vm.main.mediaAnalysis.datas[type][media].cst) *
                100
              ).toFixed(0)
            : 0;
      }
    },    
    setMediaAnalysis() {
      let vm = this;
      vm.main.mediaAnalysis.responseData = null;
      vm.main.mediaAnalysis.datas.total = {};
      vm.main.mediaAnalysis.datas.sa.naver = {};
      vm.main.mediaAnalysis.datas.sa.kakaosa = {};
      vm.main.mediaAnalysis.datas.sa.google = {};
      vm.main.mediaAnalysis.datas.dsp.kakaomo = {};
    },    
    getReport() {
      let vm = this;
      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/mediareport",
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
            // console.log(data);
            let isData = false;
            let periods = [];
            let diff = moment(vm.report.reportInfo.end).diff(moment(vm.report.reportInfo.start), "days");
            for (let i = 1; i <= diff; i++) {periods.push(moment(vm.report.reportInfo.end).subtract(i, "days").format("YYYY-MM-DD"));}
            periods.reverse().push(vm.report.reportInfo.end);

            vm.main.mediaAnalysis.responseData = data;
            vm.report.activeMedia.kakaomo ? vm.getTotal(data, "dsp", "kakaomo") : "";
            vm.report.activeMedia.naver ? vm.getTotal(data, "sa", "naver") : "";
            vm.report.activeMedia.kakaosa ? vm.getTotal(data, "sa", "kakaosa") : "";    
            vm.report.activeMedia.google ? vm.getTotal(data, "sa", "google") : "";    
            
            vm.main.medias.forEach(function (page, index) {
              if (vm.report.activePage.mediaAnalysis && vm.report.activeMedia[page]) {
                isData = true;
                let type = page === "kakaomo" ? "dsp" : "sa";
                let values = { cst: [], cv: [], clk: [], im: [] };

                Object.keys(data.data[type][page]).forEach(function (date) {
                  values.cst.push(data.data[type][page][date].cst);
                  values.cv.push(data.data[type][page][date].cv);
                  values.clk.push(data.data[type][page][date].clk);
                  values.im.push(data.data[type][page][date].im);
                });

                Object.keys(vm.main.mediaAnalysis.pages[index][page].graph).forEach(
                  function (graph, index2) {
                    if (vm.main.mediaAnalysis.pages[index][page].graph[graph])
                      vm.main.mediaAnalysis.pages[index][page].graph[graph].dispose();
                    if (!document.querySelector(".mediaAnalysis " + " ." + page + " #" + graph)) {
                      vm.$forceUpdate();
                    }
                    vm.$nextTick(function () {
                      vm.main.mediaAnalysis.pages[index][page].graph[graph] = echarts.init(document.querySelector(".mediaAnalysis " + " ." + page + " #" + graph));
                      var option = {
                        color: ["#1795F0", "#6664DA", "#4EDF9F", "#4DC6DF"],
                        tooltip: {
                          trigger: "axis",
                          axisPointer: {
                            type: "cross",
                            crossStyle: { color: "#999" },
                          },
                        },
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
                            tooltip: {
                              valueFormatter: function (value) {
                                return value;
                              },
                            },
                            data: !index2 ? values.im : values.cst,
                            label: {
                              show: false,
                              position: "top",
                              textStyle: { fontSize: "12", fontWeight: "bold" },
                              formatter: function (value) {
                                return priceToString(value.value);
                              },
                            },
                            barWidth: 20,
                          },
                          {
                            name: !index2 ? "클릭수" : "전환수",
                            type: "line",
                            yAxisIndex: 1,
                            tooltip: {
                              valueFormatter: function (value) {
                                return value;
                              },
                            },
                            data: !index2 ? values.clk : values.cv,
                          },
                        ],
                      };
                      vm.main.mediaAnalysis.pages[index][page].graph[graph].setOption(
                        option
                      );
                      vm.main.mediaAnalysis.pages[index][page].graph[graph].on(
                        "finished",
                        function () {
                          vm.$emit("finished", {graph: graph + page, status: true});
                        }
                      );
                    });
                  }
                );
              }
            });       

            if (isData) {
              vm.main.mediaAnalysis.total[0].total.report = [];
              if (vm.isOneMedia()) {
                vm.$emit('rendering', {graph: 'crossGraphMediaTotalOne', status: true});
                vm.$emit('rendering', {graph: 'crossGraphMediaTotalTwo', status: true});
                // vm.rendering.crossGraphMediaTotalOne = true;
                // vm.rendering.crossGraphMediaTotalTwo = true;
                // return true;
              } 
            }

            // console.log(vm.main.mediaAnalysis);
          } else {
          }
        },
        error: function (a, b, c) {},
        complete: function (a, b, c) {
          
        },
      });
    },        
  },
};
</script>

<style scoped></style>
