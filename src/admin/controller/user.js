const Base = require('./base.js')
const fs = require('fs')
const _ = require('lodash')
const path = require('path')
const gm = require('gm')

module.exports = class extends Base {
  uploadUserAvatarAction() {
    const avatar = this.file('file')
    if (think.isEmpty(avatar)) return this.fail(0, '保存失败')
    const avatarPath = path.join(think.ROOT_PATH, `www/static/user/avatar/${think.uuid(12)}${this.ctx.state.userId}@@@@@@@@@@@@@@@@.${_.last(_.split(avatar.path, '.'))}`)
    let temp = fs.readFileSync(avatar.path)
    gm(avatar.path).size(function(err, info){
      if(err){

      }
      console.log(err)
      console.log('--------------------')
      console.log(info.width, info.height)
    })
    console.log(avatar)
    return this.success(avatar)
    console.log(temp.toString())
    console.log(this.ctx.state.userId)
    // console.log(avatar)
    console.log(avatarPath)
  }
}
