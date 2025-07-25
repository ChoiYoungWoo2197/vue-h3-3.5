import $ from 'jquery';
import { API_URL, TEMP_KEY, MONG_ID } from '@/configs/config.js';
import { SHA256 } from '@/assets/js/sha256.js';
import moment from "moment";

const dateStore = {
    state: { cStart: null, cEnd: null, start: null, end: null, },
    mutations: {
      initDate: function(state, payload) {
        state.cStart = moment().subtract(60, "days").format("YYYY-MM-DD");
        state.cEnd = moment().subtract(31, "days").format("YYYY-MM-DD");           
        state.start = moment().subtract(30, "days").format("YYYY-MM-DD");
        state.end = moment().subtract(1, "days").format("YYYY-MM-DD");
      },
      setDate: function(state, payload) {
        state.start = payload.start;
        state.end = payload.end;
      },
      setCDate: function(state, payload) {
        state.cStart = payload.cStart;
        state.cEnd = payload.cEnd;
      },
      getDate: function(state) { return { cStart, cEnd, start, end }; }
   },
   actions : {

   }
}
export default dateStore

