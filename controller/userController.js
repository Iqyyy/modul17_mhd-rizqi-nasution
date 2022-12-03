const express = require('express')
const db = require('../db.config/db.config')
const jwt = require('jsonwebtoken');
// const Auth = require('./auth')
const cookieParser = require('cookie-parser');
require("dotenv").config();
const bcrypt = require('bcryptjs');
const Auth = require('../middleware/auth');
SECRET = process.env.SECRET


const register = async(req, res, next) => {
    // * 7. silahkan ubah password yang telah diterima menjadi dalam bentuk hashing
    const {username, email, password} = req.body
    const hash = await bcrypt.hash(password, 10)
    // 8. Silahkan coding agar pengguna bisa menyimpan semua data yang diinputkan ke dalam database
    try {
       await db.query (`INSERT INTO unhan_modul_17 VALUES (DEFAULT, $1, $2, $3)`, [username, email, hash])
       res.send("Data berhasil dimasukkan")
    } catch (error) {
        res.send("Terjadi Kesalahan penginputan data")
        console.log(error)
    }
    
}

const login = async(req, res, next) => {
   
    // 9. komparasi antara password yang diinput oleh pengguna dan password yang ada didatabase
    const {email, password} = req.body
    const datas = await db.query(`SELECT * FROM unhan_modul_17 WHERE email=$1`, [email])

    try {
        
        
        await bcrypt.compare(password,datas.rows[0].password, (err,response)=>{
            if (err) {
                res.send(err)
            }
            if (!response) {
                res.send("email atau password salah")
            }
            else {
            
            // 10. Generate token menggunakan jwt sign
            const data = {
                userid: datas.rows[0].id,
                username: datas.rows[0].username,
                email: datas.rows[0].email,
                password: datas.rows[0].password
            }
        
            const token = jwt.sign(data, SECRET)
            datas.rows[0].token = token

            console.log(token)
        
            //11. kembalikan nilai id, email, dan username

            res.cookie("token", token).status(200).send(datas.rows[0])
        }
        }) 
    
           } catch (error) {
        res.send(error)
        console.log(error)
    }
        
}

const logout = async(req, res, next) => {
                
    try {
        // 14. code untuk menghilangkan token dari cookies dan mengembalikan pesan "sudah keluar dari aplikasi"  
        res.clearCookie('token').send("Logout Success")
    } catch (err) {
        console.log(err.message);
        return res.status(500).send(err)
    }
            
}

const verify = async(req, res, next) => {

    try {
        // 13. membuat verify
        
        const verified = req.verified

        const datas = await db.query(`SELECT * FROM unhan_modul_17 WHERE id=$1`, [verified])

        res.status(200).json(datas.rows[0])
        
    } catch (err) {
        console.log(err.message);
        return res.status(500).send(err)    
    }

}

module.exports = {
    register,
    login,
    logout,
    verify,
    
}