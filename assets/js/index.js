// Global variable to store all videos
let allVideos = [];

// Active button toggle
function setActiveButton(clickedBtn){
    const allButtons = document.querySelectorAll(".category-btn");
    allButtons.forEach(btn => btn.classList.remove("btn-active"));
    clickedBtn.classList.add("btn-active");
}

// Show/Hide Spinner
function showSpinner() {
    const container = document.getElementById("categoryVideoContainer");
    container.innerHTML = `<div class="col-span-full flex justify-center py-10">
        <span class="loading loading-spinner text-accent text-4xl"></span>
    </div>`;
}

// Load all videos in the background (for search)
function preloadAllVideos(){
    fetch("https://openapi.programming-hero.com/api/phero-tube/videos")
    .then(res => res.json())
    .then(data => {
        allVideos = data.videos; // store all videos for search
    });
}

// Load All Videos (on click)
function loadAllVideos(){
    if(allVideos.length === 0){
        showSpinner();
        fetch("https://openapi.programming-hero.com/api/phero-tube/videos")
        .then(res => res.json())
        .then(data => {
            allVideos = data.videos;
            displayAllVideo(allVideos);
        });
    } else {
        displayAllVideo(allVideos);
    }
}

// Category Wise Video
function categorywiseVideo(category_id){
    showSpinner();
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${category_id}`)
    .then(res => res.json())
    .then(data => {
        displayAllVideo(data.category);
    });
}

// Display Videos
function displayAllVideo(videos){
    const container = document.getElementById("categoryVideoContainer");
    container.innerHTML = ""; 

    if(videos.length === 0){
        container.innerHTML = `
            <div class="col-span-full text-center flex flex-col justify-center items-center py-10">
                <img class="w-[120px]" src="./assets/images/Icon.png" alt="">
                <h2 class="text-2xl font-bold text-gray-400 pt-5">No Videos Found</h2>
            </div>
        `;
        return;
    }

    for(const video of videos){
        const div = document.createElement("div");
        div.innerHTML = `
        <div class="card bg-base-100 h-full shadow-sm">
          <figure class="relative">
            <img class="h-48 w-full object-cover" src="${video.thumbnail}" />
          </figure>

          <div class="flex gap-4 p-4">
            <div>
              <h1 class="text-lg font-bold">${video.title}</h1>
              <p class="text-gray-400">${video.authors[0].profile_name}<img class="w-5" src="https://img.icons8.com/?size=100&id=98A4yZTt9abw&format=png&color=000000"></p>
              <p class="text-gray-400">${video.others.views} Views</p>
            </div>
          </div>
        </div>
        `;
        container.appendChild(div);
    }
}

// Search function
function searchVideos(keyword){
    const filtered = allVideos.filter(video => 
        video.title.toLowerCase().includes(keyword.toLowerCase())
    );
    displayAllVideo(filtered);
}

// Load Categories
function loadCategories(){
    fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then(res => res.json())
    .then(data => {
        displaycategoryContainer(data.categories);
        preloadAllVideos(); // preload all videos for search
    });
}

// Display Categories
function displaycategoryContainer(categories){
    const categoryContainer = document.getElementById("categoryContainer");

    // Add "All" button first
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

    // Add category buttons
    for(const cat of categories){
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

// Initial Calls
loadCategories();

// Search input listener
document.querySelector('input[type="search"]').addEventListener('input', function(){
    searchVideos(this.value);
});

//loag blog
function loadBlog(){
    document.getElementById("blogId").addEventListener('click', function(event){
        // Open the blog page in a new tab
        window.open("https://blog.google/products-and-platforms/products/youtube/", "_blank");
    });
}