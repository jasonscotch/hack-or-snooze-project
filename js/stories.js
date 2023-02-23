"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDelete = false) {
  //console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  const showFav = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
      ${showDelete ? deleteBtn() : ''}  
      ${showFav ? starHTML(story, currentUser) : ""}
      ${showDelete ? editBtn() : ''}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function starHTML(story, user) {
  const isFav = user.isFavorite(story);
  const starType = isFav ? "fas" : "far";
  return `
      <span class="favorite">
        <i class="fa-star ${starType}"></i>
      </span>`;
}

function deleteBtn() {
  return `
  <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`;
}

function editBtn() {
  return `
  <span class="edit">
    <i class="fas fa-edit"></i>
  </span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function putFavStoriesOnPage() {
  console.debug('putFavStoriesOnPage');

 $favStoriesList.empty();

 if (currentUser.favorites.length === 0) {
  $favStoriesList.append("<h5>No favorites added!</h5>");
  } else {
    for(let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
        $favStoriesList.append($story);
    }
  }
  $favStoriesList.show();
}

function putMyStoriesOnPage() {
  console.debug('putMyStoriesOnPage');

 $myStoriesList.empty();

 if (currentUser.ownStories.length === 0) {
  $myStoriesList.append("<h5>No stories added by user yet!</h5>");
  } else {
    for(let story of currentUser.ownStories) {
      const $story = generateStoryMarkup(story, true);
        $myStoriesList.append($story);
    }
  }
  $myStoriesList.show();
}

async function deleteStory(evt) {
  console.debug('deleteStory');
  
  const $target = $(evt.target);
  const $closest = $target.closest('li');

  const storyId = $closest.attr('id');
  
  await storyList.removeStory(currentUser, storyId);

  putMyStoriesOnPage();

}
$storiesList.on('click', '.trash-can', deleteStory);


async function submitStory(evt) {
  console.debug("submitStory", evt);
  evt.preventDefault();

  const author = $('#author-input').val();
  const title = $('#title-input').val();
  const url = $('#url-input').val();
  const username = currentUser.username;

  let story = {author, title, url, username};
  
  let res = await storyList.addStory(currentUser, story);

  $submitForm.hide();

  generateStoryMarkup(res);

  putStoriesOnPage();

}

$submitForm.on('submit', submitStory);


let editStoryId;

async function storyEditClick(evt) {
  console.debug("storyEditClick");
  hidePageComponents();
  $editForm.show();

  const $target = $(evt.target);
  const $closest = $target.closest('li');

  editStoryId = $closest.attr('id');
  
  let res = await storyList.storyDetails(currentUser,editStoryId);
  console.log(res);

  $('#author-edit').val(res.author);
  $('#title-edit').val(res.title);
  $('#url-edit').val(res.url);

}

$storiesList.on('click', '.edit', storyEditClick);



async function storyEdit(evt) {
  console.debug('storyEdit', evt);
  
  evt.preventDefault();

  const author = $('#author-edit').val();
  const title = $('#title-edit').val();
  const url = $('#url-edit').val();
  const username = currentUser.username;
  //const storyId = 

  let story = {author, title, url, username};
  
  let res = await storyList.editStory(currentUser, editStoryId, story); 

  $editForm.hide();

  //generateStoryMarkup(res);

  putStoriesOnPage();
}
 $editForm.on('submit', storyEdit);



//Functions for updating favorited stories....

async function updateFavorite(evt) {
  console.debug('updateFavorite');

  const $target = $(evt.target);
  const $closest = $target.closest('li');

  const storyId = $closest.attr('id');
  const story = storyList.stories.find(s => s.storyId === storyId);

  if($target.hasClass('far')) {
    $target.toggleClass('far fas');
    await currentUser.addFavorite(story);
  }
  else {
    $target.toggleClass('fas far');
    await currentUser.removeFavorite(story);
  }

}

$storiesList.on('click', '.favorite', updateFavorite)
