const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Project = require('../models/Project')

// create project
router.post('/', auth, async (req, res) => {
  const { title, html, css, js } = req.body
  try {
    const project = new Project({ owner: req.user.id, title, html, css, js })
    await project.save()
    res.json(project)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// update
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate({ _id: req.params.id, owner: req.user.id }, req.body, { new: true })
    if (!project) return res.status(404).json({ message: 'Not found' })
    res.json(project)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// list
router.get('/', auth, async (req, res) => {
  try {
    const list = await Project.find({ owner: req.user.id }).sort({ updatedAt: -1 })
    res.json(list)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// get single
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user.id })
    if (!project) return res.status(404).json({ message: 'Not found' })
    res.json(project)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
