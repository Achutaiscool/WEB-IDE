const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const dotenv = require('dotenv')
dotenv.config()

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body
  try {
    const existing = await User.findOne({ $or: [{ email }, { username }] })
    if (existing) return res.status(400).json({ message: 'User exists' })
    const hash = await bcrypt.hash(password, 10)
    const user = new User({ username, email, password: hash })
    await user.save()
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET)
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ message: 'Invalid credentials' })
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET)
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
