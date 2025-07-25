<template>
    <footer :id="getUniqueId" class="w991d">
		<a href="#"><img src="../../assets/image/heeilw.png" alt="희일커뮤니케이션"></a>
		<div class="d-flex justify-content-center align-items-center">
			<a class="d-flex justify-content-center align-items-center" href="#" @click="clickDtMode">PC버전</a>
		</div>
	</footer>
</template>

<script>
import $ from 'jquery';

    export default {
        data() {
			return {
				uniqueId : null,
			}
		},
		computed: {
            getUniqueId() {
                if(!this.uniqueId) {
                    this.uniqueId = 'vm-' + this._uid;
                    return this.uniqueId;
                }
                return this.uniqueId;
            },
        },
        methods: {
            clickDtMode() {
                // console.log(this.$router);
                document.cookie="DesktopMode=true";
                document.cookie="DesktopModeScale="+$('html').width()/1024;
                window.scrollTo(0,0);
                this.$router.go(this.$router.currentRoute);
            }
        }
    }
</script>

<style scoped>

</style>