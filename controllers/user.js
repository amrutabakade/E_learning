import { User } from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import sendMail from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/TryCatch.js";

export const register = async(req,res)=>
{
    try{
        //res.send("Register ApI")
        const {email,name,password} = req.body;

        let user = await User.findOne({email});

        //if email is not already registered
        if(user)
        {
            return res.status(400).json({
                message: "User exist",
            })
        };

        //elaborate it
        const hashPassword = await bcrypt.hash(password,10);
        
        user ={
            name,
            email,
            password: hashPassword,
        };

        const otp = Math.floor(Math.random()*1000000);

        //vvimp
        const activationToken = jwt.sign({
            user,
            otp,
        },
        process.env.Activation_secret,
        {
            expiresIn:"5m",
        });

        const data = {
            name,
            otp,
        };
        await sendMail(email,"E-learning", data)
        res.status(200).json(
            {
                message:"Otp send to your mail",
                activationToken,
            }
        )
    } 
    catch(error)
    {
        res.status(500).json(
            {
                message : error.message,
            }
        )
    }
};

export const verifyUser = TryCatch(async(req,res)=>{
    const {otp, activationToken} = req.body
    const verify = jwt.verify(activationToken , process.env.Activation_secret)

    // if user took more than 5m to enter otp
    if(!verify)
        return res.status(400).json(
            {
                message:"otp expired"
            }
        );
    if(verify.otp !== otp)
        return res.status(400).json(
            {
                message:"Wrong Otp"
            }
        );

    await User.create(
        {
            name: verify.user.name,
            email: verify.user.email,
            password: verify.user.password,
        }
    )
    res.json(
        {
            message: "User registerd"
        }
    )
});

export const loginUser = TryCatch(async(req,res)=>{
    const { email, password} = req.body;

    const user = await User.findOne({email});

    if(!user) 
        return res.status(400).json(
        {
            message: "No User with this email"
        }
    );
    const mathPassword = await bcrypt.compare(password,user.password);

    if(!mathPassword)
        return res.status(400).json({
            message : "Wrong Password",
    });

    const token = jwt.sign({_id: user._id},process.env.Jwt_Sec ,{
        expiresIn: "15d",
    });

    res.json(
        {
            message: `Welcome back ${user.name}`,
            token,
            user,
        }
    );
});

export const myProfile = TryCatch(async(req,res)=>{
    const user = await User.findById(req.user._id)

    res.json({user}); // getting requested user from middleware->isAuth
})