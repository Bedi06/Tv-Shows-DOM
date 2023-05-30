let allShows;
let allEpisodes;

async function setup() {
  allShows = getAllShows();
  const selectedShowId = allShows[0].id; // Selecting  the first show by default
  allEpisodes = await getEpisodes(selectedShowId);

  createHeader();
  showSelectField(allShows);
  episodeSelectField(allEpisodes);
  addSearchField();
  makePageForEpisodes(allEpisodes);
  createFooter();
}

// Fetching episodes for shows
async function getEpisodes(showId) {
  try {
    const response = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching episodes:', error);
  }
}

// level 400 -adding show selector
function showSelectField(shows) {
  const searchSelectDiv = document.querySelector(".search-select");

  const showContainer = document.createElement("div");
  showContainer.classList.add("show-container");

  const showSelect = document.createElement("select");
  showSelect.classList.add("show-select");
  showSelect.addEventListener("change", () => {
    const selectedShowId = showSelect.value;
    getEpisodes(selectedShowId)
      .then((episodes) => {
        allEpisodes = episodes;
        makePageForEpisodes(allEpisodes);
        updateEpisodeSelect(allEpisodes);
      })
      .catch((error) => console.error(error));
  });

  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelect.appendChild(option);
  });

  showContainer.appendChild(showSelect);
  searchSelectDiv.appendChild(showContainer);
}

//updating the select field to get episodes from all shows
function updateEpisodeSelect(episodes) {
  const episodeSelect = document.querySelector(".episode-select");
  episodeSelect.innerHTML = "";

  const selectOption = document.createElement("option");
  selectOption.value = "select-episode";
  selectOption.textContent = "Select Episode";
  episodeSelect.appendChild(selectOption);

  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${episode.name} - S${episode.season
      .toString()
      .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
    episodeSelect.appendChild(option);
  });
}



//Creating the header of page
function createHeader() {
  const body = document.body;

  // create the header element
  const header = document.createElement("header");
  header.classList.add("header");
  body.insertBefore(header, body.firstChild);

  // create the title div
  const titleHeader = document.createElement("h1");
  titleHeader.classList.add("title");
  titleHeader.textContent = "Cineflix";
  header.appendChild(titleHeader);

  // create the search and select div
  const searchSelectDiv = document.createElement("div");
  searchSelectDiv.classList.add("search-select");
  header.appendChild(searchSelectDiv);
}

//creating footer 
function createFooter() {
  const body = document.body;

  let footer = document.createElement("footer");
  footer.classList.add("footer");

  // create the attribution
  let licensing = document.createElement("p");
  licensing.innerHTML = `This data has (originally) come from <a href="https://www.tvmaze.com/">TVMaze.com</a>`;
  footer.appendChild(licensing);

  // append the footer to the body
  body.appendChild(footer);
}

//level 300-adding an episode selector 
function episodeSelectField(episodes) {
  const searchSelectDiv = document.querySelector(".search-select");

  const episodeSelectContainer = document.createElement("div");
  episodeSelectContainer.classList.add("episode-select-container");

  const episodeSelect = document.createElement("select");
  episodeSelect.classList.add("episode-select");
  episodeSelect.addEventListener("change", () => {
    const episodeId = episodeSelect.value;
    if (episodeId === "select-episode") {
      makePageForEpisodes(allEpisodes);
    } else {
      const selectedEpisode = allEpisodes.find((episode) => episode.id == episodeId);
      makePageForEpisodes([selectedEpisode]);
    }
  });

  const selectOption = document.createElement("option");
  selectOption.value = "select-episode";
  selectOption.textContent = "Select Episode";
  episodeSelect.appendChild(selectOption);

  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${episode.name} - S${episode.season
      .toString()
      .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
    episodeSelect.appendChild(option);
  });

  episodeSelectContainer.appendChild(episodeSelect);
  searchSelectDiv.appendChild(episodeSelectContainer);
}

// Level 200 - Add search field for episodes
function addSearchField() {
  const searchSelectDiv = document.querySelector(".search-select");

  const searchContainer = document.createElement("div");
  searchContainer.classList.add("search-container");

  const searchForm = document.createElement("form");
  searchForm.classList.add("search-form");

  const searchInput = document.createElement("input");
  searchInput.classList.add("search-input");
  searchInput.type = "search";
  searchInput.placeholder = "Search episodes";
  searchInput.id = "search-input";

  const searchLabel = document.createElement("label");
  searchLabel.classList.add("search-label");
  searchLabel.setAttribute("for", "search-input");

  searchForm.appendChild(searchInput);
  searchForm.appendChild(searchLabel);
  searchContainer.appendChild(searchForm);
  searchSelectDiv.appendChild(searchContainer);

  // add event listener to the search input
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter((episode) => {
      const title = `${episode.name} - S${episode.season
        .toString()
        .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
      const titleMatch = title.toLowerCase().includes(query);
      const summaryMatch = episode.summary.toLowerCase().includes(query);
      return titleMatch || summaryMatch;
    });

    // update the episode list with the filtered episodes
    makePageForEpisodes(filteredEpisodes);

    // update the search label with the number of filtered episodes
    searchLabel.textContent = `Displaying ${filteredEpisodes.length} / ${allEpisodes.length} episodes`;
  });

  // set the initial search label text
  searchLabel.textContent = `Displaying ${allEpisodes.length} / ${allEpisodes.length} episodes`;
}





// Level 100 - Building episodes cards
function makePageForEpisodes(episodes) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  // create the episode container
  const episodeContainer = document.createElement("div");
  episodeContainer.classList.add("episode-container");
  rootElem.appendChild(episodeContainer);

  episodes.forEach((episode) => {
    // create the episode card
    let episodeCard = document.createElement("div");
    episodeCard.classList.add("episode-card");
    episodeContainer.appendChild(episodeCard);

    // create the episode title
    let episodeTitle = document.createElement("h2");
    episodeTitle.classList.add("episode-title");
    episodeTitle.textContent = `${episode.name} - S${episode.season
      .toString()
      .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
    episodeCard.appendChild(episodeTitle);

    // create the episode image
    let episodeImage = document.createElement("img");
    episodeImage.classList.add("episode-image");
    episodeImage.src = episode.image ? episode.image.medium : "";
    episodeImage.alt = `Screenshot from ${episode.name} episode`;
    episodeCard.appendChild(episodeImage);

    // create the episode summary
    let episodeSummary = document.createElement("p");
    episodeSummary.classList.add("episode-summary");
    episodeSummary.innerHTML = episode.summary;
    episodeCard.appendChild(episodeSummary);
  });
}


window.onload = setup;
