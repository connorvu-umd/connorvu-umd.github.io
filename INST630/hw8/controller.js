const restaurantController = {
  init: function () {
    const showAllButton = document.querySelector("#showAll");
    const showTopRatedButton = document.querySelector("#showTopRated");
    const showInexpensiveButton = document.querySelector("#showInexpensive");
    const cuisineFilter = document.querySelector("#cuisineFilter");

    showAllButton.addEventListener("click", function () {
      const restaurants = restaurantModel.getAllRestaurants();
      restaurantView.displayRestaurants(restaurants);
      cuisineFilter.value = "";
    });

    showTopRatedButton.addEventListener("click", function () {
      const restaurants = restaurantModel.getTopRatedRestaurants();
      restaurantView.displayRestaurants(restaurants);
      cuisineFilter.value = "";
    });

    showInexpensiveButton.addEventListener("click", function () {
      const restaurants = restaurantModel.getInexpensiveRestaurants();
      restaurantView.displayRestaurants(restaurants);
      cuisineFilter.value = "";
    });

    cuisineFilter.addEventListener("change", function () {
      if (cuisineFilter.value === "") {
        restaurantView.displayRestaurants(restaurantModel.getAllRestaurants());
        return;
      }

      const restaurants = restaurantModel.getRestaurantsByCuisine(cuisineFilter.value);
      restaurantView.displayRestaurants(restaurants);
    });

    restaurantView.displayRestaurants(restaurantModel.getAllRestaurants());
  }
};

restaurantController.init();
