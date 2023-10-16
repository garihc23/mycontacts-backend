const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//@desc Resgister a user
//@routes POST /api/user/register
//@access public

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        req.statusCode(400);
        throw new Error("All fields are mandatory");
    }
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        res.status(400);
        throw new Error("User already registered!");
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("HASHED PASS---", hashedPassword);
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });
    console.log(`User Created: ${user}`);
    if (user) {
        res.status(201).json({ _id: user.id, email: user.email });
    } else {
        res.status(400);
        throw new Error("User data not valid");
    }
    res.json({ message: "Register the user" })
});

//@desc Login a user
//@routes POST /api/user/login
//@access public

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const user = await User.findOne({ email });
    //compare password with hashed password
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
            },
        }, process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "59m" }
        );
        res.status(200).json({ accessToken });
    } else {
        res.status(401);
        throw new Error("email or password is invalid");
    }
    res.json({ message: "login user" })
});

//@desc Current user info 
//@routes GET /api/user/current
//@access private

const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user)
});

module.exports = { registerUser, loginUser, currentUser }