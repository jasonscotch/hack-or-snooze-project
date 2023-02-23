"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// show submit form on click on 'submit

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $submitForm.show();
}

$navSubmit.on("click", navSubmitClick);

function navFavoritesClick(evt) {
  console.debug('navFavoritesClick');
  hidePageComponents();
  
  putFavStoriesOnPage();

}

$navFavorites.on("click", navFavoritesClick);

//My stories on click

function navMyStoriesClick(evt) {
  console.debug('navMyStoriesClick');
  hidePageComponents();
  
  putMyStoriesOnPage();

}

$navMyStories.on("click", navMyStoriesClick);

// User Details Page
function navUserProfileClick(evt) {
  console.debug('navUserProfileClick');

  hidePageComponents();
  $userProfile.show();

}
$navUserProfile.on('click', navUserProfileClick);