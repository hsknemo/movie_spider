
const LiveModel = require('../model/live.model')

module.exports = class LiveService {
  constructor() {
    this.liveModel = new LiveModel()
  }

  async select(form) {
    try {
      let t = await this.liveModel.getList(form)
      let list = t[0]
      let total = t[1]
      return {
        list, total, page: form.page || '', pageSize: form.pageSize || ''
      }
    } catch (e) {
      throw new Error(e.message)
    }
  }

  add(form = {}) {
    if (!Object.values(form).length) {
      throw new Error('入参为空')
    }
    if (!form.title) {
      throw new Error('标题必传')
    }

    try {
      return this.liveModel.add(form)
    } catch (e) {
      throw new Error(e.message)
    }
  }

}
