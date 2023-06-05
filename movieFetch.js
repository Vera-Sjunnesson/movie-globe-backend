import { OmdbMovie } from './models/movieModel';

export const movieFetch = async () => {
  const titles = ['Taste%20of%20Cherry', 'Babyteeth', 'What%20Time%20Is%20It%20There?', 'Amores%20Perros', 'The%20Return', 'City%20of%20God', 'Atlantique', 'Rosetta', 'Beau%20Travail', 'Videodrome'];
  await OmdbMovie.deleteMany();

  try {
    for (const title of titles) {
      const fetch_api = `https://www.omdbapi.com/?t=${title}&apikey=${process.env.API_KEY}&`;
      const response = await fetch(fetch_api);
      const data = await response.json();

      if (data.Title) {
        const newMovie = new OmdbMovie(data);
        console.log(data);
        await newMovie.save();
      }
    }
    console.log('Movies fetched and saved successfully.');
  } catch (err) {
    console.error('Failed to fetch and save movies:', err);
  }
};

/* import { OmdbMovie } from './models/movieModel'

export const movieFetch = async () => {
    const titles = ['Taste%20of%20Cherry', 'Babyteeth', 'What%20Time%20Is%20It%20There?', 'Amores%20Perros', 'The%20Return', 'City%20of%20God', 'Atlantique', 'Rosetta', 'Beau%20Travail', 'Videodrome' ];
    await OmdbMovie.deleteMany();
  
    try {
      titles.forEach((title) => {
        const fetch_api = `https://www.omdbapi.com/?t=${title}&apikey=${process.env.API_KEY}&`;
        fetch(fetch_api)
          .then((res) => res.json())
          .then((data) => {
            if (data.Title) {
              const newMovie = new OmdbMovie(data);
              console.log(data);
              newMovie.save();
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      });
      console.log('Movies fetched and saved successfully.');
    } catch (err) {
      console.error('Failed to fetch and save movies:', err);
    }
  }; */

/* 
export const movieFetch = async () => {

    const titles = ['Batman', 'Titanic'];
    await OmdbMovie.deleteMany();
    try {

    
    titles.forEach(title => {
        const fetch_api = `https://www.omdbapi.com/?t=${title}%20and&apikey=497b18fa&`;
        fetch(fetch_api)
            .then((res) => res.json())
            .then((data) => {
                    const newMovie = new OmdbMovie({ Title: data.Title });
                    console.log(data)
                    newMovie.save(); 
            })
            .catch((error) => {
                console.error('Error:', error);
            });  
    })
    console.log('Movies fetched and saved successfully.');
    } catch (err) {
    console.error('Failed to fetch and save movies:', err);
    }
}; */