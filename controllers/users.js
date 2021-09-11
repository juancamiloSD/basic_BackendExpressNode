const User = require('../models/user');
const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const getUsers = async(req, res) => {

    const users = await User.find({}, 'nombre email role google');

    res.json({
        ok: true,
        users,
    })
}

const createUsers = async(req, res = response) => {

    const { password, email } = req.body;

    try {
        const existEmail = await User.findOne({ email });
        if(existEmail){
            return res.status(400).json({
                ok: false,
                msg: "El correo ya esta registrado"
            });
        }
        const user = new User(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        // Guardar usuario
        await user.save();

        // Generar el TOKEN - JWT
        const token = await generateJWT(user.id);
    
        res.json({
            ok: true,
            user,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error inesperado... revisar logs"
        });
    }
}

const updateUser = async(req, res = response) => {
    // TODO: Validar token y comprobar si el usuario es valido
    const uid = req.params.id;

    try {
        const userDB = await User.findById( uid );

        if(!userDB){
            return res.status(400).json({
                ok: false,
                msg: "No existe un usuario con ese id"
            })
        }
        
        // Actualizaciones
        const {password, google, email, ...fields} = req.body;

        if(userDB.email != email){
            const existEmail = await User.findOne({ email });
            if(existEmail){
                return res.status(400).json({
                    ok: false,
                    msg: "Ya existe un usuario con ese email"
                })
            }
        }

        fields.email = email;
        const userUpdated = await User.findByIdAndUpdate(uid, fields, { new: true });

        // Generar el TOKEN - JWT
        const token = await generateJWT(userDB.id);

        res.json({
            ok: true,
            user: userUpdated,
            token
        })
    } catch (error) {
        res.status(500).json({
            opk: false,
            msg: "Error inesperado"
        })
    }
}

const deleteUser = async(req, res = response) => {

    const uid  = req.params.id;
    try {
        const userDB = await User.findById( uid );

        if(!userDB){
            return res.status(400).json({
                ok: false,
                msg: "No existe un usuario con ese id"
            })
        }
        await User.findByIdAndDelete(uid);
        res.json({
            ok: true,
            msn: "Usuario eliminado"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            opk: false,
            msg: "Error inesperado"
        })
    }
}

module.exports = {
    getUsers,
    createUsers,
    updateUser,
    deleteUser
}