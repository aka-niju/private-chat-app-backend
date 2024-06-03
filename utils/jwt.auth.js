import jwt from 'jsonwebtoken';

const createJwtAndSendCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        SameSite: "strict",
        Secure: (process.env.NODE_ENV === 'development'),
    })
}

export default createJwtAndSendCookie;