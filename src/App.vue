<template>
  <div id="app" class="m-h-100 view">
    <template v-if="dasyboard === true">
      <router-view @mountedMain="activeMain" @mountedDasyboad="activeDasyboard">
      </router-view>
    </template>
    <template v-else>
      <h-3-header v-if="isMain" :pDasyboard="dasyboard"></h-3-header>
      <h-3-navbar v-if="isMain" :pDasyboard="dasyboard"></h-3-navbar>
      <h-3-span v-if="isMain"></h-3-span>
      <router-view @mountedMain="activeMain" @mountedDasyboad="activeDasyboard">
      </router-view>
      <h-3-footer v-if="isMain === false"></h-3-footer>
      <h-3-footer-2 v-if="isMain"></h-3-footer-2>
    </template>
  </div>
</template>

<script>
import h3Header from "./components/layout/header.vue";
import h3Navbar from "./components/layout/navbar.vue";
import h3Footer from "./components/layout/footer.vue";
import h3Footer2 from "./components/layout/footer2.vue";
import h3Span from "./components/layout/span.vue";
import { getCookie } from "./assets/js/common.js";
import { store } from "./store/store.js";

export default {
  name: "app",
  data() {
    return {
      // msg: 'Welcome to Your Vue.js App'
      main: false,
      dasyboard: false,
    };
  },
  components: {
    h3Header,
    h3Navbar,
    h3Footer,
    h3Footer2,
    h3Span,
  },
  computed: {
    isMain() {
      return this.main;
    },
  },
  mounted() {
    this.clearCache();
  },
  beforeDestroy() {
    // console.log('beforeDestroy');
  },
  destroyed() {
    // console.log('beforeDestroy');
    if (this.main) {
      document.cookie = "DesktopMode=false";
      // this.$store.commit("logout");
    }
  },
  methods: {
    clearCache() {
      // localStorage.getItem("vuex") !== null ? localStorage.removeItem("vuex") : '';

      var desktopModeTF = getCookie("DesktopMode");
      var Scale = getCookie("DesktopModeScale");

      if (desktopModeTF == "true") {
        document.write(
          '<meta name="viewport" content="width=1024, user-scalable=yes, initial-scale=' +
            Scale +
            '">'
        );
      } else {
        document.write(
          '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
        );
      }

      this.$store.commit("initDate", {});
    },
    activeMain(flag) {
      this.main = flag;
    },
    activeDasyboard(flag) {
      this.dasyboard = flag;
    },
  },
};
</script>

<style></style>
