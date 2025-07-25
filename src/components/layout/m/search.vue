<template>
  <div class="m-search" :class="getUniqueId">
    <table class="date">
      <colgroup>
        <col width="30%" />
        <col width="70%" />
      </colgroup>
      <tbody>
        <tr>
          <td>키워드</td>
          <td>
            <div class="input-container">
              <a href="#" class="d-flex justify-content-center align-items-center" @click="clickSearchBtn">
                <i class="bi bi-search"></i>
              </a>
              <div>
                <input type="search" v-model="search" @keyup.enter="clickSearchBtn" placeholder="키워드를 입력해보세요.(최대 5개)"/>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import $ from "jquery";
import {
  clearBody,
  addClassDashboard,
  isMobile,
  hideLayout,
  hideOffcanvas,
} from "../../../assets/js/common.js";
import { store } from "../../../store/store.js";

export default {
  props: {
    pMenu: null,
    pDasyboard: false,
    pSearch: null,
  },
  data() {
    return {
      menu: null,
      uniqueId: null,
      username: null,
      userid: null,
      search: null,
    };
  },
  watch: {
    pSearch() {
      this.search = this.pSearch;
    }
  },
  mounted() {
    this.menu = this.pMenu;
    this.search = this.pSearch;
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

      let bigMenu2 = document.querySelector(".m-wrap > .big-menu-2");
      bigMenu2.classList.remove("d-none");
      bigMenu2.classList.add("open");
    },
    clickLogo() {
      this.$router.push("/dashboard");
    },
    clickSearchBtn() {
      // console.log(this.search);
      this.$emit('changedData', this.search);
      this.search = null;
    }
  },
};
</script>

<style></style>
