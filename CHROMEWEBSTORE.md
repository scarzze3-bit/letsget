# Chrome Web Store Listing — letsget

> Last Updated: 2026-09-30

---

## Store Listing

**Extension Name** [REQUIRED]
letsget — Ad Blocker & Session Guard

**Short Description** [REQUIRED]
Block ads and trackers automatically. Login to manage your token balance, view blocking activity, and keep sessions secure.

**Detailed Description** [REQUIRED]
```
letsget automatically blocks intrusive ads and tracking requests while you browse — without slowing down your browser or reading your page content.

KEY FEATURES

Account-based blocking — Log in with your account to activate real-time ad and tracker blocking across every site you visit.

Token balance — Each blocked request uses a small number of tokens from your balance. Top up when needed and keep browsing without interruptions.

Live transaction history — See exactly which blocking events were charged, when they happened, and how many tokens each one used.

Security-first design — Your login credentials and session data are encrypted locally. All communication with our servers is protected with end-to-end encryption.

Always up to date — The extension checks for updates to its blocking rules automatically. Tap "Check For Updates" any time to refresh manually.

Support built in — Contact our support team directly from the extension via WhatsApp or Telegram if you need help.

HOW TO USE

1. Click the letsget icon in your Chrome toolbar.
2. Enter your username and password, then click Connect.
3. Browse normally — letsget blocks ads and trackers automatically in the background.
4. Click "View Transactions & Usage" to check your token balance and blocking history.

PRIVACY

letsget does not read your browsing history or the content of web pages. Blocking is performed using Chrome's built-in declarative filtering system — page content never leaves your device. Your account credentials are encrypted before storage.

SUPPORT

For help, use the WhatsApp or Telegram buttons inside the extension, or contact us at support@letsget.io.
```

**Category** [REQUIRED]
Productivity

**Single Purpose** [REQUIRED]
Blocks ads and trackers while metering usage via a token-based subscription account.

**Primary Language** [REQUIRED]
English

---

## Graphics & Assets

| Asset | Dimensions | Status | Filename |
|-------|-----------|--------|----------|
| Store Icon [REQUIRED] | 128×128 PNG | ✅ Ready | icon-128.png |
| Screenshot 1 [REQUIRED] | 1280×800 or 640×400 | ⬜ Not created | — |
| Screenshot 2 [RECOMMENDED] | 1280×800 or 640×400 | ⬜ Not created | — |
| Screenshot 3 [RECOMMENDED] | 1280×800 or 640×400 | ⬜ Not created | — |
| Small Promo Tile [RECOMMENDED] | 440×280 | ⬜ Not created | — |
| Marquee Promo Tile | 1400×560 | ⬜ Not created | — |

### Screenshot Notes

**Screenshot 1**: Show the popup in "Connected" state with a token balance visible. Include a browser tab in the background with visible ad-free content.
**Screenshot 2**: Show the "Recent Transactions" history list with a few sample entries.
**Screenshot 3**: Show the login screen (disconnected state) to orient new users.

---

## Permissions Justification

| Permission | Type | Justification |
|------------|------|---------------|
| `storage` | permissions | Stores encrypted session credentials, token balance, transaction history, and announcement data locally on the user's device. |
| `alarms` | permissions | Runs a background heartbeat every 60 seconds to keep the user's session alive and update their token balance without requiring manual refresh. |
| `declarativeNetRequest` | permissions | Core feature — applies server-defined blocking rules to stop ads and trackers from loading on every site the user visits. |
| `declarativeNetRequestFeedback` | permissions | Allows the extension to listen for rule match events so it can record which blocking events occurred and charge the appropriate number of tokens. Note: `onRuleMatchedDebug` is guarded by an availability check and only fires in compatible builds. |
| `cookies` | permissions | Sets an anti-abuse session cookie on the extension's backend API domain to prevent bot traffic from abusing the token system. No user cookies are read or modified. |
| `activeTab` | permissions | Required to send a visual confirmation animation to the currently active tab when a blocking event occurs, so users see that blocking is working. |
| `scripting` | permissions | Injects the visual feedback animation into the active tab when a blocking rule fires. No page content is read or transmitted. |
| `contextMenus` | permissions | Reserved for future right-click menu support. Currently inactive. |
| `unlimitedStorage` | permissions | The blocking ruleset downloaded from the server can grow beyond 5MB as the rule list is updated. Unlimited storage ensures rules are never truncated. |
| `<all_urls>` | host_permissions | The extension's declarativeNetRequest rules apply to network requests on all websites. Without this, the blocking rules cannot match requests made by pages the user visits. No page content is read — only request URLs are matched against the ruleset. |

> **Note on `offscreen` and `identity`**: These permissions should be **removed** from the manifest before submission if they are not actively used by any code path. Unused permissions trigger reviewer scrutiny.

---

## Privacy & Data Use

### Data Collection

**Does the extension collect user data?** Yes

| Data Type | Collected? | Transmitted Off-Device? | Purpose | Shared with Third Parties? |
|-----------|-----------|------------------------|---------|---------------------------|
| Personally identifiable info | No | No | — | No |
| Health info | No | No | — | No |
| Financial info | No | No | — | No |
| Authentication info | Yes (username + hashed) | Yes — sent to letsget API over ECDH-encrypted channel | Login and session management | No |
| Personal communications | No | No | — | No |
| Location | No | No | — | No |
| Web history | No | No | — | No |
| User activity | Yes (rule match events / block counts) | Yes — aggregated event counts sent to letsget API | Token billing: charging the correct number of tokens per blocking event | No |
| Website content | No | No | — | No |

### Data Use Certification

- [x] Data is NOT sold to third parties
- [x] Data is NOT used for purposes unrelated to the extension's core functionality
- [x] Data is NOT used for creditworthiness or lending purposes

---

## Privacy Policy

**Privacy Policy URL** [REQUIRED]
```
TODO: Host at https://letsget.io/privacy or similar.
See references/webstore/privacy-policy.md for a template to generate from.
```

Key points your privacy policy MUST cover:
- What data is collected (username, aggregated block counts)
- How data is encrypted in transit (ECDH + AES-GCM)
- How data is stored locally (AES-GCM encrypted via browser crypto)
- Data retention and deletion procedures
- No sale of data to third parties
- Contact information for data requests

---

## Distribution

**Visibility**: Public
**Regions**: All regions (or restrict as needed for your token payment infrastructure)

---

## Developer Info

**Publisher Name** [REQUIRED]
letsget / [Your name or company]

**Contact Email** [REQUIRED]
support@letsget.io (or your actual support email)

**Support URL / Email** [RECOMMENDED]
WhatsApp and Telegram links are displayed inside the extension dynamically.

**Homepage URL** [RECOMMENDED]
https://letsget.io

---

## Pre-Submission Checklist

Run through these before creating the `.zip`:

### Manifest Fixes
- [ ] Remove `"offscreen"` permission if unused
- [ ] Remove `"identity"` permission if unused
- [ ] Rename extension from `"formUpdate"` to `"letsget"` (or chosen brand name)
- [ ] Update `"description"` to match actual functionality (ad blocking + token billing)
- [ ] Verify all icon files exist and are the correct pixel dimensions (16×16, 48×48, 128×128)

### Code Fixes
- [ ] Remove `setInterval` from `service-worker.js` — use `chrome.alarms` only (the `_gc` alarm already handles the heartbeat)
- [ ] Remove or move `public-key.pem` out of the extension directory before zipping

### Store Assets
- [ ] Create at least 1 screenshot (1280×800 or 640×400)
- [ ] Write and host a privacy policy at a public URL
- [ ] Confirm the 128×128 store icon looks good (no white margin, full bleed)

### Zip for Submission
```bash
cd "/home/yegn/work/New folder"
zip -r letsget-v2.1.0.zip . \
  --exclude "*.pem" \
  --exclude ".git/*" \
  --exclude "CHROMEWEBSTORE.md" \
  --exclude "*.zip"
```

---

## Version History

| Version | Date | Changes | Status |
|---------|------|---------|--------|
| 2.1.0 | 2026-09-30 | Initial CWS submission. Encryption vault, token billing, fireworks feedback. | Draft |

---

## Review Notes

### Known Issues / Limitations
- `declarativeNetRequestFeedback` may draw reviewer attention. The `onRuleMatchedDebug` listener is guarded by a runtime availability check — include this in your reviewer notes.
- `<all_urls>` host permission will require a written justification in the submission form. Use the text from the Permissions Justification table above.
- Obfuscated code in `crypto.js`: CWS policy requires you to be willing to share unobfuscated source on request. Keep the unobfuscated version accessible.

### Rejection History
None yet — first submission.
