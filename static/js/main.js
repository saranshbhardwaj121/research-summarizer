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

                    const body = paper.summary || paper.abstract || "";
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

                    card.innerHTML =
                        '<h3>' +
                        escapeHtml(paper.title || "Untitled") +
                        "</h3>" +
                        (published
                            ? '<p class="meta">Published ' +
                              escapeHtml(published) +
                              "</p>"
                            : "") +
                        (body
                            ? '<p class="abstract">' +
                              escapeHtml(body) +
                              "</p>"
                            : "");

                    resultsDiv.appendChild(card);
                });
            } catch (err) {
                loadingDiv.style.display = "none";
                resultsDiv.innerHTML =
                    '<p class="results-error">Error fetching papers.</p>';
            }
        });
    }

    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            initTheme();
            initSearch();
        });
    } else {
        initTheme();
        initSearch();
    }
})();
