# DMG Read More Plugin

This WordPress plugin provides two key features:

1. A **Gutenberg block** that allows editors to insert a stylized "Read More" link to any published post.
2. A **WP-CLI command** to search for posts containing that block within a specific date range.

---

## 🔧 Features

### 1. Gutenberg Block: `DMG Read More`

- Lets editors **search for and select** a published post from the **InspectorControls** sidebar.
- **Search supports:**
    - Partial post titles
    - Specific post IDs
    - Pagination of results
- **Recent posts** are displayed by default when no search term is entered.
- Inserts a stylized anchor link into the editor:
  ```html
  <p class="dmg-read-more">Read More: <a href="https://example.com/my-post">Post Title</a></p>
  ```
- Selecting a new post **dynamically updates** the preview in the editor.
---

### 2. WP-CLI Command: `dmg-read-more search`

- Searches for posts that contain the `dmg-read-more` block in their content.
- Supports optional parameters:
    - `--date-before=<YYYY-MM-DD>`
    - `--date-after=<YYYY-MM-DD>`
- If no date arguments are passed, it **defaults to the last 30 days**.

**Usage Example:**
```bash
wp dmg-read-more search --date-after=2024-12-01 --date-before=2024-12-31
```
---

## 🛠️ Installation

1. Clone the repository into your WordPress `wp-content/plugins/` directory:
   ```bash
   git clone https://github.com/yourusername/dmg-read-more.git
   ```
2. Activate the plugin via WP Admin or with WP-CLI:
   ```bash
   wp plugin activate dmg-read-more
   ```

---

## 🧪 Testing

- To test the block, navigate to the Block Editor and insert the **DMG Read More** block.
- To test the WP-CLI command:
  ```bash
  wp dmg-read-more search
  ```
