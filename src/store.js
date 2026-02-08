import { create } from 'zustand';

export const useStore = create((set) => ({
  topics: [],
  
  // Requirement: Add/Set Topics
  setTopics: (topics) => set({ topics }),
  
  // Requirement: Add/Edit/Delete
  addTopic: (title) => set((state) => ({
    topics: [...state.topics, { id: `topic-${Date.now()}`, title, questions: [] }]
  })),
  
  deleteTopic: (id) => set((state) => ({
    topics: state.topics.filter(t => t.id !== id)
  })),

  // Requirement: Reorder (Drag and Drop Logic)
  reorder: (sourceIndex, destinationIndex) => set((state) => {
    const newTopics = Array.from(state.topics);
    const [removed] = newTopics.splice(sourceIndex, 1);
    newTopics.splice(destinationIndex, 0, removed);
    return { topics: newTopics };
  }),
}));