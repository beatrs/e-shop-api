const mongoose = require("mongoose")
const { Schema } = mongoose

const WishSchema = new mongoose.Schema(
    {
        _user: { type: Schema.ObjectId, ref: 'User' },
        products: [
            {
                _product: { type: Schema.ObjectId, ref: 'Product' },
                version: { type: String }
            }
        ]
    },
    { timestamps: true }
)

module.exports = mongoose.model("Wish", WishSchema)