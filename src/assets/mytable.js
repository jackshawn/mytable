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
        var page = $('<div class="my-page"></div>');
        var $loading = $('<tr><td colspan="' + option.thead.length + '" class="my-loading">loading...</td></tr>')
        
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
          if ($span.length) {
            var order = $(this).attr('class');
            var state = $span.find('span').eq(0).css('visibility')
            thead.find('span').css('visibility', 'visible')
            if (state !== 'visible') {
              $span.find('span').eq(0).css('visibility', 'visible')
              $span.find('span').eq(1).css('visibility', 'hidden')
            } else {
              $span.find('span').eq(0).css('visibility', 'hidden')
              $span.find('span').eq(1).css('visibility', 'visible')
            }
            option.oriData.order = order;
            init();
          }
        });
        
        /*初始化方法*/
        var init = function () {
          tbody.empty().append($loading)
          $.ajax({
            type: option.type,
            url: option.url,
            data: JSON.stringify(option.oriData),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (d) {
              setTable(d.data);
              page.mypage(option.oriData.page, d.totalPage, d.count, function (index) {
                option.oriData.page = index;
                init();
              });
            },
            error: function (jqXHR) {
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
        var $this = $(this).empty();
        var creatBtn = function (text, type) {
          var $btn = $('<span></span>');
          $btn.text(text).data('curr', curr);
          if (type) {
            $btn.addClass('active')
          }
          return $btn;
        };
        $this.off().on('click', 'span', function (e) {
          e.stopPropagation()
          var text = $(this).text();
          var index;
          switch (text) {
            case '<':
              index = $(this).data('curr') - 1;
              break;
            case '>':
              index = $(this).data('curr') + 1;
              break;
            default:
              index = text * 1;
              break;
          }
          if (index && fn) fn(index);
        })
        /*存在分页*/
        if (total && total > 1) {
          /*显示上一页*/
          if (curr > 1) {
            $this.append(creatBtn('<'));
          }
          /*首页 1 */
          if (curr - 2 > 1) {
            $this.append(creatBtn(1));
            if (curr !== 4) {
              $this.append(creatBtn('...'));
            }
          }
          for (var i = (curr - 2); i <= (curr + 2); i++) {
            if (i > 0 && i <= total) {
              $this.append(i === curr ? creatBtn(i, true) : creatBtn(i));
            }
          }
          /*尾页 total*/
          if (curr + 2 < total) {
            if (total - curr !== 3) {
              $this.append(creatBtn('...'));
            }
            $this.append(creatBtn(total));
          }
          /*显示统计*/
          $this.append(creatBtn(curr + '/' + total + '页, ' + count + '条 '));
          /*显示下一页*/
          if (curr !== total) {
            $this.append(creatBtn('>'));
          }
        }
      });
    }
  });
})(jQuery)
