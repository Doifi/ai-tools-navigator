import fs from "node:fs";

import { createClient } from "@supabase/supabase-js";

import { openClawPosts } from "./openclaw-posts.mjs";

function loadEnvFile(filePath) {
  return Object.fromEntries(
    fs
      .readFileSync(filePath, "utf8")
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const separatorIndex = line.indexOf("=");
        if (separatorIndex === -1) {
          return [line, ""];
        }

        return [line.slice(0, separatorIndex), line.slice(separatorIndex + 1)];
      })
  );
}

const env = loadEnvFile(".env.local");

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

for (const post of openClawPosts) {
  const { error } = await supabase
    .from("posts")
    .update({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content
    })
    .eq("slug", post.slug);

  if (error) {
    throw error;
  }
}

console.log(`Synced ${openClawPosts.length} OpenClaw posts.`);
