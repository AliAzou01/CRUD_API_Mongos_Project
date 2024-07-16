const User = require('../../models/user');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');






module.exports = {
    
    user: async args => {
        try {
            const user = await User.findOne({ email: args.email }).populate('createdEvents');
            if (!user) {
                throw new Error('User not found!');
            }
            return { ...user._doc, _id: user._doc._id.toString() };
        } catch (err) {
            throw err;
        }
    },
    
    createUser: async args => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email });
            if (existingUser) {
                throw new Error('User exists!');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword,
                createdEvents: []
            });
            const result = await user.save();
            return { ...result._doc, password: null, _id: result._doc._id.toString() };
        } catch (err) {
            throw err;
        }
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email});
        if (!user) {
            throw new Error('User does not exist!');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if(!isEqual) {
            throw new Error('Password is incorrect!');
        }
    const token = jwt.sign(
        {userId: user.id, email: user.email},
        'myincreptablesecrettoken',
        {
            expiresIn: '1h'
        }
    );
    return { userId: user.id, token, tokenExpiration: 1 }
    }

};
