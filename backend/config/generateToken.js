const jwt = require('jsonwebtoken')

const generatetoken = (id) => {
    const secret = process.env.JWT_SECRET ;
    const data = {id} ;
    const token = jwt.sign(data , secret , {expiresIn:"30d"} ) ;
    return token ;
}

module.exports = generatetoken ;