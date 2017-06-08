import mock from 'mockjs'
mock.setup({
  timeout: 1000
})
mock.mock('qwe',function () {
  return {
    data: (function () {
      let arr = [];
      for(let i=0;i<10;i++){
        arr.push({
          source: mock.Random.email(),
          target: mock.Random.email(),
          time: mock.Random.date(),
          content: mock.Random.cparagraph()
        })
      }
      return arr
    })(),
    totalPage: 100,
    count: 1000
  }
})
