import {create} from 'zustand';
import { persist } from 'zustand/middleware';

export const useInstagramData = create(
    persist((set) => ({
    instagramData: {
        posts:[],
        stories: [],
        userData: {
            id: '',
            ig_id:'',
            media_count: 0,
            username: '',
            profile_picture_url: '',
            followers_count: 0,
            follows_count: 0,
            biography: '',
            name: ''
        },
        daily: {},
        monthly: {},
        yearly: {},
        extraMetrics: {},
        demographicData: {},
        lastFetched: new Date()
    },
    instagramCalculatedData: {
        totalImpressions: 0,
        totalReach: 0,
        percentageChangeFollowers: 0,
        percentageChangeImpressions: 0,
        percentageChangeReach: 0,
        topCountry: '',
        numberOfDaysOfData: 0
    },
    instagramEQS:{
        eqsPercentage: 0,
        eqsPercentageChange: 0,
    },
    instagramEQSText: "",
    setInstagramEQS: (data) => set({instagramEQS: data}),
    setInstagramEQSText: (data) => set({instagramEQSText: data}),
    setPostData: (posts) => set((state) => ({ instagramData: { ...state.instagramData, posts : posts } })),
    setStoryData: (stories) => set((state) => ({ instagramData: { ...state.instagramData, stories : stories } })),
    setUserData: (userData) => set((state) => ({ instagramData: { ...state.instagramData, userData : userData } })),
    setDaily: (daily) => set((state) => ({ instagramData: { ...state.instagramData, daily : daily } })),
    setMonthly: (monthly) => set((state) => ({ instagramData: { ...state.instagramData, monthly : monthly } })),
    setYearly: (yearly) => set((state) => ({ instagramData: { ...state.instagramData, yearly : yearly } })),
    setLastFetched: (lastFetched) => set((state) => ({ instagramData: { ...state.instagramData, lastFetched : lastFetched } })),
    setExtraMetrics: (extraMetrics) => set((state) => ({ instagramData: { ...state.instagramData, extraMetrics : extraMetrics } })),
    setDemographicData: (demographicData) => set((state) => ({ instagramData: { ...state.instagramData, demographicData : demographicData } })),
    setInstagramData: (instagramData) => set((state) => ({ instagramData: instagramData })),
    setInstagramCalculatedData: (instagramCalculatedData) => set((state) => ({ instagramCalculatedData: instagramCalculatedData }))
}),
{
    name: 'InstagramStorage', // required, this is the key used in storage
    storage: localStorage, // optional, defaults to localStorage
    serialize: (state) => JSON.stringify(state), // Convert state to JSON string
    deserialize: (str) => JSON.parse(str), // Parse JSON string back to object
}));