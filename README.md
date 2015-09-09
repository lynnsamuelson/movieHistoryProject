#Movie History Project

Group exercise in taking another groups previous project and refactoring the foreign code to meet new requirements.

##Original project:

Utilize the OMDb API (http://www.omdbapi.com/) to retrieve movies, add them to a list, provide ratings & a status of watched or unwatched.

Refactored project:

Two views, one for wishlist of to-watch movies, one for already watched movies with star-bar ratings.
Search bar in menu that searches watched movies, unwatched movies, and returns any other movies that match the searched value via the OMDb API
Post-search, buttons to filter by watched/unwatched/un-added
Choosing a movie from the API adds it to the wishlist
Clicking watched on a wishlist movie moves it to the watched view and allows it to be rated
Unwatched movies can be removed from the wishlist, but watched movies cannot be unwatched/removed
Site must be mobile responsive
Makes use of Firebase https://www.firebase.com/ for data storage.

Requirements:

Node.js https://nodejs.org/en/
Installation of http-server via npm install -g http-server
Post-clone Installation:

From the commandline, inside the main repo directory:
    bower install
    npm install
    http-server

Now you can open your browser and go to http://localhost:8081 (or whichever port it reports it is using) and you should see the basic mock-up. The application will be displayed along with the movie poster and general information from the OMDBA database.
