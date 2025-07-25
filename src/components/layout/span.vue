<template>
    <span :class="getUniqueId" class="screen-darken"></span>
</template>

<script>
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
    }
</script>

<style scoped>

</style>