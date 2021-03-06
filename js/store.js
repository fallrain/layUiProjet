layui.config({
  version: '1535898708509' //为了更新 js 缓存，可忽略
});

layui.use(['laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider'], function () {
  var laydate = layui.laydate //日期
    , laypage = layui.laypage //分页
    , layer = layui.layer //弹层
    , table = layui.table //表格
    , upload = layui.upload //上传
    , element = layui.element //元素操作
    , slider = layui.slider //滑块
  //初始化搜索栏
  laydate.render({
    elem: '#dateDtKpi', //指定元素
    value: new Date(new Date().getTime() - 3600 * 24 * 1000)
  });
  $('#searchBtn').click(function () {
    getData();
  });
  //执行一个 table 实例
  var getData = function (pageNum) {
    var page = pageNum || location.hash.replace('#!page=', '') || 1;
    var date = new Date(new Date().getTime() - 3600 * 24 * 1000);
    var preDay = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).substr(-2) + '-' + ('0' + date.getDate()).substr(-2);
    var url = 'http://10.138.42.215:19805/common/inter?fresh=1&dataType=scy_mendian_mx_01&dateDtKpi=' + ($('#dateDtKpi').val() || preDay) + '&params=';
    url += 'page::' + page + ';;';
    url += 'trade_name::' + $('#trade_name').val() + ';;';//中心
    url += 'mendian_name::' + $('#mendian_name').val() + ';;';//门店名称
    url += 'grid_micro_name::' + $('#grid_micro_name').val() + ';;';//小微名称
    url += 'fenji::' + ($('#fenji').val() || '') + '';//分级
    Common.sendFormData(
      //'../json/store.json',
      url,
      {},
      function (data) {
        var tableData = data.scy_mendian_01;
        //转化为标准数据格式
        var newData = [];
        for (var p in tableData) {
          var col = tableData[p];
          for (var i = 0, l = col.length; i < l; i++) {
            if (!newData[i]) {
              newData[i] = {};
            }
            newData[i][p] = col[i];
          }
        }

        table.render({
          elem: '#storeList',
          width: 1400,
          height: 500,
          data: newData,
          title: '用户表',
          page: false, //开启分页
          request: {
            pageName: 'page'
          },
          //, toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
          //totalRow: true,//开启合计行
          cols: [
            [ //表头
              //{field: 'mendian_code', title: 'ID', width: 80, sort: false, fixed: 'left'},
              {
                field: 'mendian_code',
                title: '门店编码',
                rowspan: 2,
              },
              {
                field: 'mendian_name',
                title: '门店名称',
                rowspan: 2,
              },
              {
                field: 'trade_name',
                title: '中心名称',
                rowspan: 2,
              },
              {
                field: 'grid_micro_name',
                title: '网格小微名称',
                rowspan: 2,
              },
              /*{
                field: 'yj_shr_sj',
                title: '门店种类',
                rowspan: 2,
              },*/
              {
                field: 'yj_shr_sj',
                title: '月均零售',
                rowspan: 2,
              },
              {
                field: 'chuyang_no',
                title: '产品出样',
                rowspan: 2,
              },
              {
                title: '交互能力',
                colspan: 2,
                align: 'center'
              },
              {
                title: '全屋能力',
                colspan: 2,
                align: 'center'
              },
              {
                title: '模式输出',
                colspan: 2,
                align: 'center'
              },
              {
                field: 'fenji',
                title: '五星评级',
                rowspan: 2,
              },
            ],
            [
              {
                field: 'xiaoshou_no',
                title: '销售团队',
              },
              {
                field: 'ruzhuxiaoqu',
                title: '入住小区',
              },
              {
                field: 'sheji_no',
                title: '设计团队',
              },
              {
                field: 'anzhuang_no',
                title: '安装团队',
              },
              {
                field: 'sfyms',
                title: '是否有模式',
              },
              {
                field: 'moshi_content',
                title: '模式内容',
              },
            ]
          ]
        });
        laypage.render({
          elem: 'storePage',//元素ID
          count: data['scy_mendian_count']['jilushu'][0],//数据总数
          limit: 10,
          groups: 10,
          curr: location.hash.replace('#!page=', ''),
          hash: 'page',
          jump: function (obj, first) {
            if (!first) {
              getData(obj.curr);
            }
          }
        });
      }
    )
    ;
  };
  //上来便请求数据
  getData();
});