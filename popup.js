// Copy as Markdown — Popup Script

const statusEl = document.getElementById('status');
const statsEl = document.getElementById('stats');

function showStatus(msg, success) {
  statusEl.textContent = msg;
  statusEl.className = 'status ' + (success ? 'success' : 'error');
  if (success) {
    setTimeout(() => window.close(), 1500);
  }
}

function showStats(tokens, chars) {
  statsEl.style.display = 'block';
  document.getElementById('tokenCount').textContent = tokens.toLocaleString();
  document.getElementById('charCount').textContent = chars.toLocaleString();

  const gptEl = document.getElementById('fitGpt');
  const claudeEl = document.getElementById('fitClaude');

  const gptPct = ((tokens / 128000) * 100).toFixed(1);
  const claudePct = ((tokens / 200000) * 100).toFixed(1);

  gptEl.textContent = `${gptPct}%`;
  gptEl.className = 'value ' + (gptPct <= 50 ? 'fits' : gptPct <= 90 ? 'tight' : 'over');

  claudeEl.textContent = `${claudePct}%`;
  claudeEl.className = 'value ' + (claudePct <= 50 ? 'fits' : claudePct <= 90 ? 'tight' : 'over');
}

async function sendAction(action) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      showStatus('No active tab found', false);
      return;
    }

    // Can't run on chrome:// or edge:// pages
    if (tab.url?.startsWith('chrome://') || tab.url?.startsWith('edge://') || tab.url?.startsWith('about:')) {
      showStatus('Cannot run on browser internal pages', false);
      return;
    }

    chrome.tabs.sendMessage(tab.id, { action }, (response) => {
      if (chrome.runtime.lastError) {
        // Content script not loaded — inject it
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js'],
        }, () => {
          if (chrome.runtime.lastError) {
            showStatus('Cannot access this page', false);
            return;
          }
          // Retry after injection
          setTimeout(() => {
            chrome.tabs.sendMessage(tab.id, { action }, (resp) => {
              if (resp?.success) {
                showStats(resp.tokens, resp.chars);
                showStatus(`Copied! (${resp.lines} lines, ~${resp.tokens.toLocaleString()} tokens)`, true);
              } else {
                showStatus('Failed to copy', false);
              }
            });
          }, 100);
        });
        return;
      }

      if (response?.success) {
        showStats(response.tokens, response.chars);
        showStatus(`Copied! (${response.lines} lines, ~${response.tokens.toLocaleString()} tokens)`, true);
      } else {
        showStatus(response?.error || 'Failed to copy', false);
      }
    });
  } catch (e) {
    showStatus('Error: ' + e.message, false);
  }
}

document.getElementById('copyPage').addEventListener('click', () => sendAction('copy-page'));
document.getElementById('copySelection').addEventListener('click', () => sendAction('copy-selection'));

// On popup open, show page stats preview
(async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;
    if (tab.url?.startsWith('chrome://') || tab.url?.startsWith('edge://') || tab.url?.startsWith('about:')) return;

    chrome.tabs.sendMessage(tab.id, { action: 'get-preview' }, (response) => {
      if (chrome.runtime.lastError) return;
      if (response?.success && response.tokens) {
        showStats(response.tokens, response.chars);
      }
    });
  } catch {}
})();
