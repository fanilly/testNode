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
    gm(avatar.path).size(function(err, info) {
      if (err) {

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

  async batchCompressionImageAction() {
    let currentIndex = 0
    let quality = this.post('quality') || 70
    let basePath = this.post('path')

    const compressionImage = (imagesPath) => {
      return new Promise((resolve, reject) => {
        const callback = (imagesPath) => {
          gm(imagesPath[currentIndex]).quality(quality).write(imagesPath[currentIndex], (err) => {
            if (imagesPath.length <= currentIndex) {
              resolve({ success: true })
            } else {
              currentIndex++
              callback(imagesPath)
            }
          })
        }
        callback(imagesPath)
      })
    }

    const readDir = () => {
      return new Promise((resolve, reject) => {
        fs.readdir(basePath + '\\', function(err, files) {
          if (err) reject()
          let imagesPath = []
          files.forEach(function(file) {
            if (file.endsWith('.png') || file.endsWith('.jpg')) imagesPath.push(path.join(basePath, file))
          })
          resolve(imagesPath)
        });
      })
    }

    const imagesPath = await readDir()

    if (imagesPath) {
      const result = await compressionImage(imagesPath)
      return this.success('处理成功')
    } else {
      return this.fail('读取文件失败')
    }

    console.log(basePath)
  }
}
