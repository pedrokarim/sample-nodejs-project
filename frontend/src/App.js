import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', description: '' });
  const [editingItem, setEditingItem] = useState(null);

  // Charger les éléments au démarrage
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/items');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des données');
      }
      const data = await response.json();
      setItems(data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sample React + Express App</h1>
        <p>Un projet de test pour Jenkins CI/CD</p>
      </header>

      <main className="App-main">
        {error && (
          <div className="error-message">
            ❌ Erreur : {error}
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

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

        <section className="stats-section">
          <h2>Statistiques</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{items.length}</h3>
              <p>Éléments totaux</p>
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