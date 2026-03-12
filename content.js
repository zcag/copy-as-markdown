// Copy as Markdown — Content Script
// Converts webpage DOM to clean Markdown, no external dependencies.

(() => {
  'use strict';

  // ─── Readability: extract main content ───

  const REMOVE_TAGS = new Set([
    'script', 'style', 'noscript', 'iframe', 'svg', 'canvas',
    'nav', 'footer', 'header', 'aside', 'form', 'button',
    'input', 'select', 'textarea', 'label',
  ]);

  const SKIP_CLASSES = /nav|menu|sidebar|footer|header|breadcrumb|pagination|ads?|banner|cookie|popup|modal|overlay|social|share|comment-form|search-form/i;

  function findMainContent() {
    // Try semantic tags first
    const article = document.querySelector('article');
    if (article && article.textContent.trim().length > 200) return article;

    const main = document.querySelector('main');
    if (main && main.textContent.trim().length > 200) return main;

    const role = document.querySelector('[role="main"]');
    if (role && role.textContent.trim().length > 200) return role;

    // Heuristic: find the div with the most paragraph text
    let best = null;
    let bestScore = 0;
    const candidates = document.querySelectorAll('div, section');
    for (const el of candidates) {
      const paragraphs = el.querySelectorAll('p');
      let textLen = 0;
      for (const p of paragraphs) textLen += p.textContent.trim().length;
      const linkDensity = (el.querySelectorAll('a').length + 1) / (paragraphs.length + 1);
      const score = textLen / (linkDensity + 1);
      if (score > bestScore) {
        bestScore = score;
        best = el;
      }
    }

    return best || document.body;
  }

  // ─── HTML to Markdown converter ───

  function escapeMarkdown(text) {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/([*_`\[\]#])/g, '\\$1');
  }

  function nodeToMarkdown(node, opts = {}) {
    if (node.nodeType === Node.TEXT_NODE) {
      let text = node.textContent;
      if (!opts.preformatted) {
        text = text.replace(/\s+/g, ' ');
      }
      if (!opts.preformatted && !opts.inline) {
        // Don't escape in code blocks
        // Light escaping — keep readability
      }
      return text;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return '';

    const tag = node.tagName.toLowerCase();

    // Skip invisible and irrelevant elements
    if (REMOVE_TAGS.has(tag)) return '';
    if (node.hidden || node.getAttribute('aria-hidden') === 'true') return '';
    const style = window.getComputedStyle(node);
    if (style.display === 'none' || style.visibility === 'hidden') return '';
    if (SKIP_CLASSES.test(node.className)) return '';

    // Process children helper
    const children = () => {
      let result = '';
      for (const child of node.childNodes) {
        result += nodeToMarkdown(child, opts);
      }
      return result;
    };

    const inlineChildren = () => {
      let result = '';
      for (const child of node.childNodes) {
        result += nodeToMarkdown(child, { ...opts, inline: true });
      }
      return result;
    };

    switch (tag) {
      case 'h1': return `\n\n# ${inlineChildren().trim()}\n\n`;
      case 'h2': return `\n\n## ${inlineChildren().trim()}\n\n`;
      case 'h3': return `\n\n### ${inlineChildren().trim()}\n\n`;
      case 'h4': return `\n\n#### ${inlineChildren().trim()}\n\n`;
      case 'h5': return `\n\n##### ${inlineChildren().trim()}\n\n`;
      case 'h6': return `\n\n###### ${inlineChildren().trim()}\n\n`;

      case 'p':
      case 'div': {
        // Only add paragraph breaks for p and content divs
        const content = children().trim();
        if (!content) return '';
        if (tag === 'p') return `\n\n${content}\n\n`;
        // For divs, only add breaks if it contains text directly
        const hasBlockChildren = node.querySelector('p, h1, h2, h3, h4, h5, h6, ul, ol, table, pre, blockquote');
        if (hasBlockChildren) return children();
        return `\n\n${content}\n\n`;
      }

      case 'br': return '\n';

      case 'hr': return '\n\n---\n\n';

      case 'strong':
      case 'b': {
        const text = inlineChildren().trim();
        return text ? `**${text}**` : '';
      }

      case 'em':
      case 'i': {
        const text = inlineChildren().trim();
        return text ? `*${text}*` : '';
      }

      case 'del':
      case 's':
      case 'strike': {
        const text = inlineChildren().trim();
        return text ? `~~${text}~~` : '';
      }

      case 'code': {
        if (node.parentElement && node.parentElement.tagName.toLowerCase() === 'pre') {
          return node.textContent;
        }
        const text = node.textContent.trim();
        return text ? `\`${text}\`` : '';
      }

      case 'pre': {
        const codeEl = node.querySelector('code');
        const text = codeEl ? codeEl.textContent : node.textContent;
        // Try to detect language from class
        let lang = '';
        const langClass = (codeEl || node).className.match(/(?:language-|lang-)(\w+)/);
        if (langClass) lang = langClass[1];
        return `\n\n\`\`\`${lang}\n${text.trimEnd()}\n\`\`\`\n\n`;
      }

      case 'a': {
        const href = node.getAttribute('href');
        const text = inlineChildren().trim();
        if (!text) return '';
        if (!href || href.startsWith('#') || href.startsWith('javascript:')) return text;
        // Make relative URLs absolute
        let fullUrl = href;
        try { fullUrl = new URL(href, window.location.href).href; } catch {}
        return `[${text}](${fullUrl})`;
      }

      case 'img': {
        const alt = node.getAttribute('alt') || '';
        const src = node.getAttribute('src');
        if (!src) return '';
        let fullSrc = src;
        try { fullSrc = new URL(src, window.location.href).href; } catch {}
        return `![${alt}](${fullSrc})`;
      }

      case 'ul': {
        let result = '\n\n';
        for (const li of node.children) {
          if (li.tagName.toLowerCase() === 'li') {
            const content = nodeToMarkdown(li, opts).trim();
            result += `- ${content}\n`;
          }
        }
        return result + '\n';
      }

      case 'ol': {
        let result = '\n\n';
        let i = parseInt(node.getAttribute('start') || '1', 10);
        for (const li of node.children) {
          if (li.tagName.toLowerCase() === 'li') {
            const content = nodeToMarkdown(li, opts).trim();
            result += `${i}. ${content}\n`;
            i++;
          }
        }
        return result + '\n';
      }

      case 'li': {
        return children();
      }

      case 'blockquote': {
        const content = children().trim();
        return '\n\n' + content.split('\n').map(line => `> ${line}`).join('\n') + '\n\n';
      }

      case 'table': {
        return convertTable(node);
      }

      case 'figure': {
        return children();
      }

      case 'figcaption': {
        const text = inlineChildren().trim();
        return text ? `\n*${text}*\n` : '';
      }

      case 'mark': {
        const text = inlineChildren().trim();
        return text ? `==${text}==` : '';
      }

      case 'sup': {
        const text = inlineChildren().trim();
        return text ? `^${text}` : '';
      }

      case 'sub': {
        const text = inlineChildren().trim();
        return text ? `~${text}` : '';
      }

      case 'details': {
        const summary = node.querySelector('summary');
        const summaryText = summary ? summary.textContent.trim() : 'Details';
        let content = '';
        for (const child of node.childNodes) {
          if (child !== summary) content += nodeToMarkdown(child, opts);
        }
        return `\n\n<details>\n<summary>${summaryText}</summary>\n${content.trim()}\n</details>\n\n`;
      }

      case 'summary': return '';

      // Skip these
      case 'video':
      case 'audio':
      case 'source':
      case 'picture':
        return '';

      default:
        return children();
    }
  }

  function convertTable(table) {
    const rows = [];
    const allRows = table.querySelectorAll('tr');

    for (const tr of allRows) {
      const cells = [];
      for (const cell of tr.children) {
        if (cell.tagName === 'TD' || cell.tagName === 'TH') {
          cells.push(cell.textContent.trim().replace(/\|/g, '\\|').replace(/\n/g, ' '));
        }
      }
      rows.push(cells);
    }

    if (rows.length === 0) return '';

    const colCount = Math.max(...rows.map(r => r.length));

    // Pad rows to same length
    for (const row of rows) {
      while (row.length < colCount) row.push('');
    }

    let md = '\n\n';
    // Header
    md += '| ' + rows[0].join(' | ') + ' |\n';
    md += '| ' + rows[0].map(() => '---').join(' | ') + ' |\n';
    // Body
    for (let i = 1; i < rows.length; i++) {
      md += '| ' + rows[i].join(' | ') + ' |\n';
    }
    return md + '\n';
  }

  // ─── Clean up markdown output ───

  function cleanMarkdown(md) {
    return md
      // Collapse multiple blank lines to two
      .replace(/\n{3,}/g, '\n\n')
      // Remove leading/trailing whitespace on lines
      .split('\n').map(l => l.trimEnd()).join('\n')
      // Trim overall
      .trim() + '\n';
  }

  // ─── Public API for messages ───

  function getPageMarkdown(selectionOnly) {
    const title = document.title;
    const url = window.location.href;

    let root;
    if (selectionOnly) {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
        const container = document.createElement('div');
        for (let i = 0; i < sel.rangeCount; i++) {
          container.appendChild(sel.getRangeAt(i).cloneContents());
        }
        // Convert the cloned fragment — attach temporarily for getComputedStyle
        document.body.appendChild(container);
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        const md = nodeToMarkdown(container);
        container.remove();
        const header = `# ${title}\n\nSource: ${url}\n\n---\n\n`;
        return cleanMarkdown(header + md);
      }
    }

    root = findMainContent();
    const md = nodeToMarkdown(root);
    const header = `# ${title}\n\nSource: ${url}\n\n---\n\n`;
    return cleanMarkdown(header + md);
  }

  // ─── Toast notification ───

  function showToast(message, success = true) {
    const existing = document.getElementById('cam-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'cam-toast';
    toast.textContent = message;
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      padding: '12px 20px',
      borderRadius: '8px',
      backgroundColor: success ? '#10b981' : '#ef4444',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '14px',
      fontWeight: '500',
      zIndex: '2147483647',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      transition: 'opacity 0.3s ease',
      opacity: '0',
    });
    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity = '1'; });
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  // ─── Token estimation ───

  function estimateTokens(text) {
    // Approximate token count: ~4 chars per token for English text
    // This matches OpenAI/Anthropic tokenizers within ~10%
    const chars = text.length;
    const tokens = Math.ceil(chars / 4);
    return { chars, tokens };
  }

  function formatTokenCount(tokens) {
    if (tokens >= 1000) return `~${(tokens / 1000).toFixed(1)}K tokens`;
    return `~${tokens} tokens`;
  }

  // ─── Message handler ───

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === 'copy-page' || msg.action === 'copy-selection') {
      try {
        const selectionOnly = msg.action === 'copy-selection';
        const md = getPageMarkdown(selectionOnly);
        const lines = md.split('\n').filter(l => l.trim()).length;
        const { chars, tokens } = estimateTokens(md);

        navigator.clipboard.writeText(md).then(() => {
          showToast(`Copied ${formatTokenCount(tokens)} as Markdown`);
          sendResponse({ success: true, lines, chars, tokens });
        }).catch(err => {
          // Fallback: textarea copy
          const ta = document.createElement('textarea');
          ta.value = md;
          ta.style.position = 'fixed';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
          showToast(`Copied ${formatTokenCount(tokens)} as Markdown`);
          sendResponse({ success: true, lines, chars, tokens });
        });
        return true; // async response
      } catch (e) {
        showToast('Failed to convert page', false);
        sendResponse({ success: false, error: e.message });
      }
    }

    if (msg.action === 'get-preview') {
      try {
        const md = getPageMarkdown(false);
        const { chars, tokens } = estimateTokens(md);
        sendResponse({ success: true, preview: md.slice(0, 500), totalLength: md.length, chars, tokens });
      } catch (e) {
        sendResponse({ success: false, error: e.message });
      }
    }
  });
})();
