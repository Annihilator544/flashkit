import * as mobx from 'mobx';
import { createContext, useContext } from 'react';
import localforage from 'localforage';

import * as api from './api';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

window.localforage = localforage;

export const ProjectContext = createContext({});

export const useProject = () => useContext(ProjectContext);

const getFromStorage = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
};

const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {}
};

class Project {
  id = '';
  name = '';
  user = {};
  skipSaving = false;
  cloudEnabled = false;
  imagesList = [];
  status = 'saved'; // or 'has-changes' or 'saving' or 'loading'
  language = getFromStorage('polotno-language') || navigator.language || 'en';
  designsLength = 0;

  constructor({ store }) {
    mobx.makeAutoObservable(this);
    this.store = store;

    store.on('change', () => {
      this.requestSave(null);
    });

    // setInterval(() => {
    //   mobx.runInAction(() => {
    //     this.cloudEnabled = window.puter?.auth?.isSignedIn();
    //   });
    // }, 100);
  }

  setLanguage(lang) {
    this.language = lang;
    setToStorage('polotno-language', lang);
  }

  requestSave() {
    this.status = 'has-changes';
    if (this.saveTimeout) {
      return;
    }
    this.saveTimeout = setTimeout(() => {
      this.saveTimeout = null;
      // skip autosave if no project opened
      this.save();
    }, 5000);
  }

  async firstLoad() {
    const deprecatedDesign = await localforage.getItem('polotno-state');
    this.imagesList = [];
    if (deprecatedDesign) {
      this.store.loadJSON(deprecatedDesign);
      await localforage.removeItem('polotno-state');
      await this.save(null);
      return;
    }
    const lastDesignId = await localforage.getItem('polotno-last-design-id');
    if (lastDesignId) {
      await this.loadById(lastDesignId);
    }
  }

  async loadById(id) {
    this.id = id;
    await localforage.setItem('polotno-last-design-id', id);
    this.status = 'loading';
    try {
      const { storeJSON, name } = await api.loadById({
        id,
      });
      if (storeJSON) {
        this.store.loadJSON(storeJSON);
      }
      this.name = name;
    } catch (e) {
      console.error(e);
      this.id = '';
      this.name = 'Untitled Design';
      await localforage.removeItem('polotno-last-design-id');
    }
    this.status = 'saved';
  }

  updateUrlWithProjectId() {
    if (!this.id || this.id === 'local') {
      window.history.replaceState({}, null, `/`);
      return;
    }
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);
    params.set('id', this.id);
    window.history.replaceState({}, null, `/design/${this.id}`);
  }

  async save() {
    this.status = 'saving';
    const bucketNamePersonal = 'flashkitpersonalsharebucket';
    const storeJSON = this.store.toJSON();
    const maxWidth = 1080;
    const s3Client = new S3Client({
      region: 'eu-west-2', // e.g., 'us-east-1'
      credentials: {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      }
    });
    const Shareable = await this.getUploadJSON({ json: storeJSON })
    const preview = await this.getUploadImage();
    const canvas = await this.store._toCanvas({
      pixelRatio: maxWidth / this.store.activePage?.computedWidth,
      pageId: this.store.activePage?.id,
    });
    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.9);
    });
    const authStorage = localStorage.getItem('auth-storage');

    // Since localStorage returns a string, we need to parse it as JSON
    const authObject = JSON.parse(authStorage);
    
    // Now you can safely access the UID
    const uid = authObject?.state?.user?.uid;
    try {
      if(uid){
      const command = new PutObjectCommand({
        Bucket: bucketNamePersonal,
        Key: `${uid}/shared/${this.id}.json`,
        Body: Shareable,
        ContentType: 'application/json',
      });
      const commandImage = new PutObjectCommand({
        Bucket: bucketNamePersonal,
        Key: `${uid}/shared/${this.id}.jpg`,
        Body: preview,
        ContentType: 'image/jpeg',
      });
      await s3Client.send(command);
      await s3Client.send(commandImage);
    }
      const res = await api.saveDesign({
        storeJSON,
        preview: blob,
        id: this.id,
        name: this.name,
      });
      if (res.status === 'saved') {
        this.id = res.id;
        await localforage.setItem('polotno-last-design-id', res.id);
      }
    } catch (e) {
      console.error(e);
    }
    finally{
      if(this.id !== ''){
      this.getPreviewImages()
      }
    }
    this.status = 'saved';
  }

  async getPreviewImages(){
      this.imagesList = [];
        try{
        this.store.pages.forEach(async (page) => {
          const img = await this.store.toDataURL({ pageId: page.id, mimeType: 'image/jpeg', pixelRatio: 2, quickMode: true });
          this.imagesList.push(img);
        });
      }catch(e){
        console.log(e);
      }
  }

  async getUploadJSON({ json }){
    this.status = 'saving';
    const lastModified = new Date().toISOString();
    this.status = 'saved';
    return JSON.stringify({
      name: this.name,
      id: this.id,
      lastModified: lastModified,
      json: json,
    });
  }

  async getUploadImage(){
    const maxWidth = 1080;
    const canvas = await this.store._toCanvas({
      pixelRatio: maxWidth / this.store.activePage?.computedWidth,
      pageId: this.store.activePage?.id,
    });
    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.9);
    });
    return blob;
  }

  async duplicate() {
    this.id = '';
    this.save(null);
  }

  async clear() {
    this.store.clear();
    this.store.addPage();
    await localforage.removeItem('polotno-last-design-id');
  }

  async createNewDesign() {
    await this.clear();
    this.name = 'Untitled Design';
    this.id = '';
    this.store.openSidePanel('templates');
    console.log('saving');
    await this.save(null);
    console.log('saving done');
  }

  // async signIn() {
  //   await window.puter.auth.signIn();
  //   this.designsLength = await api.backupFromLocalToCloud();
  // }
}

export const createProject = (...args) => new Project(...args);
export default createProject;
