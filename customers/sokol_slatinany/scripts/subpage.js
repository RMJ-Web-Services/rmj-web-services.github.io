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
document.addEventListener("DOMContentLoaded", async () => {
  await loadContent(location.href);

  const htmlFile = mapQueryToFile(location.href);

  menuLinks.forEach((link) => {
    if (!isExternalLink(link.href) && mapQueryToFile(link.href) === htmlFile) {
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
async function loadContent(url) {
  const htmlFile = mapQueryToFile(url);

  try {
    const res = await fetch(htmlFile);
    const html = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const newContent = doc.querySelector(".content");
    const currentContent = document.querySelector(".content");

    if (newContent && currentContent) {
      currentContent.innerHTML = newContent.innerHTML;

      // reveal AFTER content is replaced
      currentContent.style.visibility = "visible";
    } else {
      console.error("No content found in", htmlFile);
    }
  } catch (err) {
    console.error("Failed to load content:", err);
  }
}

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

  return "index.html"; // default page if none found
}

function isExternalLink(url) {
  try {
    const linkUrl = new URL(url, location.href);
    return linkUrl.origin !== location.origin;
  } catch (e) {
    // If URL parsing fails, treat as external to be safe
    return true;
  }
}
