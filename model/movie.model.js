const usePrisma = require("../config/usePrisma");
const moment = require("moment");
const MovieSpider = require("../spider/main");

module.exports = class MovieModel {
  constructor() {
    this.prisma = usePrisma;
    this.movieSpider = new MovieSpider()
  }

  async getList(form = {}) {
    let where = {}

    if (form.id) {
      where = Object.assign({}, {
        id: form.id
      })
    }
    if (form.category) {
      where = Object.assign({}, {
        category: form.category
      })
    }
    if (form.title) {
      where = Object.assign({}, {
        title: form.title
      })
    }
    if (form.type) {
      where = Object.assign({}, {
        type: form.type
      })
    }





    let needSelectItem = form.needSelectItem

    let query = {
      select: {
        id: true,
        title: true,
        originalTitle: true,
        year: true,
        rating: true,
        cast: true,
        category: true,
        genre: true,
        isEnd: true,
        poster: true,
        summary: true,
        type: true,
        fromWebUrl: true,
        movieItem: needSelectItem ? {
          select: {
            title: true,
            source: true,
          }
        } : false,
      },
      where,
      orderBy: {
        updatedAt: 'desc'
      }
    }

    if (form.page && form.pageSize) {
      query = Object.assign({}, query, {
        take: parseInt(form.pageSize),
        skip: parseInt((form.page - 1) * form.pageSize),
      })
    }

    let promiseAll = [this.prisma.movie.findMany(query), this.prisma.movie.count({
      where
    })]

    return Promise.all(promiseAll);
  }

  async updateMovieItem(form) {
    let data = await this.prisma.movie.findFirst({
      where: {
        id: form.id
      }
    })

    if (data) {
     return this.movieSpider.start({
        name: data.title,
        webUrl: data.fromWebUrl,
        cat: data.category,
        type: data.type,
        isEnd: data.isEnd,
        from: data.from,
        id: data.id,
      })
    }

    return
  }


  async addItem(forms, movieId) {
    const data = forms
    await this.prisma.movieItem.deleteMany({
      where: {
        movieId,
      }
    })
    return this.prisma.movieItem.createMany({
      data
    })
  }

  async add(form = {}) {
    const data = {
      title: form.title,
      originalTitle: form.originalTitle || "",
      updatedAt: moment().toDate(),
      from: form.from || "",
      fromWebUrl: form.fromWebUrl || "",
      cast: form.cast ? JSON.stringify(form.cast) : JSON.stringify([]),
      year: form.year || "",
      rating: form.rating || "",
      summary: form.summary || "",
      poster: form.poster || "",
      genre: form.genre ? JSON.stringify(form.genre) : JSON.stringify([]),
      category: form.category || "",
      type: form.type || "",
      isEnd: form.isEnd || "",
    };
    let d = await this.prisma.Movie.findFirst({
      where:{
        title: form.title
      }
    })
    if (d) {
      await this.prisma.Movie.delete({
        where: {
          id: d.id
        }
      })
    }
    return this.prisma.Movie.create({
      data,
    });
  }

  async grabMovie(form) {
    return this.movieSpider.start({
      webUrl: form.webUrl,
      name: form.name,
      type: form.type,
      cat: form.cat
    }, true)
  }
};
