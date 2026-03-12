# Browser Extension Store Listing

## Name
Copy as Markdown — Web to MD for AI

## Short Description (132 chars max)
One-click to copy any webpage as clean Markdown with token count. Perfect for ChatGPT, Claude, Gemini, and other AI tools.

## Detailed Description

**Copy any webpage as clean Markdown in one click. See the token count before you paste.**

Stop manually formatting text when pasting into AI tools. Copy as Markdown instantly converts the current page (or your selection) into clean, well-structured Markdown — ready to paste into ChatGPT, Claude, Gemini, or any AI assistant.

**Features:**

• **Token counter** — See how many tokens the page will use before copying (GPT-4o and Claude context window fit indicators)
• **Full page copy** — Extracts the main content, strips ads/navigation/footers, and converts to Markdown
• **Selection copy** — Select specific text, right-click → "Copy selection as Markdown"
• **Smart content detection** — Automatically finds the article/main content on any page
• **Keyboard shortcuts** — Ctrl+Shift+M (full page) / Ctrl+Shift+K (selection)
• **Context menu** — Right-click to copy as Markdown
• **No external servers** — Everything runs locally in your browser. Your data never leaves your machine.

**Converts:**
• Headings, bold, italic, strikethrough
• Links (with absolute URLs)
• Images (with alt text)
• Code blocks (with language detection)
• Tables
• Lists (ordered and unordered)
• Blockquotes
• And more...

**Why Markdown for AI?**

AI tools like ChatGPT, Claude, and Gemini understand Markdown natively. When you paste Markdown instead of raw text, the AI gets proper structure — headings, lists, code blocks — and gives you better responses.

**Privacy first.** Zero tracking, zero data collection, zero external requests. The extension runs entirely in your browser.

## Category
Productivity

## Tags
markdown, copy, ai, chatgpt, claude, token counter, productivity, developer tools

---

## Publishing Instructions

### Option A: Microsoft Edge Add-ons (FREE — recommended first)

1. Go to https://partner.microsoft.com/dashboard/microsoftedge/overview
2. Sign in with your Microsoft or GitHub account
3. Enroll in the Microsoft Edge program (free, no payment)
4. Create the ZIP:
   ```bash
   cd ~/mill/work/copy-as-markdown
   zip -r copy-as-markdown.zip manifest.json content.js background.js popup.html popup.js icons/
   ```
5. Click "Create new extension" → upload the ZIP
6. Fill listing from this file
7. Submit for review (~7 business days)

### Option B: Chrome Web Store ($5 one-time fee)

1. Go to https://chrome.google.com/webstore/devconsole
2. Pay $5 one-time developer fee
3. Create the ZIP (same as above)
4. Click "New Item" → upload ZIP
5. Fill listing from this file
6. Submit for review (1-3 business days)

### Option C: Firefox Add-ons (FREE)

Requires converting to Firefox manifest format (I can do this). Then:
1. Go to https://addons.mozilla.org/developers/
2. Create a Mozilla account (free)
3. Upload the Firefox-compatible ZIP
4. Submit for review

### Option D: Opera Add-ons (FREE)

Same MV3 format as Chrome/Edge. Upload at https://addons.opera.com/developer/

**Recommended order:** Edge (free, 270M users) → Chrome ($5, 3B users) → Firefox (free, 200M users) → Opera (free)
