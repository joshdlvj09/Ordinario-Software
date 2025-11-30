const bcrypt = require ('bcryptjs')
const jwt = require ('jsonwebtoken')
const asyncHandler = require ('express-async-handler')
const User = require('../models/usersModel')


// POST /api/users/login
// En Postman: iniciar sesión.
// Body requerido:
// { "email": "correo@correo.com", "password": "123456" }
// Devuelve: _id, nombre, email, token
const login = asyncHandler( async(req, res) => {

    const {email, password} = req.body

    const user = await User.findOne({email})

    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user.id,
            nombre: user.nombre,
            email: user.email,
            token: generarToken(user.id)
        })
    } else {
        res.status(401)
        throw new Error ('Credenciales Incorrectas')
    }
})


// POST /api/users
// En Postman: registrar usuario.
// Body requerido:
// { "nombre": "Juan", "email": "correo@correo.com", "password": "123456" }
// Devuelve los datos del usuario creado.
const register = asyncHandler( async(req, res) => {
    const {nombre, email, password} = req.body

    if(!nombre || !email || !password){
        res.status(400)
        throw new Error('Faltan datos')
    }

    const userExiste = await User.findOne({email})

    if (userExiste) {
        res.status(400)
        throw new Error('Ese usuario ya existe')
    } else {

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.create({
            nombre,
            email,
            password: hashedPassword
        })

        if (user) {
            res.status(201).json({
                _id: user.id,
                nombre: user.nombre,
                email: user.email,
                password: user.password
            })
        } else {
            res.status(400)
            throw new Error('No se pudieron guardar los datos')
        }
    }
})


// GET /api/users/me
// En Postman: obtener datos del usuario actual.
// Requiere token en headers: Authorization: Bearer TOKEN
// Sin body.
const data = (req, res) => {
    res.status(200).json(req.user)
}


// Genera token JWT (no se prueba en Postman directamente)
const generarToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = {
    login, register, data
}
