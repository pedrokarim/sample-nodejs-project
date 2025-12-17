const express = require('express');
const router = express.Router();

// Données de test
let items = [
  { id: 1, name: 'Premier élément', description: 'Description du premier élément', createdAt: new Date() },
  { id: 2, name: 'Deuxième élément', description: 'Description du deuxième élément', createdAt: new Date() },
  { id: 3, name: 'Troisième élément', description: 'Description du troisième élément', createdAt: new Date() },
  { id: 4, name: 'Quatrième élément', description: 'Description du quatrième élément', createdAt: new Date() }
];

let nextId = 5;

// Collections de test
let collections = [
  {
    id: 1,
    name: 'Collection Favoris',
    description: 'Mes éléments préférés',
    items: [1, 2],
    createdAt: new Date()
  },
  {
    id: 2,
    name: 'Collection Archive',
    description: 'Éléments archivés',
    items: [3],
    createdAt: new Date()
  }
];

let nextCollectionId = 3;

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

// =================== GESTION DES COLLECTIONS ===================

// GET /api/collections - Récupérer toutes les collections
router.get('/collections', (req, res) => {
  const collectionsWithItems = collections.map(collection => ({
    ...collection,
    itemDetails: collection.items.map(itemId => items.find(item => item.id === itemId)).filter(Boolean)
  }));

  res.json({
    success: true,
    data: collectionsWithItems,
    count: collections.length,
    timestamp: new Date().toISOString()
  });
});

// GET /api/collections/:id - Récupérer une collection par ID
router.get('/collections/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const collection = collections.find(collection => collection.id === id);

  if (!collection) {
    return res.status(404).json({
      success: false,
      error: 'Collection not found',
      message: `No collection found with id ${id}`
    });
  }

  const collectionWithItems = {
    ...collection,
    itemDetails: collection.items.map(itemId => items.find(item => item.id === itemId)).filter(Boolean)
  };

  res.json({
    success: true,
    data: collectionWithItems,
    timestamp: new Date().toISOString()
  });
});

// POST /api/collections - Créer une nouvelle collection
router.post('/collections', (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      message: 'Name is required'
    });
  }

  const newCollection = {
    id: nextCollectionId++,
    name,
    description: description || '',
    items: [],
    createdAt: new Date()
  };

  collections.push(newCollection);

  res.status(201).json({
    success: true,
    data: newCollection,
    message: 'Collection created successfully',
    timestamp: new Date().toISOString()
  });
});

// PUT /api/collections/:id - Mettre à jour une collection
router.put('/collections/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description } = req.body;

  const collectionIndex = collections.findIndex(collection => collection.id === id);

  if (collectionIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Collection not found',
      message: `No collection found with id ${id}`
    });
  }

  if (!name) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      message: 'Name is required'
    });
  }

  collections[collectionIndex] = {
    ...collections[collectionIndex],
    name,
    description: description || collections[collectionIndex].description,
    updatedAt: new Date()
  };

  res.json({
    success: true,
    data: collections[collectionIndex],
    message: 'Collection updated successfully',
    timestamp: new Date().toISOString()
  });
});

// DELETE /api/collections/:id - Supprimer une collection
router.delete('/collections/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const collectionIndex = collections.findIndex(collection => collection.id === id);

  if (collectionIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Collection not found',
      message: `No collection found with id ${id}`
    });
  }

  const deletedCollection = collections.splice(collectionIndex, 1)[0];

  res.json({
    success: true,
    data: deletedCollection,
    message: 'Collection deleted successfully',
    timestamp: new Date().toISOString()
  });
});

// =================== GESTION DES ITEMS DANS LES COLLECTIONS ===================

// POST /api/collections/:id/items/:itemId - Ajouter un item à une collection
router.post('/collections/:id/items/:itemId', (req, res) => {
  const collectionId = parseInt(req.params.id);
  const itemId = parseInt(req.params.itemId);

  const collectionIndex = collections.findIndex(collection => collection.id === collectionId);
  const item = items.find(item => item.id === itemId);

  if (collectionIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Collection not found',
      message: `No collection found with id ${collectionId}`
    });
  }

  if (!item) {
    return res.status(404).json({
      success: false,
      error: 'Item not found',
      message: `No item found with id ${itemId}`
    });
  }

  if (collections[collectionIndex].items.includes(itemId)) {
    return res.status(400).json({
      success: false,
      error: 'Item already in collection',
      message: `Item ${itemId} is already in collection ${collectionId}`
    });
  }

  collections[collectionIndex].items.push(itemId);

  res.json({
    success: true,
    data: {
      collection: collections[collectionIndex],
      item: item
    },
    message: 'Item added to collection successfully',
    timestamp: new Date().toISOString()
  });
});

// DELETE /api/collections/:id/items/:itemId - Retirer un item d'une collection
router.delete('/collections/:id/items/:itemId', (req, res) => {
  const collectionId = parseInt(req.params.id);
  const itemId = parseInt(req.params.itemId);

  const collectionIndex = collections.findIndex(collection => collection.id === collectionId);

  if (collectionIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Collection not found',
      message: `No collection found with id ${collectionId}`
    });
  }

  const itemIndex = collections[collectionIndex].items.indexOf(itemId);

  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Item not in collection',
      message: `Item ${itemId} is not in collection ${collectionId}`
    });
  }

  collections[collectionIndex].items.splice(itemIndex, 1);

  res.json({
    success: true,
    data: collections[collectionIndex],
    message: 'Item removed from collection successfully',
    timestamp: new Date().toISOString()
  });
});

// GET /api/stats - Statistiques de l'API
router.get('/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalItems: items.length,
      totalCollections: collections.length,
      serverTime: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: '1.0.0'
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;