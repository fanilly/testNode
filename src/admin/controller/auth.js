const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    return this.display();
  }
  loginAction() {
    return this.success('登录失败')
  }
}
