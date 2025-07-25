import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router/router.js';
import VueCookies from 'vue-cookies';
import htmlToPdf from '@/assets/js/htmlToPdf.js';
import { store } from '@/store/store.js';
import '@/assets/css/bootstrap.4.6.css';
import '@/assets/css/main.css';
import '@/assets/css/main.1.css'; //view
import '@/assets/css/main.2.css'; //main
import '@/assets/css/main.3.css'; //dashboard
import '@/assets/css/m/main.3.css'; //m-dashboard
import '@/assets/css/select2.css';
import '@/assets/css/select2-bootstrap.css';
import '@/assets/css/jqueryui.1.12.css';
import '@/assets/css/datepicker.css';
import '@/assets/css/daterangepicker.css';
import '@/assets/css/tui-grid.min.css';
import '@/assets/css/tui-editor.min.css';
import '@/assets/js/jquery.3.5.js';
import '@/assets/js/bootstrap.4.6.js';
import '@/assets/js/select2.js';
import '@/assets/js/sha256.js'
import '@/assets/js/jqueryui.1.12.js';
import '@/assets/js/lodash.js';
import '@/assets/js/daterangepicker.js';
import '@/assets/js/htmlToPdfForFile.js';
import '@/assets/js/tui-grid.js';
import '@/assets/js/tui-editor.js';

// 앱 인스턴스 생성
const app = createApp(App);

// 플러그인 등록
app.use(router);
app.use(store);
app.use(VueCookies);
app.use(htmlToPdf);

// 쿠키 기본 설정
app.config.globalProperties.$cookies.config('7d');

// 기타 설정
app.config.productionTip = false;
app.config.devtools = true;

// 마운트
app.mount('#app');