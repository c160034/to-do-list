const Joi = require('joi');

module.exports.itemSchema = Joi.object({
    item: Joi.object({
        title: Joi.string().required(),
        deadline: Joi.date().required(),
    }).required()
});