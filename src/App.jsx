import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Trash2, Plus, ExternalLink, Loader2 } from 'lucide-react';
import { useStore } from './store';

function App() {
  const { topics, setTopics, reorder, deleteTopic, addTopic } = useStore();
  const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Requirement: API Integration
        const res = await axios.get('https://node.codolio.com/api/question-tracker/v1/sheet/public/get-sheet-by-slug/striver-sde-sheet');
        
        // Deep access to the sections array
        const sections = res.data?.data?.sections;

        if (sections && Array.isArray(sections)) {
          const formatted = sections.map(s => ({
            id: s._id || Math.random().toString(),
            title: s.title,
            questions: s.questions || []
          }));
          setTopics(formatted);
        }
      } catch (err) { 
        console.error("API Error:", err); 
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const onDragEnd = (result) => {
    if (!result.destination) return;
    reorder(result.source.index, result.destination.index);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <header className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Codolio Question Tracker</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your Striver SDE Sheet progress</p>
        </div>
        <button 
          onClick={() => addTopic("New Topic")}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-blue-900/20"
        >
          <Plus size={18} /> Add Topic
        </button>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin mb-4" size={32} />
          <p>Hydrating your tracker...</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="topics">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {topics.map((topic, index) => (
                  <Draggable key={topic.id} draggableId={topic.id} index={index}>
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef} 
                        {...provided.draggableProps} 
                        className={`bg-[#161b2a] border ${snapshot.isDragging ? 'border-blue-500' : 'border-slate-800'} rounded-xl overflow-hidden shadow-2xl transition-colors`}
                      >
                        <div className="p-4 flex items-center justify-between bg-[#1c2333]">
                          <div className="flex items-center gap-4">
                            <div {...provided.dragHandleProps} className="text-slate-500 hover:text-white cursor-grab active:cursor-grabbing">
                              <GripVertical size={20} />
                            </div>
                            <h2 className="font-bold text-blue-400 uppercase text-xs tracking-widest">{topic.title}</h2>
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full uppercase">
                              {topic.questions.length} Questions
                            </span>
                          </div>
                          <button 
                            onClick={() => deleteTopic(topic.id)} 
                            className="text-slate-500 hover:text-red-400 transition-colors p-1"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        
                        <div className="p-4 space-y-2 bg-[#0b0f1a]">
                          {topic.questions.length > 0 ? (
                            topic.questions.map((q, i) => (
                              <div key={`${topic.id}-q-${i}`} className="flex justify-between items-center p-3 rounded-lg border border-slate-800 bg-[#161b2a] hover:border-slate-600 transition-all group">
                                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{q.title}</span>
                                <a 
                                  href={q.url} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="text-slate-500 hover:text-blue-400 p-1"
                                >
                                  <ExternalLink size={14} />
                                </a>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-slate-600 italic py-2">No questions in this topic yet.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      
      {topics.length === 0 && !loading && (
        <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl">
          <p className="text-slate-500">No topics found. Start by adding a new one!</p>
        </div>
      )}
    </div>
  );
}

export default App;