
const multer = require("multer")
const path = require("path")
// ! file handling

//cloudinary

module.exports = multer({
    storage: multer.diskStorage({
        filename: (req, file, cb) => {
            const prefix = new Date().toISOString().split('T')[0].replaceAll('-','')
            const newName = prefix + '_' + file.originalname
            cb(null, newName)
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/png') {
            cb(new Error("File type not supported"), false)
            return
        } 
        cb(null, true)
    }, limits: {
        fileSize: 1024 * 1024 * 5
    }
})

//*local storage
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads')
//     },
//     filename: function (req, file, cb) {
//         const prefix = new Date().toISOString().split('T')[0].replaceAll('-','')
//         const newName = prefix + '_' + file.originalname
//         cb(null, newName)
//     }
// })

// const fileFilter = (req, file, cb) => {
//     // reject certain file formats
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
//         cb(null, true)
//     } else {
//         cb(null, false)
//     }
// }