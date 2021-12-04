const express = require('express');
const SignupData = require('./src/model/signupdata')
const BookData = require('./src/model/bookdata')
const AuthorData = require('./src/model/authordata')
const port = process.env.PORT || 2000;
const cors = require('cors');
var bodyparser = require('body-parser');
const jwt = require('jsonwebtoken')
const path = require('path');

var app = new express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./dist/Frontend'));

app.use(cors());
app.use(bodyparser.json());



function verifyToken(req, res, next) { //token
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request1')
    }
    let token = req.headers.authorization.split(' ')[1]
    console.log(token)
    if (token === 'null') {
        return res.status(401).send('Unauthorized request2')
    }
    let payload = jwt.verify(token, 'admin')
    if (!payload) {
        return res.status(401).send('Unauthorized request3')
    }
    // let userpayload = jwt.verify(token, 'user')
    // if (!userpayload) {
    //     return res.status(401).send('Unauthorized request4')
    // }
    // req.userId = payload.subject
    next()
}

app.post('/api/insert', function(req, res) {
    console.log("backend")

    res.header("Access-Control-Allow-Origin", "*")
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH,PUT,DELETE')
    console.log(req.body)

    var signup = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }
    var signupdata = new SignupData(signup);
    signupdata.save();
    console.log("signupsaved")
})

app.get('/api/books', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH,PUT,DELETE')
    BookData.find().then(function(books) {
        res.send(books)
    })
});
app.get('/api/books/book', function(req, res) {
    console.log("backend singlr book")
    res.header("Access-Control-Allow-Origin", "*")
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH,PUT,DELETE')
    BookData.find().then(function(book) {
        res.send(book)
    })
});
app.get('/api/authors/author', function(req, res) {
    console.log("backend singlr author")
    res.header("Access-Control-Allow-Origin", "*")
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH,PUT,DELETE')
    AuthorData.find().then(function(author) {
        res.send(author)
    })
});
app.get('/api/authors', function(req, res) {
    console.log("authors backend")
    res.header("Access-Control-Allow-Origin", "*")
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH,PUT,DELETE')
    AuthorData.find().then(function(authors) {
        res.send(authors)
    })
});

app.post('/api/addbook', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH,PUT,DELETE')
    console.log(req.body)

    var books = {
        image: req.body.image,
        title: req.body.title,
        author: req.body.author,
        text: req.body.text,
    }
    var books = new BookData(books);
    books.save();
})

app.post('/api/addauthor', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH,PUT,DELETE')
    console.log(req.body)

    var authors = {
        image: req.body.image,
        author: req.body.author,
        title: req.body.title,
        text: req.body.text,
    }
    var authors = new AuthorData(authors);
    authors.save();
})

app.post("/api/login", function(req, res) {
    // let userData = req.body
    // console.log(userData)
    // res.send(`<center><h1>Site is working</h1></center>`);
    // res.header("Access-Control-Allow-Origin", "*")
    // res.header('Access-Control-Allow-Methods: GET, POST, PATCH,PUT,DELETE')

    var userdata = {
        username: req.body.username,
        password: req.body.password

    }
    SignupData.findOne({
            username: userdata.username,
            password: userdata.password
        },
        (err, user) => {
            // console.log(user)

            const usname = userdata.username;
            const pas = userdata.password;
            console.log(usname)
            if (err) {
                console.log(err);
            } else
            if (user !== null) {
                console.log(" user exist");
                let payload = { subject: usname + pas }
                let usertoken = jwt.sign(payload, 'user')
                res.status(200).send({ usertoken })
                    // res.redirect('/');
            } else if (usname == "admin" && pas == '1234') {
                let payload = { subject: usname + pas }
                let admintoken = jwt.sign(payload, 'admin')
                res.status(200).send({ admintoken })
                    // res.redirect('/books');
            } else if (user === null) {
                res.status(401).send('User doesnt exist')
                    // res.redirect('/signup');
            } else {
                res.send('Inavlidusername and password')

            }


        })




    // let username = "admin";
    // let password = "12345";
    // if (username !== userData.username) {
    //     res.status(401).send('Invalid Username')
    // } else
    // if (password !== userData.password) {
    //     res.status(401).send('Invalid Password')
    // } else {
    //     console.log(username)
    //     console.log(password)
    //     let payload = { subject: username + password }
    //     let token = jwt.sign(payload, 'secretKey')
    //     res.status(200).send({ token })
    // }

});

app.get('/api/:id', (req, res) => {

    const id = req.params.id;
    BookData.findOne({ "_id": id })
        .then((book) => {
            res.send(book);
        });
})
app.get('/api/singleauthor/:id', (req, res) => {
    console.log("back auth")
    var id = req.params.id;
    console.log(id)
    AuthorData.findOne({ "_id": id })
        .then((author) => {
            res.send(author);
        });
})

app.put('/api/update', (req, res) => {

    console.log(req.body)
    id = req.body._id

    image = req.body.image
    title = req.body.title
    author = req.body.author
    text = req.body.text

    BookData.findByIdAndUpdate({ "_id": id }, {
            $set: {
                "image": image,
                "title": title,
                "author": author,
                "text": text
            }
        })
        .then(function() {
            res.send();
        })

})

app.put('/api/updateauth', (req, res) => {

    console.log(req.body)
    id = req.body._id

    image = req.body.image
    title = req.body.title
    author = req.body.author
    text = req.body.text

    AuthorData.findByIdAndUpdate({ "_id": id }, {
            $set: {
                "image": image,
                "title": title,
                "author": author,
                "text": text
            }
        })
        .then(function() {
            res.send();
        })

})

app.delete('/api/:id', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH,PUT,DELETE')
    id = req.params.id;
    BookData.findByIdAndDelete({ "_id": id })
        .then(() => {
            console.log('success')
            res.send();
        })
})

app.delete('/api/delete/:id', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH,PUT,DELETE')
    id = req.params.id;
    AuthorData.findByIdAndDelete({ "_id": id })
        .then(() => {
            console.log('success')
            res.send();
        })
})

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
})

app.listen(port, () => {
    console.log("Server is ready at port no:" + port);
});