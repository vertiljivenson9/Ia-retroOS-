import React, { useState } from 'react';
import { soundService } from '../services/SoundService';
import { PROJECT_MANIFEST } from '../services/ProjectSource';
import { kernel } from '../services/osKernel';

export const NexusForge = ({ os, onUpdateOS, openApp }) => {
  const [pin, setPin] = useState('');
  const [isLocked, setIsLocked] = useState(true);

  const handleVerify = () => {
    if (pin === '2002') { setIsLocked(false); soundService.playAppOpen(); }
    else { soundService.playError(); setPin(''); }
  };

  if (isLocked) return (
    <div className="h-full bg-zinc-950 flex flex-col items-center justify-center p-8 font-mono">
      <i className="fas fa-fingerprint text-cyan-500 text-4xl mb-8 animate-pulse"></i>
      <input type="password" value={pin} onChange={e => setPin(e.target.value)} className="bg-black border border-cyan-500/20 p-5 rounded-2xl text-cyan-400 text-center" />
      <button onClick={handleVerify} className="mt-4 bg-cyan-600 px-8 py-2 rounded-xl text-black font-black uppercase">Authorize</button>
    </div>
  );

  return (
    <div className="h-full bg-zinc-950 text-cyan-400 flex flex-col font-mono">
       <div className="p-6">
          <h2 className="text-xl font-black uppercase">DNA Nodes ({PROJECT_MANIFEST.length})</h2>
          <button onClick={() => openApp('sovereignbridge', 'Bridge', 'fa-link', { files: PROJECT_MANIFEST })} className="mt-8 w-full bg-cyan-600 text-black py-4 rounded-xl font-black">NEURAL SYNC</button>
       </div>
    </div>
  );
};