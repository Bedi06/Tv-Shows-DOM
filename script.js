
// You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  addSearchBar();

}


function addSearchBar() {
  const body = document.body;
  let allEpisodes = [];

  // create the search container
  const searchContainer = document.createElement("div");
  searchContainer.classList.add("search-container");
  body.insertBefore(searchContainer, body.firstChild);

  // create the search form
  const searchForm = document.createElement("form");
  searchForm.classList.add("search-form");
  searchContainer.appendChild(searchForm);

  // create the search input
  const searchInput = document.createElement("input");
  searchInput.classList.add("search-input");
  searchInput.type = "search";
  searchInput.placeholder = "Search episodes";
  searchForm.appendChild(searchInput);

  // create the search label
  const searchLabel = document.createElement("label");
  searchLabel.classList.add("search-label");
  searchLabel.textContent = "Search episodes";
  searchLabel.setAttribute("for", "search-input");
  searchForm.appendChild(searchLabel);

  // fetch the episode data from the API
  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then((response) => response.json())
    .then((data) => {
      allEpisodes = data;
      makePageForEpisodes(allEpisodes);
    })
    .catch((error) => console.log(error));

  // add event listener to the search input
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    let filteredEpisodes = allEpisodes.filter((episode) => {
      const title = `${episode.name} - S${episode.season
        .toString()
        .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
      const summary = episode.summary.toLowerCase();
      return title.includes(query) || summary.includes(query);
    });
    if (query.length > 0) {
      filteredEpisodes.sort((a, b) => {
        const aTitle = `${a.name} - S${a.season
          .toString()
          .padStart(2, "0")}E${a.number.toString().padStart(2, "0")}`;
        const aSummary = a.summary.toLowerCase();
        const aRelevance = aTitle.includes(query)
          ? aTitle.indexOf(query)
          : aSummary.indexOf(query);
        const bTitle = `${b.name} - S${b.season
          .toString()
          .padStart(2, "0")}E${b.number.toString().padStart(2, "0")}`;
        const bSummary = b.summary.toLowerCase();
        const bRelevance = bTitle.includes(query)
          ? bTitle.indexOf(query)
          : bSummary.indexOf(query);
        return aRelevance - bRelevance;
      });
    }
    makePageForEpisodes(filteredEpisodes);
  });
}

//building all episodes
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;

  // create the episode container
  const episodeContainer = document.createElement("div");
  episodeContainer.classList.add("episode-container");
  rootElem.appendChild(episodeContainer);

  episodeList.forEach((episode) => {
    // create the episode card
    let episodeCard = document.createElement("div");
    episodeCard.classList.add("episode-card");
    episodeContainer.appendChild(episodeCard);

    // create the episode info container
    let episodeInfoContainer = document.createElement("div");
    episodeInfoContainer.classList.add("episode-info-container");
    episodeCard.appendChild(episodeInfoContainer);

    // create the episode title
    let episodeTitle = document.createElement("h2");
    episodeTitle.classList.add("episode-title");
    episodeTitle.textContent = `${episode.name} - S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
    episodeInfoContainer.appendChild(episodeTitle);

    // create the episode image container
    let episodeImageContainer = document.createElement("div");
    episodeImageContainer.classList.add("episode-image-container");
    episodeCard.appendChild(episodeImageContainer);

    // create the episode image
    let episodeImage = document.createElement("img");
    episodeImage.classList.add("episode-image");
    episodeImage.src = episode.image.medium;
    episodeImage.alt = `Screenshot from ${episode.name} episode`;
    episodeImageContainer.appendChild(episodeImage);


    // create the episode summary
    let episodeSummary = document.createElement("p");
    episodeSummary.classList.add("episode-summary");
    episodeSummary.innerHTML = episode.summary;
    episodeCard.appendChild(episodeSummary);
  });

 //footer p
 // create the footer
let footer = document.createElement("footer");
footer.classList.add("footer");

// create the attribution
let licensing = document.createElement("p");
licensing.innerHTML = `This data has (originally) come from <a href="https://www.tvmaze.com/">TVMaze.com</a>`;
footer.appendChild(licensing);

// append the footer to the episode container
rootElem.appendChild(footer);

}
//search 

window.onload = setup;
