<template>
      <!-- 상단바 -->
      <div class="m-top" :class="getUniqueId" >
        <nav class="d-flex justify-content-between align-items-center">
          <div class="menu-info d-flex align-items-center" @click="clickLogo">
            <div class="logo d-flex justify-content-center align-items-center">
              <a
                href="dashboard1-1.html"
                class="d-flex justify-content-center align-items-center"
                ><img
                  src="../../../assets/image/icon_heeil.png"
                  alt="희일커뮤니케이션"
                  class="icon"
              /></a>
            </div>
          </div>
          <h2 v-if="username !== null"> {{username}}</h2>
          <div class="menu-icon d-flex justify-content-center align-items-center">
            <button
              class="btn d-flex justify-content-center align-items-center"
              type="button"
              data-toggle="offcanvas"
              data-target="#nav"
              aria-controls="nav"
              aria-expanded="false"
              aria-label="Toggle navigation"
              @click="clickBigMenu"
            >
              <i class="bi bi-list icon"></i>
            </button>
          </div>
        </nav>
      </div>
</template>

<script>
import $ from 'jquery';
import { clearBody, addClassDashboard, isMobile, hideLayout, hideOffcanvas } from "../../../assets/js/common.js";
import { store } from "../../../store/store.js";

  export default {
    props: {
      pMenu: null,
      pDasyboard: false,
    },    
    data() {
      return {
        menu: null,
        uniqueId: null,
        username: null,
        userid: null,
      };
    },
    mounted() {
      this.menu = this.pMenu;
      clearBody();
      addClassDashboard();
      this.username = store.state.userStore.userinfo.username;
      this.userid = store.state.userStore.userinfo.userid;
      this.$emit("mountedMain", true);
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
    methods: {
      clickBigMenu() {
        hideLayout();
        hideOffcanvas();

        let bigMenu2 = document.querySelector('.m-wrap > .big-menu-2');
        bigMenu2.classList.remove('d-none');
        bigMenu2.classList.add('open');
      },
      clickLogo() {
        this.$router.push('/dashboard');
      }

    }
  }
</script>

<style >

</style>