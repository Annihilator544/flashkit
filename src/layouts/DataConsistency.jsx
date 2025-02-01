import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as api from '../plotNoFeatures/api';
import localforage from 'localforage';
import { useEffect } from 'react';
import useOnlineStatus from '../hooks/useOnlineStatus';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { useAuthStore } from 'store/use-auth-data';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { useSyncState } from 'store/use-sync-state';

function  DataConsistency({ children }) {
    const isOnline = useOnlineStatus();
    const { user } = useAuthStore();
    const { setSyncing } = useSyncState();
    const uploadOfflineData = async () => {
        const list = await api.listOfflineChanges();
        const map = new Map(list);
        const s3Client = new S3Client({
            region: 'eu-west-2', // e.g., 'us-east-1'
            credentials: {
                accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
            }
        });
        map.forEach(async (value, key) => {
        const bucketNamePersonal = 'flashkitpersonalbucket';
          try {
            if(key.includes('delete')) {
                const command = new DeleteObjectCommand({
                    Bucket: bucketNamePersonal,
                    Key: value,
                });
                await s3Client.send(command);
            }
            else{
                if(key.includes('.json')) {
                const command = new PutObjectCommand({
                        Bucket: bucketNamePersonal,
                        Key: key,
                        Body: value,
                        ContentType: 'application/json',
                    });;
                    await s3Client.send(command);
                }
                else if(key.includes('.jpg')) {
                    const commandImage = new PutObjectCommand({
                        Bucket: bucketNamePersonal,
                        Key: key,
                        Body: value,
                        ContentType: 'image/jpeg',
                    });;
                    await s3Client.send(commandImage);
                }
            }
            map.delete(key);
          } catch (e) {
            console.error(e);
          } finally{
            await localforage.setItem('offline-changes', Array.from(map));
          }
        });
    }
    async function syncArraysExact(localArray, uploadArray) {
        const s3Client = new S3Client({
            region: 'eu-west-2', // e.g., 'us-east-1'
            credentials: {
              accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
            }
        });
        const bucketName = 'flashkitpersonalbucket';
        // Step 1: Insert or update all items from uploadArray
        let updatedLocal = [...localArray];
        for (const uploadItem of uploadArray) {
          const indexInLocal = updatedLocal.findIndex(
            (localItem) => localItem.id === uploadItem.id
          );
          if (indexInLocal === -1) {
            const command = new GetObjectCommand({
                Bucket: bucketName,
                Key: `${user.uid}/shared/${uploadItem.id}.json`
            });
            const command2 = new GetObjectCommand({
                Bucket: bucketName,
                Key: `${user.uid}/shared/${uploadItem.id}.jpg`
            });
            //get object from s3
            const urlJSON = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
            const urlImage = await getSignedUrl(s3Client, command2, { expiresIn: 3600 });

            // Now 'urlJSON' and 'urlImage' are just strings (the presigned URLs).
            const response1 = await fetch(urlJSON);
            const jsonData = await response1.json();

            const response2 = await fetch(urlImage);
            const blobImage = await response2.blob();
            api.saveDesign({
                storeJSON: jsonData,
                preview: blobImage,
                id: uploadItem.id,
                name: uploadItem.name,
              });
            updatedLocal.push(uploadItem);
          } else {
            if(uploadItem.lastModified > updatedLocal[indexInLocal].lastModified) {
                const command = new GetObjectCommand({
                    Bucket: bucketName,
                    Key: `${user.uid}/shared/${uploadItem.id}.json`
                });
                const command2 = new GetObjectCommand({
                    Bucket: bucketName,
                    Key: `${user.uid}/shared/${uploadItem.id}.jpg`
                });
                //get object from s3
                const { Body } = await s3Client.send(command);
                const { Body2 } = await s3Client.send(command2);
                console.log(Body, Body2);
                api.saveDesign({
                    storeJSON: Body,
                    preview: Body2,
                    id: uploadItem.id,
                    name: uploadItem.name,
                });
            }
            updatedLocal[indexInLocal] = {
              ...updatedLocal[indexInLocal],
              ...uploadItem,
            };
          }
        }
      
        // Step 2: Remove anything not in uploadArray
        const uploadIds = new Set(uploadArray.map((item) => item.id));
        updatedLocal.filter((localItem) =>
          !uploadIds.has(localItem.id)
        ).map(async (item) => {
            await localforage.removeItem(`designs/${item.id}.json`);
            await localforage.removeItem(`designs/${item.id}.jpg`);
        });

        updatedLocal = updatedLocal.filter((localItem) =>
            uploadIds.has(localItem.id)
        );
        // Step 3: Save the updated local array
        await localforage.setItem('designs-list', updatedLocal);
      }      
    const syncOnlineData = async () => {
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
        Key: { uid: user.uid },
      };
        const result = await docClient.send(new GetCommand(params));
        const list = await api.listDesigns();
        if (result.Item && result.Item.designsList && result.Item.designsList !== list) {
            console.log("Data is out of sync");
            setSyncing(true);
            await syncArraysExact(list, result.Item.designsList);
            setSyncing(false);
            console.log("Data synced");
        } 
        else if (!result.Item) {
          console.log("No user data found");
        }
        else {
          console.log("Data is in sync");
        }
    }
    useEffect  (() => {
        async function fetchData() {
          try{
            console.log("Starting upload");
            await uploadOfflineData();
            await syncOnlineData();
            console.log("Data uploaded");
          } catch (e) {
            console.error(e);
          }
        }
        fetchData();
    }, [isOnline]);
  return (
    <div>
      {children}
    </div>
  );
}

export default DataConsistency;