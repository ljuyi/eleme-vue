<template>
  <div>
    <!--不能使用原生html标签-->
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/rating">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/sellers">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>
<script>
import header from './components/header/header.vue';
import { urlParse } from 'common/js/util.js';
import axios from 'axios';

const ERR_OK = 0;

export default {
  data() {
    return {
      seller: {
        id: (() => {
          let queryParam = urlParse();
          return queryParam.id;
        })()
      }
    };
  },
  // 实例已经创建完成后被调用.在这一步,实例已经完成以下的配置:数据观测,属性和方法的运算,watch/event事件的回调,然而挂载阶段还没开始,$el属性目前不可见(生命周期)
  created() {
    axios.get('/api/seller?id=' + this.seller.id)
      .then((response) => {
        if (response.data.errno === ERR_OK) {
          // 直接赋值会使response的data值将id覆盖
          this.seller = Object.assign({}, this.seller, response.data.data);
          console.log(this.seller.id);
        }
      });
  },
  components: {
    'v-header': header
  }
};
</script>
<style lang="stylus">
  @import './common/stylus/mixin.styl'

  .tab
    display: flex
    witdh: 100%
    height:40px
    line-height:40px
    border-1px(rgba(7, 17, 27, 0.1))
    .tab-item
      flex: 1
      text-align:center
      & > a
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)
        &.active
          color: rgb(240, 20, 20)
</style>
