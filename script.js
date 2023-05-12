// //You can edit ALL of the code here
// function setup() {
//   const allEpisodes = getAllEpisodes();
//   makePageForEpisodes(allEpisodes);
// }

// function makePageForEpisodes(episodeList) {
//   const rootElem = document.getElementById("root");
//   rootElem.textContent = `Got ${episodeList.length} episode(s)`;
// }


// window.onload = setup;
// You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
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

window.onload = setup;
