const express = require('express');
const itemRouter = express.Router();
const Item = require('../models/item');
const Image = require('../models/image');
itemRouter.post('/:user', async(req, res) => {
    const {city, region, price, type, images, mainImage, description} = req.body;
    if(!city || !region || !price || !images || !mainImage || !description || !type)
    {
        res.status(400).json({message: 'all field is required'});
    }

    if(images.length === 0)
    {
        res.status(400).json({message: 'please enter one image at least'})
    }
    const {user} = req.params;
    const item = new Item({
        city, region, price, type, user, mainImage, description
    });
    await item.save();

    
    images.forEach(async(publicId) => {
        await (new Image({publicId, item: item._id}).save())
    });

    res.json(item);
});

itemRouter.get('/', async(req, res) => {
    const items = await Item.find({}).populate('user');
    res.json(items);
})

itemRouter.get('/:itemId', async(req, res) => {
    const {itemId} = req.params
    const item = await Item.findById(itemId).populate('user');
    const images = await Image.find({item: itemId});
    res.json({item, images});
})

module.exports = itemRouter;