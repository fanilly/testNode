const api = {
  login: '/admin/auth/login',
  register: '/admin/auth/register',
  logout: '/admin/auth/logout',
  forgetPassword: '/admin/auth/forge-password',
  twoStepCode: '/admin/auth/2step-code',
  sendSms: '/admin/account/sms',
  sendSmsErr: '/admin/account/sms_err',
  // get my info
  UserInfo: '/admin/user/info'
}
export default api