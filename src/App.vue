<template>
  <div>
    <mytable :option="option">
      <!--slot为需要修改列对应的字段名，val相应的字段值-->
      <template slot="time" scope="props">
        <td>{{props.val.split('-')[0]+'年'+props.val.split('-')[1]+'月'+props.val.split('-')[2]+'日'}}</td>
      </template>
    </mytable>
    <div id="mytable"></div>
  </div>
</template>

<script>
  import mytable from './mytable/mytable.vue'
  export default {
    components: {
      mytable: mytable
    },
    data(){
      return {
        option: {
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
        }
      }
    }
  }
</script>
