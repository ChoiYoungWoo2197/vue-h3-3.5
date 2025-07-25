<template>
    <section class="row d-flex dashboard">
        <big-menu 
        :pMenu="'dashboard'"
        @mountedMain="activeMain"></big-menu>
		<div class="full-wrap d-flex flex-column non-reverse">
			<article class="admin-list flex-none">
                <div class="admin-title">
					<h3>네이버 Bizmoney 실행</h3>
					<form @submit.prevent="submitBizmoneyForm" onkeydown="return event.key == 'Enter' ? false : true">
                        <div class="row">
                            <div class="col-sm-6">
                                <label for="aMethod" class="form-label mt-2">method</label>
                                <input type="text" class="form-control shadow-none" id="aMethod" placeholder="method" >
                            </div>
                            <div class="col-sm-6">
                                <label for="aUrl" class="form-label mt-2">url</label>
                                <input type="text" class="form-control shadow-none" id="aUrl" placeholder="url" >
                            </div>
                        </div>
                        <!-- <div class="row">
                            <div class="col-sm">
                                <div class="alert alert-secondary" role="alert" v-text="alert" style="height : 400px; ">
                               
                                </div>
                            </div>
                        </div> -->
                        <div class="row">
                            <div class="col-sm">
                                <!-- <label for="aCode" class="form-label mt-2">실행</label> -->
                                <button type="submit" class="btn btn-primary" >실행</button>
                            </div>
                        </div>
					</form>
				</div>
			</article>
		</div>
    </section>
</template>

<script>
import $ from 'jquery';
import bigMenu from '../components/layout/bigMenu.vue';
import {API_URL, TEMP_KEY} from '../configs/config.js';
import { store } from '../store/store.js';
import { SHA256 } from '../assets/js/sha256.js';

    export default {
        data() {
            return {
                alert : ''
            }
        },
        components : {
			bigMenu,
		},
        methods: {
            activeMain(flag) {
                this.$emit('mountedMain', true);
                this.$emit('mountedDasyboad', true);
            },
            submitBizmoneyForm() {
                $.ajax({
					type: 'post', //요청 메소드 방식
					// url: API_URL + '/app/naver/bizmoney',
					url: API_URL + '/index',
                    headers : { "authorization" : SHA256(TEMP_KEY) },
                    data: {
                        // "session" : store.state.userStore.session
                    },
                    beforeSend: function (xhr) {
                    },
                    success: function (res) {
                        console.log("jquery");
                        console.log(res);
                    }
                });
            },
        }
    }
</script>

<style scoped>

</style>