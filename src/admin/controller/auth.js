const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    return this.display();
  }

  async testTokenAction() {
    let token = this.post('token')
    const tokenInstance = this.service('token', 'admin')
    const userId = await tokenInstance.getUserId(token)
  }

  // 登录
  async loginAction() {
    let { userName, password } = this.post()
    const user = await this.model('sys_user').where({ userName }).find()

    if (think.isEmpty(user)) return this.fail(0, '用户不存在')
    if (think.md5(think.md5(password) + user.salt) !== user.password) return this.fail(0, '密码错误')

    const token = await this.service('token', 'admin').create({ id: user.id, createTime: Date.now() })
    return this.success({ token, userName }, '登录成功')
  }

  // 注册
  async registerAction() {
    const postData = this.post()
    const userTable = this.model('sys_user')

    const user = await userTable.where({ 'email': postData.email }).find()

    if (!think.isEmpty(user)) return this.fail(0, '账号已存在', {})

    let salt = think.uuid(12)
    let addResult = await userTable.add({
      userName: postData.email,
      email: postData.email,
      password: think.md5(think.md5(postData.password) + salt),
      createTime: this.getTime(),
      salt: salt
    })

    return this.success({}, '注册成功')
  }
}
