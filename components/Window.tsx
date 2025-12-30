import React from 'react';
export const Window = ({ window: win, isActive, onClose, onMinimize, onFocus, children }: any) => {
  if (win.isMinimized) return null;
  return (
    <div onClick={() => onFocus(win.id)} className={`fixed flex flex-col overflow-hidden shadow-2xl transition-all border border-white/10 backdrop-blur-3xl bg-zinc-950/95 ${isActive ? 'ring-2 ring-cyan-500/40' : 'opacity-95'}`} style={{ top: '10%', left: '5%', width: '90%', height: '75%', zIndex: win.zIndex, borderRadius: '20px' }}>
      <div className="h-10 bg-black/80 flex items-center justify-between px-4 border-b border-white/5">
        <div className="flex items-center gap-3"><i className={`fas ${win.icon} text-cyan-500 text-[10px]`}></i><span className="text-white font-black uppercase text-[9px]">{win.title}</span></div>
        <div className="flex gap-1">
          <button onClick={(e) => { e.stopPropagation(); onMinimize(win.id); }} className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-lg"><i className="fa-solid fa-minus text-[9px] text-white/30"></i></button>
          <button onClick={(e) => { e.stopPropagation(); onClose(win.id); }} className="w-8 h-8 flex items-center justify-center hover:bg-red-600 text-white rounded-lg"><i className="fa-solid fa-xmark"></i></button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden bg-black">{children}</div>
    </div>
  );
};