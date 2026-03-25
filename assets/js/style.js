function loadCategories(){
    fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then(response=>response.json())
    .then(data=>{
        displaycategoryContainer(data.category)
    })
}
function displaycategoryContainer(category){
    const categoryContainer=document.getElementById("categoryContainer");
    for(const cat of category){
const div=document.createElement("div");
div.innerHTML=
`
   <button onclick="categorywiseVideo(${cat.category_id})">
            ${cat.category}
        </button>

`
categoryContainer.appendChild(div);
    }
}