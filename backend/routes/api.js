const express = require('express');
const router = express.Router();

// Données de test
let items = [
  { id: 1, name: 'Premier élément', description: 'Description du premier élément', createdAt: new Date() },
  { id: 2, name: 'Deuxième élément', description: 'Description du deuxième élément', createdAt: new Date() }
];

let nextId = 3;

// GET /api/items - Récupérer tous les éléments
router.get('/items', (req, res) => {
  res.json({
    success: true,
    data: items,
    count: items.length,
    timestamp: new Date().toISOString()
  });
});

// GET /api/items/:id - Récupérer un élément par ID
router.get('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find(item => item.id === id);

  if (!item) {
    return res.status(404).json({
      success: false,
      error: 'Item not found',
      message: `No item found with id ${id}`
    });
  }

  res.json({
    success: true,
    data: item,
    timestamp: new Date().toISOString()
  });
});

// POST /api/items - Créer un nouvel élément
router.post('/items', (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      message: 'Name and description are required'
    });
  }

  const newItem = {
    id: nextId++,
    name,
    description,
    createdAt: new Date()
  };

  items.push(newItem);

  res.status(201).json({
    success: true,
    data: newItem,
    message: 'Item created successfully',
    timestamp: new Date().toISOString()
  });
});

// PUT /api/items/:id - Mettre à jour un élément
router.put('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description } = req.body;

  const itemIndex = items.findIndex(item => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Item not found',
      message: `No item found with id ${id}`
    });
  }

  if (!name || !description) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      message: 'Name and description are required'
    });
  }

  items[itemIndex] = {
    ...items[itemIndex],
    name,
    description,
    updatedAt: new Date()
  };

  res.json({
    success: true,
    data: items[itemIndex],
    message: 'Item updated successfully',
    timestamp: new Date().toISOString()
  });
});

// DELETE /api/items/:id - Supprimer un élément
router.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = items.findIndex(item => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Item not found',
      message: `No item found with id ${id}`
    });
  }

  const deletedItem = items.splice(itemIndex, 1)[0];

  res.json({
    success: true,
    data: deletedItem,
    message: 'Item deleted successfully',
    timestamp: new Date().toISOString()
  });
});

// GET /api/stats - Statistiques de l'API
router.get('/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalItems: items.length,
      serverTime: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: '1.0.0'
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;