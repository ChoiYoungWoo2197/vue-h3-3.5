<template>
   <ul :class="getUniqueId" class="pagination">
     <li class="page-item">
       <a class="page-link shadow-none" href="javascript:;" aria-label="Previous" @click="clickPreviousFirstPageBtnForMain">
         <span aria-hidden="true"><i class="bi bi-chevron-double-left m-0"></i></span>
       </a>
     </li>
     <li class="page-item" :class="{ disabled: isFirstPageGroupForMain }">
       <a class="page-link shadow-none" href="javascript:;" aria-label="Previous" @click="clickPreviousPageBtnForMain">
         <span aria-hidden="true"><i class="bi bi-chevron-left"></i></span>
       </a>
     </li>
     <li class="page-item" :class="{ active: page - 1 === start }" v-for="page in pages" :key="page">
       <a class="page-link shadow-none" href="javascript:;" v-text="page" @click="clickPageBtnForMain(page - 1)"></a>
     </li>
     <li class="page-item" :class="{ disabled: isLastPageGroupForMain }">
       <a class="page-link shadow-none" href="javascript:;" aria-label="Next" @click="clickNextPageBtnForMain">
         <span aria-hidden="true"><i class="bi bi-chevron-right"></i></span>
       </a>
     </li>
     <li class="page-item">
       <a class="page-link shadow-none" href="javascript:;" aria-label="Next" @click="clickNextEndPageBtnForMain">
         <span><i class="bi bi-chevron-double-right m-0"></i></span>
       </a>
     </li>
   </ul>  
</template>

<script>
import $ from "jquery";
import {  isMobile,  priceToString,  getMedia,  uuidv4,  getUnit, getType,  getKpiName} from "@/assets/js/common.js";
import { API_URL, TEMP_KEY } from "@/configs/config.js";
export default {
  props: { 
    pStart:Number, pDisplay: Number, pTotalCount: Number, pDisplayPageNum: Number, pPages: Array, pIsFirst: Boolean, pIsEnd: Boolean
  },
  data() {
    return {
      uniqueId: null,
      start: 0,
      display: 10,
      displayPageNum: isMobile() === true ? 5 : 10, 
      totalcount: 0,
      pages:[],
      isFirst: false,
      isEnd: false,
      // isTotalCount:0
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
    isFirstPageGroupForMain() { return this.isFirst; },
    isLastPageGroupForMain() { return this.isEnd; },    
  },
  watch: {
    pStart() {
      this.start = this.pStart;
      this.getStartAndEndPageForMain();
    },
    pDisplay() {
      if(this.display !== this.pDisplay) {
        this.getStartAndEndPageForMain();
      }
      this.display = this.pDisplay;
    },
    pDisplayPageNum() {
      this.displayPageNum = this.pDisplayPageNum;
    },
    pTotalCount() {
      this.totalcount = this.pTotalCount;

      if(this.pages.length ===0) {
        this.getStartAndEndPageForMain();
      }
    },
    pPages: {
      deep: true,
      handler(value) {
        this.pages = this.copyObject(value);
      },
    },
    pIsFirst() {
      this.isFirst = this.pIsFirst;
    },
    pIsEnd() {
      this.isEnd = this.pIsEnd;
    }
  },
  mounted() {},
  methods: {
    copyObject(object) {
      return Object.assign({}, object);
    },    
    getData() {
      var vm = this;
      return { start: vm.start, display: vm.display, displayPageNum: vm.displayPageNum, totalcount: vm.totalcount };
    },
    setData(o) {
      this.totalcount = o.totalcount;
    },
    setTotalCount(totalcount) {
      console.log(totalcount);
      this.totalcount = totalcount;
    },
    setDisplay(display) {
      this.display = display;
    },
    setStart(start) {
      this.start = start
    },
    getStartAndEndPageForMain() {
      this.pages = [];
      var endPage = Math.ceil((this.start + 1) / this.displayPageNum) * this.displayPageNum;
      var startPage = endPage - this.displayPageNum + 1;
      var tempEndPage = Math.ceil(this.totalcount / this.display);
      if (endPage > tempEndPage) { endPage = tempEndPage; }

      this.isFirst = this.start + 1 === 1 ? true : false;
      this.isEnd = Math.ceil(this.totalcount / this.display) === this.start + 1 ? true : false;

      for (var i = startPage; i <= endPage; i++) { this.pages.push(i); }

       console.log(this.start, this.totalcount, this.pages);
    },    
    clickPreviousFirstPageBtnForMain() {
      this.start = 0;
      this.changePage();
    },
    clickPreviousPageBtnForMain() {
      this.start = this.start === 0 ? 0 : this.start - 1;
      this.changePage();
    },
    clickNextEndPageBtnForMain() {
      let tempEndPage = Math.ceil(this.totalcount / this.display);
      this.start = tempEndPage - 1;
      this.changePage();
    },
    clickNextPageBtnForMain() {
      let tempEndPage = Math.ceil(this.totalcount / this.display);
      this.start = this.start > tempEndPage ? tempEndPage : this.start + 1;
      this.changePage();
    },
    clickPageBtnForMain(page) {
      this.start = page;
      this.changePage();
    },    
    changePage() {
      this.$emit("changedPage", this.start);
    }
  }
};
</script>

<style scoped></style>
