import React, { useState, useEffect } from 'react';
import { PlusCircle, Settings, X, Edit2 } from 'lucide-react';
import { RouletteWheel } from './components/RouletteWheel';
import { RouletteEditor } from './components/RouletteEditor';
import { Roulette, RouletteItem } from './types';

const DEFAULT_ROULETTE: Roulette = {
  id: crypto.randomUUID(),
  name: '新しいルーレット',
  items: [
    { id: '1', text: '項目1', weight: 1, color: '#FF6B6B' },
    { id: '2', text: '項目2', weight: 1, color: '#4ECDC4' },
    { id: '3', text: '項目3', weight: 1, color: '#45B7D1' },
  ],
};

function App() {
  const [roulettes, setRoulettes] = useState<Roulette[]>(() => {
    const saved = localStorage.getItem('roulettes');
    return saved ? JSON.parse(saved) : [DEFAULT_ROULETTE];
  });
  
  const [selectedRoulette, setSelectedRoulette] = useState<Roulette>(roulettes[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [result, setResult] = useState<RouletteItem | null>(null);

  useEffect(() => {
    localStorage.setItem('roulettes', JSON.stringify(roulettes));
  }, [roulettes]);

  const addNewRoulette = () => {
    const newRoulette = {
      ...DEFAULT_ROULETTE,
      id: crypto.randomUUID(),
    };
    setRoulettes([...roulettes, newRoulette]);
    setSelectedRoulette(newRoulette);
    setIsEditing(true);
  };

  const saveRoulette = (updatedRoulette: Roulette) => {
    setRoulettes(roulettes.map(r => 
      r.id === updatedRoulette.id ? updatedRoulette : r
    ));
    setSelectedRoulette(updatedRoulette);
    setIsEditing(false);
  };

  const updateRouletteName = (newName: string) => {
    const updatedRoulette = { ...selectedRoulette, name: newName };
    saveRoulette(updatedRoulette);
    setIsEditingName(false);
  };

  const deleteRoulette = (id: string) => {
    const newRoulettes = roulettes.filter(r => r.id !== id);
    setRoulettes(newRoulettes);
    if (selectedRoulette.id === id) {
      setSelectedRoulette(newRoulettes[0]);
    }
  };

  const handleSpinEnd = (item: RouletteItem) => {
    setResult(item);
  };

  const selectRoulette = (roulette: Roulette) => {
    setSelectedRoulette(roulette);
    setIsEditing(false);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">カスタムルーレット</h1>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {roulettes.map(roulette => (
              <div
                key={roulette.id}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer
                  ${selectedRoulette.id === roulette.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'}
                `}
                onClick={() => selectRoulette(roulette)}
              >
                <span>{roulette.name}</span>
                {roulettes.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteRoulette(roulette.id);
                    }}
                    className="p-1 hover:text-red-500"
                    aria-label="削除"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            
            <button
              onClick={addNewRoulette}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
            >
              <PlusCircle size={20} />
              新規作成
            </button>
          </div>
        </header>

        <main className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-4">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={selectedRoulette.name}
                      onChange={(e) => setSelectedRoulette({ ...selectedRoulette, name: e.target.value })}
                      onBlur={(e) => updateRouletteName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && updateRouletteName(e.currentTarget.value)}
                      className="text-xl font-semibold px-2 py-1 border rounded"
                      autoFocus
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">{selectedRoulette.name}</h2>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 text-gray-600 hover:text-gray-800"
                >
                  <Settings size={24} />
                </button>
              </div>
              
              <RouletteWheel
                items={selectedRoulette.items}
                onSpinEnd={handleSpinEnd}
              />

              {result && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-lg font-medium">結果:</p>
                  <p className="text-2xl font-bold text-blue-600">{result.text}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            {isEditing ? (
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <RouletteEditor
                  roulette={selectedRoulette}
                  onSave={saveRoulette}
                />
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-4">項目一覧</h3>
                <ul className="space-y-2">
                  {selectedRoulette.items.map(item => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.text}</span>
                      <span className="text-sm text-gray-500 ml-auto">
                        重み: {item.weight}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;