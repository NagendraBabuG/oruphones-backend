const mongoose = require('mongoose')

const Schema = mongoose.Schema
var objectId = Schema.objectId
const userSchema = new Schema({
    id: {
        type: String, required: true
    },
    first_name: {
        type: String, required: true
    },
    last_name: {
        type: String, required: true
    },

    email: {
        type: String, required: true
    },
    gender: {
        type: String, required: true
    },

   income: {
    type:Number, required: true
   },
   city: {
    type: String, required: true
   },
   car:{
    type: String, required: true
   },
   quote: {
    type: String, required: true
   },
   phone_price: {
    type: String, required: true
   }

}, { timestamps: true })

const user = mongoose.model('users', userSchema)
module.exports = user