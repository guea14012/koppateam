import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Minus, Square, X, Search, Bell, Settings, ChevronRight,
  Clock, Star, Grid3x3, LayoutDashboard, HelpCircle, User,
} from 'lucide-react'
import clsx from 'clsx'
import toast from 'react-hot-toast'

declare global { interface Window { api?: { win: { minimize: ()=>void; maximize: ()=>void; close: ()=>void; isMax: ()=>Promise<boolean> }; launch: (n:string)=>Promise<{success:boolean}>; open: (u:string)=>void } } }

// ─── App registry ──────────────────────────────────────────────────────────────
const APPS = [
  { id: 'KOPPAWORD 2026', name: 'KOPPAWORD',   subtitle: 'Document Editor',     icon: '📝', color: '#0066ff', bg: 'rgba(0,102,255,.12)',   border: 'rgba(0,102,255,.3)',   desc: 'Rich text documents, reports, letters' },
  { id: 'KOPPAEXCEL',     name: 'KOPPAEXCEL',  subtitle: 'Spreadsheets',        icon: '📊', color: '#00bb44', bg: 'rgba(0,187,68,.12)',     border: 'rgba(0,187,68,.3)',    desc: 'Formulas, charts, data analysis' },
  { id: 'KOPPAPDF',       name: 'KOPPAPDF',    subtitle: 'PDF Suite',           icon: '📑', color: '#ff3355', bg: 'rgba(255,51,85,.12)',    border: 'rgba(255,51,85,.3)',   desc: 'View, edit, annotate & create PDFs' },
  { id: 'KOPPAPOINT',     name: 'KOPPAPOINT',  subtitle: 'Presentations',       icon: '🎨', color: '#8b2fff', bg: 'rgba(139,47,255,.12)',   border: 'rgba(139,47,255,.3)',  desc: 'Canva-style slides & design' },
  { id: 'KOPPABI',        name: 'KOPPABI',     subtitle: 'Business Intelligence',icon: '📈', color: '#ff8800', bg: 'rgba(255,136,0,.12)',    border: 'rgba(255,136,0,.3)',   desc: 'Dashboards, KPIs, data visualization' },
  { id: 'KOPPAMEET',      name: 'KOPPAMEET',   subtitle: 'Video Conferencing',  icon: '🎥', color: '#00d4ff', bg: 'rgba(0,212,255,.12)',    border: 'rgba(0,212,255,.3)',   desc: 'HD video calls, screen share, rooms' },
  { id: 'KOPPAMAIL',      name: 'KOPPAMAIL',   subtitle: 'Email Client',        icon: '📧', color: '#ffcc00', bg: 'rgba(255,204,0,.12)',    border: 'rgba(255,204,0,.3)',   desc: 'Email, calendar, contacts' },
  { id: 'KOPPANOTES',     name: 'KOPPANOTES',  subtitle: 'Notes & Wiki',        icon: '📒', color: '#ff66aa', bg: 'rgba(255,102,170,.12)',  border: 'rgba(255,102,170,.3)', desc: 'Markdown notes, wikis, knowledge base' },
  { id: 'KOPPABOARD',     name: 'KOPPABOARD',  subtitle: 'Project Management',  icon: '📋', color: '#00ff88', bg: 'rgba(0,255,136,.12)',    border: 'rgba(0,255,136,.3)',   desc: 'Kanban, sprints, tasks, timelines' },
  { id: 'KOPPAWALL',      name: 'KOPPAWALL',   subtitle: 'Digital Whiteboard',  icon: '🖼️', color: '#aa66ff', bg: 'rgba(170,102,255,.12)',  border: 'rgba(170,102,255,.3)', desc: 'Collaborative canvas, sticky notes' },
  { id: 'KOPPADRIVE',     name: 'KOPPADRIVE',  subtitle: 'File Storage',        icon: '💾', color: '#66aaff', bg: 'rgba(102,170,255,.12)',  border: 'rgba(102,170,255,.3)', desc: 'Cloud sync, file sharing, backup' },
]

const RECENT = [
  { name: 'Q2 Report.kwdoc',     app: 'KOPPAWORD',  time: '2 min ago',   icon: '📝', color: '#0066ff' },
  { name: 'Sales Dashboard.kbi', app: 'KOPPABI',    time: '1 hour ago',  icon: '📈', color: '#ff8800' },
  { name: 'Team Roadmap.kboard', app: 'KOPPABOARD', time: '3 hours ago', icon: '📋', color: '#00ff88' },
  { name: 'Budget 2026.kxls',    app: 'KOPPAEXCEL', time: 'Yesterday',   icon: '📊', color: '#00bb44' },
  { name: 'Pitch Deck.kpoint',   app: 'KOPPAPOINT', time: '2 days ago',  icon: '🎨', color: '#8b2fff' },
  { name: 'Invoice Template.pdf',app: 'KOPPAPDF',   time: '3 days ago',  icon: '📑', color: '#ff3355' },
]

const PINNED = APPS.slice(0, 6)

// ─── App Card ──────────────────────────────────────────────────────────────────
function AppCard({ app, onLaunch }: { app: typeof APPS[0]; onLaunch: (id: string) => void }) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onLaunch(app.id)}
      className="relative flex flex-col p-5 rounded-xl cursor-pointer transition-all duration-200 group"
      style={{ background: app.bg, border: `1px solid ${app.border}` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-3xl">{app.icon}</div>
        <ChevronRight size={14} className="text-k-dim group-hover:text-k-muted transition-colors mt-1" />
      </div>
      <div className="font-semibold text-k-text text-sm font-display">{app.name}</div>
      <div className="text-xs mt-0.5 mb-2" style={{ color: app.color }}>{app.subtitle}</div>
      <div className="text-xs text-k-dim leading-relaxed">{app.desc}</div>
    </motion.div>
  )
}

// ─── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState<'home' | 'all'>('home')
  const [search, setSearch] = useState('')

  const filtered = APPS.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.subtitle.toLowerCase().includes(search.toLowerCase())
  )

  const launch = async (id: string) => {
    toast.loading(`Launching ${id}…`, { id: 'launch', duration: 2000 })
    if (window.api) {
      const res = await window.api.launch(id)
      if (!res.success) toast.error(`Could not open ${id}. Make sure it's installed.`, { id: 'launch' })
    } else {
      setTimeout(() => toast.success(`${id} opened`, { id: 'launch' }), 800)
    }
  }

  const navItem = (label: string, icon: React.ElementType, v: 'home' | 'all') => {
    const Icon = icon
    return (
      <button
        onClick={() => setView(v)}
        className={clsx(
          'flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm transition-colors',
          view === v ? 'bg-k-hover text-k-text' : 'text-k-muted hover:text-k-text hover:bg-k-hover'
        )}
      >
        <Icon size={15} />
        {label}
      </button>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-k-bg text-k-text">

      {/* Title bar */}
      <div className="flex items-center justify-between h-10 px-4 shrink-0 select-none" style={{ background: 'rgba(7,7,16,.98)', WebkitAppRegion: 'drag' } as React.CSSProperties}>
        <div className="flex items-center gap-2.5" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
          <div className="flex items-center gap-1.5 w-24 font-display font-bold text-sm" style={{ background: 'linear-gradient(90deg,#00d4ff,#8b2fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            KOPPATEAM
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex items-center" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
          <button onClick={() => window.api?.win.minimize()} className="w-9 h-10 flex items-center justify-center text-k-dim hover:text-k-text hover:bg-k-hover transition-colors"><Minus size={12} /></button>
          <button onClick={() => window.api?.win.maximize()} className="w-9 h-10 flex items-center justify-center text-k-dim hover:text-k-text hover:bg-k-hover transition-colors"><Square size={11} /></button>
          <button onClick={() => window.api?.win.close()} className="w-9 h-10 flex items-center justify-center text-k-dim hover:text-white hover:bg-red-600 transition-colors"><X size={12} /></button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <div className="w-52 shrink-0 flex flex-col py-3 px-2 border-r border-k-border" style={{ background: 'rgba(7,7,16,.97)' }}>
          {/* Profile */}
          <div className="flex items-center gap-2.5 px-2 py-2.5 mb-3 rounded-xl bg-k-card border border-k-border">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0066ff] to-[#8b2fff] flex items-center justify-center text-xs font-bold text-white shrink-0">K</div>
            <div className="min-w-0">
              <div className="text-k-text text-xs font-semibold truncate">KoppaZZZ</div>
              <div className="text-k-dim text-xs truncate">kua.kuakun@gmail.com</div>
            </div>
          </div>

          {/* Nav */}
          <div className="space-y-0.5 flex-1">
            <div className="text-k-dim text-xs px-3 mb-1 mt-2 tracking-wider uppercase">Navigation</div>
            {navItem('Home',     LayoutDashboard, 'home')}
            {navItem('All Apps', Grid3x3,         'all')}

            <div className="text-k-dim text-xs px-3 mb-1 mt-4 tracking-wider uppercase">Quick Access</div>
            {PINNED.map(a => (
              <button
                key={a.id}
                onClick={() => launch(a.id)}
                className="flex items-center gap-2.5 w-full px-3 py-1.5 rounded-lg text-xs text-k-muted hover:text-k-text hover:bg-k-hover transition-colors"
              >
                <span>{a.icon}</span>{a.name}
              </button>
            ))}
          </div>

          {/* Bottom */}
          <div className="space-y-0.5 mt-2 border-t border-k-border pt-2">
            <button className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs text-k-muted hover:text-k-text hover:bg-k-hover transition-colors"><Settings size={13} />Settings</button>
            <button className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs text-k-muted hover:text-k-text hover:bg-k-hover transition-colors"><HelpCircle size={13} />Help</button>
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 overflow-y-auto">

          {/* Topbar */}
          <div className="sticky top-0 z-10 flex items-center gap-3 px-6 py-3 border-b border-k-border" style={{ background: 'rgba(11,11,20,.95)', backdropFilter: 'blur(12px)' }}>
            <div className="flex-1 flex items-center gap-2 bg-k-card border border-k-border rounded-lg px-3 py-2 focus-within:border-[#00d4ff]/40 transition-colors max-w-md">
              <Search size={14} className="text-k-dim shrink-0" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search apps…"
                className="flex-1 bg-transparent text-k-text placeholder-k-dim text-sm outline-none"
              />
            </div>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-k-muted hover:text-k-text hover:bg-k-hover transition-colors"><Bell size={15} /></button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-k-muted hover:text-k-text hover:bg-k-hover transition-colors"><User size={15} /></button>
          </div>

          <div className="px-6 py-6">
            <AnimatePresence mode="wait">

              {view === 'home' && !search && (
                <motion.div key="home" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>

                  {/* Welcome */}
                  <div className="mb-8">
                    <h1 className="text-2xl font-bold font-display text-k-text mb-1">Good morning ☀️</h1>
                    <p className="text-k-muted text-sm">Welcome to KOPPATEAM — your complete office suite.</p>
                  </div>

                  {/* Pinned apps */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm font-semibold text-k-text flex items-center gap-2"><Star size={14} className="text-[#ffcc00]" />Pinned Apps</h2>
                      <button onClick={() => setView('all')} className="text-xs text-k-muted hover:text-k-text transition-colors">See all →</button>
                    </div>
                    <div className="grid grid-cols-3 gap-3 xl:grid-cols-4">
                      {APPS.map(app => <AppCard key={app.id} app={app} onLaunch={launch} />)}
                    </div>
                  </div>

                  {/* Recent files */}
                  <div>
                    <h2 className="text-sm font-semibold text-k-text mb-4 flex items-center gap-2"><Clock size={14} className="text-k-muted" />Recent Files</h2>
                    <div className="space-y-1">
                      {RECENT.map((f, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-k-hover transition-colors cursor-pointer group"
                        >
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0" style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}>
                            {f.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-k-text text-sm truncate">{f.name}</div>
                            <div className="text-k-dim text-xs">{f.app}</div>
                          </div>
                          <div className="text-k-dim text-xs shrink-0">{f.time}</div>
                          <ChevronRight size={14} className="text-k-dim opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {(view === 'all' || search) && (
                <motion.div key="all" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold font-display text-k-text">
                      {search ? `Results for "${search}"` : 'All Apps'}
                      <span className="ml-2 text-sm font-normal text-k-muted">({filtered.length})</span>
                    </h2>
                  </div>
                  {filtered.length === 0
                    ? <p className="text-k-muted text-sm">No apps found.</p>
                    : <div className="grid grid-cols-3 gap-3 xl:grid-cols-4">
                        {filtered.map(app => <AppCard key={app.id} app={app} onLaunch={launch} />)}
                      </div>
                  }
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
