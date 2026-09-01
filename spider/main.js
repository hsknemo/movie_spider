const axios = require("axios");
const cheerio = require('cheerio')
const http = require("http");
const fs = require('fs')
const path = require('path')
const agent = new http.Agent({ keepAlive: false });
const spiderTargetData = require('./spider.data')

const picker = ($) => {
  let data_struct = function(item) {
    return {
      // 排序id
      id: 1,
      // 剧名
      title: item.title,
      // 剧别名
      originalTitle: item.alias,
      // 上映年份
      year: item.year,
      // 剧评分
      rating: item.rating,
      // 剧类型
      genre: item.genre,
      // 总共多少集数
      episodes: "更新至",
      // 导演
      director: item.director,
      // 主演
      cast: item.cast,
      // 剧介绍
      summary: item.summary,
      // 剧图片
      poster: item.poster,
      // 分集
      episodeList: [],
    };
  };

  let vodBox = $(".vodBox");
  let poster = $(vodBox).find(".vodImg .lazy").attr("src");
  let title =
    $(vodBox).find(".vodInfo .vodh > h2 strong").text() ||
    $(vodBox).find(".vodInfo .vodh > h2").text();
  let rate =
    $(vodBox).find(".vodInfo .vodh strong > label").text() ||
    $(vodBox).find(".vodInfo .vodh label").text();
  let alias =
    $($(vodBox).find(".vodinfobox li").get(0)).find("strong span").text() ||
    $($(vodBox).find(".vodinfobox li").get(0)).find("span").text();
  let director =
    $($(vodBox).find(".vodinfobox li").get(1)).find("strong span").text() ||
    $($(vodBox).find(".vodinfobox li").get(1)).find("span").text();
  let cast =
    $($(vodBox).find(".vodinfobox li").get(2)).find("strong span").text() ||
    $($(vodBox).find(".vodinfobox li").get(2)).find("span").text();
  let genre =
    $($(vodBox).find(".vodinfobox li").get(3)).find("strong span").text() ||
    $($(vodBox).find(".vodinfobox li").get(3)).find("span").text();
  let area = $($(vodBox).find(".vodinfobox li").get(4))
    .find("strong span")
    .text();
  let year =
    $($(vodBox).find(".vodinfobox li").get(6)).find("strong span").text() ||
    $($(vodBox).find(".vodinfobox li").get(6)).find("span").text();
  let summary =
    $(".vodplayinfo > strong").text() || $($(".vodplayinfo").get(0)).text();

  let ju_ji = function(item) {
    return {
      id: item.id,
      title: item.title,
      source: item.source,
    };
  };

  let ju = [];
  $($(".vodplayinfo ul").get(0))
    .children()
    .each((index, item) => {
      let source = $(item).find("a").attr("href");
      let name = $(item).find("a").attr("title");
      let id = index + 1;
      let n = new ju_ji({
        id,
        title: name,
        source,
      });
      ju.push(n);
    });


  let item = new data_struct({
    id: 2,
    title,
    year,
    rating: rate,
    genre: genre.split(","),
    director,
    cast: cast.split(","),
    poster,
    summary,
    originalTitle: alias,
  });
  var b = ju.filter(item => {
    if (item.title.includes('期')) {
      return item.title.startsWith('第') &&
        item.title.endsWith('期') || item.title.endsWith('期\t')
        || item.title.endsWith('期中') || item.title.endsWith('期上') || item.title.endsWith('期下')
    } else {
      return item
    }
  })
  item.episodeList = b
  return item
}

class MovieSpider {
  async getData() {
    let data = await axios({
      url: "http://localhost:3000/api/movie/select",
      method: "post",
      httpAgent: agent,
    });

    console.log(data.data);
  }

  async addData(data) {
    try {
      let d = await axios({
        url: "http://localhost:3000/api/movie/add",
        method: "post",
        data,
      });
      console.log('加载到数据库成功')
      return d
    } catch (e) {
      console.log('数据加入失败', e)
    }

  }

  async addItems(forms, movieId) {
    try {
      let d = await axios({
        url: "http://localhost:3000/api/movie/addItems",
        method: "post",
        data: {
          forms,
          movieId
        },
        httpAgent: agent,
      });
      return d
    }catch (e) {
      throw new Error(e.message)
    }


  }

  async loadHtml(n, url) {
    let name = `${n}.html`
    let p = path.join(__dirname, name)
    let html = fs.readFileSync(p).toString()
    let $ = cheerio.load(html)
    let data = picker($)
    data.from = '红牛影视资源'
    data.fromWebUrl = url
    data.category = 'tv'
    data.isEnd = 0
    data.type = '综艺'
    console.log(data)
    // let d = await this.addData(data)
    // let result = d.data.data
    // let res = await this.addItems(data.episodeList, result.id)
    // console.log('插入剧集', res)
  }

  async getPage() {
    let url = 'https://www.hongniuziyuan.com/index.php/vod/detail/id/E1hCCS.html?ac=detail'
    let n = '牛来'
    let name = `${n}.html`
    let p = path.join(__dirname, name)
    if (fs.existsSync(p)) {
      return this.loadHtml(n, url)
    }
    let res = await axios({
      method: 'get',
      url,
    })
    fs.writeFileSync(p, res.data, 'utf-8')
    console.log('write succ', name)
  }

  async sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
  }

  async getPage1(config, needSave = false) {
    let url = config.webUrl
    let name = config.name + '.html'
    let p = path.join(__dirname, name)
    if (fs.existsSync(p)) {
      return this.loadHtml1(config, needSave)
    }
    let res = await axios({
      method: 'get',
      url,
      httpAgent: agent,
    })
    fs.writeFileSync(p, res.data, 'utf-8')
    console.log('write succ', name)
    this.loadHtml1(config, needSave)
  }


  async loadHtml1(config, needSaveMovie = false) {
    console.log('开始提取html 写入到数据库', config.name)
    let name = config.name + '.html'
    let p = path.join(__dirname, name)
    let html = fs.readFileSync(p).toString()
    let $ = cheerio.load(html)
    let data = picker($)
    data.from = config.from || '红牛影视'
    data.fromWebUrl = config.webUrl
    data.category = config.cat
    data.isEnd = String(config.isEnd) || '0'
    data.type = config.type
    let id = config.id
    if (needSaveMovie) {
      let d = await this.addData(data)
      let result = d.data.data
      id = result.id
    }

    data.episodeList.forEach(item => {
      item.category = data.category
      item.movieId = id
      delete item.id
    })
    try {
      let res = await this.addItems(data.episodeList, id)
      return res
    } catch (e) {
      throw new Error(e.message)
    } finally {
      this.removeHtml(config)
    }
  }

  removeHtml(config) {
    let html = path.resolve(__dirname, `./${config.name}.html`)
    if (fs.existsSync(html)) {
      fs.rmSync(html)
    }
  }

  // async start() {
  //   if (!spiderTargetData.length) return
  //   for (let i = 0; i < spiderTargetData.length; i++) {
  //     let item = spiderTargetData[i]
  //     await this.sleep(3000)
  //     await this.getPage1(item)
  //   }
  // }


  /**
   * 变动 传递抓取地址及其他配置信息，单条获取影视播放地址
   * @date 2026年08月30日18:28:05
   * @param config
   * @param needSaveMovie 如果不是从数据库进来的数据必须传true 先存地址在抓取播放地址
   * @returns {Promise<void>}
   */
  async start(config = {}, needSaveMovie = false) {
    return await this.getPage1(config, needSaveMovie)
  }
}

module.exports = MovieSpider

// const spider = new MovieSpider();
//
// spider.start()

