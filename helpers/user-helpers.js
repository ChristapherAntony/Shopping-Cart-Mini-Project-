var db = require('../config/connection') // for using mongoDB connection in this helper
var collection = require('../config/collections')   // imported collections name 
var bcrypt = require('bcrypt')     // after npm install 
var objectId=require('mongodb').ObjectId   // for delete function -matching with db obj_id

module.exports = {
    // we call when user sign up
    doSignUp: (userData) => {   // userData- storing data 

        return new Promise(async (resolve, reject) => {                   // async --bcrypt have await
           // here in this condition we check the email is already used or not
           // if used it return resolve statue as false else it will create user and send status true
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })
            if (user) {
                resolve({ status: false })
            } else {
                userData.Password = await bcrypt.hash(userData.Password, 10) // change password to bcrypt format-bcrypt have a call back so made it  await
                db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                    resolve({ status: true })  // to view data obj id in console
                })

            }

        })
    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false;
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email }) // check email
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {    // if user true the check pw with bcrypt
                    if (status) {
                        response.user = user;
                        response.status = true;
                        resolve(response)  // this response include user data and statues
                    } else {
                        resolve({ status: false }) // this response include only false status
                    }
                })   // compare userData pw with db pw
            } else {
                resolve({ status: false })
            }
        })
    },
    getAllUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            let users = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)
        })
    },
    deleteUser:(userID)=>{
        return new Promise ((resolve,reject)=>{
            
            db.get().collection(collection.USER_COLLECTION).deleteOne({_id:objectId(userID)}).then((response)=>{
                console.log(response);
                resolve(response)
            })
        })
    },
    getUserDetails:(userID)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(userID)}).then((response)=>{
                resolve(response)
            })
        })
    },
    updateUser:(userID,userDetails)=>{
        return new Promise(async(resolve,reject)=>{

            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userDetails.Email })
            if (user) {
                resolve({ status: false })
            } else {
                db.get().collection(collection.USER_COLLECTION)
                .updateOne({_id:objectId(userID)},{
                    $set:{
                        Name:userDetails.Name,
                        Email:userDetails.Email
                    }
                }).then((response)=>{
                    resolve()
                })


            }


        })
    }
}   