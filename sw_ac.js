"use strict";

// Free mode — no login, no tokens. Auto-activate on install.
async function _deactivate() {
    try {
        const rules = await chrome.declarativeNetRequest.getDynamicRules();
        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: rules.map(r => r.id), addRules: []
        });
    } catch (_) {}
    await setState({ active: false });
}

async function _autoActivate() {
    // Static rules from rules.json are always loaded by Chrome automatically.
    // Just mark state as active.
    await setState({ active: true, free: true });
}

async function _toggleActive() {
    const s = await getState();
    if (s.active) {
        await _deactivate();
    } else {
        await _autoActivate();
    }
}
