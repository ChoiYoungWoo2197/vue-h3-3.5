<template>
    <div class="modal" :id="getUniqueId" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="confirm" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-title">
					<h3 style="color : #666;">로그아웃</h3>
					<h5>
                        <span style="color : #666;">지금 로그아웃하시겠습니까?</span> 
                    </h5>
				</div>
				<div class="modal-button d-flex">
					<button class="btn shadow-none mr-2" data-dismiss="modal">닫기</button>
					<button class="btn shadow-none" data-dismiss="modal" data-toggle="modal" data-target="#confirm" @click="submitForm">로그아웃</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import $ from 'jquery';
import { store } from '../../store/store.js';

    export default {
        data() {
            return {
                uniqueId : null,
            }
        },
        computed: {
            getUniqueId() {
                if(!this.uniqueId) {
                    this.uniqueId = 'vm-modal-' + this._uid;
                    return this.uniqueId;
                }
                return this.uniqueId;
            }
        },
        updated() {
        },
        methods: {
            showModal() {
                $('#'+ this.getUniqueId).modal("show");
                $('.modal-backdrop').remove();
            },
            submitForm() {
                var vm = this;
                this.$store.commit("logout");
                this.$store.commit("logoutActivedMdias");
                this.$store.commit("logoutKakaoSa");
                this.$router.push("/");
            }
        }
    }
</script>

<style scoped>

</style>