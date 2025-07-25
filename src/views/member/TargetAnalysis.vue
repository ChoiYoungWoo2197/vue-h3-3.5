<template>
  <div class="d-flex m-h-100">
    <big-menu-2 :pMenu="'targetAnalysis'" @mountedMain="activeMain" class="pc"></big-menu-2>
    <div class="pc wrap">
      <balance @logOut="handleLogOut" @changeData="handleChangedBalance"></balance>
      <section>
        <message ref="message" class="mb-4">
          <span>
            <span>최근 집계 완료 시간(오늘) |
              <template v-for="(k,i) in accountlog" >
                <template v-if="media === k.media">
                  <span v-if="k.campaign !== undefined && k.campaign !== ''" class="ml-1" :key="k+i+getUuidv4()"><span>{{"캠페인: "}}</span> {{k.campaign.split(" ")[1]}}</span>
                  <span v-if="k.adgroup !== undefined && k.adgroup !== ''" class="ml-1" :key="k+i+getUuidv4()"><span>{{"그룹: "}}</span> {{k.adgroup.split(" ")[1]}}</span>
                  <span v-if="k.keyword !== undefined && k.keyword !== ''" class="ml-1" :key="k+i+getUuidv4()"><span>{{"키워드: "}}</span> {{k.keyword.split(" ")[1]}}</span>
                  <span v-if="k.ad !== undefined && k.ad !== ''" class="ml-1" :key="k+i+getUuidv4()"><span>{{"소재: "}}</span> {{k.ad.split(" ")[1]}}</span>
                  <span v-if="k.shopping !== undefined && k.shopping !== ''" class="ml-1" :key="k+i+getUuidv4()"><span>{{"쇼핑: "}}</span> {{k.shopping.split(" ")[1]}}</span>
                </template>
              </template>              
            </span>
          </span>
        </message>          
        <div class="title d-flex justify-content-between align-items-center">
          <h2>타겟팅 분석</h2>
          <div class="search d-flex">
            <select class="form-control" id="media" v-model="media" @change="changeMediaSelect" >
              <option selected value="naver">{{getMediaNew("naver")}}</option>
              <option value="kakaosa">{{getMediaNew("kakaosa")}}</option>
              <option value="kakaomo">{{getMediaNew("kakaomo")}}</option>
            </select>
            <select class="form-control" id="level" v-model="level" @change="clickSearchBtn">
              <option value="campaign">캠페인</option>
              <option value="adgroup">그룹</option>
              <option value="ad">소재</option>
              <option value="keyword" :disabled="media == 'kakaomo'" :class="[media === 'kakaomo' ? 'list-group-item-secondary' : '']" >키워드</option>
            </select>
            <select class="form-control" id="level" v-model="target" @change="clickSearchBtn">
              <option value="device">디바이스</option>
              <option value="age" :disabled="media == 'naver' || media == 'kakaosa'" :class="[ media === 'naver' ? 'list-group-item-secondary' : '', media === 'kakaosa' ? 'list-group-item-secondary' : '', ]"> 연령 </option>
              <option value="gender" :disabled="media == 'naver' || media == 'kakaosa'" :class="[ media === 'naver' ? 'list-group-item-secondary' : '', media === 'kakaosa' ? 'list-group-item-secondary' : '', ]" > 성별 </option>
              <option value="location" :disabled="media == 'kakaosa'" :class="[media === 'kakaosa' ? 'list-group-item-secondary' : '']" > 지역 </option>
            </select>
            <date-range-picker ref="dateRangePicker" class="form-control" :pStart="start" :pEnd="end" :pDisabled="false" @changedDate="handleChangedDateRange"></date-range-picker>
            <button type="submit" class="btn submit" @click.prevent="clickSearchBtn">조회하기</button>
          </div>
        </div>
        <article>
          <div class="title d-flex justify-content-between align-items-center">
            <h3>타겟팅 리포트</h3>
            <div class="indicator d-flex align-items-center dropdown">
              <button type="button" class="btn shadow-none p-0" data-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-gear m-0"></i>
              </button>
              <div class="dropdown-menu dropdown-menu-right">
                <form>
                  <template v-for="(k,i) in ['cst','im','clk','cv','cr','ctr','cpa','cpc','cvr','roas']">
                    <div class="form-check" :key="i+getUuidv4()">
                      <input class="form-check-input" type="checkbox" :id="'indicator'+i" :value=k :checked="kpi[k].check" :disabled="kpi[k].visible === false" @change="clickCheckpi($event, k)" />
                      <label class="form-check-label" :for="'indicator'+i" ><p class="d-flex align-items-center">{{getKpiName(k)}}</p></label >
                    </div>
                  </template>
                  <div class="form-border"></div>
                  <div class="form-check">
                    <input class="form-check-input radio-check" type="checkbox" id="indicator11" value="10" :checked="main.display === 10" @click="main.display === 10 ? $event.preventDefault() : ''" @change="clickRadioDisplay($event, 10)"/>
                    <label class="form-check-label" for="indicator11"><p class="d-flex align-items-center">10개</p></label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input radio-check" type="checkbox" id="indicator12" value="30" :checked="main.display === 30" @click="main.display === 30 ? $event.preventDefault() : ''" @change="clickRadioDisplay($event, 30)"/>
                    <label class="form-check-label" for="indicator12"><p class="d-flex align-items-center">30개</p></label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input radio-check" type="checkbox" id="indicator13" value="50" :checked="main.display === 50" @click="main.display === 50 ? $event.preventDefault() : ''" @change="clickRadioDisplay($event, 50)"/>
                    <label class="form-check-label" for="indicator13"><p class="d-flex align-items-center">50개</p></label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input radio-check" type="checkbox" id="indicator14" value="100" :checked="main.display === 100" @click="main.display === 100 ? $event.preventDefault() : ''" @change="clickRadioDisplay($event, 100)"/>
                    <label class="form-check-label" for="indicator14"><p class="d-flex align-items-center">100개</p></label>
                  </div>
                  <button type="button" class="btn indicator-close" data-toggle="dropdown" aria-expanded="false">닫기</button>
                </form>
              </div>
            </div>
          </div>
          <table class="report">
            <thead>
              <tr>
                <td class="text-left fold-icon"></td>
                <td class="text-left">캠페인</td>
                <td class="text-left">그룹</td>
                <template v-if="level == 'ad'"><td class="text-left">소재</td></template
                ><template v-else><td class="text-left">키워드</td></template>
                <template>
                  <td class="text-left" v-if="target === 'device'">디바이스</td>
                  <td class="text-left" v-if="target === 'age'">연령</td>
                  <td class="text-left" v-if="target === 'gender'">성별</td>
                  <td class="text-left" v-if="target === 'location'">지역</td>
                </template>
                <template v-for="(k,i) in ['im','clk','ctr','cpc','cst','cv','cr','cpa','cvr','roas']">
                  <td :key="i+getUuidv4()" v-if="kpi[k].check">{{getKpiName(k)}}
                    <template v-if="main.sort === k+'a' || main.sort === k+'d'">
                      <button v-if="main.sort === k+'a'" class="active text-yellow" @click="clickSort(k+'d')"><i class="bi bi-caret-up-fill"></i></button>
                      <button v-if="main.sort === k+'d'" class="active text-yellow" @click="clickSort(k+'a')"><i class="bi bi-caret-down-fill"></i></button>
                    </template>
                    <template v-else>
                      <button class="active" @click="clickSort(k+'d')"> <i class="bi bi-caret-down-fill"></i> </button>                          
                    </template>
                  </td>
                </template>                
              </tr>
            </thead>
            <tbody>
              <template v-if="main.data === '' || main.data === null">
                <tr>
                  <td colspan="9" class="text-center">데이터가 존재하지 않습니다.</td>
                </tr>
              </template>
              <template v-else>
                <tr v-for="data in getDatasForMain" :key="data.dailySeq + '-' + getUuidv4()" :class="data.isMainData === true ? ['maindata', 'collapsed'] : ['subdata', 'collapse', 'subdataTr', data.link]"                  :data-toggle="data.isMainData === true ? 'collapse' : ''" :data-target="data.isMainData === true ? '.' + data.link : ''" :aria-expande="data.isMainData === true ? 'false' : ''">
                  <template v-if="data.target === 0">
                    <td colspan="10" class="text-center">데이터가 존재하지 않습니다.</td>
                  </template>
                  <template v-else>
                    <td width="40px" class="text-left fold-icon"></td>
                    <template v-if="data.isMainData === true">
                      <td width="15%" class="text-left">
                        {{ data.campaignName }}
                        <br /><small class="sub">{{ "(" + data.campaignId + ")" }}</small>
                      </td>
                      <td width="15%" class="text-left">
                        {{ data.adgroupName }}
                        <br /><small class="sub">{{ "(" + data.adgroupId + ")" }}</small>
                      </td>
                      <td width="15%" class="text-left">
                        {{ data.targetName }}
                        <br /><small class="sub">{{ "(" + data.targetId + ")" }}</small>
                      </td>
                      <td width="15%" :class=" data.haschild === true ? ['text-left fold-btn'] : ['text-left']">
                        <a>{{ data.target }}</a>
                      </td>
                    </template>
                    <template v-else>
                      <td width="15%" class="text-left">{{ "" }}</td>
                      <td width="15%" class="text-left">{{ "" }}</td>
                      <td width="15%" class="text-left">{{ "" }}</td>
                      <td width="15%" class="text-left font-weight-bold" v-text="data.target"></td>
                    </template>
                    <template v-for="(k,i) in ['im','clk','ctr','cpc','cst','cv','cr','cpa','cvr','roas']">
                      <td :key="i+getUuidv4()" v-if="kpi[k].check">{{priceToString(data[k])+getUnit(k)}}</td>
                    </template> 
                  </template>
                </tr>
              </template>
            </tbody>
          </table>
          <template v-if="main.data !== '' || main.data !== null">
            <ul class="pagination d-flex justify-content-center align-items-center mb-30">
              <li class="page-item">
                <a class="page-link shadow-none" href="javascript:;" aria-label="Previous" @click="clickPreviousFirstPageBtnForMain">
                  <span aria-hidden="true"><i class="bi bi-chevron-double-left m-0"></i></span>
                </a>
              </li>
              <li class="page-item" :class="{ disabled: isFirstPageGroupForMain }">
                <a class="page-link shadow-none" href="javascript:;" aria-label="Previous" @click="clickPreviousPageBtnForMain">
                  <span aria-hidden="true"><i class="bi bi-chevron-left"></i></span>
                </a>
              </li>
              <li class="page-item" :class="{ active: page - 1 === main.start }" v-for="page in main.pages" :key="page">
                <a class="page-link shadow-none" href="javascript:;" v-text="page" @click="clickPageBtnForMain(page - 1)" ></a>
              </li>
              <li class="page-item" :class="{ disabled: isLastPageGroupForMain }">
                <a class="page-link shadow-none" href="javascript:;" aria-label="Next" @click="clickNextPageBtnForMain">
                  <span aria-hidden="true"><i class="bi bi-chevron-right"></i></span>
                </a>
              </li>
              <li class="page-item">
                <a class="page-link shadow-none" href="javascript:;" aria-label="Next" @click="clickNextEndPageBtnForMain">
                  <span><i class="bi bi-chevron-double-right m-0"></i></span>
                </a>
              </li>
            </ul>
          </template>
        </article>
        <div class="d-flex justify-content-end">
          <button type="button" class="btn excel" @click="clickExcel">엑셀 다운받기</button>
        </div>
      </section>
    </div>
    <div class="m m-wrap">
      <mheader ref="mHeader" :pMenu="'dashboard'"></mheader>
      <mfooter ref="mFooter" :pMenu="'dashboard'"></mfooter>
      <section>
        <div class="pills-container-btn">
          <div class="pills-btn pb-0">
            <ul class="d-flex" id="pills-tab" role="tablist">
              <li class="nav-item">
                <button
                  class="nav-link media active"
                  id=""
                  type="button"
                  data-toggle="collapse"
                  data-target="#mediaBtnBoxContainerCollapse"
                  aria-expanded="false"
                  aria-controls="mediaBtnBoxContainerCollapse"
                >
                  {{ getMedia }}
                  <i class="bi bi-arrow-down text-white mr-0"></i>
                </button>
              </li>
              <li class="nav-item">
                <button
                  class="nav-link level active"
                  id=""
                  type="button"
                  data-toggle="collapse"
                  data-target="#levelBtnBoxContainerCollapse"
                  aria-expanded="false"
                  aria-controls="levelBtnBoxContainerCollapse"
                >
                  {{ getLevel }}
                  <i class="bi bi-arrow-down text-white mr-0"></i>
                </button>
              </li>
              <li class="nav-item">
                <button
                  class="nav-link target active"
                  id=""
                  type="button"
                  data-toggle="collapse"
                  data-target="#targetBtnBoxContainerCollapse"
                  aria-expanded="false"
                  aria-controls="targetBtnBoxContainerCollapse"
                >
                  {{ getTarget }}
                  <i class="bi bi-arrow-down text-white mr-0"></i>
                </button>
              </li>
            </ul>
          </div>
          <button class="allow" @click="clickAllowBtn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="9"
              viewBox="0 0 12 8"
            >
              <path
                fill="none"
                fill-rule="evenodd"
                stroke="#1e1e23"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M1 6L6 1 11 6"
                transform="translate(0 1)"
              ></path>
            </svg>
          </button>
        </div>
        <article class="collapse" id="mediaBtnBoxContainerCollapse">
          <ul class="media-btn-box-container">
            <li @click="changeMediaSelect($event, true, 'naver')">
              <input type="checkbox" />
              <label for="" :class="media === 'naver' ? 'active' : ''">
                {{getMediaNew("naver")}}
                <span>
                  <i
                    class="bi"
                    :class="media === 'naver' ? 'bi-check active' : 'bi-plus'"
                  ></i>
                </span>
              </label>
            </li>
            <li @click="changeMediaSelect($event, true, 'kakaosa')">
              <input type="checkbox" />
              <label for="" :class="media === 'kakaosa' ? 'active' : ''">
                {{getMediaNew("kakaosa")}}
                <span>
                  <i
                    class="bi"
                    :class="media === 'kakaosa' ? 'bi-check active' : 'bi-plus'"
                  ></i>
                </span>
              </label>
            </li>
            <li @click="changeMediaSelect($event, true, 'kakaomo')">
              <input type="checkbox" />
              <label for="" :class="media === 'kakaomo' ? 'active' : ''">
                {{getMediaNew("kakaomo")}}
                <span>
                  <i
                    class="bi"
                    :class="media === 'kakaomo' ? 'bi-check active' : 'bi-plus'"
                  ></i>
                </span>
              </label>
            </li>
          </ul>
        </article>
        <article class="collapse" id="levelBtnBoxContainerCollapse">
          <ul class="media-btn-box-container">
            <li @click="clickLevel($event, 'campaign')">
              <input type="checkbox" />
              <label for="" :class="level === 'campaign' ? 'active' : ''">
                캠페인
                <span>
                  <i
                    class="bi"
                    :class="level === 'campaign' ? 'bi-check active' : 'bi-plus'"
                  ></i>
                </span>
              </label>
            </li>
            <li @click="clickLevel($event, 'adgroup')">
              <input type="checkbox" />
              <label for="" :class="level === 'adgroup' ? 'active' : ''">
                그룹
                <span>
                  <i
                    class="bi"
                    :class="level === 'adgroup' ? 'bi-check active' : 'bi-plus'"
                  ></i>
                </span>
              </label>
            </li>
            <li @click="clickLevel($event, 'ad')">
              <input type="checkbox" />
              <label for="" :class="level === 'ad' ? 'active' : ''">
                소재
                <span>
                  <i
                    class="bi"
                    :class="level === 'ad' ? 'bi-check active' : 'bi-plus'"
                  ></i>
                </span>
              </label>
            </li>
            <li v-if="media !== 'kakaomo'" @click="clickLevel($event, 'keyword')">
              <input type="checkbox" />
              <label for="" :class="level === 'keyword' ? 'active' : ''">
                키워드
                <span>
                  <i
                    class="bi"
                    :class="level === 'keyword' ? 'bi-check active' : 'bi-plus'"
                  ></i>
                </span>
              </label>
            </li>
          </ul>
        </article>
        <article class="collapse" id="targetBtnBoxContainerCollapse">
          <ul class="media-btn-box-container">
            <li @click="clickTarget($event, 'device')">
              <input type="checkbox" />
              <label for="" :class="target === 'device' ? 'active' : ''">
                디바이스
                <span>
                  <i
                    class="bi"
                    :class="target === 'device' ? 'bi-check active' : 'bi-plus'"
                  ></i>
                </span>
              </label>
            </li>
            <li v-if="media === 'kakaomo'" @click="clickTarget($event, 'age')">
              <input type="checkbox" />
              <label for="" :class="target === 'age' ? 'active' : ''">
                연령
                <span>
                  <i
                    class="bi"
                    :class="target === 'age' ? 'bi-check active' : 'bi-plus'"
                  ></i>
                </span>
              </label>
            </li>
            <li v-if="media === 'kakaomo'" @click="clickTarget($event, 'gender')">
              <input type="checkbox" />
              <label for="" :class="target === 'gender' ? 'active' : ''">
                성별
                <span>
                  <i
                    class="bi"
                    :class="target === 'gender' ? 'bi-check active' : 'bi-plus'"
                  ></i>
                </span>
              </label>
            </li>
            <li
              v-if="media === 'kakaomo' || media === 'naver'"
              @click="clickTarget($event, 'location')"
            >
              <input type="checkbox" />
              <label for="" :class="target === 'location' ? 'active' : ''">
                지역
                <span>
                  <i
                    class="bi"
                    :class="target === 'location' ? 'bi-check active' : 'bi-plus'"
                  ></i>
                </span>
              </label>
            </li>
          </ul>
        </article>
        <article class="statisticst-report">
          <div class="title d-flex justify-content-between align-items-center">
            <h3>타켓팅 리포트</h3>
            <div class="indicator d-flex align-items-center dropdown">
              <button
                type="button"
                class="btn shadow-none p-0"
                data-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="bi bi-gear m-0"></i>
              </button>
              <div class="dropdown-menu dropdown-menu-right">
                <form>
                  <div class="form-check w-100 pl-0">
                    <select
                      class="form-control form-control-sm"
                      v-model="main.sort"
                      @change="changeSort"
                    >
                      <option value="ima">노출수순(올림)</option>
                      <option value="imd">노출수순(내림)</option>
                      <option value="clka">클릭수순(올림)</option>
                      <option value="clkd">클릭수순(내림)</option>
                      <option value="ctra">클릭률순(올림)</option>
                      <option value="ctrd">클릭률순(내림)</option>
                      <option value="cpca">CPC순(올림)</option>
                      <option value="cpcd">CPC순(내림)</option>
                      <option value="csta">광고비순(올림)</option>
                      <option value="cstd">광고비순(내림)</option>
                      <option value="cva">전환수순(올림)</option>
                      <option value="cvd">전환수순(내림)</option>
                      <option value="cvra">전환률순(올림)</option>
                      <option value="cvrd">전환률순(내림)</option>
                      <option value="cra">전환매출순(올림)</option>
                      <option value="crd">전환매출순(내림)</option>
                      <option value="cpaa">CPA순(올림)</option>
                      <option value="cpcd">CPA순(내림)</option>
                      <option value="roasa">ROAS순(올림)</option>
                      <option value="roasd">ROAS순(내림)</option>
                    </select>
                  </div>

                  <div class="form-border"></div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="indicator1"
                      value="cst"
                      :checked="kpi.cst.check"
                      :disabled="kpi.cst.visible === false"
                      @change="clickCheckpi($event, 'cst')"
                    />
                    <label class="form-check-label" for="indicator1"
                      ><p class="d-flex align-items-center ml-1">광고비</p></label
                    >
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="indicator2"
                      value="im"
                      :checked="kpi.im.check"
                      :disabled="kpi.im.visible === false"
                      @change="clickCheckpi($event, 'im')"
                    />
                    <label class="form-check-label" for="indicator2"
                      ><p class="d-flex align-items-center ml-1">노출수</p></label
                    >
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="indicator3"
                      value="clk"
                      :checked="kpi.clk.check"
                      :disabled="kpi.clk.visible === false"
                      @change="clickCheckpi($event, 'clk')"
                    />
                    <label class="form-check-label" for="indicator3"
                      ><p class="d-flex align-items-center ml-1">클릭수</p></label
                    >
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="indicator4"
                      value="cv"
                      :checked="kpi.cv.check"
                      :disabled="kpi.cv.visible === false"
                      @change="clickCheckpi($event, 'cv')"
                    />
                    <label class="form-check-label" for="indicator4"
                      ><p class="d-flex align-items-center ml-1">전환수</p></label
                    >
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="indicator5"
                      value="cvr"
                      :checked="kpi.cvr.check"
                      :disabled="kpi.cvr.visible === false"
                      @change="clickCheckpi($event, 'cvr')"
                    />
                    <label class="form-check-label" for="indicator5"
                      ><p class="d-flex align-items-center ml-1">전환율</p></label
                    >
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="indicator6"
                      value="cr"
                      :checked="kpi.cr.check"
                      :disabled="kpi.cr.visible === false"
                      @change="clickCheckpi($event, 'cr')"
                    />
                    <label class="form-check-label" for="indicator6"
                      ><p class="d-flex align-items-center ml-1">전환매출</p></label
                    >
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="indicator7"
                      value="ctr"
                      :checked="kpi.ctr.check"
                      :disabled="kpi.ctr.visible === false"
                      @change="clickCheckpi($event, 'ctr')"
                    />
                    <label class="form-check-label" for="indicator7"
                      ><p class="d-flex align-items-center ml-1">클릭율</p></label
                    >
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="indicator8"
                      value="cpa"
                      :checked="kpi.cpa.check"
                      :disabled="kpi.cpa.visible === false"
                      @change="clickCheckpi($event, 'cpa')"
                    />
                    <label class="form-check-label" for="indicator8"
                      ><p class="d-flex align-items-center ml-1">전환당비용</p></label
                    >
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="indicator9"
                      value="cpc"
                      :checked="kpi.cpc.check"
                      :disabled="kpi.cpc.visible === false"
                      @change="clickCheckpi($event, 'cpc')"
                    />
                    <label class="form-check-label" for="indicator9"
                      ><p class="d-flex align-items-center ml-1">클릭당비용</p></label
                    >
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="indicator10"
                      value="roas"
                      :checked="kpi.roas.check"
                      :disabled="kpi.roas.visible === false"
                      @change="clickCheckpi($event, 'roas')"
                    />
                    <label class="form-check-label" for="indicator10"
                      ><p class="d-flex align-items-center ml-1">ROAS</p></label
                    >
                  </div>
                  <button
                    type="button"
                    class="btn indicator-close"
                    data-toggle="dropdown"
                    aria-expanded="false"
                  >
                    닫기
                  </button>
                </form>
              </div>
            </div>
          </div>
          <template v-for="(d, i) in getDatasForMain">
            <div
              v-if="d.isMainData"
              class="m-table d-flex"
              :key="d + i + '-' + getUuidv4()"
            >
              <ul>
                <div v-if="d.isMainData" class="m-table-title">
                  <div class="w-100">
                    <li class="font-weight-bold">
                      <template v-if="level === 'campaign'">{{
                        d.campaignName
                      }}</template>
                      <template v-if="level === 'adgroup'">{{ d.adgroupName }}</template>
                      <template v-if="level === 'ad'">{{ d.targetName }}</template>
                      <template v-if="level === 'keyword'">{{ d.targetName }}</template>
                    </li>
                    <li>
                      <small v-if="level !== 'campaign'">
                        <span class="badge badge-pill badge-light">{{
                          d.campaignName
                        }}</span>
                      </small>
                      <small v-if="level !== 'campaign' && level !== 'adgroup'">
                        <span class="badge badge-pill badge-light">{{
                          d.adgroupName
                        }}</span>
                      </small>
                    </li>
                  </div>
                </div>
                <div v-if="d.isMainData" class="m-table-content">
                  <div class="w-100 d-flex flex-wrap">
                    <li class="col-12 d-flex align-items-center">
                      {{ d.target }}
                    </li>
                    <li v-if="kpi.im.check" class="col-4">
                      <label for="">노출수</label>
                      <div>{{ priceToString(d.im) + "회" }}</div>
                    </li>
                    <li v-if="kpi.clk.check" class="col-4">
                      <label for="">클릭수</label>
                      <div>{{ priceToString(d.clk) + "회" }}</div>
                    </li>
                    <li v-if="kpi.ctr.check" class="col-4">
                      <label for="">클릭율</label>
                      <div>{{ priceToString(d.ctr) + "%" }}</div>
                    </li>
                    <li v-if="kpi.cpc.check" class="col-4">
                      <label for="">CPC</label>
                      <div>{{ priceToString(d.cpc) + "원" }}</div>
                    </li>
                    <li v-if="kpi.cst.check" class="col-4">
                      <label for="">광고비</label>
                      <div>{{ priceToString(d.cst) + "원" }}</div>
                    </li>
                    <li v-if="kpi.cv.check" class="col-4">
                      <label for="" class="">전환수</label>
                      <div>{{ priceToString(d.cv) + "회" }}</div>
                    </li>
                    <li v-if="kpi.cvr.check" class="col-4">
                      <label for="" class="">전환률</label>
                      <div>{{ priceToString(d.cvr) + "%" }}</div>
                    </li>
                    <li v-if="kpi.cr.check" class="col-4">
                      <label for="" class="">전환매출</label>
                      <div>{{ priceToString(d.cr) + "원" }}</div>
                    </li>
                    <li v-if="kpi.cpa.check" class="col-4">
                      <label for="" class="">CPA</label>
                      <div>{{ priceToString(d.cpa) + "원" }}</div>
                    </li>
                    <li v-if="kpi.roas.check" class="col-4">
                      <label for="" class="">ROAS</label>
                      <div>{{ priceToString(d.roas) + "%" }}</div>
                    </li>
                  </div>
                </div>
                <template v-for="(d2, i2) in getDatasForChild(d.link)">
                  <div
                    v-if="!d2.isMainData && d.campaignId === d2.campaignId"
                    class="m-table-content"
                    :key="d2 + i2 + '-' + getUuidv4()"
                  >
                    <div class="w-100 d-flex flex-wrap">
                      <li class="col-12 d-flex align-items-center">
                        {{ d2.target }}
                      </li>
                      <li v-if="kpi.im.check" class="col-4">
                        <label for="">노출수</label>
                        <div>{{ priceToString(d2.im) + "회" }}</div>
                      </li>
                      <li v-if="kpi.clk.check" class="col-4">
                        <label for="">클릭수</label>
                        <div>{{ priceToString(d2.clk) + "회" }}</div>
                      </li>
                      <li v-if="kpi.ctr.check" class="col-4">
                        <label for="">클릭율</label>
                        <div>{{ priceToString(d2.ctr) + "%" }}</div>
                      </li>
                      <li v-if="kpi.cpc.check" class="col-4">
                        <label for="">CPC</label>
                        <div>{{ priceToString(d2.cpc) + "원" }}</div>
                      </li>
                      <li v-if="kpi.cst.check" class="col-4">
                        <label for="">광고비</label>
                        <div>{{ priceToString(d2.cst) + "원" }}</div>
                      </li>
                      <li v-if="kpi.cv.check" class="col-4">
                        <label for="" class="">전환수</label>
                        <div>{{ priceToString(d2.cv) + "회" }}</div>
                      </li>
                      <li v-if="kpi.cvr.check" class="col-4">
                        <label for="" class="">전환률</label>
                        <div>{{ priceToString(d2.cvr) + "%" }}</div>
                      </li>
                      <li v-if="kpi.cr.check" class="col-4">
                        <label for="" class="">전환매출</label>
                        <div>{{ priceToString(d2.cr) + "원" }}</div>
                      </li>
                      <li v-if="kpi.cpa.check" class="col-4">
                        <label for="" class="">CPA</label>
                        <div>{{ priceToString(d2.cpa) + "원" }}</div>
                      </li>
                      <li v-if="kpi.roas.check" class="col-4">
                        <label for="" class="">ROAS</label>
                        <div>{{ priceToString(d2.roas) + "%" }}</div>
                      </li>
                    </div>
                  </div>
                </template>
              </ul>
            </div>
          </template>
          <ul class="pagination d-flex justify-content-center align-items-center mb-30">
            <li class="page-item">
              <a
                class="page-link shadow-none"
                href="javascript:;"
                aria-label="Previous"
                @click="clickPreviousFirstPageBtnForMain"
              >
                <span aria-hidden="true"
                  ><i class="bi bi-chevron-double-left m-0"></i></span
              ></a>
            </li>
            <li class="page-item" :class="{ disabled: isFirstPageGroupForMain }">
              <a
                class="page-link shadow-none"
                href="javascript:;"
                aria-label="Previous"
                @click="clickPreviousPageBtnForMain"
              >
                <span aria-hidden="true"><i class="bi bi-chevron-left"></i></span>
              </a>
            </li>
            <li
              class="page-item"
              :class="{ active: page - 1 === main.start }"
              v-for="page in main.pages"
              :key="page"
            >
              <a
                class="page-link shadow-none"
                href="javascript:;"
                v-text="page"
                @click="clickPageBtnForMain(page - 1)"
              ></a>
            </li>
            <li class="page-item" :class="{ disabled: isLastPageGroupForMain }">
              <a
                class="page-link shadow-none"
                href="javascript:;"
                aria-label="Next"
                @click="clickNextPageBtnForMain"
              >
                <span aria-hidden="true"><i class="bi bi-chevron-right"></i></span>
              </a>
            </li>
            <li class="page-item">
              <a
                class="page-link shadow-none"
                href="javascript:;"
                aria-label="Next"
                @click="clickNextEndPageBtnForMain"
              >
                <span><i class="bi bi-chevron-double-right m-0"></i></span
              ></a>
            </li>
          </ul>
        </article>
        <article>
          <div class="d-flex flex-column">
            <button type="button" class="btn excel w-100" @click="clickExcel">
              엑셀 다운받기
            </button>
          </div>
        </article>
      </section>
      <mbig-menu-2
        ref="mBigMenu2"
        @closeBtn="$refs.mFooter.setFooter('home')"
      ></mbig-menu-2>
      <mdate-range-picker
        ref="mDateRangePicker"
        :pStart="start"
        :pEnd="end"
        :pCstart="''"
        :pCend="''"
        @changedDate="handleChangedDateRange"
        @closeBtn="$refs.mFooter.setFooter('home')"
      >
      </mdate-range-picker>
      <mbalance
        ref="mBalance"
        :pBalance="balance"
        @closeBtn="$refs.mFooter.setFooter('home')"
      ></mbalance>
      <mbalance
        ref="mBalance"
        :pBalance="balance"
        @closeBtn="$refs.mFooter.setFooter('home')"
      ></mbalance>
      <malarm ref="mFmenu" @closeBtn="$refs.mFooter.setFooter('home')"></malarm>
      <mfmenu
        ref="mFmenu"
        @logout="handleLogOut"
        @dbedit="$refs.mFooter.clickDbEdit('dashboard-edit')"
        @closeBtn="$refs.mFooter.setFooter('home')"
      ></mfmenu>
      <mdashboard-edit
        ref="mDashboardEdit"
        @closeBtn="$refs.mFooter.setFooter('home')"
      ></mdashboard-edit>
    </div>

    <log-out-modal ref="logOutModal" style="display: none"></log-out-modal>
    <expire-session-modal ref="expireSessionModal" style="display: none"></expire-session-modal>
    <mask-modal ref="maskModal" style="display: none"></mask-modal>
  </div>
</template>

<script>
import $ from "jquery";
import xlsx from "xlsx";
import moment from "moment";
import {  isMobile,  priceToString,  getMedia,  uuidv4,  getLevel,  getTarget, getKpiName, getUnit} from "@/assets/js/common.js";
import expireSessionModal from "@/components/modal/expireSessionModal.vue";
import messageModal from "@/components/modal/messageModal.vue";
import maskModal from "@/components/modal/maskModal.vue";
import { store } from "@/store/store.js";
import { SHA256 } from "@/assets/js/sha256.js";
import { API_URL, TEMP_KEY } from "@/configs/config.js";
import message from "@/components/common/message.vue";
import balance from "@/components/dashboard2/balance.vue";
import bigMenu2 from "@/components/layout/bigMenu2.vue";
import logOutModal from "@/components/modal/logOutModal.vue";
import dateRangePicker from "@/components/common/dateRangePicker.vue";
import mheader from "@/components/layout/m/header.vue";
import mfooter from "@/components/layout/m/footer.vue";
import mbigMenu2 from "@/components/layout/m/bigMenu2.vue";
import mdateRangePicker from "@/components/common/m/dateRangePicker.vue";
import mbalance from "@/components/common/m/balance.vue";
import mfmenu from "@/components/common/m/fMenu.vue";
import malarm from "@/components/common/m/alarm.vue";
import mdashboardEdit from "@/components/common/m/dashboardEdit.vue";

export default {
  data() {
    return {
      start: store.state.dateStore.start,
      end: store.state.dateStore.end,
      media: "naver",
      level: "campaign",
      target: "device",
      main: {
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
        isTotalCount: "-1",
      },
      kpi: {
        clk: { visible: false, check: true }, //클릭수
        im: { visible: false, check: true }, //노출수
        cst: { visible: false, check: true }, //광고비
        cv: { visible: true, check: false }, //전환수
        cr: { visible: true, check: false }, //전환매출
        ctr: { visible: false, check: true }, //클릭률
        cpc: { visible: false, check: true }, //클릭 당 비용
        cpa: { visible: true, check: false }, //전환 당 비용
        cvr: { visible: true, check: false }, //전환율
        roas: { visible: true, check: false }, //ROAS
      },
      headerSet: {
        common: {
          header: [
            { key: "im", name: "노출수" },
            { key: "clk", name: "클릭수" },
            { key: "ctr", name: "클릭률" },
            { key: "cpc", name: "클릭당비용" },
            { key: "cst", name: "광고비" },
            { key: "cv", name: "전환수" },
            { key: "cvr", name: "전환율" },
            { key: "cr", name: "전환매출" },
            { key: "cpa", name: "전환당비용" },
            { key: "roas", name: "ROAS" },
          ],
        },
        device: {
          header: [{ key: "target", name: "디바이스" }],
        },
        age: {
          header: [{ key: "target", name: "연령" }],
        },
        gender: {
          header: [{ key: "target", name: "성별" }],
        },
        location: {
          header: [{ key: "target", name: "지역" }],
        },
        naver: {
          header: [
            { key: "campaignName", name: "캠페인" },
            { key: "campaignId", name: "캠페인ID" },
            { key: "adgroupName", name: "그룹" },
            { key: "adgroupId", name: "그룹ID" },
            { key: "targetName", name: "키워드|소재" },
            { key: "targetId", name: "키워드|소재ID" },
          ],
        },
        kakaosa: {
          header: [
            { key: "campaignName", name: "캠페인" },
            { key: "campaignId", name: "캠페인ID" },
            { key: "adgroupName", name: "그룹" },
            { key: "adgroupId", name: "그룹ID" },
            { key: "targetName", name: "키워드|소재" },
            { key: "targetId", name: "키워드|소재ID" },
          ],
        },
        kakaomo: {
          header: [
            { key: "campaignName", name: "캠페인" },
            { key: "campaignId", name: "캠페인ID" },
            { key: "adgroupName", name: "그룹" },
            { key: "adgroupId", name: "그룹ID" },
            { key: "targetName", name: "키워드|소재" },
            { key: "targetId", name: "키워드|소재ID" },
          ],
        },
      },
      balance: [],
      accountlog: [],
    };
  },
  computed: {
    getDatasForMain() {
      return this.main.data;
    },
    isFirstPageGroupForMain() {
      return this.main.isFirst;
    },
    isLastPageGroupForMain() {
      return this.main.isEnd;
    },
    getMedia(media) {
      return getMedia(this.media);
    },
    getLevel(level) {
      return getLevel(this.level);
    },
    getTarget(target) {
      return getTarget(this.target);
    },
  },
  watch: {},
  components: { bigMenu2, logOutModal, balance, expireSessionModal, messageModal, maskModal, dateRangePicker, mheader, mfooter, mbigMenu2, mdateRangePicker, mbalance, mfmenu, malarm, mdashboardEdit, message },
  mounted() {
    $(".main").removeClass("m-h-100");
    this.clickSearchBtn();
    this.getAccountLog();
  },
  updated() {},
  methods: {
    getUuidv4() { return uuidv4(); },
    activeMain(flag) {
      this.$emit("mountedMain", true);
      this.$emit("mountedDasyboad", true);
    },
    handleLogOut() { this.$refs.logOutModal.showModal(); },
    handleExpireSession() { this.$refs.expireSessionModal.showModal(); },
    handleShowMask() { this.$refs.maskModal.showModal(); },
    handleHideMask() { this.$refs.maskModal.hideModal(); },
    priceToString(salse) {
      if (salse === undefined) return "";
      return priceToString(salse);
    },
    clickSearchBtn() {
      this.main.start = 0;
      this.main.isTotalCount = "-1";
      this.searchData();
    },
    searchData() {
      var vm = this;
      var md = "";
      var date = vm.$refs.dateRangePicker.getDate();
      switch (vm.media) {
        case "naver":
          md = "N";
          break;
        case "kakaosa":
          md = "D";
          break;
        case "kakaomo":
          md = "K";
          break;
        default:
          md = "N";
      }

      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/targetreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: date.start,
          todate: date.end,
          md: md,
          level: vm.level,
          target: vm.target,
          start: vm.main.start,
          sort: vm.main.sort,
          display: vm.main.display,
          totalcount: vm.main.isTotalCount,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {
          vm.handleShowMask();
        },
        success: function (data) {
          if (data.result === "success") {
            vm.main.data = [];
            vm.main.responseData = null;
            vm.main.responseData = data;
            // console.log(data);
            // vm.main.data = data.data !== undefined ? data.data.targets : '';
            vm.main.data = vm.getTotal(data.data.targets);
            vm.getStartAndEndPageForMain();
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
        },
      });
    },
    getStartAndEndPageForMain() {
      this.main.isTotalCount = this.main.responseData.totalcount;
      this.main.pages = [];
      var endPage = Math.ceil((this.main.start + 1) / this.main.displayPageNum) * this.main.displayPageNum;
      var startPage = endPage - this.main.displayPageNum + 1;
      var tempEndPage = Math.ceil(this.main.responseData.totalcount / this.main.display);
      if (endPage > tempEndPage) {
        endPage = tempEndPage;
      }

      this.main.isFirst = this.main.start + 1 === 1 ? true : false;
      this.main.isEnd = Math.ceil(this.main.responseData.totalcount / this.main.display) === this.main.start + 1 ? true : false;

      for (var i = startPage; i <= endPage; i++) {
        this.main.pages.push(i);
      }
    },
    clickPreviousFirstPageBtnForMain() {
      this.main.start = 0;
      this.searchData();
    },
    clickPreviousPageBtnForMain() {
      this.main.start = this.main.start === 0 ? 0 : this.main.start - 1;
      this.searchData();
    },
    clickNextEndPageBtnForMain() {
      let tempEndPage = Math.ceil(this.main.responseData.totalcount / this.main.display);
      this.main.start = tempEndPage - 1;
      this.searchData();
    },
    clickNextPageBtnForMain() {
      let tempEndPage = Math.ceil(this.main.responseData.totalcount / this.main.display);
      this.main.start = this.main.start > tempEndPage ? tempEndPage : this.main.start + 1;
      this.searchData();
    },
    clickPageBtnForMain(page) {
      this.main.start = page;
      this.searchData();
    },
    clickSort(sort) {
      this.main.sort = sort;
      this.main.start = 0;
      this.searchData();
    },
    getTotal(targets) {
      var vm = this;
      var data = [];
      targets.forEach(function (maindata) {
        var targetId = "";
        var targetName = "";
        if (vm.level === "ad") {
          var targetId = maindata.ad_id;
          var targetName = maindata.ad_name;
        } else if (vm.level === "keyword") {
          var targetId = maindata.keyword_id;
          var targetName = maindata.keyword_name;
        }

        data.push({
          isMainData: true,
          dailySeq: maindata.daily_seq,
          campaignId: maindata.campaignid,
          campaignName: maindata.campaign_name,
          adgroupId: maindata.adgroup_id === "" ? "-" : maindata.adgroup_id,
          adgroupName: maindata.adgroup_name === "" ? "-" : maindata.adgroup_name,
          targetId: targetId === "" ? "-" : targetId,
          targetName: targetName === "" ? "-" : targetName,
          im: maindata.im,
          clk: maindata.clk,
          cpc: maindata.cpc,
          ctr: maindata.ctr,
          cst: maindata.cst,
          cv: maindata.cv,
          cvr: maindata.cvr,
          cr: maindata.cr,
          cpa: maindata.cpa,
          roas: maindata.roas,
          target: "전체",
          link: vm.target + "-" + maindata.daily_seq,
          haschild: maindata.targets.length !== 0 ? true : false,
        });

        if (maindata.targets.length > 0) {
          // console.log(target.targets);
          maindata.targets.forEach(function (subdata) {
            var targetId = "";
            var targetName = "";
            if (vm.level === "ad" || vm.level === "keyword") {
              targetId = subdata.target_id;
              targetName = subdata.target_name;
            }
            data.push({
              isMainData: false,
              campaignId: maindata.campaignid,
              campaignName: maindata.campaign_name,
              adgroupId: maindata.adgroup_id === "" ? "-" : maindata.adgroup_id,
              adgroupName: maindata.adgroup_name === "" ? "-" : maindata.adgroup_name,
              targetId: targetId === "" ? "-" : targetId,
              targetName: targetName === "" ? "-" : targetName,
              im: subdata.im,
              clk: subdata.clk,
              cpc: subdata.cpc,
              ctr: subdata.ctr,
              cst: subdata.cst,
              cv: subdata.cv,
              cvr: subdata.cvr,
              cr: subdata.cr,
              cpa: subdata.cpa,
              roas: subdata.roas,
              target: subdata.target,
              link: vm.target + "-" + maindata.daily_seq,
            });
          });
        } else {
          // data.push({
          // 		isMainData : false,
          // 		target : 0,
          // 		link : vm.target + '-' + maindata.daily_seq,
          // });
        }
      });

      return data;
    },
    changeMediaSelect(event, ismobile, media) {
      this.level = "campaign";
      this.target = "device";
      this.main.isTotalCount = "-1";

      if (ismobile) this.media = media;
      this.clickSearchBtn();
    },
    clickExcel() {
      var vm = this;
      var md = "";
      var date = vm.$refs.dateRangePicker.getDate();
      switch (vm.media) {
        case "naver":
          md = "N";
          break;
        case "kakaosa":
          md = "D";
          break;
        case "kakaomo":
          md = "K";
          break;
        default:
          md = "N";
      }

      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/targetreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: date.start,
          todate: date.end,
          md: md,
          level: vm.level,
          target: vm.target,
          start: 0,
          sort: vm.main.sort,
          display: vm.main.isTotalCount,
          totalcount: vm.main.isTotalCount,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {
          vm.handleShowMask();
        },
        success: function (data) {
          if (data.result === "success") {
            var data = vm.getTotal(data.data.targets).filter(function (target, index) {
              return target.isMainData === false && target.target !== 0;
            });
            var options = {
              common: vm.headerSet.common,
              app: vm.headerSet[vm.target].header,
              header: vm.headerSet[vm.media].header,
              headProps: "header",
            };

            vm.exportExcel(data, options);
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
        },
      });
    },
    exportExcel(data, options) {
      var vm = this;
      var headProps = [];

      if (Array.isArray(options.headProps)) {
        headProps = options.headProps;
      } else if (options.headProps === "header") {
        for (var h of vm.headerSet[vm.media].header) {
          headProps.push(h.key);
        }
        for (var h of vm.headerSet[vm.target].header) {
          headProps.push(h.key);
        }
        for (var c of vm.headerSet.common.header) {
          headProps.push(c.key);
        }
      } else {
        headProps = Object.keys(data[0]);
      }

      this.visibleHeadProps = headProps;
      this.instance = document.createElement("table");

      // Header 세팅
      let header = [];
      if (!Array.isArray(vm.headerSet[vm.media].header[0])) {
        var value = vm.headerSet[vm.media].header.slice();
        header.push(value);
        for (var t of vm.headerSet[vm.target].header) {
          header[0].push(t);
        }
        for (var c of vm.headerSet.common.header) {
          header[0].push(c);
        }
      }

      var thead = document.createElement("thead");
      for (var row of header) {
        var tr = document.createElement("tr");
        for (var h of row) {
          var rowspan = h.rowspan || "1";
          var colspan = h.colspan || "1";
          var th = document.createElement("th");
          th.setAttribute("rowspan", rowspan);
          th.setAttribute("colspan", colspan);
          th.innerText = h.name;
          tr.appendChild(th);
        }
        thead.appendChild(tr);
      }
      this.instance.appendChild(thead);

      // Body 세팅
      var tbody = document.createElement("tbody");

      var excel = [];
      data.forEach(function (data, index) {
        var value = Object.assign({}, data);
        excel.push(value);
      });

      for (var row of excel) {
        var tr = document.createElement("tr");
        for (var cellkey of this.visibleHeadProps) {
          var td = document.createElement("td");
          td.innerText = row[cellkey];
          tr.appendChild(td);
        }
        tbody.appendChild(tr);
      }
      this.instance.appendChild(tbody);

      // instance에 만들어진 table을 엑셀파일로 저장
      var config = { raw: true, type: "string" };
      var ws = xlsx.utils.table_to_sheet(this.instance, config);
      var wb = xlsx.utils.book_new();

      xlsx.utils.book_append_sheet(wb, ws, getMedia(vm.media));
      const wbout = xlsx.write(wb, { bookType: "xlsx", type: "array" });
      const url = window.URL.createObjectURL(
        new Blob([wbout], { type: "application/octet-stream" })
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = moment().format("LLLL") + "-" + "타겟팅분석" + ".xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    clickRadioDisplay(event, display) {
      var vm = this;
      if (vm.main.display === display) return false;
      vm.main.display = display;
      vm.clickSearchBtn();
    },
    handleChangedBalance(data) {
      this.balance = [];
      this.balance = data.slice();
    },
    handleChangedDateRange(data) {
      this.$refs.dateRangePicker.setDate({ start: data.start, end: data.end });
      this.clickSearchBtn();
    },
    clickLevel(event, level) {
      this.level = level;
      this.clickSearchBtn();
    },
    clickTarget(event, target) {
      this.target = target;
      this.clickSearchBtn();
    },
    clickAllowBtn() {
      let pillstab = document.querySelector(".pills-container-btn .pills-btn #pills-tab");
      let svg = document.querySelector(".pills-container-btn .allow svg");
      if (pillstab.classList.contains("flex-wrap")) {
        pillstab.classList.remove("flex-wrap");
        svg.style.transform = "rotate(180deg)";
      } else {
        pillstab.classList.add("flex-wrap");
        svg.style.transform = "rotate(0deg)";
      }
    },
    getDatasForChild(parent) {
      let vm = this;
      return vm.main.data.filter(function (d) {
        if (!d.isMainData && d["link"] === parent) return d;
      });
    },
    changeSort() {
      this.clickSearchBtn();
    },
    clickCheckpi(event, type) {
      var vm = this;
      var $active = $(event.target);
      var keys = Object.keys(vm.kpi);

      for (let i = 0; i < keys.length; i++) {
        if (keys[i].indexOf(type) > -1) {
          vm.kpi[keys[i]].check = $active.is(":checked");
          break;
        }
      }
    },
    getMediaNew(media) { return getMedia(media); },
    getKpiName(k) {return getKpiName(k);},
    getUnit(kpi) { return getUnit(kpi); },
    getAccountLog() {
      var vm = this;
      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/dashboard/accountlog",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {},
        success: function (data) {
          vm.accountlog = data.data.slice();
          // vm.accountlog = data.data.filter(function(d) {
          //   return d.media === vm.activeMedia.media;
          // })
          //console.log(vm.accountlog);
        },
        error: function (a, b, c) {},
        complete: function (a, b, c) {},
      });      
    },     
  },
};
</script>

<style scoped></style>
