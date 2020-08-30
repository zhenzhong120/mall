<template>
  <div>
    <NavHeader></NavHeader>
    <div class="container">
      <div class="page-title-normal">
        <h2 class="page-title-h2">
          <span>check out</span>
        </h2>
      </div>
      <!-- 进度条 -->
      <div class="check-step">
        <ul>
          <li class="cur">
            <span>Confirm</span> address
          </li>
          <li class="cur">
            <span>View your</span> order
          </li>
          <li class="cur">
            <span>Make</span> payment
          </li>
          <li class="cur">
            <span>Order</span> confirmation
          </li>
        </ul>
      </div>

      <div class="order-create">
        <div class="order-create-pic">
          <img src="/static/img/ok-2.png" alt />
        </div>
        <div class="order-create-main">
          <h3>
            Congratulations!
            <br />Your order is under processing!
          </h3>
          <p>
            <span>Order ID：{{orderId}}</span>
            <span>Order total：{{orderTotal | currency("￥")}}</span>
          </p>
          <div class="order-create-btn-wrap">
            <div class="btn-l-wrap">
              <router-link class="btn btn--m" to="/cart">Cart List</router-link>
            </div>
            <div class="btn-r-wrap">
              <router-link class="btn btn--m" to="/">Goods List</router-link>

            </div>
          </div>
        </div>
      </div>
    </div>
    <NavFooter></NavFooter>
  </div>
</template>

<script>
import NavHeader from "./../components/Header.vue";
import NavFooter from "./../components/Footer.vue";
import NavBread from "./../components/Bread.vue";
import Modal from "./../components/Modal.vue";
import { currency } from "./../util/currency";
import axios from "axios";
export default {
  data() {
    return {
      orderId: "",
      orderTotal: 0,
    };
  },

  components: {
    NavHeader,
    NavFooter,
  },

  created() {
    var orderId = this.$route.query.orderId;
    if (!orderId) {   //放置订单id认为篡改
      return;  
    }
    this.axios
      .get("/users/orderDetail", {
        params:{orderId: orderId}
      })
      .then((response) => {
        let res = response.data;
        if (res.status == "0") {
            console.log(this.orderId,this.orderTotal)
          this.orderId = orderId;
          this.orderTotal = res.result.orderTotal;
        }
      });
  },

  methods: {},
};
</script>
<style lang='css' scoped>
</style>