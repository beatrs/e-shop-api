
const router = require("express").Router()
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuth } = require("./verifyToken")
const User = require("../models/User")

const upload = require("../utilities/multer")
const cloudinary = require("../utilities/cloudinary")
const upload_preset = process.env.CLOUDINARY_UPLOAD_PRESET
const defaultOptions = {
    folder: "/eshop-wiz/users",
}

const defaultImg = 'https://raw.githubusercontent.com/mozilla/fxa/9ca5c4057cde5da1e2866cb9515e88bb18e5fb2b/packages/fxa-profile-server/lib/assets/default-profile.png'

// * UPDATE
router.put("/:id", verifyTokenAndAuth, upload.single('profileImg'), async (req, res) => {

    if (req.file) {
        const profile_img = await cloudinary.uploader
            .upload(req.file.path, upload_preset, defaultOptions)
            .catch((err)=>console.log(err))
        req.body.profileImg = profile_img.secure_url
    } else {
        if (!req.body.profileImg)
            req.body.profileImg = defaultImg
    }
    
    //encrypt new password
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PW_KEY).toString()
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true})
        return res.status(200).json(updatedUser)
    } catch (error) {
        return res.status(500).json(err)
    }
})


router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        return res.status(200).json("User successfully deleted")
    } catch (err) {
        return res.status(500).json(err)
    }
})

// * GET USER
router.get("/:id", verifyTokenAndAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        const { password, ...others } = user._doc
        return res.status(200).json(others)
    } catch (err) {
        return res.status(500).json(err)
    }
})

// * GET ALL USERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new
    try {
        // if w/ query like "lh:5000/api/users?new=true", limit get to latest 5
        const users = query ? await User.find().sort({_id: -1}).limit(5) : await User.find()
        return res.status(200).json(users)
    } catch (err) {
        return res.status(500).json(err)
    }
})

// * GET USER STATS
router.get("/stats", verifyTokenAndAdmin, async(req, res) => {
    //TODO: continue next time
})

module.exports = router