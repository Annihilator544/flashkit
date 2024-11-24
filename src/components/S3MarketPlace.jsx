
import React, { useState, useEffect } from 'react';
import { S3Client, ListObjectsV2Command,  GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import TemplateCard from './TemplateCard';

const s3Client = new S3Client({
  region: 'eu-west-2', // e.g., 'us-east-1'
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  }
});

const S3FileManager = ( {store}) => {
  const [files, setFiles] = useState([]);
  const bucketName = 'flashkitmarketplace';

  const listFiles = async () => {
    try {
      // Get list of objects and their signed URLs
      const command = new ListObjectsV2Command({
        Bucket: bucketName,
      });
      const { Contents = [] } = await s3Client.send(command);
      const filesWithUrls = await Promise.all(
        Contents.map(async (file) => {
          const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: file.Key,
          });
          const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
          return { ...file, url };
        })
      );
  
      const filesWithContent = await Promise.all(
        filesWithUrls.map(async (file) => {
          const response = await fetch(file.url);
          return response.json();
        })
      );
  
      console.log(filesWithContent);
      setFiles(filesWithContent);
    } catch (error) {
      console.error('Error listing or fetching files:', error);
      throw error;
    }
  };

  useEffect(() => {
    listFiles();
  }, []);

  return (
        <div className="flex flex-wrap gap-3">
          {files.map((file) => (
            <TemplateCard key={file.Key} url={file.preview} store={store} />
          ))}
        </div>
  );
};

export default S3FileManager;