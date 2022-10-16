var db = require('../config/connection') // for using mongoDB connection in this helper
var collections = require('../config/collections')   // imported collections name 
var objectId=require('mongodb').ObjectId   // for delete function -matching with db obj_id

module.exports = {
    addProduct: (product, callback) => {
        //console.log(product);
        db.get().collection('product').insertOne(product).then((data) => {  //
            //console.log(data);
            callback(data.insertedId)
        })
    },

    getAllProducts: () => {  //we use promise here
        return new Promise(async (resolve, reject) => {   //getting data should write in await 
            let products =await db.get().collection(collections.PRODUCT_COLLECTION).find().toArray()  // toArray- convert into an array
            resolve(products)
        })

    },
    deleteProduct: (productId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.PRODUCT_COLLECTION).deleteOne({_id:objectId(productId)}).then((response)=>{
                resolve(response)
            })
        })
    },
    getProductDetails:(productId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.PRODUCT_COLLECTION).findOne({_id:objectId(productId)}).then((product)=>{
                resolve(product)
            })
        })
    },
    updateProduct:(productId,productDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.PRODUCT_COLLECTION)
            .updateOne({_id:objectId(productId)},{
                $set:{
                    Brand:productDetails.Brand,
                    Description:productDetails.Description,
                    Price:productDetails.Price
                }
            }).then((response)=>{
                resolve()
            })
        })
    }
}