/*
    Path: /api/users
*/
const { Router } = require('express');
const { getUsers, createUsers, updateUser, deleteUser } = require('../controllers/users');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/', 
    validateJWT,
    getUsers
);

router.post('/', 
    [
        
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validateFields,
    ], 
    createUsers
);

router.put('/:id', 
    [
        validateJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('role', 'El rol es obligatorio').not().isEmpty(),
        validateFields
    ],
    updateUser
);

router.delete('/:id', 
    validateJWT,
    deleteUser
);

module.exports = router;