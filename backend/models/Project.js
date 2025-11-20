const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'Untitled' },
  html: { type: String, default: '<!-- HTML -->' },
  css: { type: String, default: '/* CSS */' },
  js: { type: String, default: '// JS' }
}, { timestamps: true })

module.exports = mongoose.model('Project', ProjectSchema)
