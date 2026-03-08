(function () {
    "use strict";

    function initTheme() {
        const toggle = document.getElementById("theme-toggle");
        if (!toggle) return;

        if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }

        toggle.addEventListener("click", function () {
            document.body.classList.toggle("dark");
            localStorage.setItem(
                "theme",
                document.body.classList.contains("dark") ? "dark" : "light"
            );
        });
    }

    function initSearch() {
        const form = document.getElementById("search-form");
        const resultsDiv = document.getElementById("results");
        const loadingDiv = document.getElementById("loading");

        if (!form || !resultsDiv || !loadingDiv) return;

        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            const query = document.getElementById("query")?.value?.trim() || "";
            if (!query) return;

            resultsDiv.innerHTML = "";
            loadingDiv.innerHTML =
                '<div class="spinner"></div><span>Searching papers...</span>';
            loadingDiv.className = "loading-spinner";
            loadingDiv.style.display = "flex";

            try {
                const response = await fetch("/search", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({ query: query }),
                });

                const data = await response.json();

                loadingDiv.style.display = "none";

                if (!data.papers || data.papers.length === 0) {
                    resultsDiv.innerHTML =
                        '<p class="results-empty">No papers found.</p>';
                    return;
                }

                data.papers.forEach(function (paper, index) {
                    const card = document.createElement("div");
                    card.className = "paper-card";
                    card.style.animationDelay = (index + 1) * 0.05 + "s";

                    const summaryPoints = normalizeSummaryPoints(
                        paper.summary_points,
                        paper.summary
                    );
                    const published = paper.published
                        ? new Date(paper.published).toLocaleDateString(
                              undefined,
                              {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                              }
                          )
                        : "";

                    // Title
                    const titleEl = document.createElement("h3");
                    const titleText = paper.title || "Untitled";
                    const paperUrl = coerceHttpUrl(paper.url || "");
                    if (paperUrl) {
                        const linkEl = document.createElement("a");
                        linkEl.href = paperUrl;
                        linkEl.target = "_blank";
                        linkEl.rel = "noopener noreferrer";
                        linkEl.textContent = titleText;
                        titleEl.appendChild(linkEl);
                    } else {
                        titleEl.textContent = titleText;
                    }
                    card.appendChild(titleEl);

                    // Meta
                    if (published) {
                        const metaEl = document.createElement("p");
                        metaEl.className = "meta";
                        metaEl.textContent = "Published " + published;
                        card.appendChild(metaEl);
                    }

                    // Summary (bullets)
                    if (summaryPoints.length > 0) {
                        const summaryLabel = document.createElement("p");
                        summaryLabel.className = "section-label";
                        summaryLabel.textContent = "Summary";
                        card.appendChild(summaryLabel);

                        const ul = document.createElement("ul");
                        ul.className = "summary-list";
                        summaryPoints.forEach(function (point) {
                            const li = document.createElement("li");
                            li.textContent = point;
                            ul.appendChild(li);
                        });
                        card.appendChild(ul);
                    } else {
                        const body = paper.summary || paper.abstract || "";
                        if (body) {
                            const summaryLabel = document.createElement("p");
                            summaryLabel.className = "section-label";
                            summaryLabel.textContent = "Summary";
                            card.appendChild(summaryLabel);

                            const p = document.createElement("p");
                            p.className = "summary";
                            p.textContent = body;
                            card.appendChild(p);
                        }
                    }

                    resultsDiv.appendChild(card);
                });
            } catch (err) {
                loadingDiv.style.display = "none";
                resultsDiv.innerHTML =
                    '<p class="results-error">Error fetching papers.</p>';
            }
        });
    }

    function normalizeSummaryPoints(summaryPoints, summaryText) {
        if (Array.isArray(summaryPoints)) {
            return summaryPoints
                .map(function (p) {
                    return (p || "").toString().trim();
                })
                .filter(Boolean);
        }

        const text = (summaryText || "").toString();
        if (!text) return [];

        const lines = text
            .split(/\r?\n/)
            .map(function (line) {
                return line.trim();
            })
            .filter(Boolean);

        const bullets = lines
            .map(function (line) {
                return line.replace(/^[-•*]\s+/, "").trim();
            })
            .filter(Boolean);

        // Only treat it as bullets if it really looks like a bullet list.
        const looksBulleted = lines.some(function (line) {
            return /^[-•*]\s+/.test(line);
        });

        return looksBulleted ? bullets : [];
    }

    function coerceHttpUrl(url) {
        const raw = (url || "").toString().trim();
        if (!raw) return "";
        if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
        return "";
    }

    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    /* ===== INTERACTIVE PARTICLE BACKGROUND ===== */
    function initParticles() {
        var canvas = document.getElementById("bg-canvas");
        if (!canvas) return;
        var ctx = canvas.getContext("2d");

        var mouse = { x: -9999, y: -9999 };
        var PARTICLE_COUNT = 80;
        var CONNECT_DIST = 140;
        var MOUSE_RADIUS = 160;
        var particles = [];
        var w, h;

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener("resize", resize);

        document.addEventListener("mousemove", function (e) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        document.addEventListener("mouseleave", function () {
            mouse.x = -9999;
            mouse.y = -9999;
        });

        // Touch support
        document.addEventListener("touchmove", function (e) {
            if (e.touches.length > 0) {
                mouse.x = e.touches[0].clientX;
                mouse.y = e.touches[0].clientY;
            }
        }, { passive: true });
        document.addEventListener("touchend", function () {
            mouse.x = -9999;
            mouse.y = -9999;
        });

        function Particle() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 2 + 1;
        }

        Particle.prototype.update = function () {
            // Mouse interaction: push away gently
            var dx = this.x - mouse.x;
            var dy = this.y - mouse.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MOUSE_RADIUS && dist > 0) {
                var force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                this.vx += (dx / dist) * force * 0.4;
                this.vy += (dy / dist) * force * 0.4;
            }

            // Damping
            this.vx *= 0.98;
            this.vy *= 0.98;

            this.x += this.vx;
            this.y += this.vy;

            // Wrap around edges
            if (this.x < 0) this.x = w;
            if (this.x > w) this.x = 0;
            if (this.y < 0) this.y = h;
            if (this.y > h) this.y = 0;
        };

        for (var i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }

        function getColors() {
            var dark = document.body.classList.contains("dark");
            return {
                dot: dark
                    ? "rgba(129, 140, 248, 0.7)"
                    : "rgba(99, 102, 241, 0.45)",
                line: dark
                    ? "rgba(129, 140, 248, %%ALPHA%%)"
                    : "rgba(99, 102, 241, %%ALPHA%%)",
                mouseLine: dark
                    ? "rgba(34, 211, 238, %%ALPHA%%)"
                    : "rgba(6, 182, 212, %%ALPHA%%)",
            };
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);
            var colors = getColors();

            // Update positions
            for (var i = 0; i < particles.length; i++) {
                particles[i].update();
            }

            // Draw connections
            for (var i = 0; i < particles.length; i++) {
                for (var j = i + 1; j < particles.length; j++) {
                    var dx = particles[i].x - particles[j].x;
                    var dy = particles[i].y - particles[j].y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECT_DIST) {
                        var alpha = ((1 - dist / CONNECT_DIST) * 0.35).toFixed(3);
                        ctx.strokeStyle = colors.line.replace("%%ALPHA%%", alpha);
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }

                // Draw lines to mouse cursor
                var mdx = particles[i].x - mouse.x;
                var mdy = particles[i].y - mouse.y;
                var mDist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (mDist < MOUSE_RADIUS) {
                    var mAlpha = ((1 - mDist / MOUSE_RADIUS) * 0.5).toFixed(3);
                    ctx.strokeStyle = colors.mouseLine.replace("%%ALPHA%%", mAlpha);
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }

            // Draw particles
            ctx.fillStyle = colors.dot;
            for (var i = 0; i < particles.length; i++) {
                ctx.beginPath();
                ctx.arc(
                    particles[i].x,
                    particles[i].y,
                    particles[i].radius,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }

            requestAnimationFrame(draw);
        }

        requestAnimationFrame(draw);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            initTheme();
            initSearch();
            initParticles();
        });
    } else {
        initTheme();
        initSearch();
        initParticles();
    }
})();
