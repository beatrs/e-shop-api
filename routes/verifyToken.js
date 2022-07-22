const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token
    if (authHeader) {
        const token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.JWT_KEY, (err, user) => {
            if (err)
                return res.status(403).json("Invalid token")
            req.user = user
            next()
        })
    } else {
        return res.status(401).json("User unauthenticated!")
    }
}

const verifyTokenAndAuth = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next()
        } else {
            return res.status(403).json("User is unauthorized")
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next()
        } else {
            return res.status(403).json("User must have admin privileges to perform this action")
        }
    })
}

module.exports = { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin }