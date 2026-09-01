
const MovieModel = require('../model/movie.model')

module.exports = class MovieService {
  constructor() {
    this.movieModel = new MovieModel()
  }

  async select(form) {
    try {
      let t = await this.movieModel.getList(form)
      let list = t[0]
      let total = t[1]
      list.forEach(item => {
        if (item.movieItem) {
          item.episodeList = item.movieItem
          delete(item.movieItem)
          item.episodes = item.isEnd === '0' ? `更新到${item.episodeList.length}集` : '完结'
          item.episodeList.forEach((it, index) => {
            it.id = index + 1
            delete it.movieId
            delete it.category
          })
        }
      })
      return {
        list, total, page: form.page || '', pageSize: form.pageSize || ''
      }
    } catch (e) {
      throw new Error(e.message)
    }
  }

  addItem(forms, movieId) {
    if (!movieId) {
      throw new Error('电影id 缺失')
    }
    try {
      return this.movieModel.addItem(forms, movieId)
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
      return this.movieModel.add(form)
    } catch (e) {
      throw new Error(e.message)
    }
  }

  updateMovieItem(form = {}) {
    if (!form.id) {
      throw new Error('缺失更新参数')
    }
    return this.movieModel.updateMovieItem(form)
  }

  // 抓取影视
  grabMovie(form = {}) {
    if (!form.webUrl) {
      throw new Error('抓取链接必填')

    }
    return this.movieModel.grabMovie(form)
  }
}
