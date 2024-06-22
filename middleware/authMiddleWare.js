import jwt from 'jsonwebtoken';
import express from 'express'
import { User } from '../model/user.js';

export const protect = async (req, res, next) => {
    try {
        console.log(req.headers)
        const token = req.headers.authorization.split(' ')[1];
        const decode =  jwt.decode(token, process.env.JWT_TOKEN);
        if(!decode){
            res.status(403).send('User not authorized to this resources')
        }
        console.log(decode, token)
          req.user = await User.findById(decode.id).select('-password');

          next();
    } catch (error) {
        console.log(error);

    }
}