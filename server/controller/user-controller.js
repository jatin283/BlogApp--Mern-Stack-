
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import user from "../model/user.js";
import Token from '../model/token.js';

import dotenv from 'dotenv'

dotenv.config();

export const signupUser = async (request, response) => {
    // console.log(request);
    try {
        // const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(request.body.password, 10);

        const profile = { username: request.body.username, name: request.body.name, password: hashedPassword };
        
        const newUser = new user(profile);
        // console.log("hi")
        await newUser.save();
        // response.json({ msg: 'signup successfull' , data: user})

        return response.status(200).json({ msg: 'signup successfull' })

    } catch(error) {
        return response.status(500).json({ msg: 'Error while signup the user', data: error})
    }
}

export const loginUser = async (request, response) => {
    let isUser = await user.findOne({ username: request.body.username });
    if (!isUser) {
        return response.status(400).json({ msg: 'Username does not match' });
    }

    try {
        let match = await bcrypt.compare(request.body.password, isUser.password);
        if (match) {
            const accessToken = jwt.sign(isUser.toJSON(), process.env.ACCESS_SECRET_KEY, { expiresIn: '15m' });
            const refreshToken = jwt.sign(isUser.toJSON(), process.env.REFRESH_SECRET_KEY);

            const newToken = new Token({ token: refreshToken })
            await newToken.save();

            return response.status(200).json({ accessToken: accessToken, refreshToken: refreshToken, name: isUser.name, username: isUser.username})

            
        } else {
           return response.status(400).json({msg: 'Password does not match'});
        }

    } catch  (error) {
        return response.status(500).json({ msg: 'Error while login in user'})

    }
}