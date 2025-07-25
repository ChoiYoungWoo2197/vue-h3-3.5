<template>
  <div :class="getUniqueId" class="step-section-container">
    <swiper ref="swiper" class="tab-content swiper" id="pills-tabContent" :options="swiperOption" @slideChange="slideChangeTransitionStart">
      <slot></slot>
    </swiper>
  </div>
</template>

<script>
// import "swiper/dist/css/swiper.css";
import 'swiper/css';
// import { swiper, swiperSlide } from "vue-awesome-swiper";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";

export default {
  props: {},
  data() {
    return {
      uniqueId: null,
      swiperOption: {
        index: 1,
        slidesPerView: "auto",
        spaceBetween: 30,
        centeredSlides: true,
        loop: false,
        allowTouchMove: false,
      },
    };
  },
  computed: {
    getUniqueId() {
      if (!this.uniqueId) {
        this.uniqueId = "vm-" + this._uid;
        return this.uniqueId;
      }
      return this.uniqueId;
    },
  },
  components: {Swiper,SwiperSlide,},
  watch: {},
  mounted() {},
  methods: {
    slideChangeTransitionStart(i) {},
    slideStep(i) {this.$refs.swiper.swiper.slideTo(i - 1);},
  },
};
</script>

<style></style>
