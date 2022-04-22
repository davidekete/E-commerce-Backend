const errorHandler = function(error,statusCode){
    console.log(error)
    res.status(statusCode).json({error,})
    }

module.exports=errorHandler