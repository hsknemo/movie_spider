const usePrisma = require("../config/usePrisma");
const moment = require("moment");
const MovieSpider = require("../spider/main");

module.exports = class MovieModel {
  constructor() {
    this.prisma = usePrisma;
  }

  async getList(form = {}) {
    let where = {}

    if (form.id) {
      where = Object.assign({}, {
        id: form.id
      })
    }

    if (form.type) {
      where = Object.assign({}, {
        type: form.type
      })
    }

    if (form.title) {
      where = Object.assign({}, {
        title: form.title
      })
    }


    let query = {
      select: {
        id: true,
        title: true,
        src: true,
        type: true,
        logo: true
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

    let promiseAll = [this.prisma.live.findMany(query), this.prisma.live.count({
      where
    })]

    return Promise.all(promiseAll);
  }


  async add(form = {}) {
    const data = {
      src: form.src,
      title: form.title,
      type: form.type || '默认',
      updatedAt: moment().toDate(),
    };
    let d = await this.prisma.Live.findFirst({
      where:{
        title: form.title
      }
    })
    if (d) {
      await this.prisma.Live.delete({
        where: {
          id: d.id
        }
      })
    }
    return this.prisma.Live.create({
      data,
    });
  }
};
