import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getPath } from "@/utils/getPath";
import getSortedPosts from "@/utils/getSortedPosts";
import { SITE } from "@/config";

export async function GET() {
  const posts = await getCollection("blog");
  const sortedPosts = getSortedPosts(posts);
  const baseUrl = import.meta.env.BASE_URL;
  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: sortedPosts.map(({ data, id, filePath }) => {
      // Get path with base URL prefix
      const pathWithBase = getPath(id, filePath, true);
      // Remove the base URL prefix since SITE.website already includes it
      // Escape special regex characters in baseUrl
      const escapedBaseUrl = baseUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const relativePath = pathWithBase.replace(new RegExp(`^${escapedBaseUrl}`), "");
      // Construct absolute URL
      const absoluteUrl = new URL(relativePath, SITE.website).href;
      return {
        link: absoluteUrl,
        title: data.title,
        description: data.description,
        pubDate: new Date(data.modDatetime ?? data.pubDatetime),
      };
    }),
  });
}
