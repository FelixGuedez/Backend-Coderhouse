import { Router } from "express";
import passport  from "passport";
import { getHome, getLogin, getRegistro, getProductos, postRegistro, getLoginError, getLogout} from '../src/controllers/operacion.controllers.js';


const routerApp = Router()

routerApp.get ('/', getHome)
routerApp.get('/login', getLogin)
routerApp.get('/registro', getRegistro)
routerApp.get('/productos', getProductos)
routerApp.post('/registro', postRegistro)
routerApp.get('/login-error', getLoginError)
routerApp.get('/logout', getLogout)
routerApp.post('/login', passport.authenticate('local', { successRedirect: '/productos', failureRedirect: '/login-error' }))


export default routerApp