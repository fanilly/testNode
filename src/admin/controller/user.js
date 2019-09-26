const Base = require('./base.js')
const fs = require('fs')
const _ = require('lodash')

module.exports = class extends Base {
  uploadUserAvatarAction(){
    let avatar = this.file('file')
    const RESOURCE_PATH = path.join(think.ROOT_PATH, 'www')
    console.log(avatar.path)
    console.log(think.RESOURCE_PATH)
  }
}
