import React, { useState } from 'react';
export const LoginScreen = ({ expectedUser, onUnlock }: any) => {
  const [pass, setPass] = useState('');
  return (
    <div className="fixed inset-0 bg-zinc-950 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center rotate-12 mb-10"><span className="text-black font-black text-2xl italic">-r-</span></div>
      <form onSubmit={e => { e.preventDefault(); if (pass.toLowerCase() === expectedUser.toLowerCase()) onUnlock(); }} className="w-full max-w-xs space-y-4">
        <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Firma de acceso..." className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-xs text-cyan-400 font-mono outline-none" />
        <button type="submit" className="w-full bg-white text-black py-4 rounded-2xl text-[10px] font-black uppercase">Entrar</button>
      </form>
    </div>
  );
};