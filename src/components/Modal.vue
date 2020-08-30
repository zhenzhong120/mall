<template>
  <div>
    <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':mdShow}">
      <div class="md-modal-inner">
        <div class="md-top">
          <!-- <div class="md-title">Login in</div> -->
          <button class="md-close" @click="closeModal">Close</button>
        </div>
        <div class="md-content">
          <div class="confirm-tips">
            <slot name="message"></slot>
          </div>
          <div class="btn-wrap">
            <slot name="btnGroup"></slot>
          </div>
        </div>
      </div>
    </div>
    <!-- 遮罩层用v-if,因为它的样式设置的是显示状态，所以用v-if 创建和销毁标签来控制它的显示和隐藏 -->
    <div class="md-overlay" v-if="mdShow" @click="closeModal"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      msg: "hello vue",
    };
  },
  props: ["mdShow"],  //子组件接收父组件传递过来的属性,数组或者是对象格式
  methods: {
    closeModal() {
      this.$emit("close");},
  },
};
</script>
<style lang='css' scoped>
</style>