# Green Bag Boogie!

---

## Thoughts, ideas and discussions

My primary thought in this implementation was to make an interface that doesn't make user think too much. It should be intuitive, easy, and should perform functions with least number of clicks.

Thus, owing to the hard-limit of 5 nominations, I created a set of 5 searchable, able-to-fix windows to allow users to pick their choice of 5 movies.

## Difficulties faces

1. Slow server response – When it comes to images, it is always tricky to work with the render and re-render process of react. I used the latest technology stack by Next to ensure that all images are optimised, are curated with lazy-loading to reduce FCP and LCP.

2. The dynamics of live searching through API – This problem was compounded in two ways, one – searching the api dynamically with each render AND at the same time, checking the output array with our nominations list as well. This wasn't all, I was using the same in-place render to show the selected titles, along with non-selected ones!

## Features

[x] In-place fixing and searching for new titles
[x] Once you have selected any particular title, it doens't show in the results anymore. This is crucial to reduce user's mental fatigue of search-and-disappointment. Better than showing user that it has been already selected. (Redundant in our case as we were anyway showing in-place nominations)
[x] All posters are retrieved along with titles and years.
[x] A placeholder image has been added for titles that do not have posters. Search for 'TANIS' and you'll see some titles using our custom placeholder image.

## Live

[Checkout the live version!](http://shopify.tanishq.xyz/)
