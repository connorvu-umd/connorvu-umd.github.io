const restaurantModel = {
  restaurants: [
    { name: "Milano's", cuisine: "Italian", rating: 4.5, priceRange: "$$" },
    { name: "Sakura Sushi", cuisine: "Japanese", rating: 4.2, priceRange: "$$$" },
    { name: "The Brass Elephant", cuisine: "American", rating: 4.8, priceRange: "$$$" },
    { name: "Pho Corner", cuisine: "Vietnamese", rating: 4.3, priceRange: "$" },
    { name: "Tandoor Palace", cuisine: "Indian", rating: 4.1, priceRange: "$" }
  ],

  getAllRestaurants: function () {
    return this.restaurants;
  },

  getTopRatedRestaurants: function () {
    return this.restaurants.filter(function (restaurant) {
      return restaurant.rating >= 4.5;
    });
  },

  getInexpensiveRestaurants: function () {
    return this.restaurants.filter(function (restaurant) {
      return restaurant.priceRange === "$";
    });
  },

  getRestaurantsByCuisine: function (cuisine) {
    return this.restaurants.filter(function (restaurant) {
      return restaurant.cuisine === cuisine;
    });
  }
};

// priceRange belongs in the Model because it is part of each restaurant's data.
// Keeping it there lets the application use the same price information for display
// and filtering without duplicating business data in the View or Controller.
