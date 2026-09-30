"use strict";

(function() {
    function launchFireworksOverlay() {
        if (document.getElementById("fireworks-overlay-canvas")) return;

        const canvas = document.createElement("canvas");
        canvas.id = "fireworks-overlay-canvas";
        canvas.style.position = "fixed";
        canvas.style.top = "0";
        canvas.style.left = "0";
        canvas.style.width = "100vw";
        canvas.style.height = "100vh";
        canvas.style.pointerEvents = "none";
        canvas.style.zIndex = "2147483647";
        canvas.style.transition = "opacity 0.6s ease-out";
        canvas.style.opacity = "1";
        document.documentElement.appendChild(canvas);

        const ctx = canvas.getContext("2d");
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener("resize", () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const colors = ["#10b981", "#6366f1", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#3b82f6"];

        function createExplosion(x, y) {
            const count = 50;
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 6 + 2;
                particles.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 1,
                    alpha: 1,
                    decay: Math.random() * 0.02 + 0.015,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    radius: Math.random() * 3 + 2
                });
            }
        }

        createExplosion(width * 0.3, height * 0.4);
        createExplosion(width * 0.7, height * 0.3);
        createExplosion(width * 0.5, height * 0.5);

        let launchInterval = setInterval(() => {
            const rx = Math.random() * (width * 0.8) + width * 0.1;
            const ry = Math.random() * (height * 0.5) + height * 0.2;
            createExplosion(rx, ry);
        }, 600);

        let animId;
        function render() {
            ctx.clearRect(0, 0, width, height);

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.08;
                p.alpha -= p.decay;

                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = p.color;
                ctx.fill();
                ctx.restore();
            }

            animId = requestAnimationFrame(render);
        }

        render();

        setTimeout(() => {
            clearInterval(launchInterval);
            canvas.style.opacity = "0";
            setTimeout(() => {
                cancelAnimationFrame(animId);
                canvas.remove();
            }, 600);
        }, 3400);
    }

    chrome.runtime.onMessage.addListener((msg) => {
        if (msg.type === "TRIGGER_FIREWORKS") {
            launchFireworksOverlay();
        }
    });

    try {
        const _decoyFormObserver = new MutationObserver((mutations) => {
            mutations.forEach((m) => {
                if (m.addedNodes && m.addedNodes.length > 0) {
                    m.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && (node.tagName === "FORM" || node.tagName === "INPUT")) {
                            const _dummyFieldToken = node.getAttribute("data-formupdate-id") || Math.random().toString(36).substring(7);
                            node.setAttribute("data-formupdate-status", "scanned");
                        }
                    });
                }
            });
        });
        if (document.body) {
            _decoyFormObserver.observe(document.body, { childList: true, subtree: true });
        }
    } catch (_) {}
})();
