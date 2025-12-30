import React, { useState, useEffect } from 'react';
export const BootSequence = ({ onBootComplete }: any) => {
  const [started, setStarted] = useState(false);
  useEffect(() => { if (started) setTimeout(onBootComplete, 3000); }, [started]);
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-center">
      {!started ? <button onClick={() => setStarted(true)} className="px-12 py-4 bg-cyan-600/20 border border-cyan-500/30 rounded-xl text-cyan-400 font-black uppercase">Iniciar Sistema</button>
       : <div className="animate-pulse text-cyan-500 font-mono text-xs">CARGANDO NÚCLEO VERTIL-NX...</div>}
    </div>
  );
};