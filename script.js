const API_Key ="31e48770331e43d2b13fcc66ccff1cd2";
const url = "https://newsapi.org/v2/everything?q=";

// this is the nav search logic  to find the news related to input element
document.querySelector('.searchBtn').addEventListener('click', function () {
    let search = document.querySelector(".inputSearch");
    collectNews(search.value)

})

// it will collect the news from the api using async and await
async function collectNews(query) {
        const today = new Date().toISOString().split('T')[0];
        const res = await fetch(`${url}${query}&from=publishedAt&to=${today}&sortBy=publishedAt&apiKey=${API_Key}`);        
        const data = await res.json();
        bindData(data.articles);
}


function bindData(articles) {
    // Sort articles by publishedAt date in descending order (latest to oldest)
    articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    
    const cardsContainer = document.getElementById('cards-container');
    const newsCardTemplate = document.querySelector('.news-card');
    
    // Hide the template card initially
    newsCardTemplate.style.display = 'none';

    cardsContainer.innerHTML = "";

    // for general length of page i used 36 as the no. of cards
    const endIndex = Math.min(articles.length, 36); 
    const startIndex = endIndex - 36;  

    // Loop through articles
    for (let i = startIndex; i < endIndex; i++) {
        const article = articles[i];
        if (!article.urlToImage) continue;  // Skip articles without an image
        const cardClone = newsCardTemplate.cloneNode(true);
        
        // Applying dynamic based card position
        if (i === startIndex) {
            cardClone.classList.add('full-width-card');
        } else if (i > startIndex && i <= startIndex + 4) {
            cardClone.classList.add('two-cards-row');
        } else {
            cardClone.classList.add('four-cards-row');
        }

        cardClone.style.display = 'block';

        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    }
}

// function to collect the data from article to container
function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector('.newsImg');
    const newsTitle = cardClone.querySelector('.newsTitle');
    const newsSource = cardClone.querySelector('.newsSource');
    const newsDetails = cardClone.querySelector('.newsDetails');

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;

    // if the description is large it will hide it
    const truncatedDescription = truncateDescription(article.description, 2);
    newsDetails.innerHTML = truncatedDescription;

    // "Read More" button to open the source page
    const readMoreButton = cardClone.querySelector('.read-more-btn');
    readMoreButton.addEventListener('click', () => {
        window.open(article.url, "_blank");
    });

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta"
    });

    newsSource.innerHTML = `${article.source.name} . ${date}`;

    // if someone click anywhere on card it will open source page
    cardClone.firstElementChild.addEventListener('click', () => {
        window.open(article.url, "_blank");
    })
}


// this is the function that will hide the description to lower the length/height of card
function truncateDescription(description, lines) {
    const words = description.split(' ');
    let truncated = '';
    let currentLines = 0;

    for (let word of words) {
        if (currentLines >= lines) break;

        truncated += word + ' ';
        if (word.includes('\n')) {
            currentLines++;
        }
    }

    // Append ellipsis if the description is truncated
    if (words.length > truncated.split(' ').length) {
        truncated += '...';
    }

    return truncated.trim();
}

// this will find the news related to nav items 
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        const category = this.getAttribute('data-category');
        collectNews(category);
    });
});


// this is the universal thing like when page is reloaded or website is opened first time this will work
window.addEventListener('load',()=>collectNews(`indian`));
