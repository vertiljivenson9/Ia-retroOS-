class OSKernel {
  private static instance: OSKernel;
  public static getInstance(): OSKernel { if (!OSKernel.instance) OSKernel.instance = new OSKernel(); return OSKernel.instance; }
  public saveSystemConfig(config: any) { localStorage.setItem('VERTIL_SYSTEM_CONFIG', JSON.stringify({ ...this.getSystemConfig(), ...config })); }
  public getSystemConfig() { const d = localStorage.getItem('VERTIL_SYSTEM_CONFIG'); return d ? JSON.parse(d) : null; }
  public generateId() { return 'vpx-' + Math.random().toString(36).substring(2, 9); }
  public verifyDeploymentNodes(files: any[]) { 
    const req = ['_redirects', 'netlify.toml'];
    const names = files.map(f => (f.name || '').toLowerCase());
    const status = { '_redirects': names.includes('_redirects'), 'netlify.toml': names.includes('netlify.toml') };
    return { valid: req.every(r => status[r]), missing: req.filter(r => !status[r]), status };
  }
}
export const kernel = OSKernel.getInstance();