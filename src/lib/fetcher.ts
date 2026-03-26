export async function fetcher(url: string) {
  const response = await fetch(url, {
    cache: "no-store"
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    throw new Error(payload?.error || "请求失败");
  }

  return response.json();
}

export default fetcher;
