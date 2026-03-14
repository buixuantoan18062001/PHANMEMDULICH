const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const AccountModel = require('./models/account')
var accountRouter = require('./router/courses');
// const diadiemModel = require('./models/diadiem')
var diadiemRouter = require('./router/diadiemRouter');

var cors = require('cors')
const app = express();
const path = require('path')
const jwt = require('jsonwebtoken')
var cookieParser = require('cookie-parser')

app.use(morgan('combined'));
app.use(cookieParser())
app.use(cors());

app.all(function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  next();
});

app.use('/public', express.static(path.join(__dirname, './public')))
app.use('/public', express.static(path.join(__dirname, '.')))


const { token } = require('morgan');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////GET text
app.get('/text', (req, res) => {
  res.sendFile(path.join(__dirname, './public/html/text.html'))
})
app.get('/chitiet', (req, res) => {
  res.sendFile(path.join(__dirname, './public/html/chitiet.html'))
})
//////GET register
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, './public/html/register.html'))
})

//////POST register
app.post('/register', (req, res, next) => {
  // res.json('router 1 user post' + req.body.username + '' + req.body.phu)
  var email = req.body.email
  var username = req.body.username
  var password = req.body.password
  AccountModel.findOne({
    username: username
  })
    .then(data => {
      if (data) {
        res.json('user nay da ton tai !')
      } else {
        return AccountModel.create({
          email: email,
          username: username,
          password: password
        })
      }
    })
    .then(data => {
      res.json('Tao tai khoan thanh cong !')
    })
    .catch(err => {
      res.status(500).json('Tao tai khoan that bai !!!')
    })
})




//////GET login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, './public/html/login.html'))
})


//////POST login
app.post('/login', (req, res, next) => {
  var username = req.body.username
  var password = req.body.password
  AccountModel.findOne({
    username: username,
    password: password
  })

    .then(data => {

      var token = jwt.sign({
        _id: data._id
      }, 'mk')

      if (data) {

        return res.json({
          message: 'Dang nhap thanh cong nhe !',
          token: token,
          id: data.id
        })
      } else {
        return res.status(400).json('Account that bai !!!')
      }
    })
    .catch(err => {
      res.status(500).json('co loi ben server')
    })
})

// app.get('/private', (req, res, next) => {
//   try {
//     var token = req.cookies.token
//     var ketqua = jwt.verify(token, 'mk')
//     if (ketqua) {
//       next();
//     }
//   } catch (error) {
//     return res.redirect('/login')
//   }
// }, (req, res, next) => {
//   res.json('welcome')
// })

var checkLogin = (req, res, next) => {
  // Check Login
  try {
    var token = req.cookies.token
    var idUser = jwt.verify(token, 'mk')
    AccountModel.findOne({
      _id: idUser
    })
      .then(data => {
        if (data) {
          req.data = data
          console.log(data);
          next();
        } else {
          res.json('Ban khong co quyen a')
        }

      })
      .catch(err => {

      })
  } catch (error) {
    res.status(500).json('token khong hop le');
  }
}


var checkStudent = (req, res, next) => {
  // Check Student Role
  var role = req.data.role
  if (role >= 0) {
    next();
  } else {
    res.json('Ban khong co quyen')
  }
}

var checkTeacher = (req, res, next) => {
  // Check Teacher Role
  var role = req.data.role
  if (role >= 1) {
    next();
  } else {
    res.json('Ban khong co quyen')
  }

}

var checkManager = (req, res, next) => {
  // Check Manager Role
  var role = req.data.role
  if (role >= 2) {
    next();
  } else {
    res.json('Ban khong co quyen')
  }
}


app.get('/task', checkLogin, checkStudent, (req, res, next) => {
  console.log(req.data);
  res.json('ALL TASK')
})
app.get('/student', checkLogin, checkTeacher, (req, res, next) => {
  next();
}, (req, res, next) => {
  res.json('STUDENT')
})
app.get('/teacher', checkLogin, checkManager,(req, res, next) => {
  next();
}, (req, res, next) => {
  res.json('TEACHER')
})

app.use('/diadiem', diadiemRouter);
app.use('/', accountRouter);

var corsOptions = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}



  app.listen(4000, function () {
   console.log('http://localhost:4000/')
 })