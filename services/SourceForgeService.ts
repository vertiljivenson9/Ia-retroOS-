class SourceForgeService {
  public async deployFile(file: any, token: string, repo: string) {
    const url = `https://api.github.com/repos/${repo}/contents/${(file.path + file.name).replace(/^\//, '')}`;
    const check = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
    let sha = ""; if (check.ok) { const d = await check.json(); sha = d.sha; }
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `Sync ${file.name}`, content: btoa(unescape(encodeURIComponent(file.content))), sha: sha || undefined })
    });
    return { success: res.ok };
  }
}
export const sourceForge = new SourceForgeService();