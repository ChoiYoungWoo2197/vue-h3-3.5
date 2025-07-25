<template>
    <div class="modal fade show" :id="getUniqueId" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="joinApprove" aria-modal="true" role="dialog" style="display: block;">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-title">
					<h3>메세지</h3>
					<h5>
                        <slot name="message">

                        </slot>
                    </h5>
				</div>
				<div class="modal-button d-flex">
					<button class="btn shadow-none mr-2" data-dismiss="modal">닫기</button>
					<!-- <button class="btn shadow-none" data-dismiss="modal" data-toggle="modal" data-target="#confirm">로그인 페이지로</button> -->
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
        methods: {
            showModal() {
                $('#'+ this.getUniqueId).modal("show");
            }
        }
    }
</script>

<style scoped>

</style>