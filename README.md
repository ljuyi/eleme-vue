# vue 搭建小项目

### 遇到的问题
1. vue-router在vue2.0中被废弃,导致router.map不能使用,vue2改成在new Router对象时直接向里面传路由映射
2. 路由映射时的组件属性值为component,不加s
3. vue封装的transform动画: v-enter: 组件被插入时生效,开始进入过渡状态
						   v-enter-active: 进入行为，一般定义运动参数，transition
						   v-leave: 组件被触发离开时生效,离开开始状态
						   v-leave-active: 离开行为，一般定义运动参数，transition
                           .[transition-name].enter.to,.[transition-name].leave.to,定义进入动作结束时和离开动作结束时的状态
                           注：一般.[transition-name].enter-to和.[transition-name].leave状态一样，进入和离开堆成时.[transition-name].enter和.[transition-name].leave.to状态一样，组件进入结束后的状态需要在组件样式中同样定义
4. 怎样正确 引用jquery,bootstrap等插件:
   npm install --save 插件名
   在需要使用的模块中引入: import '插件名'
5. 无法使用ready函数:
   vue2.0废弃了ready, 使用mounted,具体见vue2.0生命周期图
6. v-el 在 vue2.x中被废弃，vue2.x中使用ref，使用this.$refs.[设置的ref值]获取
7. track-by=$index在vue2.x中被废弃，在v-for中写成(item, index) in items,可以获取index值
8. npm插件中有一个滚动插件，better-scroll，使用方法见代码和作者github
9. axios获取后台数据，axios.get('[资源路径]').then((response)=>{response.data})，注axios.get/post获取到的值是promise

### 项目运行
将项目clone到本地，在根目录下运行
`node pro.server.js`
