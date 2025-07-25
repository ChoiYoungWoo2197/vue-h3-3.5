import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
import { store } from "@/store/store.js";
import Login from "@/views/Login.vue";
import FindId from "@/views/FindId.vue";
import FindPw from "@/views/FindPw.vue";
import Terms from "@/views/Terms.vue";
import Register from "@/views/Register.vue";
import RegisterAdmin from "@/views/marketer/RegisterAdmin.vue";
import RegisterAdminNew from "@/views/marketer/RegisterAdminNew.vue";
import RegisterEdit from "@/views/marketer/RegisterEdit.vue";
import UpdatePw from "@/views/UpdatePw.vue";
import Dashboard from "@/views/member/Dashboard.vue";
import DashboardEdit from "@/views/member/DashboardEdit.vue";
import BDashboard from "@/views/member/BDashboard.vue";
import AdvAdd from "@/views/member/AdvAdd.vue";
import MediaAnalysis from "@/views/member/MediaAnalysis.vue";
import PeriodAnalysis from "@/views/member/PeriodAnalysis.vue";
import CampaignAnalysis from "@/views/member/CampaignAnalysis.vue";
import GroupAnalysis from "@/views/member/m/GroupAnalysis.vue";
import KeywordAnalysis from "@/views/member/KeywordAnalysis.vue";
import KeywordReAnalysis from "@/views/member/KeywordReAnalysis.vue";
import AdAnalysis from "@/views/member/AdAnalysis.vue";
//import TargetAnalysis from "../views/member/TargetAnalysis.vue";
import TargetAnalysis from "@/views/member/TargetAnalysisNew.vue";
import ShoppingAnalysis from "@/views/member/ShoppingAnalysis.vue";
import ShoppingGroupAnalysis from "@/views/member/m/ShoppingGroupAnalysis.vue";
import Alarms from "@/views/member/Alarms.vue";
import AlarmsSet from "@/views/member/AlarmsSet.vue";
import ReportSend from "@/views/member/ReportSend.vue";
import ReportSendRenew from "@/views/member/ReportSendRenew.vue";
import ReportSendSet from "@/views/member/m/ReportSendSet.vue";
import Agency from "@/views/marketer/Agency.vue";
import AgencyLst from "@/views/marketer/AgencyLst.vue";
import AgencyAdd from "@/views/marketer/AgencyAdd.vue";
import AgencyEdit from "@/views/marketer/AgencyEdit.vue";
import MemberMng from "@/views/marketer/MemberMng.vue";
import MemberShip from "@/views/marketer/MemberShip.vue";
import MemberLnk from "@/views/marketer/MemberLnk.vue";
import Banner from "@/views/marketer/Banner.vue";
import NotFound from "@/views/NotFound.vue";
import NotAuth from "@/views/NotAuth.vue";
import PageMediaAnalysis from "@/components/pdf/pageMediaAnalysis.vue";
import ApiTest from "@/views/ApiTest.vue";
const isDev = process.env.NODE_ENV === 'development';

const routes = [
  {
    path: "/",
    alias: ["/", "/login", "/index"],
    name: "Login",
    component: Login,
    beforeEnter(to, from, next) {
      // console.log('index : ', to, from);
      //  if(from.name !== null && store.state.userStore.session !== null) {
      // // if(store.state.userStore.session !== null) {
      //   if(store.state.userStore.userinfo.userlevel === 99 || store.state.userStore.userinfo.userlevel === 2 ||
      //     store.state.userStore.userinfo.userlevel === 3) {
      //     next("/agency");
      //   } else {
      //     next("/dashboard");
      //   }
      // } else {
      //   next();
      // }


      next();
    }
  },
  {
    path: "/find-id",
    name: "FindId",
    component: FindId
  },
  {
    path: "/find-pw",
    name: "FindPw",
    component: FindPw
  },
  {
    path: "/terms",
    name: "Terms",
    component: Terms
  },
  {
    path: "/register",
    name: "Register",
    component: Register
  },
  {
    path: "/update-pw",
    name: "UpdatePw",
    component: UpdatePw
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { authRequired: true },
    beforeEnter(to, from, next) {
      if (store.state.userStore.userinfo.userlevel === 1) {
        next();
      } else {
        next("/not-auth");
      }
    }
  },
  {
    path: "/bdashboard",
    name: "BDashboard",
    component: BDashboard
  },
  {
    path: "/adv-add",
    name: "AdvAdd",
    component: AdvAdd,
    meta: { authRequired: true },
    beforeEnter(to, from, next) {
      // console.log('membermng beforeEnter', store.state.userStore);
      if (store.state.userStore.userinfo.userlevel === 1) {
        next();
      } else {
        next("/not-auth");
      }
    }
  },
  {
    path: "/media-analysis",
    name: "MediaAnalysis",
    component: MediaAnalysis,
    meta: { authRequired: true },
    beforeEnter(to, from, next) {
      // console.log('membermng beforeEnter', store.state.userStore);
      if (store.state.userStore.userinfo.userlevel === 1) {
        next();
      } else {
        next("/not-auth");
      }
    }
  },
  {
    path: "/period-analysis",
    name: "PeriodAnalysis",
    component: PeriodAnalysis,
    meta: { authRequired: true },
    beforeEnter(to, from, next) {
      // console.log('membermng beforeEnter', store.state.userStore);
      if (store.state.userStore.userinfo.userlevel === 1) {
        next();
      } else {
        next("/not-auth");
      }
    }
  },
  {
    path: "/campaign-analysis",
    name: "CampaignAnalysis",
    component: CampaignAnalysis,
    meta: { authRequired: true },
    beforeEnter(to, from, next) {
      // console.log('membermng beforeEnter', store.state.userStore);
      if (store.state.userStore.userinfo.userlevel === 1) {
        next();
      } else {
        next("/not-auth");
      }
    }
  },
  ,
  {
    path: "/m-group-analysis",
    name: "GroupAnalysis",
    component: GroupAnalysis,
    meta: { authRequired: true },
    beforeEnter(to, from, next) {
      // console.log('membermng beforeEnter', store.state.userStore);
      if (store.state.userStore.userinfo.userlevel === 1) {
        next();
      } else {
        next("/not-auth");
      }
    }
  },  
  {
    path: "/keyword-analysis",
    name: "KeywordAnalysis",
    component: KeywordAnalysis,
    meta: { authRequired: true },
    beforeEnter(to, from, next) {
      // console.log('membermng beforeEnter', store.state.userStore);
      if (store.state.userStore.userinfo.userlevel === 1) {
        next();
      } else {
        next("/not-auth");
      }
    }
  },
  {
    path: "/keywordre-analysis",
    name: "KeywordReAnalysis",
    component: KeywordReAnalysis,
    meta: { authRequired: true },
    beforeEnter(to, from, next) {
      // console.log('membermng beforeEnter', store.state.userStore);
      if (store.state.userStore.userinfo.userlevel === 1) {
        next();
      } else {
        next("/not-auth");
      }
    }
  },
  {
    path: "/ad-analysis",
    name: "AdAnalysis",
    component: AdAnalysis,
    meta: { authRequired: true },
    beforeEnter(to, from, next) {
      // console.log('membermng beforeEnter', store.state.userStore);
      if (store.state.userStore.userinfo.userlevel === 1) {
        next();
      } else {
        next("/not-auth");
      }
    }
  },
  {
    path: "/target-analysis",
    name: "TargetAnalysis",
    // name : 'VueTest',
    component: TargetAnalysis,
    meta: { authRequired: true },
    beforeEnter(to, from, next) {
      //console.log('membermng beforeEnter', store.state.userStore);
      if (store.state.userStore.userinfo.userlevel === 1) {
        next();
      } else {
        next("/not-auth");
      }
    }
  },
  {
    path: "/shopping-analysis",
    name: "ShoppingAnalysis",
    // name : 'VueTest',
    component: ShoppingAnalysis,
    meta: { authRequired: true },
    beforeEnter(to, from, next) {
      // console.log('membermng beforeEnter', store.state.userStore);
      if (store.state.userStore.userinfo.userlevel === 1) {
        next();
      } else {
        next("/not-auth");
      }
    }
  },
  {
    path: "/m-shopping-group-analysis",
    name: "ShoppingGroupAnalysis",
    component: ShoppingGroupAnalysis,
    meta: { authRequired: true },
    beforeEnter(to, from, next) {
      // console.log('membermng beforeEnter', store.state.userStore);
      if (store.state.userStore.userinfo.userlevel === 1) {
        next();
      } else {
        next("/not-auth");
      }
    }
  },   
  {
    path: "/alarms",
    name: "Alarms",
    component: Alarms,
    meta: { authRequired: true },
    beforeEnter(to, from, next) {
      // console.log('membermng beforeEnter', store.state.userStore);
      if (store.state.userStore.userinfo.userlevel === 1) {
        next();
      } else {
        next("/not-auth");
      }
    }
  },
  {
    path: "/alarms-set",
    name: "AlarmsSet",
    component: AlarmsSet,
    meta: { authRequired: true },
    beforeEnter(to, from, next) {
      // console.log('membermng beforeEnter', store.state.userStore);
      if (store.state.userStore.userinfo.userlevel === 1) {
        next();
      } else {
        next("/not-auth");
      }
    }
  },
  {
    path: "/report-send",
    name: "ReportSend",
    component: ReportSend,
    meta: { authRequired: true },
    beforeEnter(to, from, next) {
      // console.log('membermng beforeEnter', store.state.userStore);
      if (store.state.userStore.userinfo.userlevel === 1) {
        next();
      } else {
        next("/not-auth");
      }
    }
  },
  {
    path: "/report-send-renew",
    name: "ReportSendRenew",
    component: ReportSendRenew,
    meta: { authRequired: true },
    beforeEnter(to, from, next) {
      // console.log('membermng beforeEnter', store.state.userStore);
      if (store.state.userStore.userinfo.userlevel === 1) {
        next();
      } else {
        next("/not-auth");
      }
    }
  },  
  {
    path: "/m-report-send-set",
    name: "ReportSendSet",
    component: ReportSendSet,
    meta: { authRequired: true },
    beforeEnter(to, from, next) {
      // console.log('membermng beforeEnter', store.state.userStore);
      if (store.state.userStore.userinfo.userlevel === 1) {
        next();
      } else {
        next("/not-auth");
      }
    }
  },   
  {
    path: "/agency",
    name: "Agency",
    component: Agency,
    meta: { authRequired: true },
    beforeEnter(to, from, next) {
      // console.log('Agency : ' ,to, from, store.state.userStore);
      // console.log('membermng beforeEnter', store.state.userStore);
      if (
        store.state.userStore.userinfo.userlevel === 2 ||
        store.state.userStore.userinfo.userlevel === 3 ||
        store.state.userStore.userinfo.userlevel === 99
      ) {
        next();
      } else {
        next("/not-auth");
      }
    }
  },
  {
    path: "/agency-lst",
    name: "AgencyLst",
    component: AgencyLst,
    meta: { authRequired: true },
    beforeEnter(to, from, next) {
      // console.log('membermng beforeEnter', store.state.userStore);
      if (store.state.userStore.userinfo.userlevel === 99) {
        next();
      } else {
        next("/not-auth");
      }
    }
  },
  {
    path: "/agency-add",
    name: "AgencyAdd",
    component: AgencyAdd,
    meta: { authRequired: true },
    beforeEnter(to, from, next) {
      // console.log('membermng beforeEnter', store.state.userStore);
      if (store.state.userStore.userinfo.userlevel === 99) {
        next();
      } else {
        next("/not-auth");
      }
    }
  },
  {
    path: "/agency-edit",
    name: "AgencyEdit",
    component: AgencyEdit,
    meta: { authRequired: true },
    beforeEnter(to, from, next) {
      // console.log('membermng beforeEnter', store.state.userStore);
      if (store.state.userStore.userinfo.userlevel === 99) {
        next();
      } else {
        next("/not-auth");
      }
    }
  },
  {
    path: "/membermng",
    name: "MemberMng",
    component: MemberMng,
    meta: { authRequired: true },
    beforeEnter(to, from, next) {
      // console.log('membermng beforeEnter'z, store.state.userStore.userinfo);
      if (
        store.state.userStore.userinfo.userlevel === 2 ||
        store.state.userStore.userinfo.userlevel === 99
      ) {
        next();
      } else {
        next("/not-auth");
      }
    }
  },
  {
    path: "/membership",
    name: "MemberShip",
    component: MemberShip,
    meta: { authRequired: true },
    beforeEnter(to, from, next) {
      // console.log('membermng beforeEnter', store.state.userStore);
      if (store.state.userStore.userinfo.userlevel === 99) {
        next();
      } else {
        next("/not-auth");
      }
    }
  },
  {
    path: "/memberlnk",
    name: "MemberLnk",
    component: MemberLnk,
    meta: { authRequired: true },
    beforeEnter(to, from, next) {
      // console.log('membermng beforeEnter', store.state.userStore);
      if (store.state.userStore.userinfo.userlevel === 99) {
        next();
      } else {
        next("/not-auth");
      }
    }
  },
  {
    path: "/banner",
    name: "Banner",
    component: Banner,
    meta: { authRequired: true },
    beforeEnter(to, from, next) {
      // console.log('membermng beforeEnter', store.state.userStore);
      if (store.state.userStore.userinfo.userlevel === 2 || store.state.userStore.userinfo.userlevel === 99) {
        next();
      } else {
        next("/not-auth");
      }
    }
  },
  {
    path: "/admin-register",
    name: "RegisterAdminNew",
    component: RegisterAdminNew,
    meta: { authRequired: true },
    beforeEnter(to, from, next) {
      console.log(store.state.userStore.userinfo.userlevel);
      if ( store.state.userStore.userinfo.userlevel === 2 || store.state.userStore.userinfo.userlevel === 99
      ) {
        next();
      } else {
        next("/not-auth");
      }
    }
  },
  {
    path: "/register-edit",
    name: "RegisterEdit",
    component: RegisterEdit,
    meta: { authRequired: true },
    beforeEnter(to, from, next) {
      // console.log('membermng beforeEnter', store.state.userStore);
      if (
        store.state.userStore.userinfo.userlevel === 1 ||
        store.state.userStore.userinfo.userlevel === 2 ||
        store.state.userStore.userinfo.userlevel === 3 ||
        store.state.userStore.userinfo.userlevel === 99
      ) {
        next();
      } else {
        next("/not-auth");
      }
    }
  },
  {
    path: "/dashboard-edit",
    name: "DashboardEdit",
    component: DashboardEdit,
    meta: { authRequired: true },
    beforeEnter(to, from, next) {
      // console.log('membermng beforeEnter', store.state.userStore);
      if (
        store.state.userStore.userinfo.userlevel === 1 ||
        store.state.userStore.userinfo.userlevel === 2 ||
        store.state.userStore.userinfo.userlevel === 3 ||
        store.state.userStore.userinfo.userlevel === 99
      ) {
        next();
      } else {
        next("/not-auth");
      }
    }
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound
  },
  {
    path: "/not-auth",
    component: NotAuth
  },
  {
    path: "/api-test",
    name: "ApiTest",
    component: ApiTest,
    meta: { authRequired: true },
    beforeEnter(to, from, next) {
      // console.log('membermng beforeEnter', store.state.userStore);
      if (store.state.userStore.userinfo.userlevel === 1) {
        next();
      } else {
        next("/not-auth");
      }
    }
  },
  {
    path: "/page-media-analysis",
    name: "PageMediaAnalysis",
    component: PageMediaAnalysis
  },
];

const router = createRouter({
  history: isDev ? createWebHashHistory() : createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(route => route.meta.authRequired)) {
    if (!store.state.userStore.session) {
      next("/");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
