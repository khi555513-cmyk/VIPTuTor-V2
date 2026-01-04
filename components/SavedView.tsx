import React from 'react';
import { SavedKnowledgeItem } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { Trash2, Calendar } from 'lucide-react';

interface SavedViewProps {
  items: SavedKnowledgeItem[];
  onDelete: (id: string) => void;
}

const SavedView: React.FC<SavedViewProps> = ({ items, onDelete }) => {
  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="h-16 border-b flex items-center px-6 bg-white shadow-sm">
        <h1 className="font-bold text-xl text-gray-800">Knowledge Base</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        {items.length === 0 ? (
           <div className="text-center text-gray-400 mt-20">
             <p>No knowledge saved yet.</p>
             <p className="text-sm mt-1">Click the save icon on tutor messages to add them here.</p>
           </div>
        ) : (
          <div className="grid gap-6 max-w-4xl mx-auto">
            {items.slice().reverse().map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.savedAt).toLocaleString()}
                    </div>
                  </div>
                  <button 
                    onClick={() => onDelete(item.id)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-6 text-sm text-gray-700">
                   <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                     <MarkdownRenderer content={item.content} />
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedView;
