import { BLOG_PATH } from "@/content.config";
import { slugifyStr } from "./slugify";

/**
 * Get full path of a blog post
 * @param id - id of the blog post (aka slug)
 * @param filePath - the blog post full file location
 * @param includeBase - whether to include `/posts` in return value
 * @returns blog post path
 */
export function getPath(
  id: string,
  filePath: string | undefined,
  includeBase = true
) {
  const pathSegments = filePath
    ?.replace(BLOG_PATH, "")
    .split("/")
    .filter(path => path !== "") // remove empty string in the segments ["", "other-path"] <- empty string will be removed
    .filter(path => !path.startsWith("_")) // exclude directories start with underscore "_"
    .slice(0, -1) // remove the last segment_ file name_ since it's unnecessary
    .map(segment => slugifyStr(segment)); // slugify each segment path

  // Making sure `id` does not contain the directory
  const blogId = id.split("/");
  const slug = blogId.length > 0 ? blogId.slice(-1) : blogId;

  // Build the path segments
  let pathParts: string[];
  if (!pathSegments || pathSegments.length < 1) {
    pathParts = includeBase ? ["posts", ...slug] : [...slug];
  } else {
    pathParts = includeBase
      ? ["posts", ...pathSegments, ...slug]
      : [...pathSegments, ...slug];
  }

  // Join with slashes
  const path = pathParts.join("/");

  // Only prepend base URL when includeBase is true (for template hrefs)
  // When includeBase is false (for getStaticPaths), return just the path
  if (includeBase) {
    const baseUrl = import.meta.env.BASE_URL;
    return `${baseUrl}${path}`;
  }

  return path;
}
