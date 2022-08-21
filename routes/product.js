
const mongoose = require("mongoose")
const router = require("express").Router()
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuth } = require("./verifyToken")
const Product = require("../models/Product")
const upload = require("../utilities/multer")
const cloudinary = require("../utilities/cloudinary")

const upload_preset = process.env.CLOUDINARY_UPLOAD_PRESET

// * CREATE PRODUCT
router.post("/", verifyTokenAndAdmin, 
    upload.fields([
        { name: 'cover', maxCount: 1 },
        { name: 'img', maxCount: 1 },
    ]), 
    async (req, res) => {
        console.log(req.files)
        console.log(req.files.cover[0])

        
        const coverImg = await cloudinary.uploader.upload(req.files.cover[0].path, upload_preset, options = {
            folder: "/eshop-wiz/products",
            use_filename: true,
            unique_filename: false,
        }).catch((err)=>console.log(err))

        let otherImg
        if (req.files.img) {
            otherImg = await cloudinary.uploader.upload(req.files.img[0].path, upload_preset, options = {
                folder: "/eshop-wiz/products",
                use_filename: true,
                unique_filename: false,
            }).catch((err)=>console.log(err))
        }

        let categories = [] 
        if (req.body.categories) {
            req.body.categories.forEach(category => {
                category = category.toLowerCase()
                categories.push(category)
            })
            req.body.categories = categories
        }

        const newProduct = new Product({
            _id: new mongoose.Types.ObjectId(),
            title: req.body.title,
            desc: req.body.desc,
            price: req.body.price,
            cover: coverImg.secure_url,
            coverAlt: req.body.coverAlt,
            img: req.files.img ? otherImg.secure_url : coverImg.secure_url,
            imgAlt: req.body.imgAlt || req.body.coverAlt,
            categories: req.body.categories,
            versions: req.body.versions,
            artistFormatted: req.body.artist || '',
            artist: req.body.artist.toLowerCase() || '',
        })

        // if (!newProduct.img) {
        //     newProduct.img = newProduct.cover
        //     newProduct.imgAlt = newProduct.coverAlt
        // }
        
        // if (!req.body.img && req.body.cover) {
        //     req.body.img = req.body.cover
        //     req.body.imgAlt = req.body.coverAlt
        // }
        // const newProduct = new Product(req.body)
        try {
            const savedProduct = await newProduct.save()
            return res.status(200).json(savedProduct)
        } catch (err) {
            return res.status(500).json(err)
        }
})

// * UPDATE
router.put("/:id", verifyTokenAndAdmin, 
    upload.fields([
        { name: 'cover', maxCount: 1 },
        { name: 'img', maxCount: 1 },
    ]), 
    async (req, res) => {
        console.log(req.files)
        if (req.files.cover) {
            const coverImg = await cloudinary.uploader.upload(req.files.cover[0].path, upload_preset, options = {
                folder: "/eshop-wiz/products",
                use_filename: true,
                unique_filename: false,
                overwrite: false
            }).catch((err)=>console.log(err))
            req.body.cover = coverImg.secure_url
        }
        
        if (!req.body.artist) {
            req.body.artist = ''
        } 

        req.body.artistFormatted = req.body.artist
        req.body.artist = req.body.artist.toLowerCase()

        try {
            const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, {new: true})
            return res.status(200).json(updatedProduct)
        } catch (err) {
            return res.status(500).json(err)
        }
})

// * GET PRODUCT
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        return res.status(200).json(product)
    } catch (err) {
        return res.status(500).json(err)
    }
})

//  * GET ALL PRODUCTS
router.get("/", async (req, res) => {
    try {
        const queryNew = req.query.new
        const queryCategory = req.query.category
        const queryArtists = req.query.artists
        const querySearch = req.query.s
        
        let products
        if (queryArtists === 'all') {
            artists = await Product.distinct('artistFormatted')
            return res.status(200).json(artists)
        }
        else if (queryNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(5)
        } else if (queryCategory) {
            products = await Product.find({
                categories: {
                    $in: [queryCategory]
                },
            })
        } else if (querySearch) {
            console.log(querySearch)
            products = await Product.find(
                {$or: 
                    [
                        {$text: {$search: querySearch}}, 
                        {title: {$regex: querySearch, $options: "i"}}
                    ]
                }
            )
            console.log(products)
        } else {
            products = await Product.find()
        }
        return res.status(200).json(products)
    } catch (err) {
        return res.status(500).json(err)
    }
})

// * GET LIST OF ARTISTS
router.get("/", async (req, res) => {
    try {
        console.log(req.query)
        const products = await Product.find()
        
        return res.status(200).json(products)

    } catch (err) {
        return res.status(500).json(err)
    }
})

// * DELETE A PRODUCT BY ID
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const product = await Product.deleteOne({ _id: req.params.id })
        return res.status(200).json(product)
    } catch (err) {
        console.error(err)
        return res.status(500).json(err)
    }
})

module.exports = router