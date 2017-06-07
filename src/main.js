// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App';
import goods from './components/goods/goods';
import ratings from './components/ratings/ratings';
import seller from './components/sellers/seller';

import './common/stylus/index.styl';

Vue.use(VueRouter);       // 全局注册

const routes = [
  { path: '/goods', component: goods },
  { path: '/rating', component: ratings },
  { path: '/sellers', component: seller }
];

// 以下内容与vue-router 1.x 不同, 且不兼容
const router = new VueRouter({     // vue-router 1.x 使用map方法分发路由
  linkActiveClass: 'active',             // 给被激活的a标签赋予class
  routes // （缩写）相当于 routes: routes
});

new Vue({                      // 挂载方式不同, vue-router 1.x 使用start方法
  router,
  render: h => h(App)    // 没有这句渲染不出来
}).$mount('#app');

router.push('/goods');                // 使初始化打开页面路由为goods, vue-router 1.x 使用go方法
