export interface ProjectFile { path: string; name: string; content: string; }
export const PROJECT_MANIFEST: ProjectFile[] = []; // Reemplazado dinámicamente por el kernel durante el sync