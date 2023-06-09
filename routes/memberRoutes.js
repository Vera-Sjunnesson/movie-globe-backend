import express from 'express';
import { deleteMovie, getMovie, saveMovie } from '../controllers/movieController';
import { User } from '../models/userModel';

const memberRouter = express.Router();

//// Get all authorized movies for members ////

//authentification function
const authentification = async (req, res, next) => {
    const accessToken = req.header('Authorization');
    try {
      const user = await User.findOne({accessToken});
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({
          success: false,
          response: {
            message: "Please log in",
          }
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        response: error
      });
    };
}
/* memberRouter.route("/")
    .all(authentification)
    .get(getAllMovies)
    .post(postNewMovie) */

//Single movie requests (with authentification)
memberRouter.route("/:id")
  .all(authentification)
  .get(getMovie)
  .put(saveMovie)
  .delete(deleteMovie);

/*   //Get a single movie
memberRouter.get("/:id", authentification, getMovie);

//Update a movie
memberRouter.put("/:id", authentification, updateMovie);

//delete a movie
memberRouter.delete("/:id", authentification, deleteMovie); */

export default memberRouter;