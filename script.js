
// You can edit ALL of the code here
let allEpisodes;

async function setup() {
  allEpisodes = await getEpisodes();
  createHeader();
  addSelectField();
  addSearchField();
  makePageForEpisodes(allEpisodes);
  createFooter();
}

// Fetching live data
async function getEpisodes() {
  try {
    const response = await fetch('https://api.tvmaze.com/shows/82/episodes');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching episodes:', error);
  }
}

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
function createFooter() {
  const body = document.body;

  // create the footer
  let footer = document.createElement("footer");
  footer.classList.add("footer");

  // create the attribution
  let licensing = document.createElement("p");
  licensing.innerHTML = `This data has (originally) come from <a href="https://www.tvmaze.com/">TVMaze.com</a>`;
  footer.appendChild(licensing);

  // append the footer to the body
  body.appendChild(footer);
}

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
  searchInput.id = "search-input"; // Assign a unique id to the search input field


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
    searchLabel.textContent = `Displaying ${filteredEpisodes.length} /73 episode(s)`;
  });

  // set the initial search label text
  searchLabel.textContent = `Displaying ${allEpisodes.length} /73 episode(s)`;
}

//level-300 
function addSelectField() {
  const searchSelectDiv = document.querySelector(".search-select");

  const selectContainer = document.createElement("div");
  selectContainer.classList.add("select-container");

  const selectLabel = document.createElement("label");
  selectLabel.classList.add("select-label");
  selectLabel.textContent = "Select an episode:";

  const selectInput = document.createElement("select");
  selectInput.classList.add("select-input");
  selectInput.addEventListener("change", () => {
    const episodeId = selectInput.value;
    if (episodeId === "all-episodes") {
      makePageForEpisodes(allEpisodes);
    } else {
      const selectedEpisode = allEpisodes.find((episode) => episode.id == episodeId);
      makePageForEpisodes([selectedEpisode]);
    }
  });
  selectContainer.appendChild(selectLabel);
  selectContainer.appendChild(selectInput);
  searchSelectDiv.appendChild(selectContainer);

  // add the option elements to the select input
  allEpisodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${episode.name} - S${episode.season
      .toString()
      .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
    selectInput.appendChild(option);
  });

  // set the initial selected option to "All Episodes"
  const allOption = document.createElement("option");
  allOption.value = "all-episodes";
  allOption.textContent = "All Episodes";
  selectInput.insertBefore(allOption, selectInput.firstChild);
  selectInput.value = allOption.value;
}
//level -100
//building all episodes
function makePageForEpisodes(allEpisodes) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  // create the episode container
  const episodeContainer = document.createElement("div");
  episodeContainer.classList.add("episode-container");
  rootElem.appendChild(episodeContainer);

  allEpisodes.forEach((episode) => {
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

  
}

window.onload = setup;
