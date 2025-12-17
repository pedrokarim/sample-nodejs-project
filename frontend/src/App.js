import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('items'); // 'items' ou 'collections'
  const [items, setItems] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', description: '' });
  const [newCollection, setNewCollection] = useState({ name: '', description: '' });
  const [editingItem, setEditingItem] = useState(null);
  const [editingCollection, setEditingCollection] = useState(null);

  // Charger les éléments et collections au démarrage
  useEffect(() => {
    loadItems();
    loadCollections();
  }, []);

  const loadItems = async () => {
    try {
      const response = await fetch('/api/items');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des éléments');
      }
      const data = await response.json();
      setItems(data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadCollections = async () => {
    try {
      const response = await fetch('/api/collections');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des collections');
      }
      const data = await response.json();
      setCollections(data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newItem.name.trim() || !newItem.description.trim()) {
      return;
    }

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création');
      }

      const data = await response.json();
      setItems([...items, data.data]);
      setNewItem({ name: '', description: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setNewItem({ name: item.name, description: item.description });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingItem || !newItem.name.trim() || !newItem.description.trim()) {
      return;
    }

    try {
      const response = await fetch(`/api/items/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      const data = await response.json();
      setItems(items.map(item =>
        item.id === editingItem.id ? data.data : item
      ));
      setEditingItem(null);
      setNewItem({ name: '', description: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setNewItem({ name: '', description: '' });
  };

  // Fonctions pour les collections
  const handleCollectionSubmit = async (e) => {
    e.preventDefault();
    if (!newCollection.name.trim()) {
      return;
    }

    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCollection),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la collection');
      }

      const data = await response.json();
      setCollections([...collections, data.data]);
      setNewCollection({ name: '', description: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCollectionEdit = (collection) => {
    setEditingCollection(collection);
    setNewCollection({ name: collection.name, description: collection.description });
  };

  const handleCollectionUpdate = async (e) => {
    e.preventDefault();
    if (!editingCollection || !newCollection.name.trim()) {
      return;
    }

    try {
      const response = await fetch(`/api/collections/${editingCollection.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCollection),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la collection');
      }

      const data = await response.json();
      setCollections(collections.map(collection =>
        collection.id === editingCollection.id ? data.data : collection
      ));
      setEditingCollection(null);
      setNewCollection({ name: '', description: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCollectionDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette collection ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/collections/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la collection');
      }

      setCollections(collections.filter(collection => collection.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddItemToCollection = async (collectionId, itemId) => {
    try {
      const response = await fetch(`/api/collections/${collectionId}/items/${itemId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout de l\'élément à la collection');
      }

      // Recharger les collections pour mettre à jour les données
      await loadCollections();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveItemFromCollection = async (collectionId, itemId) => {
    try {
      const response = await fetch(`/api/collections/${collectionId}/items/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'élément de la collection');
      }

      // Recharger les collections pour mettre à jour les données
      await loadCollections();
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelCollectionEdit = () => {
    setEditingCollection(null);
    setNewCollection({ name: '', description: '' });
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sample React + Express App</h1>
        <p>Un projet de test pour Jenkins CI/CD</p>

        {/* Navigation par onglets */}
        <nav className="tabs-nav">
          <button
            className={`tab-button ${activeTab === 'items' ? 'active' : ''}`}
            onClick={() => setActiveTab('items')}
          >
            📝 Éléments ({items.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'collections' ? 'active' : ''}`}
            onClick={() => setActiveTab('collections')}
          >
            📁 Collections ({collections.length})
          </button>
        </nav>
      </header>

      <main className="App-main">
        {error && (
          <div className="error-message">
            ❌ Erreur : {error}
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {activeTab === 'items' && (
          <>
            {/* Section Items */}
            <section className="form-section">
              <h2>{editingItem ? 'Modifier l\'élément' : 'Ajouter un nouvel élément'}</h2>
              <form onSubmit={editingItem ? handleUpdate : handleSubmit} className="item-form">
                <div className="form-group">
                  <label htmlFor="name">Nom :</label>
                  <input
                    type="text"
                    id="name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Entrez le nom"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description :</label>
                  <textarea
                    id="description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Entrez la description"
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingItem ? 'Modifier' : 'Ajouter'}
                  </button>
                  {editingItem && (
                    <button type="button" onClick={cancelEdit} className="btn btn-secondary">
                      Annuler
                    </button>
                  )}
                </div>
              </form>
            </section>

            <section className="items-section">
              <h2>Éléments ({items.length})</h2>
              {items.length === 0 ? (
                <p className="no-items">Aucun élément pour le moment.</p>
              ) : (
                <div className="items-grid">
                  {items.map((item) => (
                    <div key={item.id} className="item-card">
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      <small>Créé le : {new Date(item.createdAt).toLocaleDateString()}</small>
                      <div className="item-actions">
                        <button onClick={() => handleEdit(item)} className="btn btn-edit">
                          ✏️ Modifier
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="btn btn-delete">
                          🗑️ Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === 'collections' && (
          <>
            {/* Section Collections */}
            <section className="form-section">
              <h2>{editingCollection ? 'Modifier la collection' : 'Créer une nouvelle collection'}</h2>
              <form onSubmit={editingCollection ? handleCollectionUpdate : handleCollectionSubmit} className="item-form">
                <div className="form-group">
                  <label htmlFor="collection-name">Nom :</label>
                  <input
                    type="text"
                    id="collection-name"
                    value={newCollection.name}
                    onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                    placeholder="Entrez le nom de la collection"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="collection-description">Description :</label>
                  <textarea
                    id="collection-description"
                    value={newCollection.description}
                    onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                    placeholder="Entrez la description (optionnel)"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingCollection ? 'Modifier' : 'Créer'}
                  </button>
                  {editingCollection && (
                    <button type="button" onClick={cancelCollectionEdit} className="btn btn-secondary">
                      Annuler
                    </button>
                  )}
                </div>
              </form>
            </section>

            <section className="collections-section">
              <h2>Collections ({collections.length})</h2>
              {collections.length === 0 ? (
                <p className="no-items">Aucune collection pour le moment.</p>
              ) : (
                <div className="collections-grid">
                  {collections.map((collection) => (
                    <div key={collection.id} className="collection-card">
                      <h3>{collection.name}</h3>
                      {collection.description && <p>{collection.description}</p>}
                      <small>Créé le : {new Date(collection.createdAt).toLocaleDateString()}</small>

                      <div className="collection-items">
                        <h4>Éléments dans cette collection ({collection.itemDetails?.length || 0}) :</h4>
                        {collection.itemDetails && collection.itemDetails.length > 0 ? (
                          <ul className="collection-item-list">
                            {collection.itemDetails.map((item) => (
                              <li key={item.id} className="collection-item">
                                <span>{item.name}</span>
                                <button
                                  onClick={() => handleRemoveItemFromCollection(collection.id, item.id)}
                                  className="btn btn-remove-item"
                                  title="Retirer de la collection"
                                >
                                  ❌
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="no-collection-items">Aucun élément dans cette collection</p>
                        )}
                      </div>

                      {/* Sélecteur pour ajouter des items */}
                      <div className="add-item-to-collection">
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAddItemToCollection(collection.id, parseInt(e.target.value));
                              e.target.value = ''; // Reset select
                            }
                          }}
                          defaultValue=""
                        >
                          <option value="">Ajouter un élément...</option>
                          {items
                            .filter(item => !collection.items.includes(item.id))
                            .map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="collection-actions">
                        <button onClick={() => handleCollectionEdit(collection)} className="btn btn-edit">
                          ✏️ Modifier
                        </button>
                        <button onClick={() => handleCollectionDelete(collection.id)} className="btn btn-delete">
                          🗑️ Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        <section className="stats-section">
          <h2>Statistiques</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{items.length}</h3>
              <p>Éléments totaux</p>
            </div>
            <div className="stat-card">
              <h3>{collections.length}</h3>
              <p>Collections totales</p>
            </div>
            <div className="stat-card">
              <h3>React + Express</h3>
              <p>Stack technique</p>
            </div>
            <div className="stat-card">
              <h3>Jenkins</h3>
              <p>CI/CD intégré</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="App-footer">
        <p>Sample Project for Jenkins CI/CD Testing - Version 1.0.0</p>
      </footer>
    </div>
  );
}

export default App;