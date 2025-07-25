<template>
    <!-- <div :id="getUniqueId" class="d-flex justify-content-center align-items-center" style="height : 200px;"> -->
    <div :id="getUniqueId" class="d-flex justify-content-center align-items-center" :style="{'height' : pheight + 'px'}">
    	<!-- <div class="spinner-border" role="status">
    		<span class="sr-only">Loading...</span>
    	</div> -->
        <div class="text-center">
            <img src="../../assets/image/loading.gif" class="rounded" alt="...">
        </div>
    </div>
</template>

<script>
import $ from 'jquery';
import {API_URL, TEMP_KEY} from '../../configs/config.js';
import {SHA256 } from  '../../assets/js/sha256.js';

    export default {
        props : {
			pheight : Number
		},
        data() {
            return {
                uniqueId : null,
            }
        },
        computed: {
            getUniqueId() {
                if(!this.uniqueId) {
                    this.uniqueId = 'vm-select2-' + this._uid;
                    return this.uniqueId;
                }
                return this.uniqueId;
            },
        },
        methods: {
            showModal() {
                $('#'+ this.getUniqueId).modal("show");
            },
            hideModal() {
                $('#'+ this.getUniqueId).modal("hide");
            },
        }
    }
</script>

<style scoped>

</style>