import React, { useState, useEffect } from 'react';
import { OSState, WindowState, SystemFile, AppConfig, AgencyBrain } from './types';
import { APP_CONFIGS, DEFAULT_WALLPAPER } from './constants';
import { kernel } from './services/osKernel';
import { soundService } from './services/SoundService';

// Import Components
import { BootSequence } from './components/BootSequence';
import { LoginScreen } from './components/LoginScreen';
import { Window } from './components/Window';

// Import Apps
import { Explorer } from './apps/Explorer';
import { VertilIDE } from './apps/VertilIDE';
import { NexusForge } from './apps/NexusForge';
import { SovereignBridge } from './apps/SovereignBridge';
import { VertilAgency } from './apps/VertilAgency';
import { VertilMedia } from './apps/MediaPlayer';
import { VertilStream } from './apps/VertilStream';
import { Store } from './apps/Store';
import { PowerShell } from './apps/PowerShell';
import { SearchVertil } from './apps/SearchVertil';
import { VertilShield } from './apps/VertilShield';
import { Settings } from './apps/Settings';
import { VertilReggedit } from './apps/VertilReggedit';
import { VertilWriter } from './apps/Notepad';
import { CloudConsole } from './apps/CloudConsole';

const INITIAL_STATE: OSState = {
  booted: false,
  isLocked: true,
  isOff: true,
  isSuspended: false,
  authorizedUser: 'Vertil',
  isSecurityConfigured: false,
  manualBypassAllowed: true,
  biosStage: 0,
  wallpaper: DEFAULT_WALLPAPER,
  ssdUsed: 4.2,
  ramUsed: 1.8,
  windows: [],
  activeWindowId: null,
  files: [],
  processes: [
    { pid: 101, name: 'Kernel', status: 'Running', memoryUsage: 128 },
    { pid: 102, name: 'V-Shield', status: 'Running', memoryUsage: 64 }
  ],
  services: [
    { id: 's1', namespace: 'com.vertil.core', type: 'system', status: 'active' },
    { id: 's2', namespace: 'com.vertil.hid', type: 'driver', status: 'active' }
  ],
  installedApps: [],
  isDevMode: true,
  audioSettings: {
    isDriverInstalled: true,
    bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    preset: 'Flat'
  },
  allowUnknownSources: true,
  restorePoint: null,
  externalDriveLinked: false,
  driveUrl: null,
  agencyBrain: {
    learnedPatterns: [],
    lastSync: Date.now(),
    sessionKnowledge: '',
    systemContext: ''
  },
  systemDirty: false
};

const App: React.FC = () => {
  const [os, setOs] = useState<OSState>(INITIAL_STATE);

  useEffect(() => {
    const saved = kernel.getSystemConfig();
    if (saved) {
      setOs(prev => ({ ...prev, ...saved }));
    }
  }, []);

  useEffect(() => {
    kernel.saveSystemConfig({
      authorizedUser: os.authorizedUser,
      manualBypassAllowed: os.manualBypassAllowed,
      isSecurityConfigured: os.isSecurityConfigured,
      wallpaper: os.wallpaper,
      allowUnknownSources: os.allowUnknownSources,
      githubRepo: os.githubRepo,
      githubToken: os.githubToken,
      systemDirty: os.systemDirty
    });
  }, [os.authorizedUser, os.manualBypassAllowed, os.isSecurityConfigured, os.wallpaper, os.allowUnknownSources, os.githubRepo, os.githubToken, os.systemDirty]);

  const updateOS = (updates: Partial<OSState>) => {
    setOs(prev => ({ ...prev, ...updates }));
  };

  const openApp = (appId: string, title?: string, icon?: string, initialData?: any) => {
    const config = APP_CONFIGS.find(a => a.id === appId) || os.installedApps.find(a => a.id === appId);
    if (!config) return;

    soundService.playAppOpen();

    const existing = os.windows.find(w => w.appId === appId);
    if (existing) {
      setOs(prev => ({
        ...prev,
        activeWindowId: existing.id,
        windows: prev.windows.map(w => w.id === existing.id ? { ...w, isMinimized: false, initialData: initialData || w.initialData } : w)
      }));
      return;
    }

    const newWindow: WindowState = {
      id: Math.random().toString(36).substring(7),
      appId: appId,
      title: title || config.name,
      icon: icon || config.icon,
      isMaximized: false,
      isMinimized: false,
      zIndex: os.windows.length + 10,
      initialData: initialData,
      orientation: (config as any).orientation || 'portrait'
    };

    setOs(prev => ({
      ...prev,
      windows: [...prev.windows, newWindow],
      activeWindowId: newWindow.id
    }));
  };

  const closeWindow = (id: string) => {
    setOs(prev => ({
      ...prev,
      windows: prev.windows.filter(w => w.id !== id),
      activeWindowId: prev.activeWindowId === id ? null : prev.activeWindowId
    }));
  };

  const minimizeWindow = (id: string) => {
    setOs(prev => ({
      ...prev,
      windows: prev.windows.map(w => w.id === id ? { ...w, isMinimized: true } : w),
      activeWindowId: prev.activeWindowId === id ? null : prev.activeWindowId
    }));
  };

  const maximizeWindow = (id: string) => {
    setOs(prev => ({
      ...prev,
      windows: prev.windows.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)
    }));
  };

  const focusWindow = (id: string) => {
    setOs(prev => ({
      ...prev,
      activeWindowId: id,
      windows: prev.windows.map(w => w.id === id ? { ...w, zIndex: Math.max(...prev.windows.map(win => win.zIndex)) + 1 } : w)
    }));
  };

  if (os.isOff) {
    return <BootSequence onBootComplete={() => setOs(prev => ({ ...prev, isOff: false }))} />;
  }

  if (os.isLocked) {
    return <LoginScreen 
      expectedUser={os.authorizedUser} 
      manualBypassAllowed={os.manualBypassAllowed}
      onUnlock={() => setOs(prev => ({ ...prev, isLocked: false }))} 
    />;
  }

  return (
    <div 
      className="fixed inset-0 overflow-hidden bg-cover bg-center select-none"
      style={{ backgroundImage: "url(" + os.wallpaper + ")" }}
    >
      <div className="p-6 grid grid-cols-4 gap-6 content-start h-[calc(100vh-48px)]">
        {APP_CONFIGS.map(app => (
          <div key={app.id} onClick={() => openApp(app.id)} className="flex flex-col items-center gap-2 cursor-pointer group">
            <div className={"w-14 h-14 " + app.color + " rounded-2xl flex items-center justify-center text-white shadow-xl group-active:scale-95 transition-all relative"}>
              <i className={"fas " + app.icon + " text-xl"}></i>
              {(app.id === 'nexusforge' || app.id === 'sovereignbridge' || app.id === 'cloud') && os.systemDirty && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full border-2 border-black animate-pulse"></div>
              )}
            </div>
            <span className="text-[10px] text-white font-black uppercase tracking-widest text-center shadow-black drop-shadow-md">{app.name}</span>
          </div>
        ))}
      </div>

      {os.windows.map(win => (
        <Window key={win.id} window={win} isActive={os.activeWindowId === win.id} onClose={closeWindow} onMinimize={minimizeWindow} onMaximize={maximizeWindow} onFocus={focusWindow}>
          {win.appId === 'explorer' && <Explorer files={os.files} onAddFile={f => setOs(p => ({...p, files: [...p.files, f]}))} onOpenFile={f => openApp('media', f.name, 'fa-play-circle', f)} onDeleteFile={id => setOs(p => ({...p, files: p.files.filter(f => f.id !== id)}))} onMoveFile={(id, path) => setOs(p => ({...p, files: p.files.map(f => f.id === id ? {...f, path} : f)}))} onCopyFile={f => setOs(p => ({...p, files: [...p.files, {...f, id: kernel.generateId()}]}))} />}
          {win.appId === 'ide' && <VertilIDE authorizedUser={os.authorizedUser} onBuild={app => setOs(p => ({...p, installedApps: [...p.installedApps, app]}))} onSetDirty={val => setOs(p => ({...p, systemDirty: val}))} />}
          {win.appId === 'nexusforge' && <NexusForge os={os} onUpdateOS={updateOS} openApp={openApp} />}
          {win.appId === 'sovereignbridge' && <SovereignBridge os={os} onUpdateOS={updateOS} initialData={win.initialData} />}
          {win.appId === 'cloud' && <CloudConsole os={os} />}
        </Window>
      ))}

      <div className="fixed bottom-0 left-0 right-0 h-12 bg-black/80 backdrop-blur-2xl border-t border-white/10 flex items-center px-4 gap-2 z-[10000]">
        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 cursor-pointer">
          <i className="fas fa-th-large text-white/40 text-xs"></i>
        </div>
        <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar">
          {os.windows.map(win => (
            <div key={win.id} onClick={() => focusWindow(win.id)} className={"h-8 px-4 rounded-lg flex items-center gap-2 cursor-pointer transition-all " + (os.activeWindowId === win.id ? 'bg-white/20' : 'bg-white/5')}>
              <i className={"fas " + win.icon + " text-[10px] text-cyan-500"}></i>
              <span className="text-[10px] text-white/60 font-black uppercase tracking-tighter truncate max-w-[100px]">{win.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default App;