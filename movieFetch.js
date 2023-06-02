import { OmdbMovie } from './models/movieModel'

export const movieFetch = () => {


    const titles = ['batman', 'titanic'];
    
    titles.forEach(title => {
        const fetch_api = `https://www.omdbapi.com/?t=${title}%20and&apikey=497b18fa&`;
        fetch(fetch_api)
            .then((res) => res.json())
            .then((data) => {
                    const newMovie = new OmdbMovie(data);
                    console.log(data)
                    newMovie.save(); 
            })
    })
};