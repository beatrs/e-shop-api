
const router = require("express").Router()
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuth } = require("./verifyToken")
const Order = require("../models/Order")

// * CREATE
router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body)
    console.log(newOrder)
    try {Order
        const savedOrder = await newOrder.save()
        return res.status(200).json(savedOrder)
    } catch (err) {
        return res.status(500).json(err)
    }
})

// * UPDATE order status
router.put("/:id/:newStatus", verifyTokenAndAuth, async (req, res) => {
    console.log(req.params.newStatus)
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: {
                status: req.params.newStatus
            },
        }, {new: true})
        return res.status(200).json(updatedOrder)
    } catch (err) {
        return res.status(500).json(err)
    }
})

// * DELETE
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
        return res.status(200).json("Order successfully deleted")
    } catch (err) {
        return res.status(500).json(err)
    }
})

// * GET ORDERS by userId
router.get("/:userId/orders", verifyToken, async (req, res) => {
    try {
        console.log(req.params)
        const itemStatus = req.query.status
        console.log(req.query.status)
        let orders
        if (itemStatus) {
            orders = 
                await Order.find({ 
                    _user: req.params.userId,
                    status: {
                        $in: [itemStatus]
                    },
                })
                .populate('_user', '_id username')
                .populate('products._product', '_id title artistFormatted')
        } else {
            orders = 
                await Order.find({ _user: req.params.userId })
                .populate('_user', '_id username')
                .populate('products._product', '_id title artistFormatted')
        }
        return res.status(200).json(orders)
    } catch (err) {
        return res.status(500).json(err)
    }
})

// * GET ORDER BY ORDER ID
router.get("/:id", async (req, res) => {
    try {
        const orders = 
            await Order.findById(req.params.id)
                .populate('_user', '_id username')
                .populate('products._product', '_id title artistFormatted')
        return res.status(200).json(orders)
    } catch (err) {
        return res.status(500).json(err)
    }
})
// * GET ALL ORDERS
router.get("/", async (req, res) => {
    try {
        const orders = 
            await Order.find()
                .populate('_user', '_id username')
                .populate('products._product', '_id title artistFormatted')
        return res.status(200).json(orders)
    } catch (err) {
        return res.status(500).json(err)
    }
})

module.exports = router