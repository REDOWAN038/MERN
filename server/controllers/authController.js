const createError = require("http-errors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const userModel = require("../models/userModel")
const { successResponse } = require("../handler/responseHandler")
const { createJWT } = require("../handler/jwt")
const { jwtAccessKey, jwtRefreshKey } = require("../src/secret")

// user login functionality
const handleLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const user = await userModel.findOne({ email })

        if (!user) {
            throw createError(404, "user with this email does not registered. please sign up")
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password)

        if (!isPasswordMatched) {
            throw createError(401, "wrong password. try again!!!")
        }

        if (user.isBanned) {
            throw createError(403, "you are banned. please contact with the admin")
        }

        // creating access token and set up in cookies
        const accessToken = createJWT({ user }, jwtAccessKey, "1h")
        res.cookie("accessToken", accessToken, {
            maxAge: 60 * 60 * 1000,  // expires in 60 minutes
            httpOnly: true,
            sameSite: 'none',
        })

        // creating refresh token and set up in cookies
        const refreshToken = createJWT({ user }, jwtRefreshKey, "7d")
        res.cookie("refreshToken", refreshToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,  // expires in  7 days
            httpOnly: true,
            sameSite: 'none',
        })

        const userWithOutPassword = user.toObject()
        delete userWithOutPassword.password

        return successResponse(res, {
            statusCode: 200,
            message: `welcome back, ${user.name}`,
            payload: {
                userWithOutPassword
            }
        })
    } catch (error) {
        next(error)
    }
}

// user logout
const handleLogout = async (req, res, next) => {
    try {
        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")
        return successResponse(res, {
            statusCode: 200,
            message: "logged out successfully",
        })
    } catch (error) {
        next(error)
    }
}

// refresh token
const handleRefreshToken = async (req, res, next) => {
    try {
        const oldRefreshToken = req.cookies.refreshToken

        const decoded = jwt.verify(oldRefreshToken, jwtRefreshKey)
        if (!decoded) {
            throw createError(401, "invalid refresh token... please sign in.")
        }

        // creating access token and set up in cookies
        const accessToken = createJWT({ user: decoded.user }, jwtAccessKey, "1h")
        res.cookie("accessToken", accessToken, {
            maxAge: 60 * 60 * 1000,  // expires in 60 minutes
            httpOnly: true,
            sameSite: 'none',
        })

        return successResponse(res, {
            statusCode: 200,
            message: "new access token is generated"
        })
    } catch (error) {
        next(error)
    }
}

// protected route
const handleProtectedRoute = async (req, res, next) => {
    try {
        const { accessToken } = req.cookies

        const decoded = jwt.verify(accessToken, jwtAccessKey)
        if (!decoded) {
            throw createError(401, "invalid access token... please sign in.")
        }

        return successResponse(res, {
            statusCode: 200,
            message: "protected route accessed successfully"
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    handleLogin,
    handleLogout,
    handleRefreshToken,
    handleProtectedRoute
}