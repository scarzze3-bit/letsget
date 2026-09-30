"use strict";

const shieldWrap    = document.getElementById("shield-wrap");
const dotEl         = document.getElementById("dot");
const statusTextEl  = document.getElementById("status-text");
const statusSubEl   = document.getElementById("status-sub");
const statusCardEl  = document.getElementById("status-card");
const toggleBtn     = document.getElementById("btn-toggle");
const valTodayEl    = document.getElementById("val-today");
const valTotalEl    = document.getElementById("val-total");
const noticeEl      = document.getElementById("notice-box");
const announceBannerEl  = document.getElementById("announcement-banner");
const announceTextEl    = document.getElementById("announcement-text");
const dismissAnnoBtn    = document.getElementById("btn-dismiss-announcement");
const btnUpdateCheck    = document.getElementById("btn-update-check");

function setActiveUI(active) {
    if (active) {
        dotEl.className = "dot on";
        statusTextEl.textContent = "Blocking Ads";
        statusSubEl.textContent = "Active";
        statusSubEl.className = "status-sub";
        statusCardEl.className = "status-card active";
        toggleBtn.className = "toggle-btn on";
        shieldWrap.className = "shield-wrap";
    } else {
        dotEl.className = "dot off";
        statusTextEl.textContent = "Paused";
        statusSubEl.textContent = "Off";
        statusSubEl.className = "status-sub off";
        statusCardEl.className = "status-card paused";
        toggleBtn.className = "toggle-btn off";
        shieldWrap.className = "shield-wrap paused";
    }
}

function showNotice(msg) {
    noticeEl.textContent = msg;
    noticeEl.style.display = "block";
    clearTimeout(noticeEl._t);
    noticeEl._t = setTimeout(() => { noticeEl.style.display = "none"; }, 5000);
}

function formatNum(n) {
    return Number(n || 0).toLocaleString();
}

function renderAnnouncement(text) {
    if (!text || !text.trim()) {
        announceBannerEl.style.display = "none";
        return;
    }
    announceTextEl.textContent = text;
    announceBannerEl.style.display = "flex";
}

dismissAnnoBtn.addEventListener("click", () => {
    announceBannerEl.style.display = "none";
    chrome.storage.local.set({ _announcement: "" }).catch(() => {});
});

toggleBtn.addEventListener("click", async () => {
    const resp = await chrome.runtime.sendMessage({ type: "toggle" });
    if (resp?.ok && resp.result) {
        setActiveUI(resp.result.active);
    }
});

btnUpdateCheck.addEventListener("click", async () => {
    showNotice("🔍 Checking for updates...");
    try {
        const res = await fetch("https://extension.alwaysdata.net/server/g/xfeed", { cache: "no-store" });
        if (res.ok) {
            const data = await res.json();
            if (data?.announcement !== undefined) {
                await chrome.storage.local.set({ _announcement: data.announcement || "" });
                renderAnnouncement(data.announcement || "");
            }
            const minV = data?.min_version || data?.record?.min_version;
            const cur  = chrome.runtime.getManifest().version;
            if (minV && minV > cur) {
                showNotice(`⚠️ Update available — v${minV}. Please reinstall.`);
            } else {
                showNotice(`✅ You're on the latest version (v${cur}).`);
            }
        } else {
            showNotice("✅ Extension is up to date.");
        }
    } catch (_) {
        showNotice("🌐 Unable to connect. Check your internet connection.");
    }
});

chrome.storage.onChanged.addListener(async (changes, area) => {
    if (area !== "local") return;
    if (changes._announcement) {
        renderAnnouncement(changes._announcement.newValue || "");
    }
    // Refresh stats live
    const resp = await chrome.runtime.sendMessage({ type: "get_stats" });
    if (resp?.ok) {
        valTodayEl.textContent = formatNum(resp.result.blocksToday);
        valTotalEl.textContent = formatNum(resp.result.blocksTotal);
        setActiveUI(resp.result.active);
    }
});

// ── Init ──────────────────────────────────────────────────────────────────────
(async () => {
    // Load cached announcement
    try {
        const stored = await chrome.storage.local.get(["_announcement"]);
        if (stored?._announcement) renderAnnouncement(stored._announcement);
    } catch (_) {}

    // Load status + stats
    const resp = await chrome.runtime.sendMessage({ type: "get_stats" });
    if (resp?.ok) {
        setActiveUI(resp.result.active !== false); // default active
        valTodayEl.textContent = formatNum(resp.result.blocksToday);
        valTotalEl.textContent = formatNum(resp.result.blocksTotal);
    } else {
        setActiveUI(true);
    }
})();
