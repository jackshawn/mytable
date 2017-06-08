<template>
  <div>
    <!--表格-->
    <table class="my-table">
      <tr>
        <th v-for="(th ,index) in option.thead" @click="sort(index,th.key)" :width="th.width">
          {{th.name}}
          <span class="th-sort" v-if="th.sort">
            <span v-show="th.sort.asc">^</span><span v-show="th.sort.desc">^</span>
          </span>
        </th>
      </tr>
      <tr v-for="tr in toGet.data">
        <!--<td v-for="td in tr" :title="td">{{td}}</td>-->
        <template v-for="(td ,key) in tr">
          <!--slot name绑定为字段名，字段值绑定给val-->
          <slot :name="key" :val="td">
            <td>{{td}}</td>
          </slot>
        </template>
      </tr>
      <tr v-if="!toGet.data"><td class="my-loading" :colspan="option.thead.length">loading...</td></tr>
    </table>
    <!--分页-->
    <div class="my-page" v-if="toGet.totalPage && toGet.totalPage>1">
      <span @click.stop="setPage('-')" v-if="option.oriData.page>1"><</span>
      <span @click.stop="setPage(1)" v-if="option.oriData.page>3">1</span>
      <span v-if="option.oriData.page >4">...</span>
      <span v-for="i in toGet.totalPage" v-if="option.oriData.page-2<=i && option.oriData.page +2 >=i" @click.stop="setPage(i)"
            :class="{active: option.oriData.page==i}">{{i}}</span>
      <span v-if="option.oriData.page + 2 <toGet.totalPage && toGet.totalPage -option.oriData.page !=3">...</span>
      <span @click.stop="option.oriData.page = toGet.totalPage" v-if="option.oriData.page + 2 < toGet.totalPage"> {{toGet.totalPage}}</span>
      <span> {{option.oriData.page + '/' + toGet.totalPage + '页,' + toGet.count + '条'}}</span>
      <span @click.stop="setPage('+')" v-if="option.oriData.page != toGet.totalPage">></span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'mytable',
    props: ['option'],
    data () {
      return {
        toGet:{}
      }
    },
    methods: {
      setPage(i){
        switch (i) {
          case '+':
            this.option.oriData.page++;
            break;
          case '-':
            this.option.oriData.page--;
            break;
          default:
            this.option.oriData.page = i;
            break;
        }
        this.ajax();
      },
      sort(index,key){
        if(this.option.thead[index].sort){
          for (let i = 0; i < this.option.thead.length; i++) {
            if ( i !== index && this.option.thead[i].sort) {
              this.option.thead[i].sort.asc = true;
              this.option.thead[i].sort.desc = true
            }
          }
          if(this.option.thead[index].sort.asc && this.option.thead[index].sort.desc){
            this.option.thead[index].sort.asc = false;
            this.option.thead[index].sort.desc = true;
          }else{
            this.option.thead[index].sort.asc = !this.option.thead[index].sort.asc;
            this.option.thead[index].sort.desc = !this.option.thead[index].sort.desc;
          }
          this.option.oriData.order = key;
          this.option.oriData.direct = this.option.thead[index].sort.asc ? 'asc': 'desc';
          this.ajax()
        }
      },
      ajax(){
        let _this = this;
        this.toGet.data = ''
        let request = new XMLHttpRequest();
        request.open("POST", this.option.url);
        request.send(JSON.stringify(this.option.oriData));
        window.console.log(this.option.oriData)
        request.onreadystatechange = function () {
          if (request.readyState === 4) {
            if (request.status === 200) {
              let data = JSON.parse(request.responseText);
              if (data) {
                _this.toGet = data;
              }
            } else {
              window.console.error("发生错误：" + request.status);
            }
          }
        }
      }
    },
    mounted(){
    	this.option.oriData = this.option.oriData || {};
      this.option.oriData =  {
        page : this.option.oriData.page || 1,
        pageSize : this.option.oriData.pageSize || 10,
        order : this.option.oriData.order || '',
        direct : this.option.oriData.direct || '',
      };
      this.ajax();
      for (let i = 0; i < this.option.thead.length; i++) {
        this.option.thead[i].sort = this.option.thead[i].sort?{asc: true,desc: true}:false
        this.option.thead[i].width = this.option.thead[i].width || false
      }
    }
  }
</script>

<style scoped>
  .my-table {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    
    width: 100%;
    border: 1px solid #ddd;
    border-collapse: collapse;
  }
  
  .my-table th,
  .my-table td {
    padding: 8px;
    border: 1px solid #ddd;
    
    text-align: left;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 0;
  }
  
  .my-table .th-sort span {
    position: absolute;
    cursor: pointer;
  }
  
  .my-table .th-sort span:last-of-type {
    transform: rotate(180deg);
  }
  
  .my-page {
    margin: 5px auto;
    text-align: center;
    font-size: 14px;
    line-height: 28px;
  }
  
  .my-page .active {
    background: #337ab7;
    color: #fff;
  }
  
  .my-page span {
    display: inline-block;
    padding: 1px 12px 0;
    margin: 6px 3px;
    border-radius: 2px;
    cursor: pointer;
    background: #f1eff0;
    color: #666;
  }
  .my-table td.my-loading{
    font-size: 24px;
    text-align: center;
    line-height: 48px;
  }
</style>
