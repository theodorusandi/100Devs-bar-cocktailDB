import getRandomInt from "./util.js";

const list = document.querySelector(".list");

let bar = null;

const openBar = async () => {
  const todaysIngredients = await getIngredients();
  todaysIngredients.forEach(ingredient => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.innerText = ingredient.strIngredient1;
    button.addEventListener("click", () => {
      if (bar !== null) {
        closeBar();
      } 
      
      initCarousel(ingredient.strIngredient1);  
      
    });
    li.appendChild(button);
    list.appendChild(li);
  })
};

const closeBar = () => {
  clearInterval(bar);
  bar = null;
  const slideContainer = document.querySelector(".slide-container");
  slideContainer.innerHTML = "";
  slideContainer.style.transform = "translateX(0)";
}

const getIngredients = async () => {
  const ingredients = await fetch(
    "https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list"
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data.drinks;
    })
    .catch((err) => {
      console.error(err);
    });

    // get 5 random ingredients
    const startIdx = getRandomInt(0, 94);
    const numOfIngredients = Math.min(5, ingredients.length);
    const todaysIngredients = ingredients.slice(startIdx, startIdx + numOfIngredients);

    return todaysIngredients;
};

const getDrinks = async (ingredient) => {
  const drinks = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`)
    .then(res => {
      return res.json();
    })
    .then(data => {
      return data.drinks;
    })
    .catch(err => {
      console.error(err)
    })

    const todaysDrinks = drinks.slice(0, drinks.length);

    return todaysDrinks;
}

const initCarousel = async (ingredient) => {  
  const slideContainer = document.querySelector(".slide-container");
  const todaysDrinks = await getDrinks(ingredient);

  todaysDrinks.forEach(drink => {
    const slideDiv = document.createElement("div");
    const slideImg = document.createElement("img");
    const slideText = document.createElement("h3");

    slideImg.setAttribute("src", drink.strDrinkThumb);
    slideText.innerText = drink.strDrink;
    slideDiv.classList.add("slide");
    slideDiv.appendChild(slideImg);
    slideDiv.appendChild(slideText);
    slideContainer.appendChild(slideDiv);
  })

  const slides = slideContainer.children;

  slides[0].classList.add("current");
  for (let i = 0; i < slides.length; i++) {
    const width = slides[i].getBoundingClientRect().width;
    const dist = width * i;
    slides[i].setAttribute("data-dist", dist);
    slides[i].style.left = `${dist}px`;
  }

  const startSlide = () => {
    let current = slideContainer.querySelector(".current");
    let next = current.nextElementSibling || slides[0];

    slideContainer.style.transform = `translateX(${-next.dataset.dist}px)`;

    current.classList.remove("current");
    next.classList.add("current");
  };

  bar = setInterval(() => {
    startSlide();
  }, 3000);

};

openBar();