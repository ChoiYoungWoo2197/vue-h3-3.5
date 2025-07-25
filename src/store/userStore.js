// import router from '@/router'

const userStore = {
    state: {
         userinfo: null,
         managerinfo : null,
         session : null,
    },
    mutations: {
        login : function (state, payload) {
            state.userinfo = payload.userinfo;
            state.session = payload.session;

            // if(localStorage.getItem("userStore.state.userinfo") !== null) {
            //     localStorage.removeItem("userStore.state.userinfo");
            //     localStorage.removeItem("userStore.state.session");
            //     localStorage.removeItem("userStore.state.managerinfo");
            // }

            // localStorage.setItem("userStore.state.userinfo", JSON.stringify(state.userinfo));
            // localStorage.setItem("userStore.state.session", JSON.stringify(state.session));

            if(payload.managerinfo !== null) {
                state.managerinfo = payload.managerinfo;
                // localStorage.setItem("userStore.state.managerinfo", JSON.stringify(state.managerinfo));
            }
        },
        logout : function(state) {
            state.userinfo = null;
            state.managerinfo = null;
            state.session = null;

            window.localStorage.clear();
        },
        setStateManager : function(state) {
            // if(localStorage.getItem("userStore.state.managerinfo") !== null) {
            //     localStorage.removeItem("userStore.state.managerinfo");
            // }

            state.managerinfo = state.managerinfo;
            // localStorage.setItem("userStore.state.managerinfo", JSON.stringify(state.managerinfo));
        },
        registerEdit : function(state, payload) {
            state.userinfo = payload;
        }
   }
}
export default userStore

