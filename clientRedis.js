const Redis = require('ioredis')
const clientRedis = new Redis('redis://default:7814d5bd505b45c0927593a8bd16ce12@us1-helping-mackerel-38790.upstash.io:38790')
//const clientRedis = new Redis()
module.exports = clientRedis