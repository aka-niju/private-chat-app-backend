import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import createJwtAndSendCookie from "../utils/jwt.auth.js";

export const signup = async (req, res) => {
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
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // generating profilePicture
        const maleProfilePicture = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femaleProfilePicture = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = await User.create({
            name,
            username,
            password: hashedPassword,
            gender,
            profilePicture: (gender === 'male') ? maleProfilePicture : femaleProfilePicture,
        });

        if (newUser) return res.status(201).json({
            success: true,
            message: "Registered successfully",
            name: newUser.name,
            username: newUser.username,
            gender: newUser.gender,
            profilePicture: newUser.profilePicture,
        });
        else {
            return res.status(400).json({
                success: true,
                error: "Invalid user data",
            });
        }
    } catch (error) {
        console.log("Error in signup controller:", error.message);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }

}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({
            success: false,
            error: "User doesn't found",
        })

        // comparing password
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) return res.status(400).json({
            success: false,
            error: "Incorrect password",
        })

        createJwtAndSendCookie(user._id, res);

        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            name: user.name,
            username: user.username,
            gender: user.gender,
            profilePicture: user.profilePicture,
        });

    } catch (error) {
        console.log("Error in login controller:", error.message);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", null, {
            maxAge: 0,
        }).status(200).json({
            success: true,
            message: "Logged out successfully",
        })
    } catch (error) {
        console.log('Error in logout controller:', error.message);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        })
    }
}

