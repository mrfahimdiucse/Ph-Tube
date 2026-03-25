// Global variable to store all videos
let allVideos = [];

// Active button toggle
function setActiveButton(clickedBtn) {
  const allButtons = document.querySelectorAll(".category-btn");
  allButtons.forEach((btn) => btn.classList.remove("btn-active"));
  clickedBtn.classList.add("btn-active");
}

// Show Spinner
function showSpinner() {
  const container = document.getElementById("categoryVideoContainer");
  container.innerHTML = `<div class="col-span-full flex justify-center py-10">
      <span class="loading loading-spinner text-accent text-4xl"></span>
  </div>`;
}

// Preload all videos for search
function preloadAllVideos() {
  fetch("https://openapi.programming-hero.com/api/phero-tube/videos")
    .then((res) => res.json())
    .then((data) => {
      allVideos = data.videos;
    });
}

// Load All Videos
function loadAllVideos() {
  if (allVideos.length === 0) {
    showSpinner();
    fetch("https://openapi.programming-hero.com/api/phero-tube/videos")
      .then((res) => res.json())
      .then((data) => {
        allVideos = data.videos;
        displayAllVideo(allVideos);
      });
  } else {
    displayAllVideo(allVideos);
  }
}

// Load Category Wise Videos
function categorywiseVideo(category_id) {
  showSpinner();
  fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${category_id}`)
    .then((res) => res.json())
    .then((data) => {
      displayAllVideo(data.category);
    });
}

// Display Videos
function displayAllVideo(videos) {
  const container = document.getElementById("categoryVideoContainer");
  container.innerHTML = "";

  if (!videos || videos.length === 0) {
    container.innerHTML = `
        <div class="col-span-full text-center flex flex-col justify-center items-center py-10">
            <h2 class="text-2xl font-bold text-gray-400 pt-5">No Videos Found</h2>
        </div>
    `;
    return;
  }

  for (const video of videos) {
    const div = document.createElement("div");
    const author = video.authors[0]; // assuming first author
    const verifiedIcon = author.verified
      ? `<img class="inline w-5 ml-1" src="https://img.icons8.com/?size=100&id=98A4yZTt9abw&format=png&color=000000" alt="verified" />`
      : "";

    div.innerHTML = `
    <div class="card bg-base-100 h-full shadow-sm flex flex-col justify-between">
      <figure class="relative">
        <img class="h-48 w-full object-cover" src="${video.thumbnail}" alt="${video.title}" />
        <span class="bg-black text-white rounded-lg p-2 bottom-2 right-2 absolute">${video.others.posted_date}</span>
      </figure>

      <div class="flex flex-col gap-2 p-4 flex-1">
        <h1 class="text-lg font-bold">${video.title}</h1>
        <div class="flex items-center gap-2">
          <img class="w-8 h-8 rounded-full object-cover" src="${author.profile_picture}" alt="${author.profile_name}" />
          <p class="text-gray-400">${author.profile_name} ${verifiedIcon}</p>
        </div>
        <p class="text-gray-400">${video.others.views} Views</p>
      </div>

      <button class="btn mt-auto" onclick="openVideoModal('${video.video_id}')">See Details</button>
    </div>
    `;
    container.appendChild(div);
  }
}

// Search function
function searchVideos(keyword) {
  const filtered = allVideos.filter((video) =>
    video.title.toLowerCase().includes(keyword.toLowerCase())
  );
  displayAllVideo(filtered);
}

// Load Categories
function loadCategories() {
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => {
      displayCategoryContainer(data.categories);
      preloadAllVideos(); // preload all videos for search
    });
}

// Display Categories
function displayCategoryContainer(categories) {
  const categoryContainer = document.getElementById("categoryContainer");
  categoryContainer.innerHTML = "";

  // "All" button
  const allBtnDiv = document.createElement("div");
  allBtnDiv.innerHTML = `
      <button 
          onclick="loadAllVideos(); setActiveButton(this);" 
          class="btn btn-sm category-btn btn-active"
      >
          All
      </button>
  `;
  categoryContainer.appendChild(allBtnDiv);

  // Category buttons
  for (const cat of categories) {
    const category = document.createElement("div");
    category.innerHTML = `
    <button 
        onclick="categorywiseVideo(${cat.category_id}); setActiveButton(this);" 
        class="btn btn-sm category-btn"
    >
        ${cat.category}
    </button>
    `;
    categoryContainer.appendChild(category);
  }
}

// Modal to show video details
function openVideoModal(videoId) {
  const video = allVideos.find((v) => String(v.video_id) === String(videoId));
  if (!video) return;

  const author = video.authors[0];
  const verifiedIcon = author.verified
    ? `<img class="inline w-5 ml-1" src="./assets/images/verified.png" alt="verified" />`
    : "";

  document.getElementById("modalContent").innerHTML = `
      <h2 id="modalTitle" class="text-2xl font-bold mb-2">${video.title}</h2>
      <div class="flex items-center gap-2 mb-2">
        <img class="w-8 h-8 rounded-full object-cover" src="${author.profile_picture}" alt="${author.profile_name}" />
        <p class="text-gray-500">By: ${author.profile_name} ${verifiedIcon}</p>
      </div>
      <p class="text-gray-500 mb-2">Views: ${video.others.views}</p>
      <p class="text-gray-500 mb-2">Posted on: ${video.others.posted_date}</p>
      <img class="w-full h-48 rounded-lg mb-4 object-cover" src="${video.thumbnail}" alt="${video.title}" />
      <p class="text-gray-700">${video.description || "No description available."}</p>
  `;

  document.getElementById("videoModal").classList.add("show");
  document.getElementById("modalBackdrop").classList.add("show");
}

// Close Modal
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("videoModal").classList.remove("show");
  document.getElementById("modalBackdrop").classList.remove("show");
});
document.getElementById("modalBackdrop").addEventListener("click", () => {
  document.getElementById("videoModal").classList.remove("show");
  document.getElementById("modalBackdrop").classList.remove("show");
});

// Search input listener
document.querySelector('input[type="search"]').addEventListener("input", function () {
  searchVideos(this.value);
});

// Load Blog
document.getElementById("blogId").addEventListener("click", () => {
  window.open("https://blog.google/products-and-platforms/products/youtube/", "_blank");
});

// Initial load
loadCategories();