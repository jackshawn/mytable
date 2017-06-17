# mytable

> 定义数据交互格式, 快速生成展示表格

## Introduction

工作经常需要通过表格展示数据, 并有按字段排序, 以及翻页等需求。于是简单写了个jQuery插件 与Vue组件, 便于复用。


## option

#### 请求数据:Object

* type: string; 请求类型, 可选, 默认post
* url: string; 请求地址
* thead: Array; 表格头部参数, 为对象数组
	* key: string; 列的字段值, 与请求的数据字段对应
	* name: string; 表头显示的名称
	* sort: boolean; 是否可以按此列排序, 可选, 默认false
	* width: string|number; 配置当前列宽度, 可选, 默认auto
* oriData: Object; 请求的参数, 可选
	* page: number; 页码, 默认1
	* pageSize: number; 每页条数, 默认10
	* order: string; 根据列字段排序, 默认空
	* direct: ‘asc’|'desc'; 升序降序, 默认空
* fn: Function; 单元格回调函数, 可选; 默认情况下表格数据将以文本的形式插入单元格, 如果需要将数据处理组装后插入则需要使用此函数; this指向单元格jQuery对象, key为列字段, val为相应字段值, index为当前行数; 例如:

	```
	  fn: function (key,val,index) {
	    if(key==='num'){
	      this.text('#'+index)
	    }else if(key==='reversed'){
	      this.text(val.split('').reverse().join(''))
	    }else{
	      return true;
	    }
	  }
	```
  无需特殊处理的列则将函数return true以默认文本形式插入

#### 返回数据:Object
* data: Array; 表格数据, 为数组对象; 其中对象字段与thead中key相对应;例如:

	```
	  data: [
	    {
	      name: 'mytable.js',
	      time: '2017-06-17',
	      author: 'jackshawn'
	    },
	    ...
	  ],
	```
* totalPage: number; 总页数
* count: number; 总条数


## with jQuery

* 引入

	```
	   ...
	   <script src="path/jquery.js"></script>
	   <script src="path/mytable.js"></script>
	   ...
	</body>
	```

* 使用

	```
	$('#mytable').mytable({
	  url: 'requestURL',
	  thead: [
	    {
	      key: 'time',
	      name: '发件时间',
	      sort: true,
	      width: 120
	    },
	    ...
	  ]
	})
	```

* 事件绑定

  thead中的key值同样也会被设置为单元格的class名，所以可以通过事件委托的方式为单元格绑定事件:

	```
	$('#mytable').mytable({
	  ...
	}).on('click','.time',function () {
	  let timeReversed = $(this).text().split('').reverse().join('');
	  alert(timeReversed)
	})
  ```

## with Vue

* 引入src/mytable/mytable.vue 单文件组件

	```
	import mytable from 'path/mytable.vue'
	```

* 注册组件并配置参数

	```
	export default {
	    components: {
	      mytable: mytable
	    },
	    data(){
	      return {
	        option: {
	          url: 'requestURL',
	          thead: [
	            {
	              key: 'time',
	              name: '发件时间',
	              sort: true,
	              width: 120
	            },
	            ...
	          ]
	        }
	      }
	    }
	  }
	```

* 配置模板

	```
	<template>
	  <div>
	    <mytable :option="option"></mytable>
	  </div>
	</template>
	```

## demo

```
# 安装依赖
npm install

# 启动demo，localhost:8080
npm run dev

# 如果修改asset/mytable.js 需要重新打包
npm run build-mytable
```
