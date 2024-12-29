import {create} from 'zustand';

export const useSyncState = create((set) => ({
    syncing: false,
    setSyncing: (syncing) => set({syncing: syncing})
}));