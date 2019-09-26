const jwt = require('jsonwebtoken');
const secret = 'JJFSLDLKKDS323ssdd@#@@gf';

module.exports = class extends think.Service {
  async getUserId(token) {
    if (!token) {
      return 0;
    }

    const result = await this.parse(token);
    console.log(result)
    if (think.isEmpty(result) || result.id <= 0) {
      return 0;
    }

    return result.id;
  }

  async create(userInfo) {
    const token = jwt.sign(userInfo, secret);
    return token;
  }

  async parse(token) {
    if (token) {
      try {
        return jwt.verify(token, secret);
      } catch (err) {
        return null;
      }
    }
    return null;
  }

  async verify(token) {
    const result = await this.parse(token);
    if (think.isEmpty(result)) {
      return false;
    }

    return true;
  }
};
