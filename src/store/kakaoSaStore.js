// import router from '@/router'
import $ from 'jquery';
import { API_URL, TEMP_KEY, MONG_ID } from '../configs/config.js';
import { SHA256 } from '../assets/js/sha256.js';

const kakaoSaStore = {
    state: {
         refresh: null,
         access : null,
         expires: null
    },
    mutations: {
        initKakaoSa : function (state, payload) {
            // console.log('userstore : ' , payload);
            state.refresh = payload.refresh;
            state.access = payload.access;
            state.expires = payload.expires;
        },
        logoutKakaoSa : function(state) {
            state.refresh = null;
            state.access = null;
            state.expire = null;
        },
   },
   actions : {
        setKakaoSa : function(context, payload) {
            $.ajax({
		    	type: 'post',
		    	url: API_URL + '/app/kakaosatoken',
                headers : { "authorization" : SHA256(TEMP_KEY) },
		    	data : {
                    "session" : payload
		    	},
		    	cache : false,
		    	success : function(data){
                    // console.log(data);
                    context.commit('initKakaoSa', data.data);
		    	},
		    });
        }
   }
}
export default kakaoSaStore

