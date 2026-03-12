# Copy as Markdown

Browser extension that converts any webpage to clean Markdown in one click. Built for AI workflows — paste into ChatGPT, Claude, Gemini, or any LLM with proper formatting preserved.

## Features

- **One-click copy** — Full page or selected text, instantly converted to Markdown
- **Token counter** — See approximate token count with GPT-4o and Claude context window fit indicators
- **Smart extraction** — Automatically finds article content, strips navigation/ads/footers
- **Keyboard shortcuts** — `Ctrl+Shift+M` (full page), `Ctrl+Shift+K` (selection)
- **Context menu** — Right-click to copy as Markdown
- **No servers** — Everything runs locally. Your data never leaves your browser.

## What it converts

Headings, bold/italic/strikethrough, links (absolute URLs), images, code blocks (with language detection), tables, ordered/unordered lists, blockquotes, details/summary, and more.

## Install

### Download (recommended)

**[⬇ Download v1.1.0](https://github.com/zcag/copy-as-markdown/releases/latest/download/copy-as-markdown.zip)** — works on Chrome, Edge, Brave, Opera, Firefox

**Chrome / Edge / Brave / Opera:**
1. Download and extract the ZIP
2. Go to `chrome://extensions` (or `edge://extensions`)
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** → select the extracted folder

**Firefox:**
1. Download and extract the ZIP
2. Go to `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on** → select any file in the folder

### Bookmarklet (no install needed)

Don't want to install an extension? Use the [bookmarklet version](https://zcag.github.io/copy-as-markdown-bookmarklet/) — drag a link to your bookmarks bar. Works in any browser.

## Usage

| Action | How |
|--------|-----|
| Copy full page | Click extension icon → "Copy full page" |
| Copy selection | Select text → right-click → "Copy selection as Markdown" |
| Keyboard: full page | `Ctrl+Shift+M` (`Cmd+Shift+M` on Mac) |
| Keyboard: selection | `Ctrl+Shift+K` (`Cmd+Shift+K` on Mac) |

The popup shows live token stats — how many tokens the page uses and what percentage of GPT-4o (128K) and Claude (200K) context windows it fills.

## Why Markdown for AI?

AI tools understand Markdown natively. When you paste Markdown instead of raw text, the AI gets proper structure — headings, lists, code blocks — and gives better responses. This extension eliminates the manual formatting step.

## Privacy

Zero tracking. Zero data collection. Zero external requests. The extension runs entirely in your browser.

## License

MIT
