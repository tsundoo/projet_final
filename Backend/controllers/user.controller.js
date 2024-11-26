const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // check if the user already exists (by username or email)
        const existingUser = await User.findOne({ $or: [{username }, {email}] });
        if (existingUser) {
             return res.status(400).send({ message: 'User with this username or email already exists' });
        }

        // validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).send({ message: 'Invalid email format' });
        }

        // validate password length
        if(password.length < 8) {
            return res.status(400).send({ message: 'Password must be atleast 8 characters long' });
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 8);

        // create a new user
        const user = new User ({
            username,
            email,
            password: hashedPassword
        });

        await user.save();
        res.status(201).send({ 
            message: 'User created successfully', 
            user: { id: user._id, username: user.username, email: user.email } 
        });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(401).send({ message: 'Invalid username or password' });
            }
    
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).send({ message: 'Invalid username or password' });
            }
    
            const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, { expiresIn: '24h' });
            res.status(200).send({ 
                message: 'Login successful', 
                token, 
                user: { 
                    id: user._id, 
                    username: user.username, 
                    email: user.email 
                } 
            });
        } catch (error) {
        res.status(500).send({ message: error.message });
    }
}