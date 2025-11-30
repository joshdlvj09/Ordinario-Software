const bcrypt = require ('bcryptjs')
const jwt = require ('jsonwebtoken')
const asyncHandler = require ('express-async-handler')
const User = require('../models/usersModel')

const login = asyncHandler( async(req, res) => {

    //desestructuramos el body que pasamos en el request
    const {email, password} = req.body

    //verificar si el usuario que se intenta loguear existe
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

const register = asyncHandler( async(req, res) => {
    const {nombre, email, password} = req.body

    if(!nombre || !email || !password){
        res.status(400)
        throw new Error('Faltan datos')
    }

    //verificar si existe ese usuario en la bd
    const userExiste = await User.findOne({email})

    if (userExiste) {
        res.status(400)
        throw new Error('Ese usuario ya existe')
    } else {
        //hash
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //crear el usuario
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

const data = (req, res) => {
    res.status(200).json(req.user)
}

const generarToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = {
    login, register,data
}