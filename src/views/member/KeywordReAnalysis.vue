<template>
  <div class="d-flex m-h-100 dashboard">
    <big-menu-2
      :pMenu="'keywordReAnalysis'"
      @mountedMain="activeMain"
      class="pc"
    ></big-menu-2>
    <div class="pc wrap">
      <balance @logOut="handleLogOut"></balance>
      <section>
        <div class="title d-flex justify-content-between align-items-center">
          <h2>추천 키워드</h2>
        </div>
        <div class="keyword-search">
          <div class="multi-search">
            <div class="d-flex align-items-center">
              <template v-if="showMask">
                <div class="form-control">
                  <span
                    class="spinner-grow spinner-grow-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  로딩중...
                </div>
              </template>
              <template v-else>
                <select class="form-control" v-model="kpi" @change="changeKpi">
                  <option selected value="total">기준데이터</option>
                  <option value="cv">전환수</option>
                  <option value="cvr">전환율</option>
                  <option value="cst">매출액</option>
                  <option value="clk">클릭수</option>
                  <option value="ctr">클릭율</option>
                  <option value="im">노출수</option>
                  <option value="roas">ROAS</option>
                </select>
                <select class="form-control" v-model="kpi10" @change="changeKpi">
                  <option selected value="total">범위</option>
                  <option value="1">TOP1</option>
                  <option value="2">TOP2</option>
                  <option value="3">TOP3</option>
                  <option value="4">TOP4</option>
                  <option value="5">TOP5</option>
                  <option value="6">TOP6</option>
                  <option value="7">TOP7</option>
                  <option value="8">TOP8</option>
                  <option value="9">TOP9</option>
                  <option value="10">TOP10</option>
                </select>
              </template>

              <input
                type="text"
                class="form-control text-left"
                placeholder="키워드(최대 5개)"
                v-model="skeyword"
                @keyup.enter="addKeyword"
              />
              <button type="button" class="btn secondary" @click="addKeyword">
                키워드 추가
              </button>
            </div>
            <div class="d-flex align-items-center">
              <div class="input-group">
                <div
                  class="input-group-prepend date-compare d-flex justify-content-center align-items-center"
                >
                  선택된 키워드
                </div>
                <div class="d-flex form-control text-left">
                  <div
                    v-for="keyword in keywords"
                    :key="keyword.id"
                    class="badge d-flex align-items-center"
                  >
                    <input type="checkbox" checked />
                    <label>{{ keyword.text }}</label>
                    <button type="button" class="btn">
                      <i class="bi bi-x-lg" @click="delKeyword(keyword.id)"></i>
                    </button>
                  </div>
                </div>
              </div>
              <button type="button" class="btn submit" @click.prevent="clickSearchBtn">
                조회하기
              </button>
            </div>
          </div>
          <div class="alert alert-warning" role="alert">
            ※ 선택된 키워드와 연관된 키워드를 추천해 드립니다. 체크시 중복된 선택키워드는
            제거됩니다.<br />
            ※ 데이터 불러오는 중에도 키워드 추가는 가능합니다.
          </div>
        </div>
        <article>
          <div class="title d-flex justify-content-between align-items-center">
            <h3>추천 키워드 리포트</h3>
          </div>
          <table class="rekeyword">
            <thead>
              <tr>
                <th rowspan="2" width="230">
                  연관 키워드
                  <template
                    v-if="sort === 'keyword_name/asc' || sort === 'keyword_name/desc'"
                  >
                    <button
                      v-if="sort === 'keyword_name/asc'"
                      class="active text-yellow"
                      @click="clickSort('keyword_name/desc')"
                    >
                      <i class="bi bi-caret-up-fill"></i>
                    </button>
                    <button
                      v-if="sort === 'keyword_name/desc'"
                      class="active text-yellow"
                      @click="clickSort('keyword_name/asc')"
                    >
                      <i class="bi bi-caret-down-fill"></i>
                    </button>
                  </template>
                  <template v-else>
                    <button class="active" @click="clickSort('keyword_name/desc')">
                      <i class="bi bi-caret-down-fill"></i>
                    </button>
                  </template>
                </th>
                <th colspan="2">월간 검색수</th>
                <th colspan="2">월평균 클릭수</th>
                <th colspan="2">월평균 클릭률</th>
                <th rowspan="2" width="200">
                  경쟁정도
                  <template v-if="sort === 'comp_idx/asc' || sort === 'comp_idx/desc'">
                    <button
                      v-if="sort === 'comp_idx/asc'"
                      class="active text-yellow"
                      @click="clickSort('comp_idx/desc')"
                    >
                      <i class="bi bi-caret-up-fill"></i>
                    </button>
                    <button
                      v-if="sort === 'comp_idx/desc'"
                      class="active text-yellow"
                      @click="clickSort('comp_idx/asc')"
                    >
                      <i class="bi bi-caret-down-fill"></i>
                    </button>
                  </template>
                  <template v-else>
                    <button class="active" @click="clickSort('comp_idx/desc')">
                      <i class="bi bi-caret-down-fill"></i>
                    </button>
                  </template>
                </th>
                <th rowspan="2" width="230" style="border-right: 0">
                  월평균 노출광고수
                  <template
                    v-if="sort === 'pl_avg_depth/asc' || sort === 'pl_avg_depth/desc'"
                  >
                    <button
                      v-if="sort === 'pl_avg_depth/asc'"
                      class="active text-yellow"
                      @click="clickSort('pl_avg_depth/desc')"
                    >
                      <i class="bi bi-caret-up-fill"></i>
                    </button>
                    <button
                      v-if="sort === 'pl_avg_depth/desc'"
                      class="active text-yellow"
                      @click="clickSort('pl_avg_depth/asc')"
                    >
                      <i class="bi bi-caret-down-fill"></i>
                    </button>
                  </template>
                  <template v-else>
                    <button class="active" @click="clickSort('pl_avg_depth/desc')">
                      <i class="bi bi-caret-down-fill"></i>
                    </button>
                  </template>
                </th>
              </tr>
              <tr>
                <th width="100">
                  PC
                  <template
                    v-if="
                      sort === 'monthly_pc_qc_cnt/asc' ||
                      sort === 'monthly_pc_qc_cnt/desc'
                    "
                  >
                    <button
                      v-if="sort === 'monthly_pc_qc_cnt/asc'"
                      class="active text-yellow"
                      @click="clickSort('monthly_pc_qc_cnt/desc')"
                    >
                      <i class="bi bi-caret-up-fill"></i>
                    </button>
                    <button
                      v-if="sort === 'monthly_pc_qc_cnt/desc'"
                      class="active text-yellow"
                      @click="clickSort('monthly_pc_qc_cnt/asc')"
                    >
                      <i class="bi bi-caret-down-fill"></i>
                    </button>
                  </template>
                  <template v-else>
                    <button class="active" @click="clickSort('monthly_pc_qc_cnt/desc')">
                      <i class="bi bi-caret-down-fill"></i>
                    </button>
                  </template>
                </th>
                <th width="100">
                  모바일
                  <template
                    v-if="
                      sort === 'monthly_mobile_qc_cnt/asc' ||
                      sort === 'monthly_mobile_qc_cnt/desc'
                    "
                  >
                    <button
                      v-if="sort === 'monthly_mobile_qc_cnt/asc'"
                      class="active text-yellow"
                      @click="clickSort('monthly_mobile_qc_cnt/desc')"
                    >
                      <i class="bi bi-caret-up-fill"></i>
                    </button>
                    <button
                      v-if="sort === 'monthly_mobile_qc_cnt/desc'"
                      class="active text-yellow"
                      @click="clickSort('monthly_mobile_qc_cnt/asc')"
                    >
                      <i class="bi bi-caret-down-fill"></i>
                    </button>
                  </template>
                  <template v-else>
                    <button
                      class="active"
                      @click="clickSort('monthly_mobile_qc_cnt/desc')"
                    >
                      <i class="bi bi-caret-down-fill"></i>
                    </button>
                  </template>
                </th>
                <th width="100">
                  PC
                  <template
                    v-if="
                      sort === 'monthly_ave_pc_clk_cnt/asc' ||
                      sort === 'monthly_ave_pc_clk_cnt/desc'
                    "
                  >
                    <button
                      v-if="sort === 'monthly_ave_pc_clk_cnt/asc'"
                      class="active text-yellow"
                      @click="clickSort('monthly_ave_pc_clk_cnt/desc')"
                    >
                      <i class="bi bi-caret-up-fill"></i>
                    </button>
                    <button
                      v-if="sort === 'monthly_ave_pc_clk_cnt/desc'"
                      class="active text-yellow"
                      @click="clickSort('monthly_ave_pc_clk_cnt/asc')"
                    >
                      <i class="bi bi-caret-down-fill"></i>
                    </button>
                  </template>
                  <template v-else>
                    <button
                      class="active"
                      @click="clickSort('monthly_ave_pc_clk_cnt/desc')"
                    >
                      <i class="bi bi-caret-down-fill"></i>
                    </button>
                  </template>
                </th>
                <th width="100">
                  모바일
                  <template
                    v-if="
                      sort === 'monthly_ave_mobile_clk_cnt/asc' ||
                      sort === 'monthly_ave_mobile_clk_cnt/desc'
                    "
                  >
                    <button
                      v-if="sort === 'monthly_ave_mobile_clk_cnt/asc'"
                      class="active text-yellow"
                      @click="clickSort('monthly_ave_mobile_clk_cnt/desc')"
                    >
                      <i class="bi bi-caret-up-fill"></i>
                    </button>
                    <button
                      v-if="sort === 'monthly_ave_mobile_clk_cnt/desc'"
                      class="active text-yellow"
                      @click="clickSort('monthly_ave_mobile_clk_cnt/asc')"
                    >
                      <i class="bi bi-caret-down-fill"></i>
                    </button>
                  </template>
                  <template v-else>
                    <button
                      class="active"
                      @click="clickSort('monthly_ave_mobile_clk_cnt/desc')"
                    >
                      <i class="bi bi-caret-down-fill"></i>
                    </button>
                  </template>
                </th>
                <th width="100">
                  PC
                  <template
                    v-if="
                      sort === 'monthly_ave_pc_ctr/asc' ||
                      sort === 'monthly_ave_pc_ctr/desc'
                    "
                  >
                    <button
                      v-if="sort === 'monthly_ave_pc_ctr/asc'"
                      class="active text-yellow"
                      @click="clickSort('monthly_ave_pc_ctr/desc')"
                    >
                      <i class="bi bi-caret-up-fill"></i>
                    </button>
                    <button
                      v-if="sort === 'monthly_ave_pc_ctr/desc'"
                      class="active text-yellow"
                      @click="clickSort('monthly_ave_pc_ctr/asc')"
                    >
                      <i class="bi bi-caret-down-fill"></i>
                    </button>
                  </template>
                  <template v-else>
                    <button class="active" @click="clickSort('monthly_ave_pc_ctr/desc')">
                      <i class="bi bi-caret-down-fill"></i>
                    </button>
                  </template>
                </th>
                <th width="100">
                  모바일
                  <template
                    v-if="
                      sort === 'monthly_ave_mobile_ctr/asc' ||
                      sort === 'monthly_ave_mobile_ctr/desc'
                    "
                  >
                    <button
                      v-if="sort === 'monthly_ave_mobile_ctr/asc'"
                      class="active text-yellow"
                      @click="clickSort('monthly_ave_mobile_ctr/desc')"
                    >
                      <i class="bi bi-caret-up-fill"></i>
                    </button>
                    <button
                      v-if="sort === 'monthly_ave_mobile_ctr/desc'"
                      class="active text-yellow"
                      @click="clickSort('monthly_ave_mobile_ctr/asc')"
                    >
                      <i class="bi bi-caret-down-fill"></i>
                    </button>
                  </template>
                  <template v-else>
                    <button
                      class="active"
                      @click="clickSort('monthly_ave_mobile_ctr/desc')"
                    >
                      <i class="bi bi-caret-down-fill"></i>
                    </button>
                  </template>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(keyword, index) in keywordRes" :key="index">
                <td class="text-left" v-text="keyword.keyword_name"></td>
                <td
                  class="text-center"
                  v-text="getMonthlyQcCnt(keyword.monthly_pc_qc_cnt) + '회'"
                ></td>
                <td
                  class="text-center"
                  v-text="getMonthlyQcCnt(keyword.monthly_mobile_qc_cnt) + '회'"
                ></td>
                <td
                  class="text-center"
                  v-text="keyword.monthly_ave_pc_clk_cnt + '회'"
                ></td>
                <td
                  class="text-center"
                  v-text="keyword.monthly_ave_mobile_clk_cnt + '회'"
                ></td>
                <td class="text-center" v-text="keyword.monthly_ave_pc_ctr + '%'"></td>
                <td
                  class="text-center"
                  v-text="keyword.monthly_ave_mobile_ctr + '%'"
                ></td>
                <td class="text-center" v-text="getCompIdx(keyword.comp_idx)"></td>
                <td class="text-center" v-text="keyword.pl_avg_depth + '회'"></td>
              </tr>
            </tbody>
          </table>
          <ul class="pagination d-flex justify-content-center align-items-center">
            <li class="page-item">
              <a
                class="page-link shadow-none"
                href="javascript:;"
                aria-label="Previous"
                @click="clickPreviousFirstPageBtn"
              >
                <span aria-hidden="true"
                  ><i class="bi bi-chevron-double-left m-0"></i></span
              ></a>
            </li>
            <li class="page-item" :class="{ disabled: isFirstPageGroup }">
              <a
                class="page-link shadow-none"
                href="javascript:;"
                aria-label="Previous"
                @click="clickPreviousPageBtn"
              >
                <span aria-hidden="true"><i class="bi bi-chevron-left"></i></span>
              </a>
            </li>
            <li
              class="page-item"
              :class="{ active: page - 1 === start }"
              v-for="page in pages"
              :key="page"
            >
              <a
                class="page-link shadow-none"
                href="javascript:;"
                v-text="page"
                @click="clickPageBtn(page - 1)"
              ></a>
            </li>
            <li class="page-item" :class="{ disabled: isLastPageGroup }">
              <a
                class="page-link shadow-none"
                href="javascript:;"
                aria-label="Next"
                @click="clickNextPageBtn"
              >
                <span aria-hidden="true"><i class="bi bi-chevron-right"></i></span>
              </a>
            </li>
            <li class="page-item">
              <a
                class="page-link shadow-none"
                href="javascript:;"
                aria-label="Next"
                @click="clickNextEndPageBtn"
              >
                <span><i class="bi bi-chevron-double-right m-0"></i></span
              ></a>
            </li>
          </ul>
        </article>
        <div class="d-flex justify-content-end">
          <button type="button" class="btn excel" @click="clickExcel">
            엑셀 다운받기
          </button>
        </div>
      </section>
    </div>
    <div class="m m-wrap">
      <mheader ref="mHeader" :pMenu="'dashboard'"></mheader>
      <msearch
        ref="mSeader"
        :pMenu="'dashboard'"
        :pSearch="skeyword"
        @changedData="handleChangedData"
      ></msearch>
      <mfooter ref="mFooter" :pMenu="'dashboard'"></mfooter>
      <section>
        <div class="pills-container-btn">
          <div class="pills-btn pb-0">
            <ul class="d-flex" id="pills-tab" role="tablist">
              <template v-if="showMask">
                <li class="nav-item">
                  <button
                    class="nav-link media active"
                    id=""
                    type="button"
                    data-toggle="collapse"
                    data-target="#kpiBtnBoxContainerCollapse"
                    aria-expanded="false"
                    aria-controls="kpiBtnBoxContainerCollapse"
                  >
                    <span
                      class="spinner-grow spinner-grow-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span class="pl-1">로딩중...</span>
                  </button>
                </li>
              </template>
              <template v-else>
                <li class="nav-item">
                  <button
                    class="nav-link media active"
                    id=""
                    type="button"
                    data-toggle="collapse"
                    data-target="#kpiBtnBoxContainerCollapse"
                    aria-expanded="false"
                    aria-controls="kpiBtnBoxContainerCollapse"
                  >
                    {{ "기준데이터" }}
                    <i class="bi bi-arrow-down text-white mr-0"></i>
                  </button>
                </li>
                <li class="nav-item">
                  <button
                    class="nav-link media active"
                    id=""
                    type="button"
                    data-toggle="collapse"
                    data-target="#topBtnBoxContainerCollapse"
                    aria-expanded="false"
                    aria-controls="topBtnBoxContainerCollapse"
                  >
                    {{ "등급" }}
                    <i class="bi bi-arrow-down text-white mr-0"></i>
                  </button>
                </li>
              </template>

              <li
                class="nav-item"
                v-for="(k, i) in keywords"
                :key="k.id + i + '-' + getUuidv4()"
              >
                <button
                  class="nav-link media active"
                  id=""
                  type="button"
                  @click="delKeyword(k.id)"
                >
                  {{ k.text }}
                  <i data-v-3a468d86="" class="bi bi-x-lg m-0 pl-1 text-white"></i>
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
        <article class="collapse" id="kpiBtnBoxContainerCollapse">
          <ul class="media-btn-box-container">
            <li
              v-for="(k, index) in kpis"
              :key="k + index + '-' + getUuidv4()"
              @click="changeKpi($event, 'kpi', k.key)"
            >
              <input type="checkbox" />
              <label for="" :class="kpi === k.key ? 'active' : ''">
                {{ k.text }}
                <span>
                  <i
                    class="bi"
                    :class="kpi === k.key ? 'bi-check active' : 'bi-plus'"
                  ></i>
                </span>
              </label>
            </li>
          </ul>
        </article>
        <article class="collapse" id="topBtnBoxContainerCollapse">
          <ul class="media-btn-box-container">
            <li
              v-for="i in 10"
              :key="i + '-' + getUuidv4()"
              @click="changeKpi($event, 'top', i)"
            >
              <input type="checkbox" />
              <label for="" :class="kpi10 === i ? 'active' : ''">
                {{ "TOP" + i }}
                <span>
                  <i class="bi" :class="kpi10 === i ? 'bi-check active' : 'bi-plus'"></i>
                </span>
              </label>
            </li>
          </ul>
        </article>
        <article class="statisticst-report">
          <div class="title d-flex justify-content-between align-items-center">
            <h3>추천키워드 리포트</h3>
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
                      v-model="sort"
                      @change="clickSort(sort)"
                    >
                      <option value="keyword_name/asc">연관키워드순(올림)</option>
                      <option value="keyword_name/desc">연관키워드순(내림)</option>
                      <option value="monthly_pc_qc_cnt/asc">PC월간검색수순(올림)</option>
                      <option value="monthly_pc_qc_cnt/desc">PC월간검색수순(내림)</option>
                      <option value="monthly_mobile_qc_cnt/asc">
                        MOBILE월간검색수순(올림)
                      </option>
                      <option value="monthly_mobile_qc_cnt/desc">
                        MOBILE월간검색수순(내림)
                      </option>
                      <option value="monthly_ave_pc_clk_cnt/asc">
                        PC월평균클릭수순(올림)
                      </option>
                      <option value="monthly_ave_pc_clk_cnt/desc">
                        PC월평균클릭수순(내림)
                      </option>
                      <option value="monthly_ave_mobile_clk_cnt/asc">
                        MOBILE월평균클릭수순(올림)
                      </option>
                      <option value="monthly_ave_mobile_clk_cnt/desc">
                        MOBILE월평균클릭수순(내림)
                      </option>
                      <option value="monthly_ave_pc_ctr/asc">
                        PC월평균클릭율순(올림)
                      </option>
                      <option value="monthly_ave_pc_ctr/desc">
                        PC월평균클릭율순(내림)
                      </option>
                      <option value="monthly_ave_mobile_ctr/asc">
                        MOBILE월평균클릭율순(올림)
                      </option>
                      <option value="monthly_ave_mobile_ctr/desc">
                        MOBILE월평균클릭율순(내림)
                      </option>
                      <option value="comp_idx/asc">경쟁정도순(올림)</option>
                      <option value="comp_idx/desc">경쟁정도순(내림)</option>
                      <option value="pl_avg_depth/asc">월평균노출광고수순(올림)</option>
                      <option value="pl_avg_depth/desc">월평균노출광고수순(내림)</option>
                    </select>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div
            class="m-table"
            v-for="(keyword, index) in keywordRes"
            :key="keyword + index + '-' + getUuidv4()"
          >
            <ul>
              <div class="m-table-title">
                <div class="w-100">
                  <li class="font-weight-bold">
                    {{ keyword.keyword_name }}
                  </li>
                </div>
              </div>
              <div class="m-table-content">
                <div class="w-100 d-flex flex-wrap">
                  <li class="col-4">
                    <label for="">월간 검색수</label>
                    <div>{{ getMonthlyQcCnt(keyword.monthly_pc_qc_cnt) + "회 (p)" }}</div>
                    <div>
                      {{ getMonthlyQcCnt(keyword.monthly_mobile_qc_cnt) + "회 (m)" }}
                    </div>
                  </li>
                  <li class="col-4">
                    <label for="">월평균 클릭수</label>
                    <div>
                      {{ getMonthlyQcCnt(keyword.monthly_ave_pc_clk_cnt) + "회 (p)" }}
                    </div>
                    <div>
                      {{ getMonthlyQcCnt(keyword.monthly_ave_mobile_clk_cnt) + "회 (m)" }}
                    </div>
                  </li>
                  <li class="col-4">
                    <label for="">월평균 클릭율</label>
                    <div>
                      {{ getMonthlyQcCnt(keyword.monthly_ave_pc_ctr) + "회 (p)" }}
                    </div>
                    <div>
                      {{ getMonthlyQcCnt(keyword.monthly_ave_mobile_ctr) + "회 (m)" }}
                    </div>
                  </li>
                  <li class="col-4">
                    <label for="">경쟁정도</label>
                    <div>{{ getCompIdx(keyword.comp_idx) }}</div>
                  </li>
                  <li class="col-4">
                    <label for="">월평균노출광고수</label>
                    <div>{{ keyword.pl_avg_depth + "회" }}</div>
                  </li>
                </div>
              </div>
            </ul>
          </div>
          <ul class="pagination d-flex justify-content-center align-items-center">
            <li class="page-item">
              <a
                class="page-link shadow-none"
                href="javascript:;"
                aria-label="Previous"
                @click="clickPreviousFirstPageBtn"
              >
                <span aria-hidden="true"
                  ><i class="bi bi-chevron-double-left m-0"></i></span
              ></a>
            </li>
            <li class="page-item" :class="{ disabled: isFirstPageGroup }">
              <a
                class="page-link shadow-none"
                href="javascript:;"
                aria-label="Previous"
                @click="clickPreviousPageBtn"
              >
                <span aria-hidden="true"><i class="bi bi-chevron-left"></i></span>
              </a>
            </li>
            <li
              class="page-item"
              :class="{ active: page - 1 === start }"
              v-for="page in pages"
              :key="page"
            >
              <a
                class="page-link shadow-none"
                href="javascript:;"
                v-text="page"
                @click="clickPageBtn(page - 1)"
              ></a>
            </li>
            <li class="page-item" :class="{ disabled: isLastPageGroup }">
              <a
                class="page-link shadow-none"
                href="javascript:;"
                aria-label="Next"
                @click="clickNextPageBtn"
              >
                <span aria-hidden="true"><i class="bi bi-chevron-right"></i></span>
              </a>
            </li>
            <li class="page-item">
              <a
                class="page-link shadow-none"
                href="javascript:;"
                aria-label="Next"
                @click="clickNextEndPageBtn"
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
        :pStart="pStart"
        :pEnd="pEnd"
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
    <expire-session-modal
      ref="expireSessionModal"
      style="display: none"
    ></expire-session-modal>
    <message-modal ref="messageModal" style="display: none">
      <template slot="message">
        <span class="text-primary font-weight-bolder" style="display: inline-block">{{
          message.title
        }}</span>
        <span>{{ message.content }}</span>
      </template>
    </message-modal>
    <mask-modal ref="maskModal" style="display: none"></mask-modal>
  </div>
</template>

<script>
import $ from "jquery";
// import xlsx from "xlsx";
import * as xlsx from "xlsx";
import moment from "moment";
import {
  isMobile,
  priceToString,
  uuidv4,
  getTextLength,
} from "../../assets/js/common.js";
import expireSessionModal from "../../components/modal/expireSessionModal.vue";
import messageModal from "../../components/modal/messageModal.vue";
import maskModal from "../../components/modal/maskModal.vue";
import maskPannel from "../../components/common/maskPannel.vue";
import "moment/locale/ko";
import { store } from "../../store/store.js";
import { SHA256 } from "../../assets/js/sha256.js";
import { API_URL, TEMP_KEY } from "../../configs/config.js";
import balance from "../../components/dashboard2/balance.vue";
import bigMenu2 from "../../components/layout/bigMenu2.vue";
import logOutModal from "../../components/modal/logOutModal.vue";
import dateRangePicker from "../../components/common/dateRangePicker.vue";
import mheader from "../../components/layout/m/header.vue";
import mfooter from "../../components/layout/m/footer.vue";
import msearch from "../../components/layout/m/search.vue";
import mbigMenu2 from "../../components/layout/m/bigMenu2.vue";
import mdateRangePicker from "../../components/common/m/dateRangePicker.vue";
import mbalance from "../../components/common/m/balance.vue";
import mfmenu from "../../components/common/m/fMenu.vue";
import malarm from "../../components/common/m/alarm.vue";
import mdashboardEdit from "../../components/common/m/dashboardEdit.vue";

export default {
  data() {
    return {
      pStart: store.state.dateStore.start,
      pEnd: store.state.dateStore.end,
      showMaskPannel: false,
      skeyword: "",
      keywords: [],
      keywordRes: [],
      kpi: "total",
      kpi10: "total",
      responseData: null,
      responseReData: null,
      start: 0, //현재 페이지
      display: 10, //게시글의 수
      displayPageNum: isMobile() === true ? 5 : 10, // 페이지 번호의 수
      sort: "keyword_name/asc",
      isTotalCount: "-1",
      totalcount: 0,
      pages: [],
      isFirst: false,
      isEnd: false,
      visibleHeadProps: [],
      instance: undefined,
      header: [
        { key: "keyword_name", name: "연관키워드" },
        { key: "monthly_pc_qc_cnt", name: "월간검색수(PC)" },
        { key: "monthly_mobile_qc_cnt", name: "월간검색수(MO)" },
        { key: "monthly_ave_pc_clk_cnt", name: "월평균클릭수(PC)" },
        { key: "monthly_ave_mobile_clk_cnt", name: "월평균클릭수(MO)" },
        { key: "monthly_ave_pc_ctr", name: "월평균클릭률(PC)" },
        { key: "monthly_ave_mobile_ctr", name: "월평균클릭률(MO)" },
        { key: "comp_idx", name: "월평균노출광고수" },
        { key: "pl_avg_depth", name: "경쟁정도" },
      ],
      message: {
        title: "",
        content: "",
      },
      kpis: [
        { key: "cv", text: "전환수" },
        { key: "cvr", text: "전환율" },
        { key: "cst", text: "매출액" },
        { key: "clk", text: "클릭수" },
        { key: "ctr", text: "클릭율" },
        { key: "im", text: "노출수" },
        { key: "roas", text: "ROAS" },
      ],
      balance: [],
      showMask: false,
    };
  },
  computed: {
    isFirstPageGroup() {
      return this.isFirst;
    },
    isLastPageGroup() {
      return this.isEnd;
    },
  },
  watch: {
    start() {
      this.searchData();
      // this.clickSearchBtn();
    },
  },
  components: {
    bigMenu2,
    logOutModal,
    balance,
    expireSessionModal,
    messageModal,
    maskModal,
    dateRangePicker,
    mheader,
    mfooter,
    mbigMenu2,
    mdateRangePicker,
    mbalance,
    mfmenu,
    malarm,
    msearch,
    mdashboardEdit,
  },
  mounted() {
    $(".main").removeClass("m-h-100");
    let svg = document.querySelector(".pills-container-btn .allow svg");
    svg.style.transform = "rotate(180deg)";
    this.getTopKpi();
  },
  updated() {},
  methods: {
    activeMain(flag) {
      this.$emit("mountedMain", true);
      this.$emit("mountedDasyboad", true);
    },
    handleLogOut() {
      this.$refs.logOutModal.showModal();
    },
    handleExpireSession() {
      this.$refs.expireSessionModal.showModal();
    },
    handleShowMask() {
      this.$refs.maskModal.showModal();
    },
    handleHideMask() {
      this.$refs.maskModal.hideModal();
    },
    priceToString(salse) {
      if (salse === undefined) return "";

      return priceToString(salse);
    },
    addKeyword() {
      var vm = this;
      if (this.skeyword == "") {
        vm.message.title = "키워드";
        vm.message.content = "를 입력해주세요.";
        vm.$refs.messageModal.showModal();
        return false;
      }
      if (this.skeyword.length >= 1 && this.skeyword.length < 2) {
        vm.message.title = "최소 2글자";
        vm.message.content = "를 입력해주세요.";
        vm.$refs.messageModal.showModal();
        return false;
      }
      if (vm.keywords.length >= 5) {
        vm.message.title = "선택된 키워드가 5개";
        vm.message.content = "를 초과하였습니다.";
        vm.$refs.messageModal.showModal();
        return false;
      }

      vm.keywords.push({
        id: uuidv4(),
        text: vm.skeyword,
      });
      vm.skeyword = "";
      // console.log(this.skeyword, uuidv4());
    },
    delKeyword(id) {
      var vm = this;
      if (vm.keywords.length === 0) return false;

      vm.keywords.find(function (keyword, index) {
        if (keyword === undefined) return;

        if (keyword.id === id) {
          vm.keywords.splice(index, 1);
        }
      });
    },
    getTopKpi() {
      var vm = this;
      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/keywordreport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          fromdate: moment().subtract("30", "d").format("YYYY-MM-DD"),
          todate: moment().subtract("1", "d").format("YYYY-MM-DD"),
          md: "N",
          start: 0,
          sort: "cstd",
          display: 10,
          totalcount: vm.isTotalCount,
          kpi: "cv,cvr,cst,clk,ctr,im,roas",
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {
          vm.showMask = true;
          // vm.showMaskPannel = true;
          // vm.handleShowMask();
        },
        success: function (data) {
          if (data.result === "success") {
            vm.responseData = null;
            vm.responseData = data;
            vm.isTotalCount = vm.responseData.totalcount;
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
          vm.showMask = false;
          // vm.showMaskPannel = false;
          // vm.handleHideMask();
        },
      });
    },
    changeKpi(event, target, value) {
      var vm = this;
      if (target) {
        target === "kpi" ? (vm.kpi = value) : (vm.kpi10 = value);
      }

      if (vm.kpi !== "total" && vm.kpi10 !== "total") {
        if (vm.responseData.data !== null) {
          var keys = Object.keys(vm.responseData.data.kpis);
          for (var i = 0; i < keys.length; i++) {
            if (keys[i] === vm.kpi) {
              var data = vm.responseData.data.kpis[keys[i]];
              vm.skeyword = data[Number(this.kpi10) - 1].keyword_name;
            }
          }
        }
      } else {
        vm.skeyword = "";
      }
    },
    clickSearchBtn() {
      this.start = 0;
      this.searchData();
    },
    searchData() {
      var vm = this;
      if (vm.keywords.length === 0) {
        vm.message.title = "키워드";
        vm.message.content = "를 추가해주세요.";
        vm.$refs.messageModal.showModal();
        return false;
      }

      if (vm.keywords.length === 0) {
        vm.message.title = "키워드";
        vm.message.content = "를 선택해주세요.";
        vm.$refs.messageModal.showModal();
        return false;
      }

      var keywords = "";
      vm.keywords.forEach(function (keyword, index) {
        keywords += keyword.text;
        if (index !== vm.keywords.length - 1) keywords += ",";
      });

      var dKeywords = "";
      var checked = document.querySelectorAll("input[type='checkbox']:checked");
      for (var i = 0; i < checked.length; i++) {
        dKeywords += checked[i].nextSibling.nextSibling.innerText;
        if (i !== checked.length - 1) dKeywords += ",";
      }

      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/keywordrereport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          keywords: keywords,
          dkeywords: dKeywords,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {
          vm.handleShowMask();
        },
        success: function (data) {
          if (data.result === "success") {
            vm.totalcount = 0;
            vm.keywordRes = [];
            vm.responseReData = null;
            var sortedKeywords = vm.sortKeywords(data.data.keywords);

            vm.totalcount = sortedKeywords.length;
            var start = vm.start * 10;
            var end =
              start + 10 > sortedKeywords.length ? sortedKeywords.length : start + 10;

            for (var i = start; i < end; i++) {
              vm.keywordRes.push(sortedKeywords[i]);
            }

            vm.getStartAndEndPage();
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
    getStartAndEndPage() {
      this.pages = [];
      var endPage =
        Math.ceil((this.start + 1) / this.displayPageNum) * this.displayPageNum;
      var startPage = endPage - this.displayPageNum + 1;
      var tempEndPage = Math.ceil(this.totalcount / this.display);
      if (endPage > tempEndPage) {
        endPage = tempEndPage;
      }

      // console.log(startPage, endPage);
      this.isFirst = this.start + 1 === 1 ? true : false;
      this.isEnd =
        Math.ceil(this.totalcount / this.display) === this.start + 1 ? true : false;

      for (var i = startPage; i <= endPage; i++) {
        this.pages.push(i);
      }
    },
    clickPreviousFirstPageBtn() {
      this.start = 0;
    },
    clickPreviousPageBtn() {
      var currentPage = this.start - 1;
      this.start = this.start === 0 ? 0 : this.start - 1;
    },
    clickNextEndPageBtn() {
      let tempEndPage = Math.ceil(this.totalcount / this.display);
      this.start = tempEndPage - 1;
    },
    clickNextPageBtn() {
      let tempEndPage = Math.ceil(this.totalcount / this.display);
      this.start = this.start > tempEndPage ? tempEndPage : this.start + 1;
      // console.log(this.start, tempEndPage);
    },
    clickPageBtn(page) {
      this.start = page;
    },
    clickSort(sort) {
      this.sort = sort;
      this.start = 0;
      this.searchData();
    },
    sortKeywords(keywords) {
      return _.orderBy(keywords, this.sort.split("/")[0], this.sort.split("/")[1]);
    },
    clickExcel() {
      var vm = this;
      if (vm.keywords.length === 0) {
        vm.message.title = "키워드";
        vm.message.content = "를 추가해주세요.";
        vm.$refs.messageModal.showModal();
        return false;
      }

      if (vm.keywords.length === 0) {
        vm.message.title = "키워드";
        vm.message.content = "를 선택해주세요.";
        vm.$refs.messageModal.showModal();
        return false;
      }

      var keywords = "";
      vm.keywords.forEach(function (keyword, index) {
        keywords += keyword.text;
        if (index !== vm.keywords.length - 1) keywords += ",";
      });

      var dKeywords = "";
      var checked = document.querySelectorAll("input[type='checkbox']:checked");
      for (var i = 0; i < checked.length; i++) {
        dKeywords += checked[i].nextSibling.innerText;
        if (i !== checked.length - 1) dKeywords += ",";
      }

      $.ajax({
        type: "get", //요청 메소드 방식
        url: API_URL + "/app/analysis/keywordrereport",
        headers: { authorization: SHA256(TEMP_KEY) },
        data: {
          userid: store.state.userStore.userinfo.userid,
          keywords: keywords,
          dkeywords: dKeywords,
          session: store.state.userStore.session,
        },
        beforeSend: function (data) {
          vm.handleShowMask();
        },
        success: function (data) {
          if (data.result === "success") {
            var options = { header: vm.header, headProps: "header" };
            var keywords = vm.sortKeywords(data.data.keywords);
            vm.exportExcel(keywords, options);

            // var workBook = xlsx.utils.book_new();
            // var workSheet = xlsx.utils.json_to_sheet(data.data.keywords);
            // xlsx.utils.book_append_sheet(workBook, workSheet, 'example');
            // xlsx.writeFile(workBook, moment().format('LLLL') +' 연관검색어'+'.xlsx');
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
      // data row별 header에 바인딩 될 매핑값 설정
      var vm = this;
      var headProps = [];
      if (Array.isArray(options.headProps)) {
        headProps = options.headProps;
      } else if (options.headProps === "header") {
        for (var h of vm.header) {
          headProps.push(h.key);
        }
      } else {
        headProps = Object.keys(data[0]);
      }
      vm.visibleHeadProps = headProps;
      vm.instance = document.createElement("table");

      // Header 세팅
      var header = [];
      if (!Array.isArray(vm.header[0])) {
        header.push(vm.header);
      } else {
        header = vm.header;
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
      vm.instance.appendChild(thead);

      // Body 세팅
      var tbody = document.createElement("tbody");

      for (var row of data) {
        var tr = document.createElement("tr");
        for (var cellkey of this.visibleHeadProps) {
          var td = document.createElement("td");
          var value = "";
          if (cellkey === "monthly_pc_qc_cnt" || cellkey === "monthly_mobile_qc_cnt") {
            value = vm.getMonthlyQcCnt(row[cellkey]);
          } else if (cellkey === "comp_idx") {
            value = vm.getCompIdx(row[cellkey]);
          } else {
            value = row[cellkey];
          }

          td.innerText = value;
          tr.appendChild(td);
        }
        tbody.appendChild(tr);
      }
      vm.instance.appendChild(tbody);

      // instance에 만들어진 table을 엑셀파일로 저장
      var config = { raw: true, type: "string" };
      var ws = xlsx.utils.table_to_sheet(this.instance, config);
      var wb = xlsx.utils.book_new();

      xlsx.utils.book_append_sheet(wb, ws, "키워드추천");
      const wbout = xlsx.write(wb, { bookType: "xlsx", type: "array" });
      const url = window.URL.createObjectURL(
        new Blob([wbout], { type: "application/octet-stream" })
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = moment().format("LLLL") + " 연관검색어" + ".xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    getMonthlyQcCnt(qcCnt) {
      return qcCnt === 0 ? "< 10" : qcCnt;
    },
    getCompIdx(compIdx) {
      return compIdx === 0 ? "낮음" : compIdx === 1 ? "중간" : "높음";
    },
    handleChangedDateRange(data) {
      this.$refs.dateRangePicker.setDate({ start: data.start, end: data.end });
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
    handleChangedBalance(data) {
      this.balance = [];
      this.balance = data.slice();
    },
    getUuidv4() {
      return uuidv4();
    },
    handleChangedData(search) {
      this.skeyword = search;
      this.addKeyword();
      this.clickSearchBtn();
      // console.log(search);
    },
  },
};
</script>

<style scoped></style>
