class OSKernel {
  private static instance: OSKernel;
  private REGISTRY_KEY = 'VERTIL_SYSTEM_CONFIG_JSON';
  public static getInstance() { if (!OSKernel.instance) OSKernel.instance = new OSKernel(); return OSKernel.instance; }
  public saveSystemConfig(config: any) { 
    const current = this.getSystemConfig() || {};
    localStorage.setItem(this.REGISTRY_KEY, JSON.stringify({ ...current, ...config })); 
  }
  public getSystemConfig() { const d = localStorage.getItem(this.REGISTRY_KEY); return d ? JSON.parse(d) : null; }
  public verifyDeploymentNodes(files: any[]) {
    const req = ['_redirects', 'netlify.toml', 'package.json'];
    const names = files.map(f => f.name.toLowerCase());
    const status = {}; req.forEach(r => status[r] = names.includes(r));
    return { valid: req.every(r => status[r]), missing: req.filter(r => !status[r]), status };
  }
}
export const kernel = OSKernel.getInstance();