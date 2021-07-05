const express = require('express')
const app = express()

//needed to use middleware
app.use(express.json())
app.use(function (req, res, next) {
  /*to apply this function just to a specific handler function. 
    Also the function could be saved as a const and paste like app.get("/albums", filteringFunction, function (req, res)
    if (req.method == 'GET') {   
      return next()
  }*/
    const start = new Date()
    console.log(req.method, req.path, req.headers.authorization);
    next();
    const end = new Date()
    const lapseTime = end - start
    console.log(`Request took: ${lapseTime}`);
})

app.use(function (req, res, next) {
  //check if there is an autho header with 'somesecre...'
  if (req.headers.authorization == 'somesecretpassword') {
    //if there is, great, keep going
    next()
    return
  } else {
  //otherwise, dont go. return status 401 unauthorized
  res.status(401).send()
  }
})

const albumsData = [
    {
      albumId: "10",
      artistName: "Beyoncé",
      collectionName: "Lemonade",
      artworkUrl100:
        "http://is1.mzstatic.com/image/thumb/Music20/v4/23/c1/9e/23c19e53-783f-ae47-7212-03cc9998bd84/source/100x100bb.jpg",
      releaseDate: "2016-04-25T07:00:00Z",
      primaryGenreName: "Pop",
      url:
        "https://www.youtube.com/embed/PeonBmeFR8o?rel=0&amp;controls=0&amp;showinfo=0",
    },
    {
      albumId: "11",
      artistName: "Beyoncé",
      collectionName: "Dangerously In Love",
      artworkUrl100:
        "http://is1.mzstatic.com/image/thumb/Music/v4/18/93/6d/18936d85-8f6b-7597-87ef-62c4c5211298/source/100x100bb.jpg",
      releaseDate: "2003-06-24T07:00:00Z",
      primaryGenreName: "Pop",
      url:
        "https://www.youtube.com/embed/ViwtNLUqkMY?rel=0&amp;controls=0&amp;showinfo=0",
    },
  ];
  
app.get("/albums", function (req, res) {
    console.log(req.path);
    res.send(albumsData);
});

app.get('/albums/:albumId', function (req, res) {
    const albumId = req.params.albumId 
    const album = albumsData.find(album => album.albumId == albumId) 
    if (album) {
        res.send(album)
    } else {
        res.status(404).send()
    }
})

app.post('/albums', function (res, req) {
    console.log(req.body);
    const album = req.body
    if (albumsData.find(a => a.albumId == album.albumId))
    albumsData.push(album)
    res.send({ success: true })
})


app.delete('/albums/:albumId', function (res, req) {
    const albumId = req.params.albumId
    const index = albumsData.findIndex(a => a.albumId == albumId)

    if (index == -1) {
      res.status(404).send()
      return
    }
    albumsData.splice(index, 1)
    res.send({ success: true })
})

app.listen(5000, () => console.log("the server has started"))