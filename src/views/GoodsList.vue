<template>
  <div>
    <NavHeader></NavHeader>
    <NavBread>
      <span slot="bread">Goods</span>
    </NavBread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="#" class="price" @click="sortGoods">
            Price
            <svg class="icon-arrow-short" :class="{'sort-up':!sortFlag}">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-short" />
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{'filterby-show' : filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd>
                <a
                  href="javascript:void(0)"
                  @click="priceChecked = 'all'"
                  v-bind:class="{'cur' : priceChecked == 'all'}"
                >All</a>
              </dd>
              <dd v-for="(item,index) in priceFilter">
                <a
                  href="javascript:void(0)"
                  @click="setPriceFilter(index)"
                  :class="{'cur' : priceChecked == index }"
                >{{item.startPrice}} - {{item.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="item in goodsList">
                  <div class="pic">
                    <a href="#">
                      <img v-lazy="'/static/img/' + item.productImg" />
                    </a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.productPrice}}</div>
                    <div class="btn-area">
                      <a
                        href="javascript:;"
                        class="btn btn--m"
                        @click="addCart(item.productId)"
                      >加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="busy"
                infinite-scroll-distance="30"
              >
                <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <Modal v-bind:mdShow="mdShow" v-on:close="closeModal">
      <p slot="message">请先登录，否则无法加入到购物车中</p>
      <div slot="btnGroup">
        <a class="btn btn--m" @click="mdShow=false">关闭</a>
      </div>
    </Modal>
    <Modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
      <p slot="message">
        <svg class="icon-status-ok">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok" />
        </svg>
        <span>加入购物车成功</span>
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="mdShowCart=false">继续购物</a>
        <router-link class="btn btn--m" to="/cart">查看购物车</router-link>
      </div>
    </Modal>
    <NavFooter></NavFooter>
  </div>
</template>
<script>
import "./../assets/css/base.css";
import "./../assets/css/product.css";
import NavHeader from "./../components/Header.vue";
import NavFooter from "./../components/Footer.vue";
import NavBread from "./../components/Bread.vue";
import Modal from "./../components/Modal.vue";
import axios from "axios";
export default {
  data() {
    return {
      goodsList: [],
      sortFlag: true, //升降序
      page: 1, //分页
      pageSize: 8,
      mdShow: false,
      priceFilter: [
        {
          startPrice: "0.00",
          endPrice: "500.00",
        },
        {
          startPrice: "600.00",
          endPrice: "1000.00",
        },
        {
          startPrice: "1100.00",
          endPrice: "1500.00",
        },
        {
          startPrice: "1600.00",
          endPrice: "2000.00",
        },
      ],
      priceChecked: "all",
      filterBy: false,
      overLayFlag: false,
      busy: true, //true 滚动禁用
      loading: false, //默认不显示
      mdShowCart: false,
    };
  },
  components: {
    NavHeader: NavHeader,
    NavFooter,
    NavBread,
    Modal,
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    showFilterPop() {
      this.filterBy = true;
      this.overLayFlag = true;
    },
    closePop() {
      this.filterBy = false;
      this.overLayFlag = false;
    },
    setPriceFilter(index) {
      this.priceChecked = index; //点击价格，选中价格区间，关闭浮层，同时外面的价格区间也同步选中
      this.closePop();
      this.page = 1; //点击价格，实现过滤功能
      this.getGoodsList();
    },
    getGoodsList(flag) {
      //请求接口，渲染数据
      var param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? -1 : 1, //true赋值1 =》 升序 ；false赋值-1 =》 降序
        priceLevel: this.priceChecked, //传递点击的价格区间
      };
      this.loading = true;
      this.axios({ method: "get", url: "/goods/list", params: param }).then(
        (response) => {
          this.loading = false;
          if (response.data.status == "0") {
            if (flag) {
              let result = response.data.result.list;
              this.goodsList = this.goodsList.concat(result);
              if (response.data.result.count == 0) {
                //如果数据库中没有数据了，禁用滚动
                this.busy = true;
              } else {
                this.busy = false; //如果数据库中有数据，设置为false,下次滚动时才可以发送请求
              }
            } else {
              let result = response.data.result.list;
              this.goodsList = result;
              this.busy = false; //默认flag是false=>busy是true禁用状态，启用它，才会有反应
            }
          } else {
            this.goodsList = [];
          }
        }
      );
    },
    sortGoods() {
      //排序
      this.sortFlag = !this.sortFlag;
      this.page = 1;
      this.getGoodsList();
    },
    loadMore() {
      //滚动函数
      this.busy = true;
      setTimeout(() => {
        this.page++;
        this.getGoodsList(true);
      }, 500);
    },
    addCart(productId) {
      this.axios
        .post("/goods/addCart", {
          productId: productId,
        })
        .then((res) => {
          if (res.data.status == "0") {
            this.mdShowCart = true;
            this.$store.commit("updateCartCount", 1);
          } else {
            this.mdShow = true;
          }
        });
    },
    closeModal() {
      this.mdShow = false;
      this.mdShowCart = false;
    },
  },
};
</script>
<style lang="" scoped>
.btn:hover {
  background-color: #ffe5e6;
  transition: all 1s ease-out;
}
.sort-up {
  transform: rotate(180deg);
  transition: all 0.3s ease-out;
}
.icon-arrow-short {
  transition: all 0.3s ease-out;
}
</style>