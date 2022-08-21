const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true },
        desc: { type: String, required: true },
        artist: { type: String, required: false},
        artistFormatted: { type: String, required: false},
        cover: { type: String, required: true },
        coverAlt: { type: String, required: false },
        img: { type: String, required: false },
        imgAlt: { type: String, required: false },
        categories: { type: Array },
        versions: { type: Array },
        price: { type: Number, required: false },
        bg: { type: String, required: false }
        
    },
    { timestamps: true },
)

ProductSchema.index({'$**': 'text'})
module.exports = mongoose.model("Product", ProductSchema)