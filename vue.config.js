const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({

  transpileDependencies: true,
  lintOnSave: false,
  devServer: {

    proxy: {
      "/api": {
        target: "http://119.23.54.229:8082",
        pathRewrite: {
          '^/api': ''
        },
        ws: true,
        changeOrigin: true
      }
    }
  }
})

