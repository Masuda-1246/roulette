import React, { useState } from 'react';
import { PlusCircle, Trash2, Save } from 'lucide-react';
import { Roulette, RouletteItem } from '../types';

interface Props {
  roulette: Roulette;
  onSave: (roulette: Roulette) => void;
}

export const RouletteEditor: React.FC<Props> = ({ roulette, onSave }) => {
  const [items, setItems] = useState<RouletteItem[]>(roulette.items);
  const [name, setName] = useState(roulette.name);

  const addItem = () => {
    const newItem: RouletteItem = {
      id: crypto.randomUUID(),
      text: '新しい項目',
      weight: 1,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, updates: Partial<RouletteItem>) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const handleSave = () => {
    onSave({
      ...roulette,
      name,
      items,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">ルーレット名</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center gap-2">
            <input
              type="text"
              value={item.text}
              onChange={(e) => updateItem(item.id, { text: e.target.value })}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="項目名"
            />
            <input
              type="number"
              value={item.weight}
              onChange={(e) => updateItem(item.id, { weight: Number(e.target.value) })}
              className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="1"
              step="1"
            />
            <input
              type="color"
              value={item.color}
              onChange={(e) => updateItem(item.id, { color: e.target.value })}
              className="w-10 h-10 rounded cursor-pointer"
            />
            <button
              onClick={() => removeItem(item.id)}
              className="p-2 text-red-600 hover:text-red-800"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={addItem}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <PlusCircle size={20} />
          項目を追加
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Save size={20} />
          保存
        </button>
      </div>
    </div>
  );
};