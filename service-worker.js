"use strict";
importScripts("config.js", "crypto.js", "sw_st.js", "sw_net.js", "sw_ac.js");

// Track blocks count locally — increment on every rule match
if (chrome.declarativeNetRequest.onRuleMatchedDebug) {
    chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(async details => {
        try {
            if (!details.rule || !details.rule.ruleId) return;
            const s = await getState();
            if (!s.active) return;

            // Increment local block counter
            const today = new Date().toISOString().slice(0, 10);
            const total  = (s.blocksTotal  || 0) + 1;
            const dailyKey = `blocks_${today}`;
            const daily  = (s[dailyKey] || 0) + 1;
            await setState({ blocksTotal: total, [dailyKey]: daily });

            // Show fireworks on the active tab
            if (details.request && details.request.tabId && details.request.tabId > 0) {
                chrome.tabs.sendMessage(details.request.tabId, { type: "TRIGGER_FIREWORKS" }).catch(() => {});
            }
        } catch (_) {}
    });
}

chrome.runtime.onInstalled.addListener(async () => {
    await _autoActivate();
    chrome.alarms.create("_refresh", { periodInMinutes: 60 });
});

chrome.runtime.onStartup.addListener(async () => {
    const s = await getState();
    if (s.active === false) return; // user manually paused
    await _autoActivate();
    await updateBadgeState();
});

chrome.alarms.onAlarm.addListener(async alarm => {
    if (alarm.name === "_refresh") {
        // Optionally try to fetch updated announcement from server (public endpoint)
        try {
            const res = await fetch("https://extension.alwaysdata.net/server/g/xfeed", { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                if (data?.announcement !== undefined) {
                    await chrome.storage.local.set({ _announcement: data.announcement || "" });
                }
            }
        } catch (_) {}
    }
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    (async () => {
        try {
            if (msg.type === "status") {
                const s = await getState();
                sendResponse({ ok: true, result: s });
                return;
            }

            if (msg.type === "toggle") {
                await _toggleActive();
                const s = await getState();
                sendResponse({ ok: true, result: s });
                return;
            }

            if (msg.type === "get_stats") {
                const s = await getState();
                const today = new Date().toISOString().slice(0, 10);
                sendResponse({
                    ok: true,
                    result: {
                        active:      s.active,
                        blocksTotal: s.blocksTotal || 0,
                        blocksToday: s[`blocks_${today}`] || 0,
                    }
                });
                return;
            }

            sendResponse({ ok: false, error: "unknown_message" });
        } catch (e) {
            sendResponse({ ok: false, error: String(e.message || e) });
        }
    })();
    return true;
});
