import { logger } from "../utils/logger.config.js"
import { usuarioModel } from "../../models/usuario.model.js"
import {generateHashPassword, verifyPass, nameUsername} from '../services/operaciones.services.js';
import passport from 'passport';
import { Strategy } from 'passport-local'

const LocalStrategy = Strategy
let nameUser

passport.use(new LocalStrategy(
    async function (username, password, done) {
        console.log(`${username} ${password}`)
        //Logica para validar si un usuario existe
        const existeUsuario = await usuarioModel.findOne({ username: username })
        if (!existeUsuario) {
            return done(null, false);
        } else {
            const match = await verifyPass(existeUsuario, password);
            if (!match) {
                return done(null, false);
            }
            nameUser = await nameUsername(existeUsuario)
            return done(null, existeUsuario);
        }
    }
));

export async function getHome(req, res) {
    try {
        res.redirect('/login')
    } catch (error) {
        logger.warn('Ruta no implementada', error)
    }
}

export async function getLogin(req, res) {
    try {
        res.render('login.hbs')
    } catch (error) {
        logger.warn('Ruta no implementada', error)
    }
}


export async function getRegistro(req, res) {
    try {
        res.render('registro.hbs')
    } catch (error) {
        logger.warn('Ruta no implementada', error)
    }
}

export async function getProductos(req, res) {
    try {
        const nombre = nameUser
        res.render('productos.hbs', { nombre })
    } catch (error) {
        logger.warn('Ruta no implementada', error)
    }
}

export async function getLoginError(req, res) {
    try {
        res.render('loginError.hbs')
    } catch (error) {
        logger.warn('Ruta no implementada', error)
    }
}

export async function getLogout(req, res) {
    try {
        const nombre = nameUser
        req.session.destroy(err => {
            if (err) {
                res.json({ err });
            } else {
                res.render('logout.hbs', { nombre })
            }
        });
    } catch (error) {
        logger.warn('Ruta no implementada', error)
    }
}


export async function postRegistro(req, res) {
    try {
        const { username, password } = req.body;
        console.log(req.body)
        const newUsuario = await usuarioModel.findOne({ username: username })

        if (newUsuario) {
            res.render('registro-error')
        } else {
            const newUser = { username, password: await generateHashPassword(password) };
            await usuarioModel.create(newUser)
            res.redirect('/login')
        }
    } catch (error) {
        logger.warn('Ruta no implementada', error)
    }
}
