<template>
  <section id="terms" class="bg-light m-h-100">
    <article
      class="terms-wrap container-xl d-flex justify-content-center align-items-center modal-dialog-centered"
    >
      <div class="wrap row col-xl-8 col-lg-6 col-md-12 col-12">
        <div class="process-title mb-3 col-12">
          <img
            src="../assets/image/h3.png"
            alt="h3"
            @click="$router.push('/login').catch(() => {})"
          />
          <h3>회원가입</h3>
        </div>
        <form onkeydown="return event.key == 'Enter' ? false : true" class="mb-0 col-12">
          <div class="form-check d-flex align-items-center">
            <input
              class="form-check-input shadow-none"
              type="checkbox"
              id="allAgree"
              name="allAgree"
              value="true"
              checked=""
              v-model="checkAll"
              @change="changeChkAll"
            />
            <label class="form-check-label" for="allAgree">모두 동의</label>
            <button></button>
            <!-- <button class="privacy-btn" type="button" data-toggle="collapse" data-target=".multi-collapse" aria-expanded="false" aria-controls="terms privacy">모두 보기 <i class="bi bi-caret-down-fill"></i></button> -->
          </div>
          <div class="form-check d-flex align-items-center mb-2">
            <input
              class="form-check-input shadow-none"
              type="checkbox"
              id="termsAgree"
              name="agree"
              value="true"
              checked=""
              v-model="checkTerms"
            />
            <label class="form-check-label" for="termsAgree"
              >서비스 이용약관 동의<span>(필수)</span></label
            >
            <!-- <button class="privacy-btn" type="button" data-toggle="collapse" data-target="#terms" aria-expanded="false" aria-controls="terms">보기 <i class="bi bi-caret-down-fill"></i></button> -->
          </div>
          <div id="terms">
            <div class="card card-body privacy rounded mb-3">
              <p>■ 서비스 이용약관</p>
              <p>
                <a
                  href="https://www.heeil.com/template/solution/solution.php?pmid=solution_intro"
                  target="_blank"
                  style="
                    color: #14aee1 !important;
                    display: inline;
                    text-decoration: underline;
                  "
                  >H-solution 통합광고시스템 소개 바로가기</a
                >
              </p>
            </div>
          </div>
          <div class="form-check d-flex align-items-center mb-2">
            <input
              class="form-check-input shadow-none"
              type="checkbox"
              id="privacyAgree"
              name="agree"
              value="true"
              checked=""
              v-model="checkPrivacy"
            />
            <label class="form-check-label" for="privacyAgree"
              >개인정보 수집 및 이용 동의<span>(필수)</span></label
            >
            <!-- <button class="privacy-btn" type="button" data-toggle="collapse" data-target="#privacy" aria-expanded="false" aria-controls="privacy">보기 <i class="bi bi-caret-down-fill"></i></button> -->
          </div>
          <div id="privacy">
            <div class="card card-body privacy rounded mb-3">
              <p>■ 개인정보 수집 및 이용안내</p>
              <p>광고 관리를 위한 개인정보 수집 및 이용에 관한 동의</p>
              <p>
                1. 제공받는 개인정보 항목 : 이름, 업체명, 이메일, 휴대번호, 광고 계정 정보
              </p>
              <p>
                2. 개인정보의 수집 및 이용목적 : 광고 관리 및 매체 분석을 위한 자료 수집
              </p>
              <p>3. 개인정보 보유 및 이용기간 : 회원 탈퇴 시까지 보관, 탈퇴 후 파기</p>
              <p>
                개인정보 수집에 동의하지 않으면 회원가입이 제한될 수 있으며, 정보
                오기입으로 인한 문제발생 시 책임지지 않습니다.
              </p>
            </div>
          </div>
          <div class="button-group mt-5">
            <button
              type="button"
              @click="clickLoginBtn"
              class="btn process-btn shadow-none btn-hover"
            >
              이전
            </button>
            <button
              type="button"
              @click="clickRegisterBtn"
              class="btn process-btn shadow-none btn-hover"
            >
              다음
            </button>
            <!--<button type="submit" class="btn process-btn shadow-none btn-hover">다음</button>-->
          </div>
        </form>
      </div>
    </article>
    <view-menu @mountedMain="handleMountedMain"></view-menu>
  </section>
</template>

<script>
import $ from "jquery";
import { addClassView } from "../assets/js/common.js";
import viewMenu from "../components/layout/viewMenu.vue";

export default {
  data() {
    return {
      checkAll: true,
      checkTerms: true,
      checkPrivacy: true,
    };
  },
  components: {
    viewMenu,
  },
  created() {},
  mounted() {},
  methods: {
    handleMountedMain() {
      this.$emit("mountedMain", false);
    },
    clickLoginBtn() {
      this.$router.push("/");
    },
    clickRegisterBtn() {
      if (!this.checkTerms || !this.checkPrivacy) {
        alert("H3 서비스 이용약관 및 개인정보 처리방침에 동의해주세요.");
      } else {
        this.$router.push("/register");
      }
    },
    changeChkAll() {
      if (this.checkAll) {
        this.checkTerms = true;
        this.checkPrivacy = true;
      } else {
        this.checkTerms = false;
        this.checkPrivacy = false;
      }
    },
  },
};
</script>

<style scoped></style>
