const mongoose = require("mongoose")
const { Schema } = mongoose
const User = require("./User")

const OrderSchema = new mongoose.Schema(
    {
        _user: { type: Schema.ObjectId, ref: 'User' },
        products: [
            {
                _product: { type: Schema.ObjectId, ref: 'Product' },
                quantity: { type: Number, default: 1 },
                version: { type: String }
            }
        ],
        totalQty: { type: Number, required: true },
        amount: { type: Number, required: true },
        address: { type: Object, required: false },
        status: { type: String, default: "pending" },
        // isDelivered: { type: Boolean, default: false },
        // isCancelled: { type: Boolean, default: false },
        

    },
    { timestamps: true }
)

module.exports = mongoose.model("Order", OrderSchema)