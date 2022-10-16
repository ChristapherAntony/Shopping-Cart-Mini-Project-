var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers') // add a helper function (9)
var userHelper = require('../helpers/user-helpers')




/* GET home page. */
router.get('/', function (req, res, next) {
  let user = req.session.user          // check if session contain any user
  if(user){
    productHelper.getAllProducts().then((products) => {      // here we call get data function and use then -promise method
      res.render('user/view-products', { products, user })// render only dat comes its passes products with user(session data)
    })

  }else{
    productHelper.getAllProducts().then((products) => {      // here we call get data function and use then -promise method
      res.render('user/view-products', { products})// render only dat comes its passes products with user(session data)
    })
    
  }
  

});

// when click login render login page
router.get('/login', (req, res) => {
  if(req.session.loggedIn){              // if already logged in hoes to home page
    res.redirect('/')
  }else if(req.session.admin){
    res.redirect('/admin')
  }
  else{
    res.render('user/login')            // if session not exist login pae
  }
})

// when click signUp render signUp page
router.get('/signUp', (req, res) => {
  res.render('user/signUp')
}) 
//when form submit in sign Up page
router.post('/signUp', (req, res) => {
  userHelper.doSignUp(req.body).then((response) => {

    if(response.status==false){          //if response status false email already exist and show error         
      res.render('user/signup',{'emailError':"Email Already Exists"})
    }else{                                // else it will redirect to login page for login
      res.render('user/login')
    }
  })
})

// when login (form) clicks
router.post('/login', (req, res) => {
  userHelper.doLogin(req.body).then((response) => {    // here we call the function and pass the data got via req.  
    if (response.status) {
      req.session.loggedIn = true
      req.session.user = response.user   // session storesD
      res.redirect('/')         // if response return status:true then redirect to home page . vs render
    } else {
      res.redirect('/errorpage')    // res-false then to login page
    }
  })
})
// wrong password 
router.get('/errorpage', function (req, res) {
  
  if(req.session.user){
    res.redirect('/')
  }else{
    res.render('user/login', { error: 'Invalid Credentials' })  // to show Invalid Credentials in login page
  }

  
})
/****************/


//log out 
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')           // after clearing session goes to home page
})



module.exports = router;
