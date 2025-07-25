<template>
    <section id="findId" class="bg-light m-h-100">
        <article
            class="find-wrap container-xl d-flex justify-content-center align-items-center modal-dialog-centered"
        >
            <div class="wrap row col-xl-5 col-lg-6 col-md-8 col-12">
                <div class="process-title mb-3 col-12">
                    <img
                        src="../assets/image/h3.png"
                        alt="h3"
                        @click="$router.push('/login').catch(() => {})"
                    />
                    <h3>아이디 찾기</h3>
                    <p>회원가입시 작성한 정보를 입력해 주세요.</p>
                </div>
                <form
                    @submit.prevent="submitForm"
                    onkeydown="return event.key == 'Enter' ? false : true"
                    class="mb-0 col-12"
                >
                    <div class="mb-2">
                        <label for="findIname" class="form-label">이름</label>
                        <input
                            type="text"
                            class="form-control shadow-none"
                            id="findIname"
                            placeholder="이름을 입력해 주세요."
                            v-model="findIname"
                            @blur="blurFindIname"
                        />
                        <div
                            v-if="findInameErrorMessage.length > 0"
                            id="findInamefeedback"
                            class="invalid-feedback d-block"
                        >
                            {{ findInameErrorMessage }}
                        </div>
                    </div>
                    <div class="row mb-2">
                        <div class="col-9 pl-0 pr-0">
                            <div>
                                <label for="findIemail" class="form-label"
                                    >이메일</label
                                >
                                <input
                                    type="email"
                                    class="form-control shadow-none"
                                    id="findIemail"
                                    placeholder="이메일을 입력해 주세요."
                                    v-model="findIemail"
                                    @blur="blurFindIemail"
                                />
                            </div>
                        </div>
                        <div
                            class="col pr-0 d-flex justify-content-start align-items-end"
                        >
                            <button
                                type="button"
                                class="btn-email-auth-no btn process-btn shadow-none btn-hover w-100"
                                @click="clickBtnEmailAuthNo"
                            >
                                인증코드
                            </button>
                        </div>
                        <div
                            v-if="findIemailErrorMessage.length > 0"
                            id="findIemailfeedback"
                            class="invalid-feedback d-block"
                        >
                            {{ findIemailErrorMessage }}
                        </div>
                        <div
                            v-if="logMessage.length > 0"
                            class="input-group mb-3"
                        >
                            <div class="invalid-feedback d-block">
                                {{ logMessage }}
                            </div>
                        </div>
                    </div>
                    <div class="mb-2">
                        <input
                            type="text"
                            class="email-auth-no form-control shadow-none"
                            id="emailAuthNo"
                            placeholder="인증코드를 입력해주세요."
                            v-model="emailAuthNo"
                            :disabled="isDisable === true"
                        />
                    </div>

                    <div class="button-group mt-3">
                        <button
                            type="button"
                            @click="clickLoginBtn"
                            class="btn process-btn shadow-none btn-hover"
                        >
                            로그인 페이지로
                        </button>
                        <button
                            type="submit"
                            class="btn process-btn shadow-none btn-hover"
                            data-target="#findId"
                        >
                            다음
                        </button>
                        <!--<button type="submit" class="btn process-btn shadow-none btn-hover">아이디 찾기</button>-->
                    </div>
                </form>
            </div>
        </article>
        <find-id-modal ref="findIdModal" style="display: none"></find-id-modal>
        <view-menu @mountedMain="handleMountedMain"></view-menu>
    </section>
</template>

<script>
import $ from "jquery";
import {
    isblank,
    isNotEmail,
    clearBody,
    addClassView,
} from "../assets/js/common.js";
import { SHA256 } from "../assets/js/sha256.js";
import { API_URL, TEMP_KEY } from "../configs/config.js";
import findIdModal from "../components/modal/findIdModal.vue";
import viewMenu from "../components/layout/viewMenu.vue";

export default {
    data() {
        return {
            ajax: true,
            findIname: "",
            findIemail: "",
            findInameErrorMessage: "",
            findIemailErrorMessage: "",
            logMessage: "",
            emailAuthNo: '',
            isDisable: true,
        };
    },
    components: {
        findIdModal,
        viewMenu,
    },
    created() {},
    mounted() {},
    methods: {
        handleMountedMain() {
            this.$emit("mountedMain", false);
        },
        validate() {
            this.logMessage = "";

            // this.blurFindIname();
            this.blurFindIemail();
        },
        clickLoginBtn() {
            this.$router.push("/");
        },
        submitForm() {
            var vm = this;
            this.ajax = true;
            this.validate();

            if (this.ajax) {
                $.ajax({
                    type: "POST", //요청 메소드 방식
                    url: API_URL + "/user/findid",
                    headers: { authorization: SHA256(TEMP_KEY) },
                    data: {
                      "username" : vm.findIname,
                      "useremail" : vm.findIemail,
                      "code": vm.emailAuthNo
                    },
                    success: function (data) {
                        // console.log(data);
                        if (data.result === "success") {
                            vm.$refs.findIdModal.showModal();
                        } else {
                          vm.logMessage = '인증이 실패하였습니다. 다시 한번 확인해주세요.';
                        }
                    },
                    error: function (a, b, c) {
                        vm.logMessage = b;
                    },
                });
            }
        },
        blurFindIname() {
            this.findInameErrorMessage = "";
            if (isblank(this.findIname)) {
                this.findInameErrorMessage = "이름을 입력해주세요.";
                this.ajax = false;
            }
        },
        blurFindIemail() {
            this.findIemailErrorMessage = "";
            if (isNotEmail(this.findIemail)) {
                this.findIemailErrorMessage =
                    "이메일 주소가 올바르지 않습니다.";
                this.ajax = false;
            }
        },
        clickBtnEmailAuthNo() {
          let vm = this;
          vm.emailAuthNo = '';
          vm.isDisable = true;
					$.ajax({
						type: "POST", //요청 메소드 방식
						url: API_URL + "/user/emailauthnoforid",
						headers : { "authorization" : SHA256(TEMP_KEY) },
						data : {
							"username" : vm.findIname,
							"useremail" : vm.findIemail,
						},
						success : function(data){
              if(data.status === '200') {
                vm.isDisable = false;

              } else {
                alert('이름 및 이메일 정보를 확인해주세요.');
              }
            },
						error : function(a, b, c){},
					});
        }
    },
};
</script>

<style scoped>
</style>