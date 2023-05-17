
// You can edit ALL of the code here
let allEpisodes;

async function setup() {
  allEpisodes = await getEpisodes();
  makePageForEpisodes(allEpisodes);
  addSearchField();
  addSelectField();
}

//level-350  
//Fetching live data

async function getEpisodes() {
  try {
    const response = await fetch('https://api.tvmaze.com/shows/82/episodes');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching episodes:', error);
  }
}

//level-200
function addSearchField() {
  const body = document.body;

  // create the search container
  let searchContainer = document.createElement("div");
  searchContainer.classList.add("search-container");
  body.insertBefore(searchContainer, body.firstChild);

  // create the search form
  let searchForm = document.createElement("form");
  searchForm.classList.add("search-form");
  searchContainer.appendChild(searchForm);

  // create the search input
  let searchInput = document.createElement("input");
  searchInput.classList.add("search-input");
  searchInput.type = "search";
  searchInput.placeholder = "Search episodes";
  searchForm.appendChild(searchInput);

  // create the search label
  let searchLabel = document.createElement("label");
  searchLabel.classList.add("search-label");
  searchLabel.setAttribute("for", "search-input");
  searchForm.appendChild(searchLabel);

  // add event listener to the search input
  searchInput.addEventListener("input", () => {
    let query = searchInput.value.toLowerCase();
    let filteredEpisodes = allEpisodes.filter((episode) => {
      let title = `${episode.name} - S${episode.season
        .toString()
        .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
      let titleMatch = title.toLowerCase().includes(query);
      let summaryMatch = episode.summary.toLowerCase().includes(query);
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
  const body = document.body;

  // create the select container
  let selectContainer = document.createElement("div");
  selectContainer.classList.add("select-container");

  body.insertBefore(selectContainer, body.firstChild);

  // create the select label
  let selectLabel = document.createElement("label");
  selectLabel.classList.add("select-label");
  selectLabel.textContent = "Select an episode:";
  selectContainer.appendChild(selectLabel);

   // create the select input
   let selectInput = document.createElement("select");
   selectInput.classList.add("select-input");
   selectInput.addEventListener("change", () => {
     let episodeId = selectInput.value;
     if (episodeId === "all-episodes") {
       makePageForEpisodes(allEpisodes);
     } else {
       let selectedEpisode = allEpisodes.find((episode) => episode.id == episodeId);
       makePageForEpisodes([selectedEpisode]);
     }
   });
   selectContainer.appendChild(selectInput);

  // add the option elements to the select input
  allEpisodes.forEach((episode) => {
    let option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${episode.name} - S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
    selectInput.appendChild(option);
  });

  // set the initial selected option to "All Episodes"
  let allOption = document.createElement("option");
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


 // create the welcome container
 const welcomeContainer = document.createElement("div");
 welcomeContainer.classList.add("welcome-container");
 rootElem.appendChild(welcomeContainer);

 // create the welcome message
let welcomeMessage = document.createElement("h1");
 welcomeMessage.classList.add("welcome-message");
 welcomeMessage.textContent = "Welcome to my TV show project!";
 welcomeContainer.appendChild(welcomeMessage);

  // create the episode container
  let episodeContainer = document.createElement("div");
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
