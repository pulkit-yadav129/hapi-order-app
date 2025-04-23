import Joi from 'joi';
 export const addToCartSchema=Joi.object({
   items:Joi.array().items(Joi.object({
                        productId:Joi.number().integer().required(),
                        quantity:Joi.number().integer().min(1).required()
 })
)
.min(1).required()

});