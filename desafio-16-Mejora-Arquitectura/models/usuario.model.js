import { Schema, model } from "mongoose";

const usuarioSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true}
});

export const usuarioModel = model('usuarios', usuarioSchema);
