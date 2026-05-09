import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import { spawn } from 'child_process'
import Store from 'electron-store'

const store = new Store()
const isDev = !app.isPackaged

if (!app.requestSingleInstanceLock()) { app.quit(); process.exit(0) }

let win: BrowserWindow | null = null

function createWindow() {
  const b = store.get('bounds', { width: 1280, height: 820 }) as { width: number; height: number; x?: number; y?: number }
  win = new BrowserWindow({
    ...b, minWidth: 1000, minHeight: 680,
    frame: false, backgroundColor: '#070710', show: false,
    webPreferences: { preload: join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false },
  })
  isDev ? win.loadURL('http://localhost:5173') : win.loadFile(join(__dirname, '../dist/index.html'))
  win.once('ready-to-show', () => win?.show())
  win.on('resize', () => win && store.set('bounds', win.getBounds()))
  win.on('move',   () => win && store.set('bounds', win.getBounds()))
  win.on('closed', () => win = null)
}

// Window controls
ipcMain.handle('win:min',   () => win?.minimize())
ipcMain.handle('win:max',   () => win?.isMaximized() ? win.unmaximize() : win?.maximize())
ipcMain.handle('win:close', () => win?.close())
ipcMain.handle('win:ismax', () => win?.isMaximized() ?? false)

// Launch a sub-app by its folder name
ipcMain.handle('app:launch', (_, appName: string) => {
  const appPath = isDev
    ? join(__dirname, '../../', appName)
    : join(process.resourcesPath, 'apps', appName)

  try {
    const child = spawn('npm', ['run', 'electron:dev'], {
      cwd: appPath,
      shell: true,
      detached: true,
      stdio: 'ignore',
    })
    child.unref()
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
})

ipcMain.handle('shell:open', (_, url: string) => shell.openExternal(url))
ipcMain.handle('app:version', () => app.getVersion())

app.whenReady().then(createWindow)
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
