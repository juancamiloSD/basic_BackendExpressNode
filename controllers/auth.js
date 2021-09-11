const { repsonse } = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const login = async(req, res = response) => {

    const {email, password} = req.body;

    try {

        // Verificar email
        const userDB = await User.findOne({email});

        if(!userDB){
            return res.status(404).json({
                ok: false,
                msg: "Email no encontrado"
            });
        }

        // Verificar contraseña
        const validatePass = bcrypt.compareSync(password, userDB.password);
        if(!validatePass){
            return res.status(400).json({
                ok: false,
                msg: "Contraseña no válida"
            })
        }

        // Generar el TOKEN - JWT
        const token = await generateJWT(userDB.id);

        res.json({
            ok: true,
            token
        })

    } catch (error) {
        console.log(error);
        res.statis(500).json({
            ok: false,
            msg: "Error inesperado"
        })
    }
}

module.exports = {
    login
}