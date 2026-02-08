// Select all menu links
const menuLinks = document.querySelectorAll("ul li a");

const queryToFileMap = {
  uvod: "index.html",
  jednota: "o-jednote.html",
  clenske: "prihlaseni-clena-placeni-clenskych-prispevku.html",
  sokolovna: "sokolovna.html",
  kontakty: "kontakty.html",
  oddily: "oddily.html",
  budouciAkce: "kalendar-akci.html",
  partneri: "partneri.html",
  kestazeni: "ke-stazeni.html",
  tanecni: "tanecni-kurzy.html",
  tanecni2: "pokracovaci-kurzy.html",
  cvicenidospelych: "cviceni-dospelych.html",
  cvicenideti: "cviceni-deti.html", // the special case
};

// When the page first loads, load the content matching the query
document.addEventListener("DOMContentLoaded", () => {
  loadContent(location.href);

  // Optional: update active menu link
  const htmlFile = mapQueryToFile(location.href);
  menuLinks.forEach((link) => {
    // check if the link corresponds to this HTML file
    if (mapQueryToFile(link.href) === htmlFile) {
      link.classList.add("aktualni");
    } else {
      link.classList.remove("aktualni");
    }
  });
});

menuLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    // If it’s an external link, do nothing
    if (isExternalLink(this.href)) return;

    e.preventDefault(); // prevent page reload for internal links

    // Update active menu
    menuLinks.forEach((a) => a.classList.remove("aktualni"));
    this.classList.add("aktualni");

    // Load content dynamically
    loadContent(this.href);

    // Update browser URL
    history.pushState(null, "", this.href);
  });
});

// Handle browser back/forward buttons
window.addEventListener("popstate", () => {
  loadContent(location.href);
});

// Function to fetch and insert content
function loadContent(url) {
  const htmlFile = mapQueryToFile(url);

  fetch(htmlFile)
    .then((res) => res.text())
    .then((html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const content = doc.querySelector(".content");
      if (content) {
        document.querySelector(".content").innerHTML = content.innerHTML;
      } else {
        console.error("No content found in", htmlFile);
      }
    })
    .catch((err) => console.error("Failed to load content:", err));
}

// Handle browser back/forward navigation
window.addEventListener("popstate", () => {
  // Reload the current URL's content
  loadContent(location.href);
});

function mapQueryToFile(url) {
  const fullUrl = new URL(url, location.origin);
  const params = fullUrl.searchParams;

  // find the parameter that isn’t 'cz'
  for (const key of params.keys()) {
    if (key !== "cz") {
      // Check mapping first
      if (queryToFileMap[key]) {
        return queryToFileMap[key];
      }
      // Default fallback
      return key + ".html";
    }
  }

  return "uvod.html"; // default page if none found
}
