const {SUCCESS, ERROR} = require("../_requestResponse/setResponse");

const MovieService = require('../service/movie.service')
const ms = new MovieService()
const addMovie_func = async (req, res) => {
  try {
    let result = await ms.add(req.body)
    res.send(SUCCESS(result))
  } catch (e) {
    res.send(ERROR(e.message))
  }
}
const addMovie = {
  method: 'post',
  path: '/movie/add',
  func: addMovie_func
}

const selectMovie_func = async (req, res) => {
  try {
    let result = await ms.select(req.body)
    if (req.body.jsonMode) {
      return res.send(result.list)
    }
    res.send(SUCCESS(result))
  } catch (e) {
    res.send(ERROR(e.message))
  }
}
const selectMovie = {
  method: 'post',
  path: '/movie/select',
  func: selectMovie_func
}


const addMovieItems_Func = async (req, res) => {
  try {
    let result = await ms.addItem(req.body.forms, req.body.movieId)
    res.send(SUCCESS(result))
  } catch (e) {
    res.send(ERROR(e.message))
  }
}
const addMovieItems = {
  method: 'post',
  path: '/movie/addItems',
  func: addMovieItems_Func,
}


const update_movie_Func = async (req, res) => {
  try {
    let result = await ms.updateMovieItem(req.body)
    res.send(SUCCESS(result))
  } catch (e) {
    res.send(ERROR(e.message))
  }
}


const updateMovie = {
  method: 'post',
  path: '/movie/update',
  func: update_movie_Func,
}

const grab_movie_Func =  async (req, res) => {
  try {
    let result = await ms.grabMovie(req.body)
    res.send(SUCCESS(result))
  } catch (e) {
    res.send(ERROR(e.message))
  }
}


const grabMovie = {
  method: 'post',
  path: '/movie/grab',
  func: grab_movie_Func,
}

module.exports = [
  addMovie,
  selectMovie,
  addMovieItems,
  updateMovie,
  grabMovie,
]
