const express = require('express')
const mongoose = require('mongoose')

const userModel = require('../model/user')

const router = express.Router()
const middleware = require('../middleware/index')
router.use(middleware)
// Users which have income lower than $5 USD and have a car of brand “BMW” or “Mercedes”.
router.get('/query1', async (req, res)=> {
    const users = await userModel.find({
        income: { $lt: 5 }, 
        car: { $in: ['BMW', 'Mercedes'] }
      });
      console.log(users.length)
      return res.status(200).json({status : 'success', data : users})
})
// . Male Users which have phone price greater than 10,000.
router.get('/query2', async (req, res)=> {
    const maleUsersWithPhoneG10K = await userModel.find({
        gender: 'Male', // Filter for gender "Male"
        phonePrice: { $gt: 10000 } // Filter for phone price greater than $10,000
      })
    console.log(maleUsersWithPhoneG10K.length)
    return res.status(200).json({status: 'success', data: maleUsersWithPhoneG10K})
})

// Users whose last name starts with “M” and has a quote character length greater than 15 and email includes his/her last name.
router.get('/query3', async (req, res)=> {
    const queryResponse = await userModel.find({
      last_name: { $regex: /^M/i }, // Starts with "M", case-insensitive
      $expr: { $gt: [{ $strLenCP: "$quote" }, 15] }, // Quote character length greater than 15
      email: { $regex: /M/i } // Email includes last name, case-insensitive
    });
    console.log(queryResponse.length)
    return res.status(200).json({status: 'success', data: queryResponse})
})


//Users which have a car of brand “BMW”, “Mercedes” or “Audi” and whose email does not include any digit.
router.get('/query4', async (req, res)  => {
  
  const result = await userModel.find({
    car: { $in: ["BMW", "Mercedes", "Audi"] }, // Car brand is "BMW", "Mercedes", or "Audi"
    email: { $not: { $regex: /\d/ } } // Email does not include any digit
  })
  console.log(result.length)
  return res.status(400).json({status: 'success', data : result})
})
//Show the data of top 10 cities which have the highest number of users and their average income.
router.get('/query5', async (req, res) => {
  const top10Cities = await userModel.aggregate([
    {
      $group: {
        _id: "$city", // Group by city
        userCount: { $sum: 1 }, // Count the number of users in each city
        avgIncome: { $avg: "$income" } // Calculate the average income in each city
      }
    },
    {
      $sort: { userCount: -1 } // Sort by userCount in descending order
    },
    {
      $limit: 10 // Limit the result to top 10 cities
    }
  ])
  console.log(top10Cities.length)
  return res.status(200).json({status : 'success', data : top10Cities})
})

module.exports = router