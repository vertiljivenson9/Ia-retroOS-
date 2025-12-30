import React, { useState, useEffect } from 'react';
// Importaciones simplificadas para el despliegue inicial
export default function App() {
  return (
    <div style={{
      height: '100vh', 
      background: 'url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80)',
      backgroundSize: 'cover',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'monospace'
    }}>
      <div style={{ background: 'rgba(0,0,0,0.8)', padding: '40px', borderRadius: '24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h1 style={{ letterSpacing: '0.5em' }}>retroOS</h1>
        <p style={{ opacity: 0.5, fontSize: '10px' }}>SYSTEM DEPLOYED SUCCESSFULLY</p>
        <div style={{ marginTop: '20px', fontSize: '12px', color: '#06b6d4' }}>Neural Mesh Active</div>
      </div>
    </div>
  );
}