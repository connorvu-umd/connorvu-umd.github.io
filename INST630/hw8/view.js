const restaurantView = {
  displayRestaurants: function (restaurants) {
    const container = document.querySelector("#restaurantList");
    container.innerHTML = "";

    if (restaurants.length === 0) {
      container.innerHTML = "<p class=\"empty-message\">No restaurants found.</p>";
      return;
    }

    restaurants.forEach(function (restaurant) {
      const card = document.createElement("div");
      card.classList.add("restaurant-card");

      const name = document.createElement("h2");
      name.textContent = restaurant.name;

      const cuisine = document.createElement("p");
      cuisine.textContent = restaurant.cuisine;

      const rating = document.createElement("p");
      rating.textContent = "Rating: " + restaurant.rating;

      const price = document.createElement("p");
      price.textContent = "Price: " + restaurant.priceRange;

      card.appendChild(name);
      card.appendChild(cuisine);
      card.appendChild(rating);
      card.appendChild(price);
      container.appendChild(card);
    });
  }
};
