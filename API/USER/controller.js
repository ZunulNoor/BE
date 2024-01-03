const { create, getUser, login } = require('./service')
const { genSaltSync, hashSync, compareSync } = require('bcrypt')
const { sign } = require("jsonwebtoken")
module.exports = {
    createUser: (req, res) => {
        const body = req.body
        const salt = genSaltSync(10)
        body.user_password = hashSync(body.user_password, salt)
        create(body, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    success: 0,
                    message: "DB Connection error"
                })
            }
            return res.json({ message: 'User added successfully' });
        })
    },
    getUser: (req, res) => {
        getUser((err, results) => {
            if (err) {
                console.log(err)
                return
            }
            return res.status(200).json(results);
        })
    },
    login: (req, res) => {
        const body = req.body;
        login(body.user_id, (err, results) => {
            if (err) {
                console.log(err);
                return res.json({
                    success: 0,
                    data: "Error occurred during login"
                });
            }
            if (!results) {
                return res.json({
                    success: 0,
                    data: "Invalid email or Password"
                });
            }
            const result = compareSync(body.user_password, results.user_password);
            if (result) {
                results.user_password = undefined;
                const jsontoken = sign({ result: results }, 'hello123', {
                    expiresIn: "1h"
                });
                return res.json({
                    success: 1,
                    data: results,
                    token: jsontoken
                });
            } else {
                return res.json({
                    success: 0,
                    data: "Invalid Email OR Password"
                });
            }
        });
    }
}