import bcrypt from "bcryptjs"

import User from "../models/user.model.js"
import generateTokenandSetCookie from "../utilities/generateToken.js"

export const signup = async  (req , res) =>{
    try{

        // get user inputs
        const {fullName, username, password, confirmPassword, gender} = req.body
        //check if password matched with confirm password
        if (password !== confirmPassword) {
            return res.status(400).json({error:"Passwords dont match"})
        }

        // does user exist in db
        const user = await User.findOne({username})

        //if user exists return error
        if(user){
            return res.status(400).json({error:"Username already exists"})
        }

        //HASH PASSWORD
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        //generate pfps
        const boyPfp = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlPfp = `https://avatar.iran.liara.run/public/girl?username=${username}`

        //create user or return error
    
        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyPfp : girlPfp
        })

        if(newUser) {
            generateTokenandSetCookie(newUser._id, res)
            await newUser.save()

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic
            })
        } else {
            res.status(400).json({error:"Invalid User Data"});
        }
       

    } catch (error){ 
        console.log("Error in signup controller", error.message)
        res.status(500).json({error:"Internal Server Error"})
    }
}
export const login = async (req , res) =>{
    try {
        //get input
        const {username, password} = req.body
        //find user in db
        const user = await User.findOne({username})
        //check password
        const correctPassword = await bcrypt.compare(password, user?.password || "")

        //if  user OR password does not match return error
        if (!user || !correctPassword) {
            return res.status(400).json({error: "Invalid Credentials"})
        }

        generateTokenandSetCookie(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        })
        
    } catch (error) {
        console.log("Error in login controller", error.message)
        res.status(500).json({error:"Internal Server Error"})
    }
}

export const logout = (req , res) =>{

    try {
        res.cookie("jwt", "", {maxAge: 0})
        res.status(200).json({message: "Logged Out successfully"})
    } catch (error) {
        console.log("Error in logout controller", error.message)
        res.status(500).json({error:"Internal Server Error"})
    }
}

