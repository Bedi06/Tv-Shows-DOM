//Setting global variables

let allShows;
let allEpisodes;
let isShowsListing = true;
let episodeSelectContainer;
let searchContainer;
let showSearchInput;
let showSelect;
let searchInput;
let episodeSelect;
let showSearchContainer;

async function setup() {
  allShows = await getAllShows();
  const selectedShowId = allShows[0].id; // Selecting the first show by default
  allEpisodes = await getEpisodes(selectedShowId);
  createHeader();
  createShowSearch();
  showSelectField(allShows);
  showListing();
  createFooter();
}

// Fetching episodes for shows
function getEpisodes(showId) {
  return fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error fetching episodes");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching episodes:", error);
    });
}

function backToShows() {
  let rootElem = document.getElementById("root");

  let showsButton = document.createElement("button");
  showsButton.classList.add("backToShows");

  showsButton.textContent = "Back to Shows";

  showsButton.addEventListener("click", function () {
    showListing();
  });
  rootElem.appendChild(showsButton);
}

function searchShows(searchValue, showSelect) {
  let searchResults;

  if (searchValue !== "") {
    searchResults = allShows.filter((show) => {
      // Search through show names, genres, and summary texts
      const { name, genres, summary } = show;
      const lowerCaseName = name.toLowerCase();
      const lowerCaseGenres = genres.join(", ").toLowerCase();
      const lowerCaseSummary = summary.toLowerCase();

      return (
        lowerCaseName.includes(searchValue) ||
        lowerCaseGenres.includes(searchValue) ||
        lowerCaseSummary.includes(searchValue)
      );
    });

    addSelectOption(showSelect, "Select Show");
  } else {
    searchResults = allShows;
  }

  while (showSelect.firstChild) {
    showSelect.removeChild(showSelect.firstChild);
  }

  searchResults.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelect.appendChild(option);
  });
  const resultsLabel = document.querySelector(".search-results-label");
  if (searchValue !== "") {
    resultsLabel.textContent = `Found ${searchResults.length} shows`;
    resultsLabel.style.display = "inline-flex";
  } else {
    resultsLabel.style.display = "none";
  }
}

function createShowSearch() {
  const showSearch = document.querySelector(".search-select");

  showSearchContainer = document.createElement("div");
  showSearchContainer.classList.add("show-search-container");

  const searchLabel = document.createElement("label");
  searchLabel.textContent = "Filtering for...";
  searchLabel.setAttribute("for", "show-search-input");

  const showSearchInput = document.createElement("input");
  showSearchInput.setAttribute("id", "show-search-input");
  showSearchInput.setAttribute("type", "text");

  const resultsLabel = document.createElement("label");
  resultsLabel.classList.add("search-results-label");
  resultsLabel.textContent = "";
  resultsLabel.style.display = "none";

  showSearchContainer.appendChild(searchLabel);
  showSearchContainer.appendChild(showSearchInput);
  showSearchContainer.appendChild(resultsLabel);

  showSearchInput.addEventListener("input", handleSearchInput);

  function handleSearchInput() {
    showSearchInput.removeAttribute("placeholder");

    const searchValue = showSearchInput.value.toLowerCase();
    let searchResults;

    if (searchValue !== "") {
      searchResults = allShows.filter((show) => {
        const { name, genres, summary } = show;
        const lowerCaseName = name.toLowerCase();
        const lowerCaseGenres = genres.join(", ").toLowerCase();
        const lowerCaseSummary = summary.toLowerCase();

        return (
          lowerCaseName.includes(searchValue) ||
          lowerCaseGenres.includes(searchValue) ||
          lowerCaseSummary.includes(searchValue)
        );
      });
    } else {
      searchResults = allShows;
    }
    showListing(searchValue);

    while (showSelect.firstChild) {
      showSelect.removeChild(showSelect.firstChild);
    }

    searchResults.forEach((show) => {
      const option = document.createElement("option");
      option.value = show.id;
      option.textContent = show.name;
      showSelect.appendChild(option);
    });

    if (searchResults.length > 0 && searchValue !== "") {
      resultsLabel.textContent = `Found ${searchResults.length} shows`;
      resultsLabel.style.display = "inline";
    } else {
      resultsLabel.style.display = "none";
    }
  }

  showSearch.appendChild(showSearchContainer);

  return showSearchContainer;
}

function showListing(searchValue = "") {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  // Create the show container
  const showContainer = document.createElement("div");
  showContainer.classList.add("show-container");
  rootElem.appendChild(showContainer);

  if (episodeSelectContainer) {
    // Hiding the episode select field if
    episodeSelectContainer.style.display = "none";
  }

  allShows.forEach((show) => {
    const lowerCaseName = show.name.toLowerCase();
    const lowerCaseGenres = show.genres.join(", ").toLowerCase();
    const lowerCaseSummary = show.summary.toLowerCase();

    if (
      searchValue === "" ||
      lowerCaseName.includes(searchValue.toLowerCase()) ||
      lowerCaseGenres.includes(searchValue.toLowerCase()) ||
      lowerCaseSummary.includes(searchValue.toLowerCase())
    ) {
      const showCard = createShowCard(show);
      showContainer.appendChild(showCard);
    }
  });
}

//level-500 Display shows
function createShowCard(show) {
  // Creating the show card
  const showCard = document.createElement("div");
  showCard.classList.add("show-card");

  const showName = document.createElement("h2");
  showName.classList.add("show-name");
  showName.textContent = show.name;
  showCard.appendChild(showName);

  const showDetails = document.createElement("div");
  showDetails.classList.add("show-details");
  showCard.appendChild(showDetails);

  // Creating a div to wrap the image and summary
  const imageSummaryDiv = document.createElement("div");
  imageSummaryDiv.classList.add("image-summary");
  showDetails.appendChild(imageSummaryDiv);

  const showImage = document.createElement("img");
  showImage.classList.add("show-image");
  showImage.src = show.image ? show.image.medium : "";
  showImage.alt = `Poster of ${show.name}`;
  imageSummaryDiv.appendChild(showImage);

  const showSummary = document.createElement("p");
  showSummary.classList.add("show-summary");
  showSummary.innerHTML = show.summary;
  imageSummaryDiv.appendChild(showSummary);

  // Creating a div to wrap the additional details
  const additionalDetailsDiv = document.createElement("div");
  additionalDetailsDiv.classList.add("additional-details");
  showDetails.appendChild(additionalDetailsDiv);

  const showRated = document.createElement("p");
  showRated.classList.add("show-rated");
  showRated.textContent = `Rated: ${show.rating.average}`;
  additionalDetailsDiv.appendChild(showRated);

  const showGenres = document.createElement("p");
  showGenres.classList.add("show-genres");
  showGenres.textContent = `Genres: ${show.genres.join(", ")}`;
  additionalDetailsDiv.appendChild(showGenres);

  const showStatus = document.createElement("p");
  showStatus.classList.add("show-status");
  showStatus.textContent = `Status: ${show.status}`;
  additionalDetailsDiv.appendChild(showStatus);

  const showRuntime = document.createElement("p");
  showRuntime.classList.add("show-runtime");
  showRuntime.textContent = `Runtime: ${show.runtime} minutes`;
  additionalDetailsDiv.appendChild(showRuntime);

  // Add click event listener to show name -- back to show button TO BE DONE
  showName.addEventListener("click", () => {
    getEpisodes(show.id)
      .then((episodes) => {
        allEpisodes = episodes;
        hideShowListing();
        showSelectField(allShows);
        episodeSelectField(episodes);
        addSearchField();
        makePageForEpisodes(allEpisodes);
        updateEpisodeSelect(allEpisodes);
        backToShows();
      })
      .catch((error) => console.error(error));
  });

  return showCard;
}

function hideShowListing() {
  const showContainer = document.querySelector(".show-container");
  showContainer.style.display = "none";
  if (showSearchContainer) {
    showSearchContainer.style.display = "none";
  }
}
// Function to remove the episode select field
function removeEpisodeSelectField() {
  if (episodeSelectContainer && episodeSelectContainer.parentNode) {
    episodeSelectContainer.parentNode.removeChild(episodeSelectContainer);
  }
}

// Function to remove the search field
function removeSearchField() {
  if (searchContainer && searchContainer.parentNode) {
    searchContainer.parentNode.removeChild(searchContainer);
  }
  searchContainer = null;
}

function hideShowSearchField() {
  const showSearchContainer = document.querySelector(".show-search-container");
  if (showSearchContainer) {
    showSearchContainer.style.display = "none";
  }
}

function addSelectOption(selectElement, optionText) {
  const defaultOption = document.createElement("option");
  defaultOption.value = "select-show";
  defaultOption.textContent = optionText;
  selectElement.appendChild(defaultOption);
}

function showSelectField(shows) {
  const searchSelectDiv = document.querySelector(".search-select");

  const showContainer = document.createElement("div");
  showContainer.classList.add("show-container");

  showSelect = document.createElement("select");
  showSelect.classList.add("show-select");
  showSelect.addEventListener("change", handleShowSelectChange);

  addSelectOption(showSelect, "Select Show");

  shows.sort((a, b) => a.name.localeCompare(b.name));

  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelect.appendChild(option);
  });

  showContainer.appendChild(showSelect);
  searchSelectDiv.appendChild(showContainer);
}

function handleShowSelectChange() {
  const selectedShowId = showSelect.value;
  if (selectedShowId !== "select-show") {
    getEpisodes(selectedShowId)
      .then((episodes) => {
        allEpisodes = episodes;
        makePageForEpisodes(allEpisodes);

        // Checking if the episode select field already exists
        if (!episodeSelectContainer) {
          // If it doesn't exist, add we add episode select field
          episodeSelectField(allEpisodes);
        } else {
          // If it exists, we update its options with the new episodes
          updateEpisodeSelect(allEpisodes);
        }

        // Checking if the search field already exists
        if (!searchContainer) {
          // If it doesn't exist,we  add the search field
          addSearchField();
        }

        // Updating the search label text
        const searchLabel = document.querySelector(".search-label");
        searchLabel.textContent = `Displaying ${allEpisodes.length} / ${allEpisodes.length} episodes`;
      })
      .catch((error) => console.error(error));
  } else {
    showListing(allShows);
    searchShows();

    // Removing the episode select field and search field when we display shows
    removeEpisodeSelectField();
    removeSearchField();
  }
}

// Updating the select field to get episodes from all shows
function updateEpisodeSelect(episodes) {
  const episodeSelect = document.querySelector(".episode-select");
  if (episodes.length > 0) {
    // Showing the episode select field
    episodeSelectContainer.parentNode.style.display = "inline-flex";
  } else {
    // Hiding the episode select field
    episodeSelectContainer.parentNode.style.display = "none";
  }
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

// Level 300 - Adding an episode selector
function episodeSelectField(episodes) {
  const searchSelectDiv = document.querySelector(".search-select");

  episodeSelectContainer = document.createElement("div");
  episodeSelectContainer.classList.add("episode-select-container");

  const episodeSelect = document.createElement("select");
  episodeSelect.classList.add("episode-select");
  episodeSelect.addEventListener("change", () => {
    const episodeId = episodeSelect.value;
    if (episodeId === "select-episode") {
      makePageForEpisodes(allEpisodes);
    } else {
      const selectedEpisode = allEpisodes.find(
        (episode) => episode.id == episodeId
      );
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

  hideShowSearchField();
  // Hiding the search field for shows in the episodes display
}

// Level 200 - Adding search field for episodes
function addSearchField() {
  const searchSelectDiv = document.querySelector(".search-select");

  searchContainer = document.createElement("div");
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

  // adding event listener to the search input
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

    // updating the episode list with the filtered episodes
    makePageForEpisodes(filteredEpisodes);

    // updating the search label with the number of filtered episodes
    searchLabel.textContent = `Displaying ${filteredEpisodes.length} / ${allEpisodes.length} episodes`;
  });

  // setting the initial search label text
  searchLabel.textContent = `Displaying ${allEpisodes.length} / ${allEpisodes.length} episodes`;
}

//Creating the header of page
function createHeader() {
  const body = document.body;

  const header = document.createElement("header");
  header.classList.add("header");
  body.insertBefore(header, body.firstChild);

  const titleAnchor = document.createElement("a");
  titleAnchor.setAttribute("href", "#");
  titleAnchor.classList.add("title");
  titleAnchor.textContent = "Cineflix";
  header.appendChild(titleAnchor);

  const searchSelectDiv = document.createElement("div");
  searchSelectDiv.classList.add("search-select");
  header.appendChild(searchSelectDiv);

  titleAnchor.addEventListener("click", function (event) {
    event.preventDefault();
    showListing();
  });
}

//creating footer
function createFooter() {
  const body = document.body;

  let footer = document.createElement("footer");
  footer.classList.add("footer");

  // creating the attribution
  let licensing = document.createElement("p");
  licensing.innerHTML = `This data has (originally) come from <a href="https://www.tvmaze.com/">TVMaze.com</a>`;
  footer.appendChild(licensing);

  // appending it to the footer to the body
  body.appendChild(footer);
}

// Level 100 - Building episodes cards
function makePageForEpisodes(episodes) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  const episodeContainer = document.createElement("div");
  episodeContainer.classList.add("episode-container");
  rootElem.appendChild(episodeContainer);

  episodes.forEach((episode) => {
    let episodeCard = document.createElement("div");
    episodeCard.classList.add("episode-card");
    episodeContainer.appendChild(episodeCard);

    let episodeTitle = document.createElement("h2");
    episodeTitle.classList.add("episode-title");
    episodeTitle.textContent = `${episode.name} - S${episode.season
      .toString()
      .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
    episodeCard.appendChild(episodeTitle);

    let episodeImage = document.createElement("img");
    episodeImage.classList.add("episode-image");
    episodeImage.src = episode.image ? episode.image.medium : "";
    episodeImage.alt = `Screenshot from ${episode.name} episode`;
    episodeCard.appendChild(episodeImage);

    let episodeSummary = document.createElement("p");
    episodeSummary.classList.add("episode-summary");
    episodeSummary.innerHTML = episode.summary;
    episodeCard.appendChild(episodeSummary);
  });
}

window.onload = setup;
