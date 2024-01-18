const express = require("express")
const createError = require('http-errors')
const morgan = require("morgan")
const rateLimit = require("express-rate-limit")
const app = express()

const limiter = rateLimit({
	windowMs : 1*60*1000,
	max : 5,
	message : "too many requests"
})

// middlewares
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(limiter)

app.get("/test",(req,res)=>{
    res.status(200).json({
        message : "welcome to the server"
    })
})

// handling client error
app.use((req,res,next)=>{
	createError(404, "route not found")
	next()
})

// handling server error
app.use((err,req,res,next)=>{
	return res.status(err.status || 500).json({
		success : false,
		message : err.message
	})
})

module.exports = app