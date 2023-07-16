const API_Key ="2d7380b3e72e4d92bd56c40ad12b8077";
const url ="https://newsapi.org/v2/everything?q=";

window.addEventListener('load',()=>fetchNews("India"));

async function fetchNews(query){
  const res = await  fetch(`${url}${query}&apiKey=${API_Key}`);
  const data = await res.json();
  bindData(data.articles);
}

function bindData(articles){
    const cardsContainer = document.getElementById('cards-container');
    const newsCardTemplate = document.getElementById('template-news-card')

    cardsContainer.innerHTML="";

    articles.forEach(article=>{
        if(!article.urlToImage) return;
        const cardClone= newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone,article);
        cardsContainer.appendChild(cardClone)
    })
}
function fillDataInCard(cardClone,article){
    const newsImg = cardClone.querySelector('#news-img');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsSource = cardClone.querySelector('#news-source');
    const newsDetails = cardClone.querySelector('#news-details');

newsImg.src = article.urlToImage;
newsTitle.innerHTML=article.title;
newsDetails.innerHTML=article.description;

const date=new Date(article.publishedAt).toLocaleString("en-US",{
timeZone:"Asia/Jakarta"
});
newsSource.innerHTML=`${article.source.name} . ${date}`;

cardClone.firstElementChild.addEventListener('click',() => {
    window.open(article.url,"_blank");
})
}


let curSelectedNav =null;


function onNavItem(id){
    fetchNews(id);
    const navItem =document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav=navItem;
    curSelectedNav.classList.add("active");

}

const searchButton =document.getElementById('search-button');
const searchText =document.getElementById('search-input')

searchButton.addEventListener('click',()=>{
    const query = searchText.value;
    if(!query) return;
    fetchNews(query);

    curSelectedNav?.classList.remove('active');
})

const bar =document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('nav-links');

if(bar){
    bar.addEventListener('click',()=>{
        nav.classList.add('active');
    })
}

if(close){
    close.addEventListener('click',()=>{
        nav.classList.remove('active');

    })
}