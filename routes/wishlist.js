
const router = require("express").Router()
const { verifyToken, verifyTokenAndAuth } = require("./verifyToken")

const Wish = require("../models/Wishlist")

//* CREATE
router.post("/", async (req, res) => {
    const newWish = new Wish(req.body)
    console.log(newWish)
    const userExists = await Wish.find({ _user: newWish._user })
    console.log('user exists: ' , newWish._user)
    try {
        let wishlist
        if (!userExists) {
            wishlist = await newWish.save()
        } else {
            console.log('else: ', newWish.products)
            const wishId = await Wish.find(newWish._id)
            const itemExists = await Wish.find({
                $and: [
                    {_user: newWish._user},
                    {"products._product": newWish.products[0]._product}
                ]
            })

            
            console.log('prod id', newWish.products[0]._product)
            console.log('wishlist', wishlist)
            console.log('wish id', wishId)
            console.log('item exists: ', itemExists)
            if (!itemExists.length) {
                wishlist = await Wish.updateOne(
                    {_user: newWish._user}, 
                    {
                        $addToSet: {
                            products: newWish.products
                        }
                    },
                    {new: true}
                )
            } else {
                throw new Error("Item already exists in wishlist")
            }
            
        }
        return res.status(200).json(wishlist)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})

//* UPDATE
router.put("/:id", verifyTokenAndAuth, async (req, res) => {
    try {
        const updatedList = await Wish.findByIdAndUpdate()
    } catch (err) {
        return res.status(500).json(err)
    }
})

//* GET WISHLIST by userID
router.get("/:id", async (req, res) => {
    try {
        const wishlist = 
            await Wish.find({ _user: req.params.id })
            .populate('products._product', '_id title artistFormatted img imgAlt price versions')
        return res.status(200).json(wishlist)
    } catch (err) {
        return res.status(500).json(err)
    }
})

// * DELETE
router.delete("/:userId/:pId", async (req, res) => {
    try {
        await Wish.updateOne(
            {_user: req.params.userId}, 
            {
                $pull: {
                    products: {_product: req.params.pId}
                }
            },
            {new: true}
        )
        return res.status(200).json("Wishlist item successfully deleted")
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})

module.exports = router