import { SystemFile, AppConfig } from '../types';

class OSKernel {
  private static instance: OSKernel;
  private REGISTRY_KEY = 'VERTIL_SYSTEM_CONFIG_JSON';

  public static getInstance(): OSKernel {
    if (!OSKernel.instance) OSKernel.instance = new OSKernel();
    return OSKernel.instance;
  }

  public requestOrientation(orientation: 'portrait' | 'landscape') {
    if (typeof screen !== 'undefined' && (screen as any).orientation && (screen as any).orientation.lock) {
      (screen as any).orientation.lock(orientation).catch(() => {});
    }
  }

  public verifyDeploymentNodes(files: any[]) {
    const required = ['_redirects', 'netlify.toml'];
    const names = files.map(f => (f.name || '').toLowerCase().trim());
    const status: Record<string, boolean> = {};
    required.forEach(req => status[req] = names.includes(req));
    return { valid: required.every(r => status[r]), missing: required.filter(r => !status[r]), status };
  }

  public saveSystemConfig(config: any) {
    const current = this.getSystemConfig() || {};
    localStorage.setItem(this.REGISTRY_KEY, JSON.stringify({ ...current, ...config }));
  }

  public getSystemConfig() {
    const data = localStorage.getItem(this.REGISTRY_KEY);
    return data ? JSON.parse(data) : null;
  }

  public generateId() { return 'vpx-' + Math.random().toString(36).substring(2, 9); }
  
  public verifyIntegrity2D(code: string) {
    const forbidden = ['webgl', 'three.js', 'gl_Position'];
    const found = forbidden.filter(word => code.toLowerCase().includes(word));
    return { valid: found.length === 0, logs: found.length > 0 ? ["Forbidden engine found"] : ["Integrity check OK"] };
  }
}
export const kernel = OSKernel.getInstance();