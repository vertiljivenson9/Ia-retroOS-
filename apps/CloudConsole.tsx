import React from 'react';
export const CloudConsole = ({ os }: any) => (
  <div className="h-full bg-zinc-950 text-white p-6 font-sans">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center"><i className="fas fa-cloud"></i></div>
      <h1 className="text-xl font-black uppercase">Cloud Console</h1>
    </div>
    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
      <p className="text-[10px] text-white/40 uppercase font-black">Infra Status</p>
      <p className="text-xl font-bold text-green-500">STABLE</p>
    </div>
  </div>
);