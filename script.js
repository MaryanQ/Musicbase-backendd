"use strict";

let artists, allAlbums, allTracks;

window.addEventListener("load", start);

async function start() {
  await Getartists();
  await GetAlbums();
  await GetTracks();
}

async function Getartists() {
  const response = await fetch(`
musicbaseee.azurewebsites.net/artists`);
  artists = await response.json();
  displayartists(artists);
}

async function GetAlbums() {
  const response = await fetch(`
musicbaseee.azurewebsites.net/albums`);
  allAlbums = await response.json();
  displayAlbums(allAlbums);
}

async function GetTracks() {
  const response = await fetch(`
musicbaseee.azurewebsites.net/tracks`);
  allTracks = await response.json();
  displayTracks(allTracks);
}

// Function to display artists
async function displayartists(artists) {
  const artistsContainer = document.querySelector("#artists-container");
  artistsContainer.innerHTML = "";

  for (const artist of artists) {
    const html = `
      <div class="grid-item">
        <img class="image" src="${artist.image}" alt="${artist.name}"/>
        <div><h4>${artist.name}</h4>
        <h5>Gender: ${artist.gender}</h5></div>
        <div class="btns-container">
          <button class="btn-delete">Delete</button>
          <button class="btn-edit">Edit</button>
        </div>
      </div>
    `;

    artistsContainer.insertAdjacentHTML("beforeend", html);
  }
}

// Implement functions to display albums and tracks...
async function displayTracks(tracks) {
  const tbody = document.querySelector("#tracks-container");
  tbody.innerHTML = "";

  for (const track of tracks) {
    const html = /*html*/ `
      <tr>
        <td><h4> ${track.name}</h4></td>
        <td>${track.title}</td>
        <td>${track.release_date}</td>
      </tr>
    `;

    tbody.insertAdjacentHTML("beforeend", html);
  }
}

async function displayAlbums(albums) {
  const tbody = document.querySelector("#albums-container");
  tbody.innerHTML = "";

  for (const album of albums) {
    const html = /*html*/ `
      <tr>
        <td class="image2"><img src="${album.image}"></td>
        <td><h4> ${album.title}</h4></td>
        <td>${album.release_date}</td>
      </tr>
    `;

    tbody.insertAdjacentHTML("beforeend", html);
  }
}

// Function for searching

function search() {
  const searchInput = document
    .querySelector("#searchInput")
    .value.toLowerCase();

  if (artists) {
    const filteredArtists = artists.filter((artists) =>
      artists.name.toLowerCase().includes(searchInput)
    );
    displayartists(filteredArtists);
  } else {
    displayartists([]);
  }

  if (allAlbums) {
    const filteredAlbums = allAlbums.filter((allAlbums) =>
      allAlbums.title.toLowerCase().includes(searchInput)
    );
    displayAlbums(filteredAlbums);
  } else {
    displayAlbums([]);
  }

  if (allTracks) {
    const filteredTracks = allTracks.filter((allTracks) =>
      allTracks.title.toLowerCase().includes(searchInput)
    );
    displayTracks(filteredTracks);
  } else {
    displayTracks([]);
  }
}

// Event listener for search form
const searchForm = document.querySelector("#searchform");
searchForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent default form submission
  search(); // Call the search function when the form is submitted
});
