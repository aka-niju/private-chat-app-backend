import bcryptjs from "bcryptjs";
import User from "../models/user.js";
import createJwtAndSendCookie from "../utils/jwtAuth.js";

const signup = async (req, res) => {
    try {
        const { name, username, password, confirmPassword, gender } = req.body;

        if (password !== confirmPassword) return res.status(400).json({
            success: false,
            error: "Password doesn't match",
        })

        const user = await User.findOne({ username });
        if (user) return res.status(400).json({
            success: false,
            error: "User already exists",
        });

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // generating profilePicture
        const maleProfilePicture = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femaleProfilePicture = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = await User.create({
            name,
            username,
            password: hashedPassword,
            gender,
            profilePicture: (gender === 'male') ? maleProfilePicture : femaleProfilePicture,
        })

        if (newUser) return res.status(201).json({
            success: true,
            message: "User registered successfully",
            name: newUser.name,
            username: newUser.username,
            password: newUser.password,
            gender: newUser.gender,
            profilePicture: newUser.profilePicture,
        })
    } catch (error) {
        console.log("Error:", error.message);
    }

}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({
            success: false,
            error: "User doesn't found",
        })

        // comparing password
        const matchPassword = await bcryptjs.compare(password, user.password);
        if (!matchPassword) return res.status(400).json({
            success: false,
            error: "Incorrect password",
        })

        createJwtAndSendCookie(user._id, res);

        res.user = user;
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
        });

    } catch (error) {
        console.log("Error:", error.message);
    }
}

const logout = async (req, res) => {
    try {
        res.cookie("jwt", null, {
            maxAge: 0,
        }).status(200).json({
            success: true,
            message: "User logged out successfully",
        })
    } catch (error) {
        console.log('Error:', error.message);
    }
}

export { signup, login, logout };