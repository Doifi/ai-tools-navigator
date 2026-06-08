export function getToolPath(tool: { id: string; slug?: string | null }) {
  return `/tools/${tool.slug || tool.id}`;
}
