import Vue from 'vue'
import App from './App'
import './assets/mockData'
import './mytable/mytable'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})

$('#mytable').mytable({
  url: 'qwe',
  thead: [
    {
      key: 'source',
      name: '发件人',
      sort: true,
    },
    {
      key: 'target',
      name: '收件人',
      sort: true
    },
    {
      key: 'time',
      name: '发件时间',
      sort: true,
      width: 120
    },
    {
      key: 'content',
      name: '邮件内容'
    }
  ]
})
