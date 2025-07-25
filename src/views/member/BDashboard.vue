<template>
    <div>
        <p></p>
    </div>
</template>

<script>
import $ from 'jquery';
import { store } from '../../store/store.js';


    export default {
        data() {
            return {

            }
        },
        mounted() {
            this.$store.commit("login", {
								"userinfo" : {
									'usercompany'   : this.$route.query.usercompany,
									'useremail'     : this.$route.query.useremail,
									'userid'        : this.$route.query.userid,
									'userlevel'     : Number(this.$route.query.userlevel),
									'username'      : this.$route.query.username,
									'userpassupdate': this.$route.query.userpassupdate,
									'userphone'     : this.$route.query.userphone,
									'userregdate'   : this.$route.query.userregdate,
									'userseq'       : Number(this.$route.query.userseq),
									'userstatus'    : Number(this.$route.query.userstatus)
                                },
                                "managerinfo" : {
                                    'username' : this.$route.query.managername, 
                                    'userid': this.$route.query.manageruserid,
                                    'userphone' : this.$route.query.manageruserphone,
                                    'useremail' : this.$route.query.manageruseremail,
                                },
								"session"  : this.$route.query.session,
			});

            this.$route.query.userlevel === "1" ? this.$router.replace("/dashboard") : this.$router.replace("/agency");
        }
        
    }
</script>

