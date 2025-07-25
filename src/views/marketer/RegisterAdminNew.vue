<template>
  <section class="row d-flex">
    <big-menu :pMenu="'membermng'" @mountedMain="activeMain"></big-menu>
    <div class="full-wrap d-flex flex-column">
      <article class="registerAdmin">
        <div class="admin-title">
          <h3>광고주 등록</h3>
        </div>
        <step-bar :pStep="step"></step-bar>
        <step-section ref="stepSection">
          <swiper-slide class="w-100">
            <div class="tab-pane top10-card" id="pills1" role="tabpanel" aria-labelledby="pills1-tab" tabindex="1" data-index="1">
              <step-1 ref="step1" @prev="prev" @next="next"></step-1>
            </div>
          </swiper-slide>    
          <swiper-slide class="w-100">
            <div class="tab-pane top10-card" id="pills2" role="tabpanel" aria-labelledby="pills2-tab" tabindex="2" data-index="2">
              <step-2 ref="step2" @prev="prev" @next="next"></step-2>
            </div>
          </swiper-slide>  
          <swiper-slide class="w-100">
            <div class="tab-pane top10-card" id="pills3" role="tabpanel" aria-labelledby="pills3-tab" tabindex="3" data-index="3">
              <step-3 ref="step3" @prev="prev" @next="next"></step-3>
            </div>
          </swiper-slide>                            
        </step-section>
      </article>
    </div>
    <waiting-2-admin-modal ref="waiting2AdminModal" style="display: none" ></waiting-2-admin-modal>
    <expire-session-modal ref="expireSessionModal" style="display: none" ></expire-session-modal>
    <confirm-modal ref="confirmModal" style="display: none"></confirm-modal>
  </section>
</template>

<script>
import $ from "jquery";
import { store } from "@/store/store.js";
import { SHA256 } from "@/assets/js/sha256.js";
import { API_URL, TEMP_KEY } from "@/configs/config.js";
import bigMenu from "@/components/layout/bigMenu.vue";
import confirmModal from "@/components/modal/confirmModal.vue";
import expireSessionModal from "@/components/modal/expireSessionModal.vue";
import waiting2AdminModal from "@/components/modal/waiting2AdminModal.vue";
import stepBar from "@/components/common/stepBar.vue";
import stepSection from "@/components/common/stepSection.vue";
import step1 from "@/components/registerAdmin/step1.vue";
import step2 from "@/components/registerAdmin/step2.vue";
import step3 from "@/components/registerAdmin/step3.vue";
// import "swiper/dist/css/swiper.css";
import 'swiper/css';
// import { swiper, swiperSlide } from "vue-awesome-swiper";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";

export default {
  data() {
    return {
      step: 1,
      last: 2,      
    };
  },
  components: {bigMenu,expireSessionModal,confirmModal,waiting2AdminModal,stepBar,stepSection,step1,step2,step3,Swiper,SwiperSlide},
  watch: {
    step() {
      this.$refs.stepSection.slideStep(this.step);
    },    
  },
  methods: {
    activeMain(flag) {
      this.$emit("mountedMain", true);
      this.$emit("mountedDasyboad", false);
    },    
    prev() {
      if (this.step === 1) this.$router.push("/membermng");;
      if (this.step !== 1) this.step--;
    },
    next() {
      if (this.step === this.last) this.addReport();
      if (this.step !== this.last) this.step++;
    },    
    addReport() {
      var vm = this;

      vm.registerUser().then(function(data) {
        return vm.getUserAccountList();
      }).then(function(data2) {
        console.log(data2);
        vm.step++;
      }).catch(function(error) {console.log(error);})
    },   
    registerUser(data) {
      var vm = this;
      var step1 = vm.$refs.step1.getData();

      return $.ajax({
          url: API_URL + "/admin/userregister",
          type: "POST",
          headers: { authorization: SHA256(TEMP_KEY) },
          data: {userid: step1.resisterId,userpass: step1.resisterPw,username: step1.resisterName,usercompany: step1.resisterCom,useremail: '',userphone: '',advmedia: '',advid: '',advmarketer: store.state.userStore.userinfo.userid,session: store.state.userStore.session},
      });      
    },
    getUserAccountList(data) {
      var vm = this;
      var step1 = vm.$refs.step1.getData();  
      var step2 = vm.$refs.step2.getData();    

      return $.ajax({
          url: API_URL + "/app/user/accountlist",
          type: "POST",
          headers: { authorization: SHA256(TEMP_KEY) },
          data: {
              userid: step1.resisterId,
              mode: "I",
              media: "",
              naverid: step2.naver.spare1 !== null ? step2.naver.spare1 : "",
              navercustomer: step2.naver.spare2 !== null ? step2.naver.spare2 : "",
              naveraccess: step2.naver.spare3 !== null ? step2.naver.spare3 : "",
              naversecret: step2.naver.spare4 !== null ? step2.naver.spare4 : "",
              kakaosaid: step2.kakaosa.spare1 !== null ? step2.kakaosa.spare1 : "",
              kakaomomentid: step2.kakaomo.spare1 !== null ? step2.kakaomo.spare1 : "",
              naverdaid: step2.naverda.spare1 !== null ? step2.naverda.spare1 : "",
              googleid: step2.google.spare1 !== null ? step2.google.spare1 : "",
              session: store.state.userStore.session,
          },
      });      
    }  
  },
};
</script>

<style>

</style>
