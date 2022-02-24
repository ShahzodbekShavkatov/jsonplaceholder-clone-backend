const express = require("express")
const fs = require("fs")
const path = require("path")
const app = express()
const PORT = process.env.PORT || 8008

app.use( express.json() )

app.get('/posts', (req, res) => {
    let posts = fs.readFileSync(path.join(__dirname, 'database', 'posts.json'), 'UTF-8')
    res.json( JSON.parse(posts) )
})


app.get('/posts/:postId', (req, res) => {
    let posts = fs.readFileSync(path.join(__dirname, 'database', 'posts.json'), 'UTF-8')
    res.json(
        JSON.parse(posts).find(post => post.id == req.params.postId)
        )
})
    
app.get('/comments', (req, res) => {
    let comments = fs.readFileSync(path.join(__dirname, 'database', 'comments.json'), 'UTF-8')
    res.json(
        JSON.parse(comments).filter( comment => {
            console.log(req.query)
            const commentId = req.query.postId ? req.query.postId == comment.postId : true
            return commentId
        })
    )
})

app.get('/posts/:postId/comments', (req, res) => {
    let comments = fs.readFileSync(path.join(__dirname, 'database', 'comments.json'), 'UTF-8')
    res.json(
        JSON.parse(comments).filter(comment => {
            let commentId = req.params.postId ? req.params.postId == comment.postId : true
            return commentId
        })
    )
})

app.post('/posts', (req, res) => {
    let posts = fs.readFileSync(path.join(__dirname, 'database', 'posts.json'), 'UTF-8')
    let postsJ = JSON.parse(posts)
    req.body.id = postsJ.length + 1
    postsJ.push(req.body)
    console.log(postsJ)
    fs.writeFileSync(path.join(__dirname, 'database', 'posts.json'), JSON.stringify(postsJ, null, 4))
    res
        .json({ message: "OK", data: req.body })
        .status(201)
})

app.put('/posts/:id', (req, res) => {
    let posts = fs.readFileSync(path.join(__dirname, 'database', 'posts.json'), 'UTF-8')
    let postsJ = JSON.parse(posts)
    let post = postsJ.find( post => post.id == req.params.id)
    post.title = req.body.title ? req.body.title : post.title
    post.body = req.body.body ? req.body.body : post.body
    fs.writeFileSync(path.join(__dirname, 'database', 'posts.json'), JSON.stringify(postsJ, null, 4))
    res
        .json({ message: 'OK', data: post })
        .status(201)
})

app.delete('/posts/:id', (req, res) => {
    let posts = fs.readFileSync(path.join(__dirname, 'database', 'posts.json'), 'UTF-8')
    let postsJ = JSON.parse(posts)
    let post = postsJ.find( post => post.id == req.params.id)
    let index = postsJ.index(post)
    console.log(index)
    postsJ.splice(index, 1)
    fs.writeFileSync(path.join(__dirname, 'database', 'posts.json'), JSON.stringify(postsJ, null, 4))
    res
        .json({ message: 'OK', data: post })
        .status(201)
})


app.listen(PORT, () => console.log('Server is running on http://localhost:' + PORT))