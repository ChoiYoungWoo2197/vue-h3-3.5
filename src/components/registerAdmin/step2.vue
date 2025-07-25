<template>
  <div onkeydown="return event.key == 'Enter' ? false : true" :class="getUniqueId">
    <table class="agency mb-2">
      <colgroup>
        <col width="17%">
        <col width="20%">
        <col width="">
      </colgroup>
      <thead>
        <tr>
          <td class="text-left">매체</td>
          <td class="text-left">연동상태</td>          
          <td class="text-left">연동하기</td>          
        </tr>
      </thead>
      <tbody>
        <template v-for="(k,i) in ['naver','kakaosa','naverda','kakaomo','google']" :key="i+getUuidv4()">
          <tr >
            <td class="text-left">
               <img :src="(require(`@/assets/image/icon_${k}.png`))"  alt="아이콘" class="icon"/>
               <span>{{getMedia(k)}}</span>
            </td>
            <td class="text-left"><span class="dot bg-danger"></span>미연동</td>
            <td>
              <template v-if="k==='naver'">
                <div class="d-flex">
                  <input type="text" class="form-control" id="" placeholder="검색광고ID (예: heeil)" @blur="changeInput(k,'spare1',$event.target.value)"/>
                  <input type="text" class="form-control" id="" placeholder="커스텀ID (예: 234810)" @blur="changeInput(k,'spare2',$event.target.value)"/>
                  <input type="text" class="form-control" id="" placeholder="액세스 라이선스 (예: 01000000001f9301efc997e99a24129c8170fb141c1462931896447b95090a59b40ec940dd)" @blur="changeInput(k,'spare3',$event.target.value)"/>
                  <input type="text" class="form-control" id="" placeholder="비밀키 (예: AQAAAAAfkwHvyZfpmiQSnIFw+xQc5y22/5mrnJxAEzY6f0KHJg==)" @blur="changeInput(k,'spare4',$event.target.value)"/>
                </div>
              </template>
              <template v-else>
                <div class="d-flex">
                  <input type="text" class="form-control" id="" placeholder="광고계정ID (예: 234810)" @blur="changeInput(k,'spare1',$event.target.value)"/>
                </div>                
              </template>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <two-btn @prev="prev" @next="next"></two-btn>
  </div>
</template>

<script>
import { store } from "@/store/store.js";
import twoBtn from "@/components/registerAdmin/twoBtn.vue";
import { isMobile, priceToString, getMedia, uuidv4, getType} from "@/assets/js/common.js";

export default {
  props: {},
  data() {
    return {
      ajax: true,
      uniqueId: null,
      reportInfo: {
        naver:{spare1: null,spare2: null,spare3: null,spare4: null,},
        kakaosa:{spare1: null},
        naverda:{spare1: null},
        kakaomo:{spare1: null},
        google:{spare1: null}
      },
      error: {},
      step: 2,
    };
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
  components: {twoBtn,},
  watch: {},
  mounted() {},
  methods: {
    validate() {

    },
    getData() {
      return this.reportInfo;
    },
    prev() {
      let vm = this;
      vm.$emit("prev");
    },
    next() {
      let vm = this;
      vm.ajax = true;
      //vm.validate();
      vm.ajax ? vm.$emit("next") : "";
    },
    getUuidv4() { return uuidv4(); },
    getMedia(media) { return getMedia(media); },
    changeInput(media,col,value){ this.reportInfo[media][col] = value; }
  },
};
</script>

<style></style>
