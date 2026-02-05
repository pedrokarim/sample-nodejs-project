import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || '/api';

function App() {
  const [activeTab, setActiveTab] = useState('items');
  const [items, setItems] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', description: '' });
  const [newCollection, setNewCollection] = useState({ name: '', description: '' });
  const [editingItem, setEditingItem] = useState(null);
  const [editingCollection, setEditingCollection] = useState(null);

  useEffect(() => {
    Promise.all([loadItems(), loadCollections()]).finally(() => setLoading(false));
  }, []);

  const loadItems = async () => {
    try {
      const response = await fetch(`${API_URL}/items`);
      if (!response.ok) throw new Error('Erreur lors du chargement des elements');
      const data = await response.json();
      setItems(data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadCollections = async () => {
    try {
      const response = await fetch(`${API_URL}/collections`);
      if (!response.ok) throw new Error('Erreur lors du chargement des collections');
      const data = await response.json();
      setCollections(data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newItem.name.trim() || !newItem.description.trim()) return;
    try {
      const response = await fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (!response.ok) throw new Error('Erreur lors de la creation');
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
    if (!editingItem || !newItem.name.trim() || !newItem.description.trim()) return;
    try {
      const response = await fetch(`${API_URL}/items/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (!response.ok) throw new Error('Erreur lors de la mise a jour');
      const data = await response.json();
      setItems(items.map(item => item.id === editingItem.id ? data.data : item));
      setEditingItem(null);
      setNewItem({ name: '', description: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet element ?')) return;
    try {
      const response = await fetch(`${API_URL}/items/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setNewItem({ name: '', description: '' });
  };

  const handleCollectionSubmit = async (e) => {
    e.preventDefault();
    if (!newCollection.name.trim()) return;
    try {
      const response = await fetch(`${API_URL}/collections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCollection),
      });
      if (!response.ok) throw new Error('Erreur lors de la creation de la collection');
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
    if (!editingCollection || !newCollection.name.trim()) return;
    try {
      const response = await fetch(`${API_URL}/collections/${editingCollection.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCollection),
      });
      if (!response.ok) throw new Error('Erreur lors de la mise a jour de la collection');
      const data = await response.json();
      setCollections(collections.map(c => c.id === editingCollection.id ? data.data : c));
      setEditingCollection(null);
      setNewCollection({ name: '', description: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCollectionDelete = async (id) => {
    if (!window.confirm('Supprimer cette collection ?')) return;
    try {
      const response = await fetch(`${API_URL}/collections/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erreur lors de la suppression de la collection');
      setCollections(collections.filter(c => c.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddItemToCollection = async (collectionId, itemId) => {
    try {
      const response = await fetch(`${API_URL}/collections/${collectionId}/items/${itemId}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error("Erreur lors de l'ajout a la collection");
      await loadCollections();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveItemFromCollection = async (collectionId, itemId) => {
    try {
      const response = await fetch(`${API_URL}/collections/${collectionId}/items/${itemId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erreur lors du retrait de la collection');
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
    return (
      <div className="loading">
        <div className="loading-spinner" />
        <span className="loading-text">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-brand">
          <h1>Sample<span>App</span></h1>
          <p>Dashboard CI/CD</p>
        </div>

        <nav className="tabs-nav">
          <button
            className={`tab-button ${activeTab === 'items' ? 'active' : ''}`}
            onClick={() => setActiveTab('items')}
          >
            Elements <span className="tab-count">{items.length}</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'collections' ? 'active' : ''}`}
            onClick={() => setActiveTab('collections')}
          >
            Collections <span className="tab-count">{collections.length}</span>
          </button>
        </nav>
      </header>

      <main className="App-main">
        {error && (
          <div className="error-message">
            <span>{error}</span>
            <button onClick={() => setError(null)}>&#10005;</button>
          </div>
        )}

        {activeTab === 'items' && (
          <>
            <section className="form-section">
              <div className="section-header">
                <div className="section-icon purple">+</div>
                <h2>{editingItem ? 'Modifier un element' : 'Nouvel element'}</h2>
              </div>
              <form onSubmit={editingItem ? handleUpdate : handleSubmit} className="item-form">
                <div className="form-group">
                  <label htmlFor="name">Nom</label>
                  <input
                    type="text"
                    id="name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Nom de l'element"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <input
                    type="text"
                    id="description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Description courte"
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingItem ? 'Enregistrer' : 'Ajouter'}
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
              <div className="section-header">
                <div className="section-icon green">#</div>
                <h2>Elements ({items.length})</h2>
              </div>
              {items.length === 0 ? (
                <p className="no-items">Aucun element pour le moment.</p>
              ) : (
                <div className="items-grid">
                  {items.map((item) => (
                    <div key={item.id} className="item-card">
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      <small>{new Date(item.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</small>
                      <div className="item-actions">
                        <button onClick={() => handleEdit(item)} className="btn btn-edit">
                          Modifier
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="btn btn-delete">
                          Supprimer
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
            <section className="form-section">
              <div className="section-header">
                <div className="section-icon purple">+</div>
                <h2>{editingCollection ? 'Modifier la collection' : 'Nouvelle collection'}</h2>
              </div>
              <form onSubmit={editingCollection ? handleCollectionUpdate : handleCollectionSubmit} className="item-form">
                <div className="form-group">
                  <label htmlFor="collection-name">Nom</label>
                  <input
                    type="text"
                    id="collection-name"
                    value={newCollection.name}
                    onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                    placeholder="Nom de la collection"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="collection-description">Description</label>
                  <input
                    type="text"
                    id="collection-description"
                    value={newCollection.description}
                    onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                    placeholder="Description (optionnel)"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingCollection ? 'Enregistrer' : 'Creer'}
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
              <div className="section-header">
                <div className="section-icon amber">&amp;</div>
                <h2>Collections ({collections.length})</h2>
              </div>
              {collections.length === 0 ? (
                <p className="no-items">Aucune collection pour le moment.</p>
              ) : (
                <div className="collections-grid">
                  {collections.map((collection) => (
                    <div key={collection.id} className="collection-card">
                      <h3>{collection.name}</h3>
                      {collection.description && <p>{collection.description}</p>}
                      <small>{new Date(collection.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</small>

                      <div className="collection-items">
                        <h4>Elements ({collection.itemDetails?.length || 0})</h4>
                        {collection.itemDetails && collection.itemDetails.length > 0 ? (
                          <ul className="collection-item-list">
                            {collection.itemDetails.map((item) => (
                              <li key={item.id} className="collection-item">
                                <span>{item.name}</span>
                                <button
                                  onClick={() => handleRemoveItemFromCollection(collection.id, item.id)}
                                  className="btn-remove-item"
                                  title="Retirer"
                                >
                                  &#10005;
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="no-collection-items">Aucun element</p>
                        )}
                      </div>

                      <div className="add-item-to-collection">
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAddItemToCollection(collection.id, parseInt(e.target.value));
                              e.target.value = '';
                            }
                          }}
                          defaultValue=""
                        >
                          <option value="">Ajouter un element...</option>
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
                          Modifier
                        </button>
                        <button onClick={() => handleCollectionDelete(collection.id)} className="btn btn-delete">
                          Supprimer
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
          <div className="section-header">
            <div className="section-icon purple">=</div>
            <h2>Statistiques</h2>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{items.length}</div>
              <div className="stat-label">Elements</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{collections.length}</div>
              <div className="stat-label">Collections</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">React</div>
              <div className="stat-label">Frontend</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">Express</div>
              <div className="stat-label">Backend</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="App-footer">
        <p>SampleApp v1.0.0 &mdash; Jenkins CI/CD</p>
      </footer>
    </div>
  );
}

export default App;
