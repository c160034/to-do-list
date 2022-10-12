const Joi = require('joi');

module.exports.itemSchema = Joi.object({
    item: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        deadline: Joi.date().required(),
    }).required()
});

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required(),
    }).required()
});