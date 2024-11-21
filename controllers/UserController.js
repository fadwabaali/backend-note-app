const bcrypt = require('bcryptjs');
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");


const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if(!fullName) {
            return res
               .status(400)
               .json({ error:true, message: "Full name is required." });
        }
    
        if(!email) {
            return res
               .status(400)
               .json({ error:true, message: "Email is required." });
        }
    
        if(!password) {
            return res
               .status(400)
               .json({ error:true, message: "Password is required." });
        }
    
        const isUser = await User.findOne({ email: email });
        if(isUser) {
            return res
               .status(400)
               .json({ error:true, message: "User already exists." });
        }
    
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);  
    
        const user = new User({
            fullName,
            email,
            password: hashedPassword,
        });
    
        await user.save();
        // const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {
        //     expiresIn: '3600m'
        // });
    
        return res.json({
            message: "Account created successfully."
        })
        
    } catch (error) {
        res.status(500).json({message: "Error creating account"})
    }
   
}

const login =  async (req, res) => {
    try {
        const { email, password } = req.body;
    
        if(!email) {
            return res
               .status(400)
               .json({ error: true, message: "Email is required." });
        }
    
        if(!password) {
            return res
               .status(400)
               .json({ error: true, message: "Password is required." });
        }
    
        const userInfo = await User.findOne({ email });
    
        if(!userInfo) {
            return res
               .status(400)
               .json({ error: true, message: "User Not Found." });
        }
    
        // Compare the entered password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, userInfo.password);
        if(!isPasswordValid) {
            return res
               .status(400)
               .json({ error: true, message: "Invalid email or password." });
        }

        const accessToken = jwt.sign({fullName : userInfo.fullName, email : userInfo.email , userId: userInfo._id}, process.env.ACCESS_TOKEN_SECRET)

        res.status(200).json({fullName : userInfo.fullName, email : userInfo.email,userId: userInfo._id, accessToken})
    
        // if(isPasswordValid) {
        //     const user = {user: userInfo};
        //     const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        //         expiresIn: '36000m'
        //     });
        //     return res.json({
        //         error: false,
        //         email,
        //         accessToken,
        //         message: "Login successful."
        //     })
        // }else {
        //     return res
        //        .status(400)
        //        .json({ error: true, message: "Invalid email or password." });
        // }
    } catch (error) {
        res.status(500).json({ error: error})
    }
  

}

const getUserInfo = async (req, res) => {
    const { user } = req.user;

    const isUser = await User.findOne({ _id: user._id });

    if(!isUser) {
        return res
           .status(401)
           .json({ error: true, message: "Unauthorized." });
    }

    return res.json({
        error: false,
        user: {
            _id: isUser._id,
            fullName: isUser.fullName,
            email: isUser.email, 
            createdOn: isUser.createdOn,
        },
        message: "User information fetched successfully."
    })
}

module.exports = {
    signup,
    login,
    getUserInfo
}