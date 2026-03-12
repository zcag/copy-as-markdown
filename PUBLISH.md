# Extension Publishing Setup (One-Time)

After this setup, extensions can be published autonomously via CLI.
Pick any ONE store to start — or do all three for max reach.

---

## Option A: Firefox Add-ons (FREE, ~5 min, enables CLI publishing)

**This is the best option** — once set up, publishing is fully automated via `web-ext`.

1. Go to https://addons.mozilla.org/developers/
2. Sign in (or create account — free)
3. Go to https://addons.mozilla.org/en-US/developers/addon/api/key/
4. Click "Generate new credentials"
5. Copy the **JWT issuer** and **JWT secret**
6. Run:
   ```bash
   # Save credentials (run once)
   echo 'export AMO_JWT_ISSUER="your-jwt-issuer"' >> ~/.zshrc
   echo 'export AMO_JWT_SECRET="your-jwt-secret"' >> ~/.zshrc
   source ~/.zshrc
   ```

That's it. After this, publishing any extension to Firefox is:
```bash
cd ~/mill/work/copy-as-markdown
npx web-ext sign --channel=listed --api-key=$AMO_JWT_ISSUER --api-secret=$AMO_JWT_SECRET --amo-metadata=amo-metadata.json
```

Firefox has ~200M users with built-in store search/discovery.

---

## Option B: Chrome Web Store ($5, ~15 min, enables CLI publishing)

1. Go to https://chrome.google.com/webstore/devconsole
2. Pay $5 one-time developer fee
3. Set up OAuth2 for CLI automation:
   a. Go to https://console.cloud.google.com/apis/credentials
   b. Create a project (or use existing)
   c. Enable "Chrome Web Store API"
   d. Create OAuth2 credentials (Desktop app type)
   e. Download client ID + client secret
   f. Run the helper to get refresh token:
      ```bash
      npx chrome-webstore-upload-keys
      ```
   g. Save credentials:
      ```bash
      echo 'export CHROME_CLIENT_ID="your-client-id"' >> ~/.zshrc
      echo 'export CHROME_CLIENT_SECRET="your-client-secret"' >> ~/.zshrc
      echo 'export CHROME_REFRESH_TOKEN="your-refresh-token"' >> ~/.zshrc
      source ~/.zshrc
      ```

After this, publishing to Chrome is:
```bash
cd ~/mill/work/copy-as-markdown
npx chrome-webstore-upload-cli upload --source dist/copy-as-markdown.zip \
  --extension-id $CHROME_EXTENSION_ID \
  --client-id $CHROME_CLIENT_ID \
  --client-secret $CHROME_CLIENT_SECRET \
  --refresh-token $CHROME_REFRESH_TOKEN
```

Chrome has ~3B users. This is the biggest store.

---

## Option C: Edge Add-ons (FREE, ~10 min, manual upload)

1. Go to https://partner.microsoft.com/dashboard/microsoftedge/overview
2. Sign in with GitHub or Microsoft account
3. Enroll in Edge developer program (free)
4. Click "Create new extension"
5. Upload `dist/copy-as-markdown.zip`
6. Fill listing from `STORE_LISTING.md`
7. Submit for review

Edge has ~270M users. No CLI automation available — each publish is a manual upload.

---

## After Setup

Once ANY store credentials are saved, I can build and publish extensions autonomously.
The extension ZIP is pre-built at: `dist/copy-as-markdown.zip`
Store listing copy is at: `STORE_LISTING.md`
