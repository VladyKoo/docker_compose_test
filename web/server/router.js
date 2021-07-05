
const express = require("express")
const router = express.Router()
const path = require('path')
const { v4: uuidv4 } = require('uuid');

const Record = require("./model")

// router.get("/", async (req, res) => {
//   const values = await Record.find()
//   res.json( values )
// })

router.post("/", async (req, res) => {
  const file = req.files.image
  console.log('file', file)

  if (!file) return res.status(502).json({status: false})

  const filePath = `/uploads/vladykoo/web/${uuidv4()}.png`
  file.mv(filePath, (err)=>{
    if (err) return res.status(500).json({status: false})

    res.json({ status: true, url: filePath})
  })
  
  
})

module.exports = router
