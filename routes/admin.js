var express = require('express');
var router = express.Router();

var productHelper = require('../helpers/product-helpers'); // add a helper function (9)
const userHelpers = require('../helpers/user-helpers');

const passworddb = "789";
const emaildb = "admin@gmail.com";


//admin login page--if already logged in got to admin panel instead of login
router.get('/admin-login', function (req, res) {
  if (req.session.admin) {
    res.redirect('/admin')
  }
  res.render('admin/admin-login')
})


//admin home page
router.get('/', function (req, res, next) {
  if (req.session.admin) {
    res.render('admin/admin-home', { admin: true })
  } else {
    res.redirect('/admin/admin-login')
  }
})

/****************************************** */
//admin login with credentials
router.post('/', function (req, res) {

  const userData = { email, password } = req.body  // collecing data from user email pw
  if (email === emaildb && password === passworddb) {
    
    //req.session.loggedInA = true
    req.session.admin = userData
    res.redirect('/admin')
  } else {
    res.redirect('admin/errorpage') // if pw failed remains to login err message
  }

})
//error handling
router.get('/errorpage', function (req, res) {

  if(req.session.admin){
    res.redirect('/admin')
  }
  res.render('admin/admin-login', { error: 'Invalid Credentials' })
})

//logout admin
router.get('/logOut', function (req, res) {

  req.session.destroy()
  res.render('admin/admin-login')
})
/********************************************* */

/* view all products */
router.get('/all-products', function (req, res, next) {
  if (req.session.admin) {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    productHelper.getAllProducts().then((products) => {      // here we call get data function and use then -promise method
      console.log(products);
      res.render('admin/view-products', { admin: true, products })// render only dat comes
    })
  } else {
    res.redirect('/admin/admin-login')
  }

});

//when we click on add product button --to get and ender add product from
router.get('/add-product', function (req, res) {
  res.render('admin/add-product', { admin: true })

})
// add product******************************************
router.post('/add-product', (req, res) => {
  productHelper.addProduct(req.body, (id) => {
    let image = req.files.image  //Image -from Image form   

    image.mv('./public/product-images/' + id + '.jpg', (err, done) => {
      // to move this image to another path--.mv is already included in fileUpload npm
      if (!err) {
        res.redirect("/admin/all-products")
      } else {
        console.log(err);
      }
      // if not thrown any error it will render admins add projects 
    })

  })

})
// delete product*****************
router.get('/delete-product/:id', (req, res) => {
  let productId = req.params.id
  productHelper.deleteProduct(productId).then((response) => {
    res.redirect('/admin/all-products')
  })
})
//edit Product--1-get details
router.get('/edit-product/:id', async (req, res) => {
  let productId = req.params.id   //to get the clicked item id
  let product = await productHelper.getProductDetails(productId)    // to get the whole details of the product
  console.log(product);
  res.render('admin/edit-product', { product, admin: true })
})
//update the edited details 2 
router.post('/edit-product/:id', (req, res) => {
  let productId = req.params.id
  productHelper.updateProduct(productId, req.body).then(() => {
    res.redirect('/admin/all-products')
    //to update img
    if (req.files.image) {
      let image = req.files.image
      image.mv('./public/product-images/' + productId + '.jpg')
    }
  })
})

/*------view all users---------------------------*/

router.get('/allUsers', function (req, res) {
  if (req.session.admin) {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    userHelpers.getAllUsers().then((user) => {
      res.render('admin/allUsers', { user, admin: true, })// render only dat comes
    })
    //  res.render('admin/allUsers',{ admin: true, user})
  } else {

    res.redirect('/admin/admin-login')
  }

})
//add user render************************
router.get('/add-user', (req, res) => {
  if(req.session.admin){
    res.render('admin/add-user', { admin: true })
  }else{
    res.redirect('/admin/admin-login')
  }
  
})
//add user post
router.post('/addUser', (req, res) => {
  userHelpers.doSignUp(req.body).then((response) => {

    if (response.status == false) {          //if response status false email already exist and show error         
      res.render('admin/add-user', { 'emailError': "Email Already Exists" })
    } else {                                // else it will redirect to login page for login
      res.redirect('/admin/allUsers')
    }
  })
})

//edit user *******************************
router.get('/edit-user/:id', async (req, res) => {
  if(req.session.admin){
    let userId = req.params.id
    let user = await userHelpers.getUserDetails(userId)
    res.render('admin/edit-user', { user, admin: true })
  }else{
    res.redirect('/admin/admin-login')
  }
})
//update edits
router.post('/user-update/:id', (req, res) => {
  let userId = req.params.id
  userHelpers.updateUser(userId, req.body).then((response) => {
    if(response.status==false){
      res.render('admin/edit-user',{ 'emailError': "Email Already Exists" })
    }else{
      res.redirect('/admin/allUsers')
    }
    
  })
})

//delete***************************************
router.get('/delete-user/:id', function (req, res) {
  let userID = req.params.id 
  userHelpers.deleteUser(userID).then((response) => {
    res.redirect('/admin/allUsers')
  })

})

module.exports = router;
