export const generateAccessToken = (id) => {
    const refreshToken = jwt.sign(id, process.env.JWT_ACCESSTOKEN, { expiresIn: '25m'})
}

export const generateRefreshToken = (id) => {
    const refreshToken = jwt.sign(id, process.env.JWT_REFRESHTOKEN, { expiresIn: '2d'})
}