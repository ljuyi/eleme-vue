<template>
    <div class="goods">
        <div class="menu-wrapper" ref="menuWrapper">
            <ul>
                <li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index, $event)">
                    <span class="text">
                        <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
                        {{item.name}}
                    </span>
                </li>
            </ul>
        </div>
        <div class="foods-wrapper" ref="foodsWrapper">
            <ul>
                <li v-for="item in goods" class="foods-list food-list-hook">
                    <h1 class="title">{{item.name}}</h1>
                    <ul>
                        <li @click="selectFood(food, $event)" v-for="food in item.foods" class="food-item">
                            <div class="icon">
                                <img width="57" :src="food.icon" alt="">
                            </div>
                            <div class="content">
                                <h2 class="name">{{food.name}}</h2>
                                <p class="description">{{food.description}}</p>
                                <div class="extra">
                                    <span class="count">月售{{food.sellCount}}份</span>
                                    <span>好评率{{food.rating}}%</span>
                                </div>
                                <div class="price">
                                    <span class="now">￥{{food.price}}</span>
                                    <span class="old" v-show="food.oldPrice">￥{{ food.oldPrice}}
                                    </span>
                                </div>
                            </div>
                            <div class="cartcontrol-wrapper">
                                <cartcontrol :food="food" v-on:cartAdd="drop"></cartcontrol>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <div class="shopCar-wrapper">
            <shop-car ref="shopcart" :deliveryPrice="seller.deliveryPrice" :min-price="seller.minPrice" :select-foods="selectFoods"></shop-car>
        </div>
        <food :food="selectedFood" ref="food" v-on:cartAdd="drop"></food>
    </div>
</template>

<script>
import axios from 'axios';
import cartcontrol from '../cartcontrol/cartcontrol';
import shopcar from '../shopCar/shopCar';
import BScroll from 'better-scroll';
import food from '../food/food';

const ERR_OK = 0;

export default {
    props: {
        seller: {
            type: Object
        }
    },
    data() {
        return {
            goods: [],
            // 存储每个li和index的对应关系
            listHeight: [],
            scrollY: 0,
            selectedFood: {}
        };
    },
    created() {
        this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
        axios.get('/api/goods')
            .then((response) => {
                let err = response.data.errno;
                if (err === ERR_OK) {
                    this.goods = response.data.data;
                }
                // 下一个tick时执行，vue内置方法(因为以下方法是异步执行，所以执行时页面中也许还没有DOM元素，以至于获取不到总的高度，所以要等到DOM元素全部插入后获取高度，绑定事件)
                this.$nextTick(() => {
                    this._initScroll();
                    this._calculateHeight();
                });
            });
    },
    // 计算属性，computed中的方法中的依赖值一旦变化会触发函数再次执行（this.scrollY）
    computed: {
        currentIndex() {
            for (let i = 0; i < this.listHeight.length; i++) {
                let height1 = this.listHeight[i];
                let height2 = this.listHeight[i + 1];
                // 在前一个li和下一个li中间时，返回这个li的index
                if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                    return i;
                }
            }
            return 0;
        },
        selectFoods() {
            let foods = [];
            this.goods.forEach((good) => {
                good.foods.forEach((food) => {
                    if (food.count) {
                        foods.push(food);
                    }
                });
            });
            return foods;
        }
    },
    methods: {
        _drop(target) {
            this.$refs.shopcart.drop(target);
        },
        _initScroll() {
            this.menuScroll = new BScroll(this.$refs.menuWrapper, {
                // 是否让better-scroll派发click事件
                click: true
            });
            this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
                // 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
                probeType: 3,
                click: true
            });

            this.foodsScroll.on('scroll', (pos) => {
                this.scrollY = Math.abs(Math.round(pos.y));
            });
        },
        // 初始化时获取每个li的位置和index
        _calculateHeight() {
            let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
            let height = 0;
            this.listHeight.push(height);
            for (let i = 0; i < foodList.length; i++) {
                let item = foodList[i];
                height += item.clientHeight;
                this.listHeight.push(height);
            }
        },
        // 定义点击menu事件
        selectMenu(index, event) {
            // 在pc端，click时会触发一次，touchstart会触发一次，所以会执行两次
            // better-scroll中event派发的事件_constructed为true，可以根据此条特性来消除pc端的两次触发
            if (!event._constructed) {
                return;
            }
            let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
            let el = foodList[index];
            this.foodsScroll.scrollToElement(el, 300);   // 定义要滚动到的DOM节点，和运动的时间
        },
        drop(target) {
            this._drop(target);
        },
        selectFood(food, event) {
            if (!event._constructed) {
                return;
            }
            this.selectedFood = food;
            this.$refs.food.show();
        }
    },
    components: {
        'shop-car': shopcar,
        cartcontrol: cartcontrol,      // 加减数量组件
        food: food
    }
};
</script>
<style lang="stylus">
@import '../../common/stylus/mixin'

.goods
  display: flex
  position: absolute
  top: 174px
  bottom: 46px
  width: 100%
  overflow: hidden
  .menu-wrapper
    flex: 0 0 80px
    width: 80px
    background: #f3f5f7
    .menu-item
      display: table
      height: 54px
      width: 56px
      line-height: 14px
      padding: 0 12px
      &.current
        position: relative
        z-index: 10
        margin-top: -1px
        background: #fff
        font-weight: 700
        .text
          border-none()
      .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
      .text
        display: table-cell
        width: 56px
        vertical-align: middle
        text-align:center
        font-size: 12px
        border-1px(rgba(7, 17, 27, 0.1))
  .foods-wrapper
    flex: 1
    .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
    .food-item
        display: flex
        margin: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        padding-bottom: 18px
        &:last-child
            border-none()
            margin-bottom: 0
        .icon
            flex: 0 0 57px
            margin-right: 10px
        .content
            flex: 1
            .name
                margin: 2px 0 8px 0
                height: 14px
                line-height: 14px
                font-size: 14px
                color: rgb(7, 17, 27)
            .description, .extra
                line-height: 10px
                font-size: 10px
                color: rgb(147, 153, 159)
            .description
                margin-bottom: 8px
            .extra
                .count
                    margin-right: 12px
            .price
                font-weight: 700
                line-height: 24px
                .now
                    margin-right: 16px
                    font-size: 14px
                    color: rgb(240, 20, 20)
                .old
                    text-decoration: line-through
                    font-size: 10px
                    color: rgb(147, 153, 159)
        .cartcontrol-wrapper
          position: absolute
          right: 0
          bottom: 0
</style>
