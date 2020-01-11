module.exports = {
    proxy: {
          '/apis': {
              target: 'http://127.0.0.1:3000',  // 接口域名
              secure: false,  // 如果是https接口，需要配置这个参数
              changeOrigin: true,  //是否跨域
              pathRewrite: {
                  '^/apis': ''   //需要rewrite的,
              }              
          }
    }
  }