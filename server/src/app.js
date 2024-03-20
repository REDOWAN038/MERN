const express = require("express")
const createError = require('http-errors')
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const rateLimit = require("express-rate-limit")
const app = express()

const userRoutes = require("../routes/userRoutes")
const seedRoutes = require("../routes/seedRoutes")
const authRoutes = require("../routes/authRoutes")
const categoryRoutes = require("../routes/categoryRoutes")
const productRoutes = require("../routes/productRoutes")

const { errorResponse } = require("../handler/responseHandler")

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 20,
    message: "too many requests"
})

// middlewares
app.use(cookieParser())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(limiter)

// routes
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/seed", seedRoutes)
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/categories", categoryRoutes)
app.use("/api/v1/products", productRoutes)

app.get("/test", (req, res) => {
    res.status(200).json({
        message: "welcome to the server"
    })
})

// handling client error
app.use((req, res, next) => {
    createError(404, "route not found")
    next()
})

// handling server error
app.use((err, req, res, next) => {
    return errorResponse(res, {
        statusCode: err.status,
        message: err.message
    })
})

module.exports = app