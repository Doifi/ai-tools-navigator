# Articles Workflow

## Entry Points

- Admin list: `/admin/posts`
- Create post: `/admin/posts/new`
- Public list: `/posts`
- Public detail: `/posts/[slug]`

## Recommended Process

1. Open the admin create page and fill in title, excerpt, author, category, cover image, and content.
2. Use a stable slug. Prefer English slugs with hyphens for predictable URLs.
3. If the article mentions tools that already exist on the site, select them in the related tools list.
4. In the content, wrap tool names with `[[Tool Name]]` when you want them highlighted on the article page.
5. Set `status` to `published` when ready to expose the article on the public site.

## Content Format

The article editor stores plain text with lightweight Markdown-style syntax:

- `# Title`
- `## Section`
- `### Subsection`
- `- List item`
- `> Quote`
- fenced code blocks with triple backticks

## Publishing Notes

- Published posts appear on `/posts` and may also appear on the homepage latest posts area.
- Draft and archived posts remain in the database but are filtered out of the public API.
- Related tools are pulled from the `related_tools` UUID array on the `posts` table.
