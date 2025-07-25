// import router from '@/router'
 
const mediaStore = {
    state: {
        activedMedias : [
          { media : "naver", title : "네이버", userid : '', isActive : true, data : {} },
          { media : "kakaosa", title : "카카오SA", userid : '', isActive : true, data : {} },
          { media : "naverda", title : "네이버디스플레이", userid : '', isActive : true, data : {} },            
          { media : "kakaomo", title : "카카오모먼트", userid : '', isActive : true, data : {} },
          { media : "google", title : "구글", userid : '', isActive : true, data : {} },          
        ]
    },
    mutations: {
        setActivedMedias : function (state, payload) {
            state.activedMedias.find(function (activedMedia, index) {
                if(activedMedia === undefined) return;
                if(activedMedia.media === payload.media) {
                    if(payload.mode === 'D') {
                        activedMedia.data =null;
                        activedMedia.userid = null;
                    } else {
                        activedMedia.isActive = true;
                        activedMedia.data = payload.data;
                        if(payload.media === 'naver') activedMedia.userid = payload.data.naverid;
                        if(payload.media === 'kakaosa') activedMedia.userid = payload.data.kakaosaid;
                        if(payload.media === 'kakaomo') activedMedia.userid = payload.data.kakaomomentid;
                        if(payload.media === 'naverda') activedMedia.userid = payload.data.naverdaid;
                        if(payload.media === 'google') activedMedia.userid = payload.data.googleid;
                    }
                }
            });
        },
        getActivedMedias : function(state, payload) {
            return state.activedMedias;
        },
        logoutActivedMdias : function(state) {
            state.activedMedias = [
                { media : "naver", title : "네이버", userid : '', isActive : true, data : {} },
                { media : "kakaosa", title : "카카오SA", userid : '', isActive : true, data : {} },
                { media : "naverda", title : "네이버디스플레이", userid : '', isActive : true, data : {} },                
                { media : "kakaomo", title : "카카오모먼트", userid : '', isActive : true, data : {} },
                { media : "google", title : "구글", userid : '', isActive : true, data : {} },  
            ];
        },
   }
}
export default mediaStore

