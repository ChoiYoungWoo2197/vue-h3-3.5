// import router from '@/router'
import $ from 'jquery';
import { API_URL, TEMP_KEY, MONG_ID } from '../configs/config.js';
import { SHA256 } from '../assets/js/sha256.js';

const dataReloadStore = {
    state: {
         result: true,
         count : 10,
    },
    mutations: {
        toggleResult : function (state, payload) {
            state.result = payload;
        },
        decreaseCount : function (state) {
            // console.log('userstore : ' , payload);
            state.result = false;
            state.count = state.count -1;
        },
        initCount : function(state) {
            state.result = true;
            state.count = 10;
        },
   },
   actions : {

   }
}
export default dataReloadStore

