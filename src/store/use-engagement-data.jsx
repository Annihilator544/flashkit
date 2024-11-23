import {create} from 'zustand';
import { persist } from 'zustand/middleware';

export const useEngagementData = create(
    persist((set) => ({
    Engagement: {},
    setEngagement: (data) => set({Engagement: data})
}),
{
    name: 'EQSStorage', // required, this is the key used in storage
    storage: localStorage, // optional, defaults to localStorage
    serialize: (state) => JSON.stringify(state), // Convert state to JSON string
    deserialize: (str) => JSON.parse(str), // Parse JSON string back to object
}));