
const express = require("express")
const cors = require("cors")
const app = express()
const path = require("path")
app.use(cors())

const dotenv = require("dotenv")
dotenv.config()

const mongoose = require("mongoose")

const userRoute = require("./routes/user")
const userAuth = require("./routes/auth")
const productRoute = require("./routes/product")
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")

// * connect to mongodb ccloud cluster0
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("db connection successful"))
    .catch((err) => {
        console.error(err)
    })


app.use(express.json())
app.use("/api/users", userRoute)
app.use("/api/auth", userAuth)
app.use("/api/products", productRoute)
app.use("/api/cart", cartRoute)
app.use("/api/orders", orderRoute)


// ! DEPLOYMENT !

// __dirname = path.resolve()
// if (process.env.NODE_ENV === 'production') {
//     // app.use(express.static(path.join(__dirname, "/client/build")))
//     // app.use(express.static(path.join(__dirname, "../admin/build")))
//     app.get('*', (req, res) => {
//         res.send({body: "API is running"})
//         // res.sendFile(path.resolve(__dirname, "client", 'build', 'index.html'))
//         // res.sendFile(path.resolve(__dirname, "../admin", 'build', 'index.html'))
//     })
// } else {

// }

app.get('*', (req, res) => {
    res.send("API is running")
})

// ! end of deployment !

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log("Server is running at PORT:", PORT)
})