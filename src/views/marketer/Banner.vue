<template>
  <section class="row d-flex">
    <big-menu :pMenu="'agency'" @mountedMain="activeMain"></big-menu>
    <div class="full-wrap d-flex flex-column w-100">
      <!-- <div class="half-wrap d-flex m-none">
        <article class="admin-list flex-none">
          <div class="admin-title">
            <div class="d-flex justify-content-between align-items-center row">
              <h3 class="mb-3">배너관리</h3>
              <form action="" class="form-inline multi-search">
                <select name="" id="" class="form-control shadow-none rounded-0 mr-2 font-14 select-lg" v-model="pgroups" @change="clickPgroups" >
                  <template v-for="s in slbs[media]" :key="s + getUuidv4()">
                    <option  :value="s.k" :selected="s.ck">{{ s.v }}</option>
                  </template>
                </select>
                <select name="" id="" class="form-control shadow-none rounded-0 mr-2 font-14" v-model="media" @change="clickMedia" >
                  <option value="naverda">네이버디스플레이</option>
                  <option value="kakaomo">카카오모먼트</option>
                </select>
                <date-range-picker ref="dateRangePicker" class="form-control mr-2" :pStart="start" :pEnd="end" :pDisabled="false" @changedDate="handleChangedDateRange" ></date-range-picker>
                <button type="button" class="form-btn color-btn w991u" @click.prevent="clickSearchBtn" > 조회하기 </button>
              </form>
            </div>
            <div class="d-flex align-items-center row mt-4">
              <div class="tabmenu">
                <button v-for="k in btns" :key="k + getUuidv4()" type="button" class="btn select mr-2" :class="{ active: k.ck === true }" @click="clickBtn($event, k)" > {{ k.v }} </button>
              </div>
            </div>
          </div>
          <div class="w991u">
            <template v-for="k in btns">
              <h5 v-if="k.ck === true" :key="k + getUuidv4()" class="mb-2"> {{ "총" + k.v + " TOP10" }} </h5>
            </template>
            <table>
              <thead>
                <th class="text-left" width="40">#</th>
                <th class="text-left" width="10%">마케터</th>
                <th class="text-left" width="10%">업체명</th>
                <th class="text-left" width="25%">소재</th>
                <th class="text-left" width="16%">게재 위치</th>
                <th class="text-left">광고 그룹 예산</th>
                <th class="text-left">입찰 전략</th>
                <th class="text-left">비용관리</th>
                <template v-for="k2 in btns">
                  <th v-if="k2.ck === true" :key="k2 + getUuidv4()" class="text-right"> {{ k2.v }} </th>
                </template>
              </thead>
              <tbody>
                <tr v-for="(k, i) in main.topads" :key="k + getUuidv4()">
                  <td class="text-left">{{ i + 1 }}</td>
                  <td class="text-left">{{ k.mng_name }}</td>
                  <td class="text-left">{{ k.user_company }}</td>
                  <td class="text-left">
                    <div class="banner-table">
                      <div class="banner-table-title-icon">
                        <span><img class="img-thumbnail" :src="k.ad_image_url" @error="handleNoImg" /></span>
                        <span class="img-thumbnail-hover" @click="clickThumbnail(k)">
                          <div class="d-flex justify-content-center align-items-center">
                            <i class="bi bi-search text-white m-0"></i>
                          </div>
                        </span>
                      </div>
                      <ul>
                        <div class="d-flex txt-left">
                          <div class="w-100">
                            <li class="font-weight-bold"><p>{{ k.ad_headline }}</p></li>
                            <li><p class="sub">{{ "-" + k.ad_id }}</p></li>
                          </div>
                        </div>
                      </ul>
                    </div>
                  </td>
                  <td class="text-left">{{ getPgroups(k.adgroup_pgroups) }}</td>
                  <td class="text-left">{{ priceToString(k.adgroup_budgetamount) + "원" }}</td>
                  <td class="text-left">{{ getBidgoal(k.adgroup_bidgoal) }}</td>
                  <td class="text-left">{{ priceToString(k.adgroup_bidprice) + "원" + "(" + getBidtype(k.adgroup_bidtype) + ")" }}</td>
                  <template v-for="k2 in btns"><td v-if="k2.ck === true" :key="k2 + getUuidv4()" class="text-right">{{ priceToString(k[k2.k]) + getUnits(k2.k) }}</td></template>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </div>
      <div class="half-wrap d-flex m-none">
        <article class="admin-list flex-none">
          <div class="admin-title"></div>
          <div class="w991u">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-2">배너내역</h5>
              <div class="indicator d-flex align-center dropdown">
                <button type="button" class="btn shadow-none p-0" data-toggle="dropdown" aria-expanded="false" ><i class="bi bi-gear m-0"></i></button>
                <div class="dropdown-menu dropdown-menu-right">
                  <form>
                    <div class="form-check" v-for="(k, i) in ibtns" :key="i + getUuidv4()" >
                      <input class="form-check-input" type="checkbox" :id="'indicator' + (i + 1)" :value="k.k" :checked="k.ck" :disabled="k.ds" @change="clickCheckpi($event, k.k)" />
                      <label class="form-check-label" :for="'indicator' + (i + 1)"><p class="d-flex align-items-center">{{ k.v }}</p></label>
                    </div>
                    <div class="form-border"></div>
                    <div class="form-check" v-for="(n, i2) in nbtns" :key="i2 + getUuidv4()">
                      <input class="form-check-input radio-check" type="checkbox" :id="'indicator' + (i2 + 11)" :value="n.v" :checked="main.display === Number(n.v)" @change="clickRadioDisplay($event, Number(n.v))" />
                      <label class="form-check-label" :for="'indicator' + (i2 + 11)"><p class="d-flex align-items-center">{{ n.v + "개" }}</p></label>
                    </div>
                    <button type="button" class="btn indicator-close" data-toggle="dropdown" aria-expanded="false" >닫기</button>
                  </form>
                </div>
              </div>
            </div>
            <table>
              <thead>
                <th class="text-left" width="40px">#</th>
                <th class="text-left" width="10%">마케터</th>
                <th class="text-left" width="10%">업체명</th>
                <th class="text-left" width="25%">소재</th>
                <template v-for="(k, i) in ibtns">
                  <th v-if="k.ck" class="text-right" :key="i + getUuidv4()">
                    {{ k.v }}
                    <template v-if="main.sort === k.k + 'a' || main.sort === k.k + 'd'">
                      <button v-if="main.sort === k.k + 'a'" class="active text-yellow" @click="clickSort(k.k + 'd')"><i class="bi bi-caret-up-fill" :class="{ activeArrow: main.sort === k.k + 'a' || main.sort === k.k + 'd' }"></i></button>
                      <button v-if="main.sort === k.k + 'd'" class="active text-yellow" @click="clickSort(k.k + 'a')" ><i class="bi bi-caret-down-fill" :class="{ activeArrow: main.sort === k.k + 'a' || main.sort === k.k + 'd', }"></i></button>
                    </template>
                    <template v-else>
                      <button class="active" @click="clickSort(k.k + 'd')"><i class="bi bi-caret-down-fill" :class="{ activeArrow: main.sort === k.k + 'a' || main.sort === k.k + 'd', }" ></i></button>
                    </template>
                  </th>
                </template>
              </thead>
              <tbody>
                <template v-if="!main.data || main.data.length === 0">
                  <tr><td class="txt-center" colspan="9">데이터가 존재하지 않습니다.</td></tr>
                </template>
                <template v-else>
                  <tr v-for="(data, i) in getDatasForMain" :key="i + getUuidv4()">
                    <td class="text-left">{{ main.display * main.start + i + 1 }}</td>
                    <td class="text-left">{{ data.mng_name }}</td>
                    <td class="text-left">{{ data.user_company }}</td>
                    <td class="text-left">
                      <div class="banner-table">
                        <div class="banner-table-title-icon">
                          <span><img class="img-thumbnail" :src="data.ad_image_url" @error="handleNoImg"/></span>
                          <span class="img-thumbnail-hover" @click="clickThumbnail(data)"><div class="d-flex justify-content-center align-items-center"><i class="bi bi-search text-white m-0"></i></div></span>
                        </div>
                        <ul>
                          <div class="d-flex txt-left">
                            <div class="w-100">
                              <li class="font-weight-bold"><p>{{ data.ad_headline }}</p></li>
                              <li><p class="sub">{{ "-" + data.ad_id }}</p></li>
                            </div>
                          </div>
                        </ul>
                      </div>
                    </td>
                    <template v-for="(k2, i2) in ibtns">
                      <td v-if="k2.ck" :key="i2 + getUuidv4()" class="text-right">{{ priceToString(data[k2.k]) + getUnits(k2.k) }}</td>
                    </template>
                  </tr>
                </template>
              </tbody>
            </table>
            <ul class="pagination d-flex justify-content-center align-items-center mb-30">
              <li class="page-item">
                <a class="page-link shadow-none" href="javascript:;" aria-label="Previous" @click="clickPreviousFirstPageBtnForMain" >
                  <span aria-hidden="true" ><i class="bi bi-chevron-double-left m-0"></i></span ></a>
              </li>
              <li class="page-item" :class="{ disabled: isFirstPageGroupForMain }">
                <a class="page-link shadow-none" href="javascript:;" aria-label="Previous" @click="clickPreviousPageBtnForMain" >
                  <span aria-hidden="true"><i class="bi bi-chevron-left"></i></span>
                </a>
              </li>
              <li class="page-item" :class="{ active: page - 1 === main.start }" v-for="page in main.pages" :key="page" >
                <a class="page-link shadow-none" href="javascript:;" v-text="page" @click="clickPageBtnForMain(page - 1)" ></a>
              </li>
              <li class="page-item" :class="{ disabled: isLastPageGroupForMain }">
                <a class="page-link shadow-none" href="javascript:;" aria-label="Next" @click="clickNextPageBtnForMain" >
                  <span aria-hidden="true"><i class="bi bi-chevron-right"></i></span>
                </a>
              </li>
              <li class="page-item">
                <a class="page-link shadow-none" href="javascript:;" aria-label="Next" @click="clickNextEndPageBtnForMain" >
                  <span><i class="bi bi-chevron-double-right m-0"></i></span>
                </a>
              </li>
            </ul>
          </div>
        </article>
      </div>
      <article class="admin-list w991d">
        <div class="admin-title d-flex justify-content-between align-items-center row mb-0" >
          <h3 class="">배너관리</h3>
          <div class="indicator d-flex align-center dropdown">
            <button type="button" class="btn shadow-none p-0" data-toggle="dropdown" aria-expanded="false" ><i class="bi bi-gear m-0"></i></button>
            <div class="dropdown-menu dropdown-menu-right">
              <form>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="indicator1" value="cst" @change="'';" />
                  <label class="form-check-label" for="indicator1" ><p class="d-flex align-items-center">광고비</p></label>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="admin-title d-flex justify-content-between align-items-center row">
          <form action="" class="form-inline multi-search w-100">
            <div class="row">
              <date-range-picker ref="dateRangePicker" class="form-control" :pStart="start" :pEnd="end" :pDisabled="false" @changedDate="'';"></date-range-picker>
            </div>
            <div class="row">
              <select name="" id="" class="form-control shadow-none rounded-0 mr-2 font-14">
                <option>네이버디스플레이</option>
                <option>카카오모먼트</option>
              </select>
              <select name="" id="" class="input-group align-items-center">
                <option>총노출수10</option>
                <option>총클릭수10</option>
              </select>
            </div>
          </form>
        </div>
        <div class="m-banner-table">
          <swiper ref="swiper" class="tab-content swiper" id="pills-tabContent">
            <swiper-slide>
              <div class="tab-pane banner-table d-flex" id="pills1" role="tabpanel" aria-labelledby="pills1-tab" tabindex="0" >
                <div>
                  <div class="banner-table-title-icon">
                    <span
                      @click="
                        clickThumbnail({
                          ad_id: '15443166',
                          ad_headline: '골프코디365일 스타일 추천!',
                          ad_description: '',
                          ad_image_url:
                            'https://naverpa-phinf.pstatic.net/MjAyMzA5MDRfMTIx/MDAxNjkzODIwMTg2OTI3.cvTAuuah2knxrvmgK3uWHkEF7Jm5ez9wl8pYA5oV_zMg.v9-8jJ4YEByyhfKEoixptlnD8TlAVHQouTjQZac3yrcg.JPEG/%EB%84%A4%EC%9D%B4%EB%B2%84_169382018691316839991950577412309.jpg',
                        })
                      "
                    >
                      <img
                        class="img-thumbnail"
                        src="https://naverpa-phinf.pstatic.net/MjAyMzA5MDRfMTIx/MDAxNjkzODIwMTg2OTI3.cvTAuuah2knxrvmgK3uWHkEF7Jm5ez9wl8pYA5oV_zMg.v9-8jJ4YEByyhfKEoixptlnD8TlAVHQouTjQZac3yrcg.JPEG/%EB%84%A4%EC%9D%B4%EB%B2%84_169382018691316839991950577412309.jpg"
                        alt=""
                      />
                    </span>
                  </div>
                </div>
                <ul>
                  <div class="banner-table-title">
                    <div class="w-100 flex-column">
                      <li class="d-flex align-items-center">
                        1. 골프코디365일 스타일 추천!
                        <span>(154431)</span>
                      </li>
                      <li></li>
                    </div>
                  </div>
                  <div class="banner-table-content">
                    <div class="w-100 d-flex flex-wrap">
                      <li class="col-12"></li>
                      <li class="col-4">
                        <label for="">노출수</label>
                        <div>1,479,095회</div>
                      </li>
                      <li class="col-4">
                        <label for="">노출수</label>
                        <div>1,479,095회</div>
                      </li>
                      <li class="col-4">
                        <label for="">노출수</label>
                        <div>1,479,095회</div>
                      </li>
                      <li class="col-4">
                        <label for="">노출수</label>
                        <div>1,479,095회</div>
                      </li>
                      <li class="col-4">
                        <label for="">노출수</label>
                        <div>1,479,095회</div>
                      </li>
                    </div>
                  </div>
                </ul>
              </div>
              <div
                class="tab-pane banner-table d-flex"
                id="pills1"
                role="tabpanel"
                aria-labelledby="pills1-tab"
                tabindex="0"
              >
                <div>
                  <div class="banner-table-title-icon">
                    <span
                      @click="
                        clickThumbnail({
                          ad_id: '15443166',
                          ad_headline: '골프코디365일 스타일 추천!',
                          ad_description: '',
                          ad_image_url:
                            'https://naverpa-phinf.pstatic.net/MjAyMzA5MDRfMTIx/MDAxNjkzODIwMTg2OTI3.cvTAuuah2knxrvmgK3uWHkEF7Jm5ez9wl8pYA5oV_zMg.v9-8jJ4YEByyhfKEoixptlnD8TlAVHQouTjQZac3yrcg.JPEG/%EB%84%A4%EC%9D%B4%EB%B2%84_169382018691316839991950577412309.jpg',
                        })
                      "
                    >
                      <img
                        class="img-thumbnail"
                        src="https://naverpa-phinf.pstatic.net/MjAyMzA5MDRfMTIx/MDAxNjkzODIwMTg2OTI3.cvTAuuah2knxrvmgK3uWHkEF7Jm5ez9wl8pYA5oV_zMg.v9-8jJ4YEByyhfKEoixptlnD8TlAVHQouTjQZac3yrcg.JPEG/%EB%84%A4%EC%9D%B4%EB%B2%84_169382018691316839991950577412309.jpg"
                        alt=""
                      />
                    </span>
                  </div>
                </div>
                <ul>
                  <div class="banner-table-title">
                    <div class="w-100 flex-column">
                      <li class="d-flex align-items-center">
                        2. 골프코디365일 스타일 추천!
                        <span>(154431)</span>
                      </li>
                      <li></li>
                    </div>
                  </div>
                  <div class="banner-table-content">
                    <div class="w-100 d-flex flex-wrap">
                      <li class="col-12"></li>
                      <li class="col-4">
                        <label for="">노출수</label>
                        <div>1,479,095회</div>
                      </li>
                      <li class="col-4">
                        <label for="">노출수</label>
                        <div>1,479,095회</div>
                      </li>
                      <li class="col-4">
                        <label for="">노출수</label>
                        <div>1,479,095회</div>
                      </li>
                      <li class="col-4">
                        <label for="">노출수</label>
                        <div>1,479,095회</div>
                      </li>
                      <li class="col-4">
                        <label for="">노출수</label>
                        <div>1,479,095회</div>
                      </li>
                    </div>
                  </div>
                </ul>
              </div>
            </swiper-slide>
          </swiper>
          <ul class="pagination d-flex justify-content-center align-items-center">
            <li class="page-item">
              <a class="page-link shadow-none" href="#" aria-label="Previous">
                <span aria-hidden="true"><i class="bi bi-chevron-left"></i></span>
              </a>
            </li>
            <li class="page-item">
              <a class="page-link shadow-none active" href="#">1</a>
            </li>
            <li class="page-item"><a class="page-link shadow-none" href="#">2</a></li>
            <li class="page-item"><a class="page-link shadow-none" href="#">3</a></li>
            <li class="page-item"><a class="page-link shadow-none" href="#">4</a></li>
            <li class="page-item"><a class="page-link shadow-none" href="#">5</a></li>
            <li class="page-item">
              <a class="page-link shadow-none" href="#" aria-label="Next">
                <span aria-hidden="true"><i class="bi bi-chevron-right"></i></span>
              </a>
            </li>
          </ul>
        </div>
      </article> -->
    </div>

    <expire-session-modal ref="expireSessionModal" style="display: none"></expire-session-modal>
    <mask-modal ref="maskModal" style="display: none"></mask-modal>
    <thumbnail-modal ref="thumbnailModal"></thumbnail-modal>
  </section>
</template>

<script>
import $ from "jquery";
import { isMobile, priceToString, uuidv4 } from "@/assets/js/common.js";
import {  API_URL,  TEMP_KEY,  PGGROUPS,  UNITS,  BIDGOAL,  BIDTYPE,  BUDGETTYPE} from "@/configs/config.js";
import { store } from "@/store/store.js";
import { SHA256 } from "@/assets/js/sha256.js";
import datePicker from "@/components/common/datePicker.vue";
import dateRangePicker from "@/components/common/dateRangePicker.vue";
import bigMenu from "@/components/layout/bigMenu.vue";
import expireSessionModal from "@/components/modal/expireSessionModal.vue";
import maskModal from "@/components/modal/maskModal.vue";
import moment from "moment";
import thumbnailModal from "@/components/modal/thumbnailModal.vue";
// import "swiper/dist/css/swiper.css";
import 'swiper/css';
// import { swiper, swiperSlide } from "vue-awesome-swiper";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import noimg from "@/assets/image/noimg.png";

export default {
  data() {
    return {
      start: moment().subtract(31, "days").format("YYYY-MM-DD"),
      end: moment().subtract(1, "days").format("YYYY-MM-DD"),
      media: "naverda",
      pgroups: "99",
      slbs: {
        naverda: [
          { k: "99", v: "네이버 > 전체", ck: true },
          { k: "0", v: "네이버 패밀리 매체 > 피드 영역", ck: false },
          { k: "1", v: "네이버 패밀리 매체 > 배너 영역", ck: false },
          { k: "2", v: "네이버 패밀리 매체 > 스마트채널", ck: false },
          { k: "3", v: "네이버 > 배너 영역 > 서비스 통합", ck: false },
          { k: "4", v: "네이버 > 피드 영역", ck: false },
          { k: "5", v: "네이버 > 배너 영역 > 네이버 메인", ck: false },
          { k: "6", v: "네이버 > 스마트채널", ck: false },
          { k: "7", v: "네이버 퍼포먼스 네트워크 > 배너 영역", ck: false },
          { k: "8", v: "네이버 퍼포먼스 네트워크 > 스마트채널", ck: false },
          { k: "9", v: "네이버 > 커뮤니케이션 영역", ck: false },
          { k: "10", v: "네이버 > 인스트림 영역", ck: false },
          { k: "11", v: "네이버 > 쇼핑 영역", ck: false },
        ],
        kakaomo: [
          { k: "99", v: "모먼트 > 전체", ck: true },
          { k: "0", v: "카카오톡", ck: false },
          { k: "1", v: "카카오스토리", ck: false },
          { k: "2", v: "다음", ck: false },
          { k: "3", v: "카카오 서비스", ck: false },
          { k: "4", v: "네트워크", ck: false },
        ],
      },
      btns: [
        { k: "im", v: "노출수", ck: true },
        { k: "clk", v: "클릭수", ck: false },
        { k: "ctr", v: "클릭률", ck: false },
        { k: "cpc", v: "클릭 당 비용", ck: false },
        { k: "cst", v: "광고비", ck: false },
        { k: "cv", v: "전환수", ck: false },
        { k: "cvr", v: "전환율", ck: false },
        { k: "cr", v: "전환매출", ck: false },
        { k: "cpa", v: "전환 당 비용", ck: false },
        { k: "roas", v: "ROAS", ck: false },
      ],
      ibtns: [
        { k: "cst", v: "광고비", ck: true, ds: true },
        { k: "im", v: "노출수", ck: true, ds: true },
        { k: "clk", v: "클릭수", ck: true, ds: true },
        { k: "cv", v: "전환수", ck: false, ds: false },
        { k: "cvr", v: "전환율", ck: false, ds: false },
        { k: "cr", v: "전환매출", ck: false, ds: false },
        { k: "ctr", v: "클릭률", ck: true, ds: true },
        { k: "cpa", v: "전환 당 비용", ck: false, ds: false },
        { k: "cpc", v: "클릭 당 비용", ck: true, ds: true },
        { k: "roas", v: "ROAS", ck: false },
      ],
      nbtns: [
        { k: "10", v: "10", ck: true, ds: false },
        { k: "30", v: "30", ck: false, ds: false },
        { k: "50", v: "50", ck: false, ds: false },
        { k: "100", v: "100", ck: false, ds: false },
      ],
      main: {
        topads: null,
        field: "",
        query: null,
        responseData: null,
        data: null,
        start: 0, //현재 페이지
        display: 10, //게시글의 수
        displayPageNum: isMobile() === true ? 5 : 10, // 페이지 번호의 수
        sort: "imd",
        pages: [],
        isFirst: false,
        isEnd: false,
      },
    };
  },
  components: { bigMenu, datePicker, expireSessionModal, maskModal, dateRangePicker, thumbnailModal, Swiper, SwiperSlide  },
  computed: {
    getDatasForMain() { return this.main.data; },
    isFirstPageGroupForMain() { return this.main.isFirst; },
    isLastPageGroupForMain() { return this.main.isEnd; },
  },
  watch: {},
  mounted() { this.searchNew(); },
  methods: {
    getUuidv4() { return uuidv4(); },
    activeMain(flag) {
      this.$emit("mountedMain", true);
      this.$emit("mountedDasyboad", false);
    },
    handleShowMask() { if (this.$refs.maskModal) this.$refs.maskModal.showModal(); },
    handleHideMask() { if (this.$refs.maskModal) this.$refs.maskModal.hideModal(); },
    handleExpireSession() { this.$refs.expireSessionModal.showModal(); },
    handleChangedDateRange(data) {
      this.$refs.dateRangePicker.setDate({start: data.start,end: data.end,compare: false});
      this.clickSearchBtn();
    },
    handleNoImg(e) { e.target.src = noimg; },
    getBidgoal(bidgoal) { return BIDGOAL[bidgoal]; },
    getBidtype(bidtype) { return BIDTYPE[bidtype]; },
    getBudgettype(budgettype) { return BUDGETTYPE[budgettype]; },
    getPgroups(pgroups) {
      let str = pgroups === "" ? "-" : pgroups.split(",");
      let str2 = "";
      if (str.length > 0) { str.forEach(function (s) { str2 = str2 + "," + PGGROUPS[s]; }); }

      return str2.substr(1);
    },
    priceToString(salse) { return priceToString(salse); },
    getUnits(unit) { return UNITS[unit]; },
    clickThumbnail(data) { this.$refs.thumbnailModal.showModal(data); },
    clickCheckpi(event, k) {
      let vm = this;
      vm.ibtns.forEach(function (b, i) {
        if (k === b.k) { b.ck = !b.ck; }
      });
    },
    clickBtn(event, k) {
      let vm = this;
      vm.btns.forEach(function (b, i) {
        if (k.k === b.k) { b.ck = true; } 
        else { b.ck = false; }
      });

      vm.getTopKpi();
    },
    clickSort(sort) {
      this.main.sort = sort;
      this.main.start = 0;
      this.getReport();
    },
    clickSearchBtn() {
      this.main.start = 0;
      let date = this.$refs.dateRangePicker.getDate();
      this.start = date.start;
      this.end = date.end;
      this.searchNew();
    },
    clickMedia(event, type, media) {
      this.main.start = 0;
      this.pgroups = "99";
      this.searchNew();
    },
    clickPgroups() {
      this.main.start = 0;
      this.searchNew();
    },
    clickRadioDisplay(event, display) {
      let vm = this;
      if (vm.main.display === display) return false;
      vm.main.display = display;
      vm.main.start = 0;
      vm.getReport();
    },
    searchNew() {
      let vm = this;
      let md = "";
      let date = vm.$refs.dateRangePicker.getDate();
      let f = vm.btns.find(function (e) { if (e.ck === true) return e; });

      if (vm.media === "naverda") md = "Nda";
      if (vm.media === "kakaomo") md = "K";
      vm.handleShowMask();
      let adreportForTop = $.ajax({
        type: "post", //요청 메소드 방식
        url: API_URL + "/admin/banner",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: date.start,
          todate: date.end,
          md: md,
          start: 0,
          sort: f.k + "d",
          display: 10,
          kpi: f.k,
          pgroups: vm.pgroups,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {},
        success: function (data) {
          if (data.result === "success") {
          } else {
            if (data.status === "0001") {
              vm.handleExpireSession();
            } else {
            }
          }
        },
        error: function (a, b, c) {
          if (a.status === 403) {
            vm.$store.commit("logout");
            vm.$store.commit("logoutActivedMdias");
            vm.$store.commit("logoutKakaoSa");
            vm.$router.push("/");
          }
        },
        complete: function (a, b, c) {},
      });

      let adreportForAd = $.ajax({
        type: "post", //요청 메소드 방식
        url: API_URL + "/admin/banner",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: date.start,
          todate: date.end,
          md: md,
          start: vm.main.start,
          sort: vm.main.sort,
          display: vm.main.display,
          kpi: "",
          pgroups: vm.pgroups,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {},
        success: function (data) {
          if (data.result === "success") {
          } else {
            if (data.status === "0001") {
              vm.handleExpireSession();
            } else {
            }
          }
        },
        error: function (a, b, c) {
          if (a.status === 403) {
            vm.$store.commit("logout");
            vm.$store.commit("logoutActivedMdias");
            vm.$store.commit("logoutKakaoSa");
            vm.$router.push("/");
          }
        },
        complete: function (a, b, c) {},
      });
      $.when(adreportForTop, adreportForAd)
        .done(function (adreportForTop, adreportForAd) {
          if (adreportForTop && adreportForTop[1] === "success") {
            vm.main.topads = [];
            vm.main.topads = adreportForTop[0].data.topads[f.k];
          }

          if (adreportForAd && adreportForAd[1] === "success") {
            vm.main.data = [];
            vm.main.responseData = null;
            vm.main.responseData = adreportForAd[0];
            vm.main.data =
              adreportForAd[0].data !== undefined ? adreportForAd[0].data.ads : "";
            vm.getStartAndEndPageForMain();
          }
        })
        .then(function () {
          vm.handleHideMask();
        });
    },
    getTopKpi() {
      let vm = this;
      let md = "";
      let date = vm.$refs.dateRangePicker.getDate();
      let f = vm.btns.find(function (e) {
        if (e.ck === true) return e;
      });

      if (vm.media === "naverda") md = "Nda";
      if (vm.media === "kakaomo") md = "K";

      $.ajax({
        type: "post", //요청 메소드 방식
        url: API_URL + "/admin/banner",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: date.start,
          todate: date.end,
          md: md,
          start: 0,
          sort: f.k + "d",
          display: 10,
          kpi: f.k,
          pgroups: vm.pgroups,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {
          vm.handleShowMask();
        },
        success: function (data) {
          if (data.result === "success") {
            vm.main.topads = [];
            vm.main.topads = data.data.topads[f.k];
          } else {
            if (data.status === "0001") {
              vm.handleExpireSession();
            } else {
            }
          }
        },
        error: function (a, b, c) {
          if (a.status === 403) {
            vm.$store.commit("logout");
            vm.$store.commit("logoutActivedMdias");
            vm.$store.commit("logoutKakaoSa");
            vm.$router.push("/");
          }
        },
        complete: function (a, b, c) {
          vm.handleHideMask();
          // vm.showMaskPannelForTop = false;
        },
      });
    },
    getReport() {
      let vm = this;
      let md = "";
      let date = vm.$refs.dateRangePicker.getDate();
      let f = vm.btns.find(function (e) {
        if (e.ck === true) return e;
      });

      if (vm.media === "naverda") md = "Nda";
      if (vm.media === "kakaomo") md = "K";

      $.ajax({
        type: "post", //요청 메소드 방식
        url: API_URL + "/admin/banner",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: date.start,
          todate: date.end,
          md: md,
          start: vm.main.start,
          sort: vm.main.sort,
          display: vm.main.display,
          kpi: "",
          pgroups: vm.pgroups,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {
          vm.handleShowMask();
          // vm.showMaskPannelForReport = true;
        },
        success: function (data) {
          if (data.result === "success") {
            vm.main.data = [];
            vm.main.responseData = null;
            vm.main.responseData = data;
            vm.main.data = data.data !== undefined ? data.data.ads : "";
            vm.getStartAndEndPageForMain();
            // vm.getActiveTopAd();
          } else {
            if (data.status === "0001") {
              vm.handleExpireSession();
            } else {
            }
          }
        },
        error: function (a, b, c) {
          if (a.status === 403) {
            vm.$store.commit("logout");
            vm.$store.commit("logoutActivedMdias");
            vm.$store.commit("logoutKakaoSa");
            vm.$router.push("/");
          }
        },
        complete: function (a, b, c) {
          vm.handleHideMask();
          // vm.showMaskPannelForReport = false;
        },
      });
    },
    getStartAndEndPageForMain() {
      this.main.pages = [];
      var endPage =
        Math.ceil((this.main.start + 1) / this.main.displayPageNum) *
        this.main.displayPageNum;
      var startPage = endPage - this.main.displayPageNum + 1;
      var tempEndPage = Math.ceil(this.main.responseData.totalcount / this.main.display);
      if (endPage > tempEndPage) {
        endPage = tempEndPage;
      }

      this.main.isFirst = this.main.start + 1 === 1 ? true : false;
      this.main.isEnd =
        Math.ceil(this.main.responseData.totalcount / this.main.display) ===
        this.main.start + 1
          ? true
          : false;

      for (var i = startPage; i <= endPage; i++) {
        this.main.pages.push(i);
      }
    },
    clickPreviousFirstPageBtnForMain() {
      this.main.start = 0;
      this.getReport();
    },
    clickPreviousPageBtnForMain() {
      this.main.start = this.main.start === 0 ? 0 : this.main.start - 1;
      this.getReport();
    },
    clickNextEndPageBtnForMain() {
      let tempEndPage = Math.ceil(this.main.responseData.totalcount / this.main.display);
      this.main.start = tempEndPage - 1;
      this.getReport();
    },
    clickNextPageBtnForMain() {
      let tempEndPage = Math.ceil(this.main.responseData.totalcount / this.main.display);
      this.main.start = this.main.start > tempEndPage ? tempEndPage : this.main.start + 1;
      this.getReport();
    },
    clickPageBtnForMain(page) {
      this.main.start = page;
      this.getReport();
    },
  },
};
</script>

<style scoped>
.activeArrow {
  color: #7186d3;
}
</style>
