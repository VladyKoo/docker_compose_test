const express = require('express')
const app = express()
const cors = require('cors')
const fileUpload = require('express-fileupload')
const mongoose = require('mongoose')
const path = require('path')

const router = require('./router')

const port = 5000
const mongoUrl = 'mongodb://mongo:27017/web'

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(fileUpload())

app.use('/', express.static(path.join(__dirname, '../dist')))
app.use('/api', router)

// mongoose
//     .connect(mongoUrl, { useNewUrlParser: true })
//     .then((db) => {
//         console.log("[OK] DB is connected")
//     })
//     .catch((err) => console.error(err))

app.listen(port, () => {
 console.log(`Server running at http://localhost:${port}/`)
})