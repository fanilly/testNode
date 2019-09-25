module.exports = class extends think.Logic {
  loginAction() {
    this.allowMethods = 'post'

    let rules = {
      userName: { required: true, string: '', aliasName: '用户名', trim: true },
      password: { required: true, string: '', aliasName: '密码', trim: true }
    }

    if (!this.validate(rules)) return this.fail(0, Object.values(this.validateErrors)[0], this.validateErrors)

  }
}
