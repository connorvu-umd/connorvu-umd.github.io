# INST 630 MVC Homework Answers

## Part 6: MVC Explanation

**1. What problem does MVC help solve?**

MVC helps organize an application by separating its data and business rules, presentation, and user interaction. This separation makes code easier to understand, test, maintain, and update because a change to one responsibility is less likely to require changes to the others.

**2. Why should the Controller not contain the rule `restaurant.rating >= 4.5`?**

The rating threshold is a business rule, so it belongs in the Model. The Controller should respond to the user's action and ask the Model for the top-rated restaurants, rather than deciding which restaurants qualify. This keeps the rule reusable and prevents business logic from being duplicated across event handlers.

**3. If cards were replaced with a table, which component would change most?**

The View would change most because it is responsible for how restaurant information is presented. The Model could continue providing the same restaurant data, and the Controller could continue coordinating user actions and passing that data to the View.

**4. Does MVC require three separate JavaScript files?**

No. MVC describes the separation of responsibilities, not a required number of files. The Model, View, and Controller can be organized in one file or several files as long as their responsibilities remain clearly separated.

**5. If data came from a REST API, which component should manage it?**

The Model should manage the application's data, including obtaining and organizing data from a REST API. The Controller can request the data through the Model and pass the result to the View, while the View remains responsible for displaying it.

## MVC Detective

**Design problem:** The event handler filters `restaurantModel.restaurants` directly inside the Controller. This puts a business rule in the Controller instead of keeping that rule in the Model.

**Improved version:**

In `model.js`, define a reusable Model method:

```javascript
getTopRatedRestaurants: function () {
  return this.restaurants.filter(function (restaurant) {
    return restaurant.rating >= 4.5;
  });
}
```

In `controller.js`, the event handler should call that method and pass the result to the View:

```javascript
showTopRatedButton.addEventListener("click", function () {
  const topRated = restaurantModel.getTopRatedRestaurants();
  restaurantView.displayRestaurants(topRated);
});
```

The Model owns the rating rule, the Controller coordinates the button click and data flow, and the View displays the returned restaurants.
