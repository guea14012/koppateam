/**
 * KOPPATEAM Scaffold Generator
 * Creates the folder structure for all sub-apps.
 * Run: node scripts/scaffold.js
 */
const fs   = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..', '..')

const apps = [
  { name: 'KOPPAEXCEL',  color: '#00bb44', desc: 'Spreadsheet Editor',      icon: '📊' },
  { name: 'KOPPAPDF',    color: '#ff3355', desc: 'PDF Suite',                icon: '📑' },
  { name: 'KOPPAPOINT',  color: '#8b2fff', desc: 'Presentations & Design',   icon: '🎨' },
  { name: 'KOPPABI',     color: '#ff8800', desc: 'Business Intelligence',     icon: '📈' },
  { name: 'KOPPAMEET',   color: '#00d4ff', desc: 'Video Conferencing',        icon: '🎥' },
  { name: 'KOPPAMAIL',   color: '#ffcc00', desc: 'Email Client',              icon: '📧' },
  { name: 'KOPPANOTES',  color: '#ff66aa', desc: 'Notes & Wiki',              icon: '📒' },
  { name: 'KOPPABOARD',  color: '#00ff88', desc: 'Project Management',        icon: '📋' },
  { name: 'KOPPAWALL',   color: '#aa66ff', desc: 'Digital Whiteboard',        icon: '🖼️' },
  { name: 'KOPPADRIVE',  color: '#66aaff', desc: 'File Storage & Sync',       icon: '💾' },
]

apps.forEach(app => {
  const dir = path.join(ROOT, app.name)
  console.log(`Creating ${app.name}...`)
  ;['electron', 'src/components', 'src/styles', 'assets', 'docs'].forEach(d =>
    fs.mkdirSync(path.join(dir, d), { recursive: true })
  )
  console.log(`  ✓ ${app.name}`)
})

console.log('\n✅ All app folders created. Run npm install in each.')
