<template>
  <div class="cartcontrol">
      <transition name="move">
        <div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop.prevent="decreaseCart"></div>
      </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add-circle" @click.stop.prevent="addCart"></div>
  </div>
</template>
<script>
import Vue from 'vue';

export default {
  props: {
      food: {
          type: Object
      }
  },
  methods: {
      addCart(event) {
          if (!event._constructed) {
              return;
          }
          if (!this.food.count) {
              // 不能直接给一个新的属性赋值，定义属性需要调用Vue的set接口
              // 参数分别为（要定义的对象， 要定义的属性， 该对象的该属性的值）
              Vue.set(this.food, 'count', 1);
          } else {
              this.food.count ++;
          }
          this.$emit('cartAdd', event.target);
      },
      decreaseCart() {
          if (!event._constructed) {
              return;
          }
          if (this.food.count) {
              this.food.count --;
          }
      }
  }
};
</script>
<style lang="stylus">
  .cartcontrol
    font-size: 0
    .move-enter, .move-leave-to
      opacity: 0
      transform: translate3d(24px, 0, 0) rotate(180deg)
    .move-enter-to, .move-leave
      opacity: 1
      transform: translate3d(0, 0, 0) rotate(0)
    .cart-decrease
      transition: all 0.4s linear
    .cart-decrease, .cart-add
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)
</style>
