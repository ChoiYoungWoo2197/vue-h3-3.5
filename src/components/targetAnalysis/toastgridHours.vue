<template>
  <div id="grid" :class="getUniqueId" class=""></div>
</template>

<script>
import Grid from 'tui-grid';
import $ from "jquery";
import { store } from "@/store/store.js";
import { SHA256 } from "@/assets/js/sha256.js";
import { API_URL, TEMP_KEY, MEDIA_SORT } from "@/configs/config.js";
import { priceToString, isMobile, uuidv4, getMedia } from "@/assets/js/common.js";

export default {
  props: {pData: Array},
  data() {
    return {
      uniqueId: null,
      columns: [],
      data: [],
      hours: ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"],
      grid: null
    };
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
  components: {Grid},
  watch: {
  },
  created() {
    this.getReport();
  },
  mounted() {
    this.initToastGrid();
  },
  methods: {
    copyObject(object) { return JSON.parse(JSON.stringify(object)); },
    getReport() {},
    initToastGrid() {
      var vm = this;
      var complexColumns = vm.hours.map(hour => ({ header: hour, name: `mergeColumn${hour}`, childNames: [`im${hour}`,`clk${hour}`,`cst${hour}`] }));
      var columns = [{ header: '날짜', name: 'date', rowSpan: true, width: 100, align: 'center' },  { header: '구분', name: 'type', width: 100, align: 'center' }];
      var hourColumns = vm.hours.flatMap(hour => ([ { header: '노출수', name: `im${hour}`, width: 100, align: 'center' }, 
      { header: '클릭수', name: `clk${hour}`, width: 100, align: 'center' }, { header: '광고비', name: `cst${hour}`, width: 100, align: 'center' } ]));

      var grid = new Grid({
        el: document.getElementById('grid'), // Container element
        scrollX: true,
        scrollY: true,   
        bodyHeight: 500,
        header: { height: 100, complexColumns: complexColumns },
        columns: [...columns, ...hourColumns],
        columnOptions: { frozenCount: 2, frozenBorderWidth: 3, minWidth: 100 },
        data: []
      });

      vm.grid = grid;
    },
    resetToastGrid(data) {
      var vm = this;
      var raw = data;
      var hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));     
      var gridData = raw.flatMap(entry => {
        var { date, data } = entry;
        var pcRow = { date, type: 'pc' };
        var mobileRow = { date, type: 'mobile' }; // 없으면 비워두기
        var totalRow = { date, type: '총액', className:'day_price' };
        hours.forEach(hour => {
          var hourData = data[hour];
          var p = (hourData && hourData.p) || {};
          var m = (hourData && hourData.m) || {};
          var t = (hourData && hourData.total) || {};

          pcRow[`im${hour}`] = p.im == null ? 0 : vm.priceToString(p.im);
          pcRow[`clk${hour}`] = p.clk == null ? 0 : vm.priceToString(p.clk);
          pcRow[`cst${hour}`] = p.cst == null ? 0 : vm.priceToString(p.cst);

          mobileRow[`im${hour}`] = m.im == null ? 0 : vm.priceToString(m.im);
          mobileRow[`clk${hour}`] = m.clk == null ? 0 : vm.priceToString(m.clk);
          mobileRow[`cst${hour}`] = m.cst == null ? 0 : vm.priceToString(m.cst);

          totalRow[`im${hour}`] = t.im == null ? 0 : vm.priceToString(t.im);
          totalRow[`clk${hour}`] = t.clk == null ? 0 : vm.priceToString(t.clk);
          totalRow[`cst${hour}`] = t.cst == null ? 0 : vm.priceToString(t.cst);
        });

        return [pcRow, mobileRow, totalRow]; // mobileRow가 없으면 생략
      });       

      this.grid.resetData(gridData);
      this.data = gridData.slice();
      console.log(gridData);
    },
    priceToString(salse) { return priceToString(salse);}
  },
};
</script>

<style></style>

