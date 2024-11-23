import {create} from 'zustand';

export const useEngagementData = create((set) => ({
    Engagement: {},
    setEngagement: (data) => set({Engagement: data})
}),
{
    name: 'EQSStorage', // required, this is the key used in storage
    storage: sessionStorage, // optional, defaults to localStorage
    serialize: (state) => JSON.stringify(state), // Convert state to JSON string
    deserialize: (str) => JSON.parse(str), // Parse JSON string back to object
});