// default config
module.exports = {
  workers: 1,
  errnoField: 'code',
  errmsgField: 'msg',
  API_SUCCESS_CODE: 1,                              // 接口请求成功code
  API_FAIL_CODE: 0,                                 // 接口请求失败code
  TOKEN_INVALID_TIME: 60 * 60 * 24 * 3              // token 失效时间
};
