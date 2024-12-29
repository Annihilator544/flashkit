import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as api from '../plotNoFeatures/api';
import localforage from 'localforage';
import { useEffect } from 'react';
import useOnlineStatus from '../hooks/useOnlineStatus';

function  DataConsistency({ children }) {
    const isOnline = useOnlineStatus();
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
        const bucketNamePersonal = 'flashkitpersonalsharebucket';
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
            console.log(localforage.getItem('offline-changes'));
          }
        });
        console.log(localforage.getItem('offline-changes'));
    }
    useEffect  (() => {
        console.log("Starting upload");
        uploadOfflineData();
        console.log("Data uploaded");
    }, [isOnline]);
  return (
    <div>
      {children}
    </div>
  );
}

export default DataConsistency;