const Joi = require("joi");
const { dynamoose } = require("../../Configure/database.config");

// Mongo DB schema for userDetails
const userDataSchema = new dynamoose.Schema({
  "firstName": String,
  "lastName": String,
  "role":String,
  "email": String,
  "loginId": String,
  "password": String,
  "gender": String,
  "contactNumber": Number,
});

// Validation for user Data and Login
module.exports.validateSignup = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  loginId: Joi.string().required(),
  password: Joi.string().min(6).required().label("Password"),
  confirmPassword: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .label("Confirm Password")
    .messages({ "any.only": "{{#label}} does not match" }),
  gender: Joi.string().required(),
  contactNumber: Joi.number().required(),
});

module.exports.validateLogin = Joi.object()
  .keys({
    email: Joi.string().email(),
    loginId: Joi.string(),
    password: Joi.string().required(),
  })
  .or("email", "loginId");

module.exports.validateResetPassword = Joi.object({
  password: Joi.string().min(6).required().label("Password"),
  confirmPassword: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .label("Confirm Password")
    .messages({ "any.only": "{{#label}} does not match" }),
});

module.exports.userData = dynamoose.model("UserData", userDataSchema);
