import { nanoid } from 'nanoid';
import localforage from 'localforage';
import { dataURLtoBlob } from './blob';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import React from 'react';

const isSignedIn = () => {
  // return window.puter?.auth?.isSignedIn();
  return false;
};

async function writeFile(fileName, data) {
  if (isSignedIn()) {
    //await window.puter.fs.write(fileName, data, { createMissingParents: true });
  } else {
    await localforage.setItem(fileName, data);
  }
}

async function readFile(fileName) {
  if (isSignedIn()) {
    //return await window.puter.fs.read(fileName);
  }
  return await localforage.getItem(fileName);
}

async function deleteFile(fileName) {
  if (isSignedIn()) {
    //return await window.puter.fs.delete(fileName);
  }
  return await localforage.removeItem(fileName);
}

async function readKv(key) {
  if (isSignedIn()) {
    //return await window.puter.kv.get(key);
  } else {
    return await localforage.getItem(key);
  }
}

async function writeKv(key, value) {
  if(key==='designs-list'){
    const authStorage = localStorage.getItem('auth-storage');
    const authObject = JSON.parse(authStorage);
    const uid = authObject?.state?.user?.uid;
    const region = "eu-west-2";
    const credentials = {
      accessKeyId: process.env.REACT_APP_DYNAMO_DB_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_DYNAMO_DB_AWS_SECRET_ACCESS_KEY
    };
    const ddbClient = new DynamoDBClient({ region, credentials });
    const docClient = DynamoDBDocumentClient.from(ddbClient);
    const tableName = "flashkitUserData";
    const params = {
      TableName: tableName,
      Key: { uid: uid },
      UpdateExpression: 'SET designsList = :new_items',
      ExpressionAttributeValues: {
        ':new_items': value,
      },
      ReturnValues: 'ALL_NEW',
    };
    await docClient.send(new UpdateCommand(params));
  }
  return await localforage.setItem(key, value);
}

// export async function backupFromLocalToCloud() {
//   const localDesigns = (await localforage.getItem('designs-list')) || [];
//   for (const design of localDesigns) {
//     const storeJSON = await localforage.getItem(`designs/${design.id}.json`);
//     const preview = await localforage.getItem(`designs/${design.id}.jpg`);
//     await writeFile(`designs/${design.id}.json`, storeJSON);
//     await writeFile(`designs/${design.id}.jpg`, preview);
//   }
//   const cloudDesigns = (await window.puter.kv.get('designs-list')) || [];
//   cloudDesigns.push(...localDesigns);
//   await window.puter.kv.set('designs-list', cloudDesigns);
//   await localforage.removeItem('designs-list');
//   for (const design of localDesigns) {
//     await localforage.removeItem(`designs/${design.id}.json`);
//     await localforage.removeItem(`designs/${design.id}.jpg`);
//   }
//   return cloudDesigns.length;
// }

export async function listDesigns() {
  return (await readKv('designs-list')) || [];
}

export async function listFilteredDesigns( filter , dateFilter) {
  const list = await listDesigns();
  if(!filter && !dateFilter){
    return list;
  }
  if(filter && dateFilter){
    return list.filter((design) => design.name.toLowerCase().includes(filter.toLowerCase()) && design.lastModified.includes(dateFilter));
  }
  if(dateFilter){
    return list.filter((design) => design.lastModified.includes(dateFilter));
  }
  return list.filter((design) => design.name.toLowerCase().includes(filter.toLowerCase()));
}

export async function listOfflineChanges() {
  return (await readKv('offline-changes')) || [];
}

export async function deleteDesign({ id }) {
  const authStorage = localStorage.getItem('auth-storage');
  const authObject = JSON.parse(authStorage);
  const uid = authObject?.state?.user?.uid;
  const bucketNamePersonal = 'flashkitpersonalbucket';
  const s3Client = new S3Client({
        region: 'eu-west-2', // e.g., 'us-east-1'
        credentials: {
          accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        }
      });
  if(uid){
      const command = new DeleteObjectCommand({
        Bucket: bucketNamePersonal,
        Key: `${uid}/shared/${id}.json`,
      });
      const commandImage = new DeleteObjectCommand({
        Bucket: bucketNamePersonal,
        Key: `${uid}/shared/${id}.jpg`,
      });
      if(window.navigator.onLine){
        await s3Client.send(command);
        await s3Client.send(commandImage);
      }
      else{
        const list = await listOfflineChanges();
        const map = new Map(list);
        map.set(`${uid}/delete/${id}.json`, `${uid}/shared/${id}.json`);
        map.set(`${uid}/delete/${id}.jpg`, `${uid}/shared/${id}.jpg`);
        await localforage.setItem('offline-changes', Array.from(map));
      }
    }
  const list = await listDesigns();
  const newList = list.filter((design) => design.id !== id);
  await writeKv('designs-list', newList);
  await deleteFile(`designs/${id}.json`);
  await deleteFile(`designs/${id}.jpg`);
}

export async function deleteMultipleDesigns({ ids }) {
  const authStorage = localStorage.getItem('auth-storage');
  const authObject = JSON.parse(authStorage);
  const uid = authObject?.state?.user?.uid;
  const bucketNamePersonal = 'flashkitpersonalbucket';
  const s3Client = new S3Client({
        region: 'eu-west-2', // e.g., 'us-east-1'
        credentials: {
          accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        }
      });
  if(uid){
    for(const id of ids){
      const command = new DeleteObjectCommand({
        Bucket: bucketNamePersonal,
        Key: `${uid}/shared/${id}.json`,
      });
      const commandImage = new DeleteObjectCommand({
        Bucket: bucketNamePersonal,
        Key: `${uid}/shared/${id}.jpg`,
      });
      if(window.navigator.onLine){
        await s3Client.send(command);
        await s3Client.send(commandImage);
      }
      else{
        const list = await listOfflineChanges();
        const map = new Map(list);
        map.set(`${uid}/delete/${id}.json`, `${uid}/shared/${id}.json`);
        map.set(`${uid}/delete/${id}.jpg`, `${uid}/shared/${id}.jpg`);
        await localforage.setItem('offline-changes', Array.from(map));
      }
    }
  }
  const list = await listDesigns();
  const newList = list.filter((design) => !ids.includes(design.id));
  await writeKv('designs-list', newList);
  for(const id of ids){
    await deleteFile(`designs/${id}.json`);
    await deleteFile(`designs/${id}.jpg`);
  }
}

export async function loadById({ id }) {
  let storeJSON = await readFile(`designs/${id}.json`);
  const list = await listDesigns();
  const design = list.find((design) => design.id === id);
  // if it is blob, convert to JSON
  if (storeJSON instanceof Blob) {
    storeJSON = JSON.parse(await storeJSON.text());
  } else if (typeof storeJSON === 'string') {
    storeJSON = JSON.parse(storeJSON);
  }

  return { storeJSON, name: design?.name };
}
export async function duplicateDesign({ id }) {
  const newId = nanoid(10);
  const previewPath = `designs/${newId}.jpg`;
  const storePath = `designs/${newId}.json`;
  const storeJSON = await readFile(`designs/${id}.json`);
  const preview = await readFile(`designs/${id}.jpg`);

  await writeFile(previewPath, preview);
  await writeFile(storePath, JSON.stringify(storeJSON));

  let list = await listDesigns();
  const name = 'duplicate '+ list.find((design)=> design.id === id).name;
  const lastModified = new Date().toISOString();
  list.push({ id : newId, name, lastModified });
  const authStorage = localStorage.getItem('auth-storage');
  const authObject = JSON.parse(authStorage);
  const uid = authObject?.state?.user?.uid;
  const bucketNamePersonal = 'flashkitpersonalbucket';
  const s3Client = new S3Client({
        region: 'eu-west-2', // e.g., 'us-east-1'
        credentials: {
          accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        }
      });
      const Shareable =  JSON.stringify({
        name: name,
        id: newId,
        lastModified: lastModified,
        json: storeJSON,
      });
  if(uid){
      const command = new PutObjectCommand({
              Bucket: bucketNamePersonal,
              Key: `${uid}/shared/${newId}.json`,
              Body: Shareable,
              ContentType: 'application/json',
            });
      const commandImage = new PutObjectCommand({
              Bucket: bucketNamePersonal,
              Key: `${uid}/shared/${newId}.jpg`,
              Body: preview,
              ContentType: 'image/jpeg',
            });
        if(window.navigator.onLine){
          await s3Client.send(command);
          await s3Client.send(commandImage);
        }
        else{
          const list = await listOfflineChanges();
          const map = new Map(list);
          map.set(`${uid}/shared/${newId}.json`, Shareable);
          map.set(`${uid}/shared/${newId}.jpg`, preview);
          await localforage.setItem('offline-changes', Array.from(map));
        }
    }
  await writeKv('designs-list', list);
  return { newId, status: 'saved' };
}

export async function saveDesign({ storeJSON, preview, name, id }) {
  console.log('saving');
  if (!id) {
    id = nanoid(10);
  }

  const previewPath = `designs/${id}.jpg`;
  const storePath = `designs/${id}.json`;

  await writeFile(previewPath, preview);
  console.log('preview saved');
  await writeFile(storePath, JSON.stringify(storeJSON));

  let list = await listDesigns();
  const existing = list.find((design) => design.id === id);
  let lastModified = new Date().toISOString();
  if (existing) {
    existing.name = name;
  } else {
    list.push({ id, name, lastModified });
  }

  await writeKv('designs-list', list);
  return { id, status: 'saved' };
}

export const getPreview = async ({ id }) => {
  const preview = await readFile(`designs/${id}.jpg`);
  return URL.createObjectURL(preview);
};

// const batchCall = (asyncFunction) => {
//   let cachedPromise = null;
//   return async (...args) => {
//     if (!cachedPromise) {
//       cachedPromise = asyncFunction(...args).catch((error) => {
//         // Reset cachedPromise on error to allow retry
//         cachedPromise = null;
//         throw error;
//       });
//     }
//     return cachedPromise;
//   };
// };

// let subDomainCache = null;
// const getPublicSubDomain = batchCall(async () => {
//   if (subDomainCache) {
//     return subDomainCache;
//   }
//   // fist we need to validate domain
//   const sites = await window.puter.hosting.list();
//   const user = await window.puter.auth.getUser();
//   const prefix = user.username + '-pltn-pld';
//   let subdomain = prefix;
//   const existingDomain = sites.find(
//     (site) => site.subdomain.indexOf(prefix) >= 0
//   );

//   if (existingDomain) {
//     subDomainCache = existingDomain.subdomain;
//     return existingDomain.subdomain;
//   }
//   let attempt = 1;
//   while (attempt < 10) {
//     const postfix = attempt > 1 ? `-${attempt}` : '';
//     subdomain = `${prefix}${postfix}`;
//     try {
//       await window.puter.fs.mkdir('uploads', { createMissingParents: true });
//       await window.puter.hosting.create(subdomain, 'uploads');
//       break;
//     } catch (error) {
//       attempt++;
//       continue;
//     }
//   }
//   if (attempt >= 10) {
//     throw new Error('Failed to create subdomain');
//   }
//   subDomainCache = subdomain;
//   return subdomain;
// });

export const listAssets = async () => {
  const list = (await readKv('assets-list')) || [];
  for (const asset of list) {
    asset.src = await getAssetSrc({ id: asset.id });
    asset.preview = await getAssetPreviewSrc({ id: asset.id });
  }
  return list;
};

export const getAssetSrc = async ({ id }) => {
    const file = await readFile(`uploads/${id}`);
    console.log('file', file);
    return URL.createObjectURL(file);
};

export const getAssetPreviewSrc = async ({ id }) => {
    const file = await readFile(`uploads/${id}-preview`);
    console.log('file', file);
    return URL.createObjectURL(file);
};

export const uploadAsset = async ({ file, preview, type }) => {
  const list = await listAssets();
  const id = nanoid(10);
  await writeFile(`uploads/${id}`, file);
  await writeFile(`uploads/${id}-preview`, preview);
  list.push({ id, type });
  await writeKv('assets-list', list);

  const src = await getAssetSrc({ id });
  const previewSrc = await getAssetPreviewSrc({ id });
  // const authStorage = localStorage.getItem('auth-storage');
  // const authObject = JSON.parse(authStorage);
  // const uid = authObject?.state?.user?.uid;
  // const bucketNamePersonal = 'flashkitpersonalbucket';
  // const s3Client = new S3Client({
  //       region: 'eu-west-2', // e.g., 'us-east-1'
  //       credentials: {
  //         accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  //         secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  //       }
  //     });
  //     if(uid){
  //       const commandImage = new PutObjectCommand({
  //         Bucket: bucketNamePersonal,
  //         Key: `${uid}/uploads/${id}.${type === 'video' ? 'mp4' : 'png'}`,
  //         Body: file,
  //         ContentType: type,
  //       });
  //       const commandImagePreview = new PutObjectCommand({
  //           Bucket: bucketNamePersonal,
  //           Key: `${uid}/uploads/${id}-preview.png`,
  //           Body: preview,
  //           ContentType: type,
  //         });
  //       await s3Client.send(commandImagePreview);
  //       await s3Client.send(commandImage);
  //     }
  return { id, src, preview: previewSrc };
};

export const deleteAsset = async ({ id }) => {
  const list = await listAssets();
  // let type = list.find((asset) => asset.id === id).type;
  const newList = list.filter((asset) => asset.id !== id);
  // const authStorage = localStorage.getItem('auth-storage');
  // const authObject = JSON.parse(authStorage);
  // const uid = authObject?.state?.user?.uid;
  // const bucketNamePersonal = 'flashkitpersonalbucket';
  // const s3Client = new S3Client({
  //       region: 'eu-west-2', // e.g., 'us-east-1'
  //       credentials: {
  //         accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  //         secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  //       }
  //     });
  // if(uid){
  //     const deleteImage = new DeleteObjectCommand({
  //       Bucket: bucketNamePersonal,
  //       Key: `${uid}/uploads/${id}.${type === 'video' ? 'mp4' : 'png'}`,
  //     });
  //     const deleteImagePreview = new DeleteObjectCommand({
  //       Bucket: bucketNamePersonal,
  //       Key: `${uid}/uploads/${id}-preview.png`,
  //     });
  //     await s3Client.send(deleteImage);
  //     await s3Client.send(deleteImagePreview);
  //   }
  await writeKv('assets-list', newList);
};
