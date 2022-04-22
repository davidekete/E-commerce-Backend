const errorHandler = function(res,error,statusCode){
    console.log(error)
    res.status(statusCode).json({error,})
    }

module.exports=errorHandler