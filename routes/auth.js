
const router = require("express").Router()
const User = require("../models/User")
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")

const upload = require("../utilities/multer")
const cloudinary = require("../utilities/cloudinary")
const { verifyTokenAndAdmin } = require("./verifyToken")
const upload_preset = process.env.CLOUDINARY_UPLOAD_PRESET
const defaultOptions = {
    folder: "/eshop-wiz/users",
}

const defaultImg = 'https://raw.githubusercontent.com/mozilla/fxa/9ca5c4057cde5da1e2866cb9515e88bb18e5fb2b/packages/fxa-profile-server/lib/assets/default-profile.png'

// * REGISTER
router.post("/register", upload.single('profileImg'), 
    async (req, res) => {

        if (req.file) {
            const profile_img = await cloudinary.uploader
                .upload(req.file.path, upload_preset, defaultOptions)
                .catch((err)=>console.log(err))
            req.body.profileImg = profile_img.secure_url
        } else {
            req.body.profileImg = defaultImg
        }

        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(req.body.password, process.env.PW_KEY).toString(),
            profileImg: req.body.profileImg
        })

        //res.send(newUser)
        try {
            const savedUser = await newUser.save()
            const { password, ...others } = savedUser._doc
            return res.status(201).json(others)
        } catch(err) {
            return res.status(500).json(err)
        }
})

// * LOGIN

router.post("/login", async (req, res) => {
    try {
        errMsg = "Incorrect username/password!"
        const user = await User.findOne({ username: req.body.username })
        if (!user)
            return res.status(401).json(errMsg)

        const pass = CryptoJS.AES.decrypt(user.password, process.env.PW_KEY).toString(CryptoJS.enc.Utf8) 
        if (pass !== req.body.password) 
            return res.status(401).json(errMsg)

        const token = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        }, process.env.JWT_KEY)
        
        const { password, ...others } = user._doc
        return res.status(200).json({ ...others, token })
    } catch (err) {
        return res.status(500).json(err)
    }
    return
})

// * ADMIN LOGIN

router.post("/admin/login", async (req, res) => {
    try {
        errMsg = "Incorrect username/password!"
        const user = await User.findOne({ username: req.body.username })
        if (!user)
            return res.status(401).json(errMsg)

        const pass = CryptoJS.AES.decrypt(user.password, process.env.PW_KEY).toString(CryptoJS.enc.Utf8) 
        if (pass !== req.body.password) 
            return res.status(401).json(errMsg)


        const token = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        }, process.env.JWT_KEY)
        
        const { password, ...others } = user._doc
        
        if (!user.isAdmin) {
            return res.status(401).json("User is not authorized!")
        }
        return res.status(200).json({ ...others, token })
    } catch (err) {
        return res.status(500).json(err)
    }
    return
})

module.exports = router