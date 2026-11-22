# FindMyAI — No-server static website

This version uses only HTML, CSS, JavaScript and a JSON data file. An optional Python helper lets you add and validate listings. There is no Node.js, Express, database, or backend server.

## Files

- `index.html` — page structure
- `style.css` — responsive white professional design
- `script.js` — search, filters, category navigation and tool details
- `tools.json` — directory data (20 starter listings)
- `manage_tools.py` — optional Python tool to add/validate listings
- `assets/favicon.svg` — website icon

## Preview on your computer

1. Extract the ZIP file.
2. Open the `FindMyAI-Static` folder.
3. Double-click `index.html`.

**Browser note:** Some browsers block JavaScript `fetch()` from reading a local JSON file when opening a page with `file://`. If the tools list does not load, use the included no-dependency Python preview command:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

This is only a local preview option. You do not need a backend server or any server-side application.

## Add AI tools using Python

Open Terminal in this folder and run:

```bash
python3 manage_tools.py
```

Type `A` to add a tool, or `V` to validate the JSON file. Python only edits `tools.json`; the live website itself runs in the browser using JavaScript.

You can also edit `tools.json` manually. Follow the same structure as the existing listings. Use official website URLs and verify pricing before publishing.

## Publish free as a static website

### GitHub Pages
1. Create a GitHub repository, e.g. `findmyai`.
2. Upload all files and folders from this project (not the ZIP itself).
3. Open repository **Settings → Pages**.
4. Under Build and deployment, choose **Deploy from a branch**.
5. Choose `main` and `/ (root)`, then Save.
6. GitHub will provide your public website URL.

### Connect `tools.nishublogs.online`
1. Add `tools.nishublogs.online` as a custom domain in GitHub Pages settings.
2. At the DNS provider for `nishublogs.online`, add the DNS record GitHub Pages asks for. For a subdomain this is commonly a CNAME to `<your-github-username>.github.io`, but use the exact value shown in GitHub.
3. Wait for DNS verification and enable HTTPS in GitHub Pages settings.

No Render, Node.js, Express, MongoDB, or paid hosting is required for this static version. A domain name may still have a registration/renewal cost.

## Limitations of a no-backend website

- No user accounts or admin panel.
- No user-submitted listings saved to a shared database.
- You update listings by editing `tools.json` and publishing the changes.
- Do not put secret API keys in JavaScript or JSON files.
- Search/filter runs locally in each visitor's browser.
- Tool pricing and features can change; review listings regularly.

## SEO launch checklist

- Add a real About page, contact details, privacy policy and terms.
- Write original, useful descriptions and guides; avoid thin auto-generated pages.
- Verify official links and pricing.
- Add the deployed domain to Google Search Console and submit the sitemap once you create it.
- Add analytics only after reviewing the relevant privacy and consent requirements.
