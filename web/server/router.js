
const express = require("express")
const router = express.Router()

const Record = require("./model")

router.get("/", async (req, res) => {
  const values = await Record.find()
  res.json( values )
})

router.post("/", async (req, res) => {
  const value = req.body.value
  if (!value) return res.status(502).json({status: false})
  
  await Record.create({ value }, function (err, record) {
    if (err) return res.status(502).json({status: false})
  })
  
  res.json({ status: true, data: await Record.find()})
})

module.exports = router
