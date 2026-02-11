const fs = require("fs")
const path = require("path")
const multer = require("multer")

// config
const uploadDir = path.resolve(process.env.UPLOAD_DIR || "uploads")
const maxMB = Number(process.env.MAX_FILE_SIZE || 5)

// ensure upload dir exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

// storage
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir)
    },
    filename(req, file, cb) {
        const ext = path.extname(file.originalname)
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9)
        cb(null, `${unique}${ext}`)
    }
})

// file filter
function fileFilter(req, file, cb) {
    const allowed = [
        "application/pdf",
        "application/json",
        "text/plain"
    ]

    if (
        file.mimetype.startsWith("image/") ||
        allowed.includes(file.mimetype)
    ) {
        return cb(null, true)
    }

    cb(new Error("File type not allowed"), false)
}

// multer instance
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: maxMB * 1024 * 1024
    }
})

module.exports = {
    upload,
    uploadDir
}
