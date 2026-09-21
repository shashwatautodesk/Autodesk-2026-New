# Push this to GitHub

The repository is already initialized with a commit on the `main` branch. You only need to create the empty repo on GitHub and push.

## 1. Create an empty repository

Go to https://github.com/new

- **Name:** `autodesk-whats-new`
- **Visibility:** Public (required for free GitHub Pages)
- **Do not** tick "Add a README", ".gitignore" or "license" — the repo already has them, and initializing would cause a conflict on first push.

Click **Create repository**.

## 2. Push

Unzip this folder on your machine, open a terminal inside it, and run:

```bash
git remote add origin https://github.com/<your-username>/autodesk-whats-new.git
git push -u origin main
```

Replace `<your-username>` with your GitHub account or organization name.

If you're pushing to an Autodesk-owned organization, use that org name instead, and check whether it requires SSO authorization for your credentials.

### If git asks for a password

GitHub no longer accepts account passwords over HTTPS. Either:

- **Use the GitHub CLI** (simplest): install `gh`, run `gh auth login`, then push normally; or
- **Create a fine-grained personal access token** at https://github.com/settings/tokens with `Contents: Read and write` on this repository, and paste it when git asks for a password; or
- **Use SSH:** `git remote set-url origin git@github.com:<your-username>/autodesk-whats-new.git` if you already have SSH keys set up.

### If you'd rather not use a terminal

On the new empty repository page, click **uploading an existing file**, then drag in `index.html`, `README.md`, the `data` folder, the `scripts` folder and the `.github` folder. Commit directly to `main`. (Web upload won't carry the `.git` history, which is fine.)

## 3. Turn on GitHub Pages

In the repository: **Settings → Pages → Build and deployment**

- Source: **Deploy from a branch**
- Branch: **main**, folder: **/ (root)**
- **Save**

Wait about a minute. Your site will be at:

```
https://<your-username>.github.io/autodesk-whats-new/
```

## 4. Check it works

- Open the URL and confirm cards load (42 updates).
- Try a personalized link before sending it to a customer, for example:
  `https://<your-username>.github.io/autodesk-whats-new/?industry=aec&role=bim-manager&products=Revit`
- Go to the **Actions** tab — the "Validate content" workflow runs on push and will report any broken source links. This is the easiest way to verify all 42 Autodesk URLs resolve, since I couldn't reach autodesk.com to check them.

## Updating content later

Edit `data/updates.js`, run `node scripts/validate.js`, then:

```bash
git add data/updates.js data/updates.json
git commit -m "Add October 2026 updates"
git push
```

Pages redeploys automatically within a minute.
