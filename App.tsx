import React, { useState, useEffect } from 'react';
import { OSState, WindowState, AppConfig } from './types';
import { APP_CONFIGS, DEFAULT_WALLPAPER } from './constants';
import { kernel } from './services/osKernel';
import { soundService } from './services/SoundService';

// Components
import { BootSequence } from './components/BootSequence';
import { LoginScreen } from './components/LoginScreen';
import { Window } from './components/Window';

// Apps
import { Explorer } from './apps/Explorer';
import { NexusForge } from './apps/NexusForge';
import { SovereignBridge } from './apps/SovereignBridge';
import { Settings } from './apps/Settings';
import { PowerShell } from './apps/PowerShell';
import { VertilIDE } from './apps/VertilIDE';
import { SearchVertil } from './apps/SearchVertil';
import { VertilAgency } from './apps/VertilAgency';
import { VertilMedia } from './apps/MediaPlayer';
import { VertilStream } from './apps/VertilStream';
import { VertilReggedit } from './apps/VertilReggedit';
import { VertilShield } from './apps/VertilShield';
import { Store } from './apps/Store';

const INITIAL_STATE: OSState = {
  booted: false, isLocked: true, isOff: true, isSuspended: false,
  authorizedUser: 'Vertil', isSecurityConfigured: false, manualBypassAllowed: true,
  biosStage: 0, wallpaper: DEFAULT_WALLPAPER, ssdUsed: 4.2, ramUsed: 1.8,
  windows: [], activeWindowId: null, files: [], processes: [], services: [],
  installedApps: [], isDevMode: true, audioSettings: { isDriverInstalled: true, bands: [], preset: 'Flat' },
  allowUnknownSources: true, restorePoint: null, externalDriveLinked: false, driveUrl: null, systemDirty: false
};

export default function App() {
  const [os, setOs] = useState<OSState>(INITIAL_STATE);

  useEffect(() => {
    const saved = kernel.getSystemConfig();
    if (saved) setOs(prev => ({ ...prev, ...saved }));
  }, []);

  const openApp = (appId: string, title?: string, icon?: string, data?: any) => {
    const config = APP_CONFIGS.find(a => a.id === appId) || os.installedApps.find(a => a.id === appId);
    if (!config) return;
    soundService.playAppOpen();
    const existing = os.windows.find(w => w.appId === appId);
    if (existing) {
      setOs(prev => ({ ...prev, activeWindowId: existing.id, windows: prev.windows.map(w => w.id === existing.id ? { ...w, isMinimized: false } : w) }));
      return;
    }
    const newWindow: WindowState = { id: Math.random().toString(36).substring(7), appId, title: title || config.name, icon: icon || config.icon, isMaximized: false, isMinimized: false, zIndex: 100, initialData: data };
    setOs(prev => ({ ...prev, windows: [...prev.windows, newWindow], activeWindowId: newWindow.id }));
  };

  if (os.isOff) return <BootSequence onBootComplete={() => setOs(prev => ({ ...prev, isOff: false }))} />;
  if (os.isLocked) return <LoginScreen expectedUser={os.authorizedUser} onUnlock={() => setOs(prev => ({ ...prev, isLocked: false }))} manualBypassAllowed={os.manualBypassAllowed} />;

  return (
    <div className="fixed inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${os.wallpaper})` }}>
      <div className="p-6 grid grid-cols-4 gap-6">
        {APP_CONFIGS.map(app => (
          <div key={app.id} onClick={() => openApp(app.id)} className="flex flex-col items-center gap-2 cursor-pointer">
            <div className={`w-14 h-14 ${app.color} rounded-2xl flex items-center justify-center text-white shadow-xl`}>
              <i className={`fas ${app.icon} text-xl`}></i>
            </div>
            <span className="text-[10px] text-white font-black uppercase text-center">{app.name}</span>
          </div>
        ))}
      </div>
      {os.windows.map(win => (
        <Window key={win.id} window={win} isActive={os.activeWindowId === win.id} onClose={id => setOs(p => ({...p, windows: p.windows.filter(w => w.id !== id)}))} onMinimize={id => setOs(p => ({...p, windows: p.windows.map(w => w.id === id ? {...w, isMinimized: true} : w)}))} onMaximize={() => {}} onFocus={id => setOs(p => ({...p, activeWindowId: id}))}>
          {win.appId === 'nexusforge' && <NexusForge os={os} onUpdateOS={u => setOs(p => ({...p, ...u}))} openApp={openApp} />}
          {win.appId === 'sovereignbridge' && <SovereignBridge os={os} onUpdateOS={u => setOs(p => ({...p, ...u}))} initialData={win.initialData} />}
          {win.appId === 'explorer' && <Explorer files={os.files} onAddFile={f => setOs(p => ({...p, files: [...p.files, f]}))} onOpenFile={() => {}} onDeleteFile={() => {}} onMoveFile={() => {}} onCopyFile={() => {}} />}
          {win.appId === 'settings' && <Settings currentWallpaper={os.wallpaper} authorizedUser={os.authorizedUser} onWallpaperChange={w => setOs(p => ({...p, wallpaper: w}))} onIdentityChange={n => setOs(p => ({...p, authorizedUser: n}))} allowUnknown={os.allowUnknownSources} manualBypassAllowed={os.manualBypassAllowed} onToggleBypass={v => setOs(p => ({...p, manualBypassAllowed: v}))} onToggleUnknown={v => setOs(p => ({...p, allowUnknownSources: v}))} />}
          {win.appId === 'ide' && <VertilIDE onBuild={app => setOs(p => ({...p, installedApps: [...p.installedApps, app]}))} authorizedUser={os.authorizedUser} onSetDirty={v => setOs(p => ({...p, systemDirty: v}))} />}
          {win.appId === 'agency' && <VertilAgency os={os} onUpdateBrain={b => setOs(p => ({...p, agencyBrain: b}))} />}
        </Window>
      ))}
    </div>
  );
}