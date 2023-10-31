const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  // app.use(
  //     "/api",
  //     createProxyMiddleware({
  //       target: "http://localhost:8080",
  //       changeOrigin: true,
  //     })
  // );
  // app.use(
  //     "/ws-stomp",
  //     createProxyMiddleware({ target: "http://localhost:8080", ws: true })
  // );
  app.use(
      "/ws-stomp",
      createProxyMiddleware({ target: "http://ec2-52-78-218-238.ap-northeast-2.compute.amazonaws.com:8080", ws: true })
  );
};