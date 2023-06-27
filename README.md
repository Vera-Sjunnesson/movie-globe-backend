## Movie Globe Backend
The Movie Globe Backend combines movie data from Open Movie Database (OMDB) and data compiled by the project authors. The API let's you access movie data with textual content, images and coordinates to be displayed on a map. It also provides the ability to search for movies in OMDB and add additional location data and commments. A sample list of movies is open-access while the remainder of the data requries registration or login for full access.

# Endpoints
The MovieGlobe API backend provides the following endpoints:

GET /: Fetches the API's welcome message.
GET /movies/start: Fetches a list of free movies.
GET /movies: Fetches all movies (requires authentication).
POST /movies: Creates a new movie (requires authentication).
GET /movies/savedmovies: Fetches all saved movies for a user (requires authentication).
PUT /movies/:id: Updates a movie (requires authentication).
DELETE /movies/:id: Deletes a movie (requires authentication).
GET /movies/:id/getcomments: Fetches all comments for a movie (requires authentication).
PUT /movies/:id/addcomment: Adds a comment to a movie (requires authentication).
POST /user/register: Registers a new user.
POST /user/login: Logs in a user.
Please note that endpoints requiring authentication must include a valid JSON Web Token (JWT) in the request headers.
This project includes the packages and babel setup for an express server, and is just meant to make things a little simpler to get up and running with.

## View it live
The backend can be accessed at: https://movie-globe-backend-djwdbjbdsa-lz.a.run.app/

The Movie Globe API is part of the Movie Globe Project which also contains a frontend that can be seen at: https://github.com/jonsjak/finalproject-front-jonas-vera
Deployed version: https://movie-globe.netlify.app/
