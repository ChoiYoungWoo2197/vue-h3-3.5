<template>
  <div class="modal fade" :id="getUniqueId" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="confirm" style="display: none" aria-hidden="true" >
    <div class="modal-dialog modal-dialog-centered">
      <div v-if="data !== null" class="modal-content">
        <div class="modal-title text-left mb-0 bannder-boardbox-container">
          <h3 class="font-weight-bold">
            소재 이미지
            <small class="sub"></small>
          </h3>
        </div>
        <div class="modal-body">
          <swiper ref="swiper" class="tab-content swiper">
            <template v-for="(img,i) in imgurls" :key="i+getUuidv4()">
              <swiper-slide >
                <div style="position: relative; width: 100%; padding-top: 75%; background-color: #f9f9f9;">
                  <img :src="img" class="" alt="..." @error="handleNoImg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain;"/>
                </div>
                <!-- <span style="display:block">
                  <img :src="img" class="img-thumbnail" alt="..." style="width:100%;" @error="handleNoImg"/>
                </span> -->
              </swiper-slide>
            </template>
          </swiper>
        </div>
        <div class="modal-button d-flex">
          <button class="btn shadow-none" data-dismiss="modal">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import noimg from "@/assets/image/noimg.png";
import {isMobile, priceToString, uuidv4} from "@/assets/js/common.js";
import {API_URL, TEMP_KEY, PGGROUPS, UNITS, BIDGOAL, BIDTYPE, BUDGETTYPE, CTYPE} from "@/configs/config.js";
// import "swiper/dist/css/swiper.css";
import 'swiper/css';
// import { swiper, swiperSlide } from "vue-awesome-swiper";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";


export default {
  data() {
    return {
      uniqueId: null,
      data: null,
      imgurls: [],
      swiperOption: {
        index: 1,
        slidesPerView: "auto",
        spaceBetween: 30,
        centeredSlides: true,
        loop: true,
        allowTouchMove: true,
      },
    };
  },
  computed: {
    getUniqueId() {
      if (!this.uniqueId) {
        this.uniqueId = "vm-modal-" + this._uid;
        return this.uniqueId;
      }
      return this.uniqueId;
    },
  },
  components: {Swiper,SwiperSlide,},
  methods: {
    showModal(data) {
      this.data = data;
      if(this.data) {
        this.imgurls = [];
        this.swiperOption.index=1;
        (this.data.ad_imgurl1 !== undefined && this.data.ad_imgurl1.length) ? this.imgurls.push(this.data.ad_imgurl1) : '';
        (this.data.ad_imgurl2 !== undefined && this.data.ad_imgurl2.length) ? this.imgurls.push(this.data.ad_imgurl2) : '';
        (this.data.ad_imgurl3 !== undefined && this.data.ad_imgurl3.length) ? this.imgurls.push(this.data.ad_imgurl3) : '';
      }
      $("#" + this.getUniqueId).modal("show");
    },
    handleNoImg(e) { e.target.src = noimg; },
    slideChangeTransitionStart(i) {},
    slideStep(i) {this.$refs.swiper.swiper.slideTo(i - 1);},   
    getUuidv4() { return uuidv4(); },     
  },
};
</script>

<style scoped></style>
