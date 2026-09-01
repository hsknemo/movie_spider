const {SUCCESS, ERROR} = require("../_requestResponse/setResponse");
const LiveService = require('../Service/live.service')
let ls = new LiveService()
const liveList_func =  async (req, res) => {
  try {
    let result = await ls.select(req.body)
    if (req.body.jsonMode) {
      return res.send(result.list)
    }
    res.send(SUCCESS(result))
  } catch (e) {
    res.send(ERROR(e.message))
  }
}


const liveList = {
  method: 'post',
  path: '/live/select',
  func: liveList_func,
}

const liveAdd_func =  async (req, res) => {
  try {
    let result = await ls.add(req.body)
    res.send(SUCCESS(result))
  } catch (e) {
    res.send(ERROR(e.message))
  }
}


const liveAdd = {
  method: 'post',
  path: '/live/add',
  func: liveAdd_func,
}

module.exports = [
  liveList,
  liveAdd,
]
