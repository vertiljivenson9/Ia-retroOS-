import React from 'react';
import { PROJECT_MANIFEST } from '../services/ProjectSource';
export const NexusForge = ({ os, onUpdateOS, openApp }: any) => {
  return (
    <div className="h-full bg-zinc-950 text-cyan-400 p-6 font-mono overflow-y-auto">
      <h2 className="text-lg font-black uppercase mb-4">Nexus DNA Forge</h2>
      <div className="space-y-2 mb-8">
        {PROJECT_MANIFEST.map((f, i) => <div key={i} className="text-[10px] opacity-40">SYNC_READY: {f.path}{f.name}</div>)}
      </div>
      <button onClick={() => openApp('sovereignbridge', 'Bridge', 'fa-link', { files: PROJECT_MANIFEST })} className="w-full py-4 bg-cyan-600 text-black rounded-xl font-black uppercase">Neural Sync</button>
    </div>
  );
};