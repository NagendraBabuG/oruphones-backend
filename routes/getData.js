const express = require('express')
const mongoose = require('mongoose')

const userModel = require('../model/user')

const router = express.Router()
const clientRedis = require('../clientRedis')
const middlewareCache = async (req, res, next) => {
  const { key } = req.query;
  console.log(key)
  if (key === undefined) {
    next();
  } else {
    try {
      const data = await clientRedis.get(key);
      //console.log('data in cache ', data)
      if (data !== null) {
        console.log('using redis');
        return res.status(200).json({ status: 'success', data: JSON.parse(data) });
      } else {
        next();
      }
    } catch (err) {
      console.log(err);
      next();
    }
  }
}

// Users which have income lower than $5 USD and have a car of brand “BMW” or “Mercedes”.
router.get('/query1',middlewareCache, async (req, res)=> {
  try{
  
    const users = await userModel.find({
        income: { $lt: 5 }, 
        car: { $in: ['BMW', 'Mercedes'] }
      });
      clientRedis.set('query1', JSON.stringify(users))
      console.log(users.length)
      return res.status(200).json({status : 'success', data : users})
    
  }
  catch(error)
  {
    return res.status(404).json({status: 'error', data : error})
}})

// . Male Users which have phone price greater than 10,000.
router.get('/query2', middlewareCache, async (req, res)=> {
  try{
    const maleUsersWithPhoneG10K = await userModel.find({
      gender: 'Male', // Filter for gender "Male"
      phonePrice: { $gt: 10000 } // Filter for phone price greater than $10,000
    })
  console.log(maleUsersWithPhoneG10K.length)
  clientRedis.set('query2', JSON.stringify(maleUsersWithPhoneG10K))
  return res.status(200).json({status: 'success', data: maleUsersWithPhoneG10K})
  }
  catch(error)
  {
    return res.status(404).json({status: 'error', data : 'error'})
  }
    
})

// Users whose last name starts with “M” and has a quote character length greater than 15 and email includes his/her last name.
router.get('/query3',middlewareCache, async (req, res)=> {
  try{
    const queryResponse = await userModel.find({
      last_name: { $regex: /^M/i }, // Starts with "M", case-insensitive
      $expr: { $gt: [{ $strLenCP: "$quote" }, 15] }, // Quote character length greater than 15
      email: { $regex: /M/i } // Email includes last name, case-insensitive
    });
    clientRedis.set('query3', JSON.stringify(queryResponse))
    console.log(queryResponse.length)
    return res.status(200).json({status: 'success', data: queryResponse})
  }
  catch(error)
  {
    return res.status(404).json({status: 'error', data : 'error'})
  }
})


//Users which have a car of brand “BMW”, “Mercedes” or “Audi” and whose email does not include any digit.
router.get('/query4',middlewareCache, async (req, res)  => {
  try{
    const result = await userModel.find({
      car: { $in: ["BMW", "Mercedes", "Audi"] },
      email: { $not: { $regex: /\d/ } } 
    })
    clientRedis.set('query4', JSON.stringify(result))
    console.log(result.length)
    return res.status(200).json({status: 'success', data : result})
  }
  catch(error)
  {
    return res.status(404).json({status: 'error', data : 'error'})
  }
  
})
//Show the data of top 10 cities which have the highest number of users and their average income.
router.get('/query5',middlewareCache, async (req, res) => {
  try{
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
    await clientRedis.set('query5', JSON.stringify(top10Cities))
    console.log(top10Cities.length, 'in router')
    return res.status(200).json({status : 'success', data : top10Cities})
  }
  catch(error)
  {
    return res.status(404).json({status: 'error', data : 'error'})
  }
 
  })

module.exports = router