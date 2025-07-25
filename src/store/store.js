import { createStore } from "vuex";
import createPersistedState from 'vuex-persistedstate';
import SecureLS from "secure-ls";

let ls = new SecureLS({
  encodingType: "aes",
  isCompression: false,
});

// 로컬스토리지 초기화 (필요하면 유지)
window.localStorage.removeItem('userStore.state.session');
window.localStorage.removeItem('userStore.state.token');
window.localStorage.removeItem('userStore.state.managerinfo');
window.localStorage.removeItem('dateStore.state');

import userStore from '../store/userStore.js';
import mediaStore from '../store/mediaStore.js';
import kakaoSaStore from "../store/kakaoSaStore.js";
import dataReloadStore from "./dataReloadStore.js";
import dateStore from "../store/dateStore.js";

export const store = createStore({
  modules: {
    userStore,
    mediaStore,
    kakaoSaStore,
    dataReloadStore,
    dateStore,
  },
  plugins: [
    createPersistedState({ 
      paths: ["userStore", "mediaStore", "kakaoSaStore", "dataReloadStore", "dateStore"],
      storage: {
        getItem: (key) => { try { return ls.get(key); } catch(err) {} },
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      }
    })
  ]
});
