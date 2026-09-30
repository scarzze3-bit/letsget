"use strict";

const _SK = "_secState";

async function getState() {
    try {
        const raw = await chrome.storage.local.get([_SK]);
        if (!raw[_SK]) return {};
        return await decryptStorageData(raw[_SK]);
    } catch (_) { return {}; }
}

async function updateBadgeState(s) {
    try {
        if (!s) s = await getState();
        if (s.active) {
            await chrome.action.setBadgeText({ text: "\u2022" });
            await chrome.action.setBadgeBackgroundColor({ color: "#10b981" });
        } else {
            await chrome.action.setBadgeText({ text: "OFF" });
            await chrome.action.setBadgeBackgroundColor({ color: "#6b7280" });
        }
    } catch (_) {}
}

async function setState(v) {
    const c = await getState();
    const u = { ...c, ...v };
    try {
        const e = await encryptStorageData(u);
        await chrome.storage.local.set({ [_SK]: e });
    } catch (_) {
        await chrome.storage.local.set({ [_SK]: JSON.stringify(u) });
    }
    await updateBadgeState(u);
}

async function clearSession() {
    await chrome.storage.local.clear();
    await updateBadgeState({ active: false });
    await _deactivate();
}
