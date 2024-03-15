const createError = require("http-errors")
const jwt = require("jsonwebtoken")
const { jwtAccessKey } = require("../src/secret")

const isLoggedIn = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken
        if (!accessToken) {
            throw createError(401, "user is not logged in")
        }

        const decoded = jwt.verify(accessToken, jwtAccessKey)
        if (!decoded) {
            throw createError(401, "invalid token")
        }

        req.user = decoded.user
        next()
    } catch (error) {
        return next(error)
    }
}

const isLoggedOut = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken
        if (accessToken) {
            try {
                const decoded = jwt.verify(accessToken, jwtAccessKey)
                if (decoded) {
                    throw createError(400, "user already logged in")
                }
            } catch (error) {
                throw error
            }
        }
        next()
    } catch (error) {
        return next(error)
    }
}

const isAdmin = async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            throw createError(403, "Forbidden")
        }
        next()
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    isLoggedIn,
    isLoggedOut,
    isAdmin
}