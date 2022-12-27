import bcrypt from 'bcrypt';

export async function verifyPass(username, password) {
    const match = await bcrypt.compare(password, username.password);
    console.log(`pass login: ${password} || pass hash: ${username.password}`)
    return match;
}

export async function nameUsername(username) {
    const usuario = username.username
    return usuario
}

export async function generateHashPassword(password) {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
}