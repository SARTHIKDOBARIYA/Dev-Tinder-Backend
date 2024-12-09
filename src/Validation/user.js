const Joi=require("joi")

const createUser={
    firstName: Joi.required(),
    lastName:Joi.string(),
    emailId:Joi.string().trim().required()
}

