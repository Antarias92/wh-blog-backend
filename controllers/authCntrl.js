import {db} from "../db.js";
import bcrypt, { hashSync } from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
    //CHECK EXISTING USER
    const q = "SELECT * FROM login_info where email = ? OR username = ?";

    db.query(q, [req.body.email, req.body.username], (err, data)=>{
        if(err) return res.json(err)
        if(data.length) return res.status(409).json("User already exists");

        //Hash the password and create user
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const q = "INSERT INTO login_info(`username`, `email`, `password`) VALUES (?)"
        const values = [
           req.body.username,
           req.body.email,
           hash 
        ]
        db.query(q,[values], (err,data)=>{
            if(err) return res.json(err);
            return res.status(200).json("User has been created.");
        })
    });
};

export const login = (req, res) => {
    const q = "SELECT * FROM login_info WHERE username = ?"

    db.query(q,[req.body.username], (err, data)=>{
        if (err) return res.json(err);
        if(data.length === 0) return res.status(400).json("User not found");

        //check password
        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);
        if(!checkPassword) return res.status(400).json("Incorrect username or password")
        
        const token = jwt.sign({id:data[0].id}, "jwtkey");
        const {password, ...other} = data[0];
        res.cookie("access_token", token, {
            httpOnly:true
        }).status(200).json(other)
    });
};

export const logout = (req, res) => {
    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true
    }).status(200).json("User has been logged out.")
};