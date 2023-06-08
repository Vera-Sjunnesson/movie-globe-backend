import { OmdbMovie } from './models/movieModel';
import dotenv from 'dotenv';

dotenv.config();

export const movieFetch = () => {

    const api = process.env.API_KEY;
    const titles = ['batman', 'titanic', 'turtles'];
    
    titles.forEach(title => {
        const fetch_api = `https://www.omdbapi.com/?t=${title}%20and&apikey=${api}&`;
        fetch(fetch_api)
            .then((res) => res.json())
            .then((data) => {
                    const newMovie = new OmdbMovie(data);
                    console.log(data)
                    newMovie.save(); 
            }).catch(error => console.log(error))
    })
};