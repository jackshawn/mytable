import 'style-loader!css-loader!./mytable.css'
(function ($) {
  $.fn.extend({
    mytable: function (options) {
      return this.each(function () {
        /*默认参数*/
        var defaultOption = {
          type: 'post',
          oriData: {
            page: 1,
            pageSize: 10,
            order: '',
            direct: ''
          }
        };
        var option = $.extend(true, defaultOption, options);
        
        /*表格元素*/
        var table = $('<table class="my-table"><thead><tr></tr></thead><tbody></tbody></table>');
        var thead = table.find('thead>tr');
        var tbody = table.find('tbody');
        var trModel = $('<tr></tr>');
        var page = $('<div style="text-align: center"></div>');
        var $loading = $('<tr><td colspan="' + option.thead.length + '" style="text-align: center;margin: 30px 0;font-size: 18px"></td></tr>')
        var timr = (function () {
          var t = 0,
            text = '数据加载中...';
          return setInterval(function () {
            $loading.find('td').text(text.substr(0, t + 5));
            $loading.appendTo(tbody)
            if (t === 3) {
              t = 0;
            }
            t++
          }, 1000)
        })()
        
        /*填充表格*/
        var setTable = function (data) {
          tbody.empty();
          $.each(data, function (i, item) {
            var copy = trModel.clone();
            var index = (option.oriData.page - 1) * option.oriData.pageSize + i + 1;
            copy.find('td').each(function () {
              var $this = $(this);
              var className = $this.attr('class');
              if (!option.fn || option.fn.call($this, className, item[className], index)) {
                $this.text(item[className])
              }
            });
            copy.appendTo(tbody)
          })
        }
        
        
        /*设置th*/
        $.each(option.thead, function (i, item) {
          var th = $('<th class="' + item.key + '">' + item.name + '</th>');
          if (item.sort) {
            th.append('<span class="th-sort"> <span>^</span><span>^</span></span>');
          }
          thead.append(th);
          var td = $('<td class="' + item.key + '"></td>');
          trModel.append(td)
        })
        
        /*排序*/
        thead.on('click', 'th', function () {
          var $span = $(this).find('.th-sort')
          if($span.length){
            var order = $(this).attr('class');
            var state = $span.find('span').eq(0).css('visibility')
            thead.find('span').css('visibility','visible')
            if( state !== 'visible'){
              $span.find('span').eq(0).css('visibility','visible')
              $span.find('span').eq(1).css('visibility','hidden')
            }else{
              $span.find('span').eq(0).css('visibility','hidden')
              $span.find('span').eq(1).css('visibility','visible')
            }
            option.oriData.order = order;
            init();
          }
        });
        
        /*初始化方法*/
        var init = function () {
          $.ajax({
            type: option.type,
            url: option.url,
            data: JSON.stringify(option.oriData),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (d) {
              clearInterval(timr)
              setTable(d.data);
              page.mypage(option.oriData.page, d.totalPage, d.count, function (index) {
                option.oriData.page = index;
                init();
              });
            },
            error: function (jqXHR) {
              clearInterval(timr)
              $loading.find('td').text('加载失败，发生错误：' + jqXHR.status);
              $loading.appendTo(tbody)
              console.log("发生错误：" + jqXHR.status);
            }
          })
        }
        
        init();
        table.append(tbody);
        $(this).empty();
        $(this).append(table);
        $(this).append(page);
      })
    },
    mypage: function (curr, total, count, fn) {
      return $(this).each(function () {
        var $this = $(this).css({color: '#666', font: '12px/26px ""', textAlign: 'center'}).empty();
        var btnType = {
          active: {background: '#337ab7', color: '#fff'},
          normal: {background: '#f1eff0', color: '#666'}
        };
        var btn = function (option) {
          var style = {
            display: 'inline-block',
            padding: '0 12px',
            margin: '6px 3px',
            borderRadius: '2px',
            cursor: 'pointer'
          };
          return $('<span></span>').text(option.num)
            .addClass(option.class || 'page-btn')
            .data('curr', option.curr || '')
            .css($.extend(true, style, btnType[option.type || 'normal']))
        };
        $this.off().on('click', 'span.page-btn', function (e) {
          e.stopPropagation()
          var text = $(this).text();
          var index = ($(this).data('curr') || text) * 1;
          switch (text) {
            case '<':
              index--;
              break;
            case '>':
              index++;
              break;
            default:
              break;
          }
          if (fn) fn(index);
        })
        /*存在分页*/
        if (total && total > 1) {
          /*显示上一页*/
          if (curr > 1) {
            $this.append(btn({num: '<', curr: curr}));
          }
          /*首页 1 */
          if (curr - 2 > 1) {
            $this.append(btn({num: 1}));
            if (curr != 4) {
              $this.append(btn({num: '...', 'class': '...'}));
            }
          }
          for (var i = (curr - 2); i <= (curr + 2); i++) {
            if (i > 0 && i <= total) {
              $this.append(btn({
                num: i,
                type: i == curr ? 'active' : 'normal',
                'class': i == curr ? 'curr-btn' : ''
              }));
            }
          }
          /*尾页 total*/
          if (curr + 2 < total) {
            if (total - curr != 3) {
              $this.append(btn({num: '...', 'class': '...'}));
            }
            $this.append(btn({num: total}));
          }
          /*显示统计*/
          $this.append(btn({num: curr + '/' + total + '页, ' + count + '条 ', 'class': 'count'}));
          /*显示下一页*/
          if (curr != total) {
            $this.append(btn({num: '>', curr: curr}));
          }
        }
      });
    }
  });
})(jQuery)
