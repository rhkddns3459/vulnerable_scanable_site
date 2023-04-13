const router = require("express");
const mysql = require("mysql2");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");

const emailExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i; //email regExp
const passwordExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,18}$/; //password regExp
const spaceExp = /\s/g; //space regExp

const loginUser = async(req, res, next) => {
    
    const {email, password} = req.body;
   
    if(email.match(emailExp) === null || email.match(spaceExp) !== null){
        return res.status(400).send({
            ok: false,
            message: 'emailEXP is incorrect',
          });
    };

    if(password.match(passwordExp) === null || password.match(spaceExp) !== null){
        return res.status(400).send({
            ok: false,
            message: 'passwordEXP is incorrect',
          });
    };

    try{
        
        const exUser = await User.findOne({where: {email: email}});

        console.log(exUser);

        if(!exUser) {
            console.log("login fail");
            return res.status(401).send({
                ok: false,
                message: 'email is incorrect',
              });
        }

        const pass = await bcrypt.compare(password, exUser.password);

        console.log(pass);

        if(pass) {
            const key = process.env.COOKIE_SECRET;
            // console.log(key);
            let token = '';
            token = jwt.sign(
                {
                  type: "JWT",
                  email: email,
                  //profile: profile, 나중에는 admin인지 아닌지 값 넣을것
                },
                key,
                {
                  expiresIn: "15m", //15분후 만료
                  issuer: "토큰발급자",
                }
              );
              console.log(token);
              // response
              return res.status(200).send({ //client에게 토큰 모두를 반환합니다.
                ok: true,
                data: {
                  token
                },
              });
        }else{
            return res.status(401).send({
                ok: false,
                message: 'password is incorrect',
              });
        }
    }catch(err){
        console.log(err);
            return res.status(500).send({
                ok: false,
                message: 'error',
              });
    }

}

module.exports = {
    loginUser,
}


