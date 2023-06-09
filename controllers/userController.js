import bcrypt from 'bcrypt';
import { User } from '../models/userModel';

export const registerUser = async (req, res) => {
    const { username, password } = req.body;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    // At least one digit
    // At least one lowercase letter
    // At least one uppercase letter
    // At least 6 characters long
  
    //Checks if valid password
     if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        response: {
          message: "Password needs to be at least 6 characters, and include one number, one uppercase letter and one lowercase letter."
        }
      });
    };
    // checks username available
    try {
      const usernameTaken = await User.findOne({ username: username});
      if (usernameTaken) {
        return res.status(400).json({
          success: false,
          response: {
            message: "Username is already taken"
          }
        });
      };
  
      // encryption
      const salt = bcrypt.genSaltSync();
  
      const newUser = await new User({
        username: username,
        password: bcrypt.hashSync(password, salt)
      }).save();
  
       res.status(201).json({
        success: true,
        response: {
          username: newUser.username,
          id: newUser._id,
          accessToken: newUser.accessToken,
          message: "User successfully created"
        }
      });
  
    } catch (error) {
       res.status(400).json({
        success: false,
        response: error
      });
    };
  };

  export const loginUser = async (req, res) => {
      const { username, password } = req.body;
    
      try {
        const user = await User.findOne({username});
        // checks password
        if (user && bcrypt.compareSync(password, user.password)) {
          res.status(201).json({
            success: true,
            response: {
              username: user.username,
              id: user._id,
              accessToken:  user.accessToken,
              message: "User logged in"
            }
          })
        } else {
          res.status(404).json({
            success: false,
            response: {
              message: "Credentials do not match",
            }
          })
        }
      } catch (error) {
        res.status(500).json({
          success: false,
          response: error
        })
      }
    };