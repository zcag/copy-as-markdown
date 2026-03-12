// Copy as Markdown — Service Worker (Background)

// Create context menus on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'copy-page-md',
    title: 'Copy page as Markdown',
    contexts: ['page'],
  });

  chrome.contextMenus.create({
    id: 'copy-selection-md',
    title: 'Copy selection as Markdown',
    contexts: ['selection'],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab?.id) return;

  if (info.menuItemId === 'copy-page-md') {
    chrome.tabs.sendMessage(tab.id, { action: 'copy-page' });
  } else if (info.menuItemId === 'copy-selection-md') {
    chrome.tabs.sendMessage(tab.id, { action: 'copy-selection' });
  }
});

// Handle keyboard shortcut commands
chrome.commands.onCommand.addListener((command, tab) => {
  if (!tab?.id) return;

  if (command === 'copy-page') {
    chrome.tabs.sendMessage(tab.id, { action: 'copy-page' });
  } else if (command === 'copy-selection') {
    chrome.tabs.sendMessage(tab.id, { action: 'copy-selection' });
  }
});
