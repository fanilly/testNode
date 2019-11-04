import { axios } from '@/utils/request'
const REQUESTS = {
  login(parameter){
    return axios({
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      url: '/authlg/gqrc',
      method: 'post',
      data: parameter
    })
  },

  loginCallback(parameter){
    return axios({
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      url: '/authlg/lwqrc',
      method: 'post',
      data: parameter
    })
  },

  getWebsocketLink(parameter){
    let formData = new FormData();
    for(let key in parameter){
      formData.append(key, parameter[key]);
    }
    return axios({
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      url: '/srv/ngsi',
      method: 'post',
      data: formData
    })
  },

  getDueUserList (parameter) {
    return axios({
      url: '/due/due/dueuser/getList',
      method: 'post',
      data: parameter
    })
  },

  // 获取查询条件 - 贷款银行
  getDueCapitalList(parameter){
    return axios({
      url: '/due/due/config/capital/list',
      method: 'get',
      data: parameter
    })
  },

  // 获取查询条件 - 合伙人/合伙人编号
  getDuePartnerSearchList(parameter = { pageSize: 10000 }){
    return axios({
      url: '/due/due/config/partner/list',
      method: 'post',
      data: parameter
    })
  },

  // 贷后客户修改
  updateDueUserInfo(parameter){
    return axios({
      url: '/due/due/dueuser/update',
      method: 'post',
      data: parameter
    })
  },
};

export default REQUESTS;