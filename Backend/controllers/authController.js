import bcrypt from 'bcryptjs'
import User from '../models/userModel.js'
import { generateToken } from '../config/utils.js'
import cloudinary from '../config/cloudinary.js'



export const signup =async(req,res)=>{
    const {fullName,email,password} =req.body
    try {
        if(!email ||!fullName||!password){
            return res.status(400).json({success:false,message:"All fields are required"})
        }
        if(password.length <6){
            return res.status(400).json({success:false,message:"Password must be at least 6 characters"})
        }

        const user=await User.findOne({email})
        if(user){
            return res.status(400).json({success:false,message:"Email already exists"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword =await bcrypt.hash(password,salt)

        const newUser =new User({
            fullName,
            email,
            password:hashedPassword
        })

        if(newUser){
            generateToken(newUser._id,res)
            await newUser.save()
            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic
            })
        }else{
            res.json({message:"invailid user data"})
        }

    } catch (error) {
        console.log(`error in Signup controller ${error}`)
        res.status(500).json({message:"internal server error"})
    }
 }


 export const login =async(req,res)=>{
    const {email,password}=req.body
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"Invalid Credientials"})
        }
    const isPasswordCorrect=  await bcrypt.compare(password,user.password);
    if(!isPasswordCorrect){
        return res.status(400).json({message:"Invalid Credientials"})
    }
    generateToken(user._id,res)
    res.status(201).json({
        _id:user._id,
        fullName:user.fullName,
        email:user.email,
        profilePic:user.profilePic
        
    })
    } catch (error) {
        console.log(`error in login controller ${error}`)
        res.status(500).json({message:"internal server error"})
    }
 }


 export const logout =(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"logged out successfully"})
    } catch (error) {
        console.log(`error in logout controller ${error}`)
        res.status(500).json({message:"internal server error"})
    }
 }

 export const updateProfile=async(req,res)=>{
    try {
        const {profilePic} =req.body;
        const userId=req.user._id;
        

        if(!profilePic){
            return res.status(400).json({message:"profile pic is required"})
        }
        const uploadResponse=await cloudinary.uploader.upload(profilePic)
        
        const updateUser=await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true}) 

        res.status(200).json(updateUser)
    } catch (error) {
        console.log(`error in update profile controller ${error}`)
        res.status(500).json({message:"internal server error"})
    }
    }


export const checkAuth=(req,res)=>{
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log(`error in check auth ${error.message}`)
        res.status(500).json({message:"internal server error"})
    }
}
 