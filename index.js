const express = require('express')
const mongoose = require('mongoose')
const app = express()
app.use(express.json())
const userModel = require('./model/user')
//const userData = require('./data.js')
require('dotenv').config();
const PORT = process.env.PORT || 3001
//console.log(userData.length)
// userData.forEach((user)=> {
//     user.income = Number(user.income.split("$")[1])
// })
//console.log(userData[0])
mongoose.set('strictQuery', true)
app.get('/', (req, res)=> {
    res.send("Hello")
})

console.log(process.env.CONNECTION_URL)
//app.use('/.netlify/functions/getData', require('./routes/getData'))
app.use('/getData', require('./routes/getData'))
app.get('/enterData', async (req, res)=> {
    // let count = 0;
    // console.log('Entering Data \n')
    // for(let ind = 0; ind < userData.length; ind += 1)
    // {
    //     const createUser = await userModel.create(userData[ind])
    //     if(createUser) count += 1;
    //     console.log(count)
    // }
    // console.log('total created users ', count)
    const createUser = await userModel.create(userData)
    if(!createUser) return res.json(400).json({status: 'error'})
    return res.status(200).json({status: 'success'})
})
console.log(process.env.CONNECTION_URL)
mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on Port : ${PORT}`)
    })  
}).catch((error) => console.log(error.message))
