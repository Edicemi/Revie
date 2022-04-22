const path = require("path");
const User = require("../models/user");
const Review = require("../models/review");
const CustomError = require("../lib/customError");
const { validationResult, body } = require("express-validator");
const { passwordHash, passwordCompare } = require("../lib/bcrypt");
const { jwtSign } = require("../lib/ath");
const { uploadCloudinary } = require("../lib/cloudinary");

const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();

exports.signUp = async (req, res, next) => {
    const { fullname, email, password } = req.body;
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            throw new CustomError().check_input();
        }
        if (fullname && email && password) {
            let userExist = await User.findOne({ email: email });
            if (userExist) {
                throw new CustomError(
                    `Email ${email} already exist, try another one.`,
                    400
                );
            }
            const hashedPassword = await passwordHash(password);
            const user = new User({
                fullname: fullname,
                email: email,
                password: hashedPassword,
            });

            await user.save();
            return res.status(200).json({
                message: "User account created successfully",
                
            });
        } else {
            throw new CustomError().invalid_parameter();
        }
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user)
            throw {
                message: "User not found",
                code: 400,
            };
        const doMatch = await passwordCompare(password, user.password);
        if (!doMatch)
            throw {
                message: "Invalid Password",
                code: 400,
            };
        let payload = {
            user_id: user._id,
            fullname: user.fullname,
            email: user.email,
        };
        const token = jwtSign(payload);
        return res.status(200).json({
            message: "User logged in successfully",
            data: payload,
            token,
        });
    } catch (error) {
        console.log(error);
        return res.status(error.code).json({
            message: error.message,
            code: error.code,
        });
    }
};


exports.reviewPost = async (req, res, next) => {
    try {
        const { review } = req.body;
        console.log(req.file);
        const extName = path.extname(req.file.originalname).toString();
        const file64 = parser.format(extName, req.file.buffer);
        const result = await uploadCloudinary(file64.content);
        console.log(req.decoded)

        const reviews = new Review({
            userId: req.decoded.user_id,
            review: review,
            media: result.res,
        });

        await reviews.save();
        return res.status(200).json({
            message: "Review posted succesfully",
        });
    } catch (error) {
        next(error);
    }
};


exports.reviewCount = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
            
        const help = await Review.findOne({ reviewId });
        if (help) {
            help.count++;
            await help.save();
            return res.status(200).json({
                message: "Thank you for making this helpful",
            });
        };
    } catch (error) {
        next(error);
    }
};

exports.getReviews = async (req, res, next) => {
     try {
            const getReviews = await Review.find().populate("userId")
            return res.status(200).json({
                message: "fetched succesfully",
                
            });
        } catch (error) {
            next(error);
        }
};

