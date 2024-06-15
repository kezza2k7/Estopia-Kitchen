const { Shopping } = require('../models.js')

async function updateshop(req, res) {
    const { id, selected, name } = req.body;

    try {
        const item = await Shopping.findByPk(id);
        if (!item) {
            res.status(404).json({ error: 'Shopping List Item not found' });
            return;
        }
        
        item.selected = selected;
        item.name = name;
        await item.save();
        return res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = updateshop;