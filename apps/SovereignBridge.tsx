import React, { useState, useEffect } from 'react';
import { sourceForge } from '../services/SourceForgeService';
import { kernel } from '../services/osKernel';
export const SovereignBridge = ({ os, onUpdateOS, initialData }: any) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const executeMesh = async () => {
    setIsSyncing(true);
    const token = os.githubToken; const repo = os.githubRepo;
    if (!token || !repo) { setLogs(p => [...p, "ERR: Faltan credenciales."]); setIsSyncing(false); return; }
    for (const f of (initialData?.files || [])) {
      setLogs(p => [...p, `Syncing ${f.name}...`]);
      await sourceForge.deployFile(f, token, repo);
    }
    setLogs(p => [...p, "MESH COMPLETE."]); setIsSyncing(false); onUpdateOS({ systemDirty: false });
  };
  return (
    <div className="h-full bg-black text-amber-500 p-6 font-mono flex flex-col">
      <div className="flex-1 overflow-auto text-[10px] space-y-1">{logs.map((l, i) => <div key={i}>{l}</div>)}</div>
      <button onClick={executeMesh} disabled={isSyncing} className="mt-4 w-full py-4 bg-amber-600 text-black font-black uppercase">{isSyncing ? 'Deploying...' : 'Run .Mesh'}</button>
    </div>
  );
};