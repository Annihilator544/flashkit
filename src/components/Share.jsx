
import React, { useState, useEffect, use } from 'react';
import { S3Client, ListObjectsV2Command, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2, LucideGlobe, LucideUpload } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useProject } from 'plotNoFeatures/project';
import { useAuthStore } from 'store/use-auth-data';
import { Skeleton } from './ui/skeleton';

const s3Client = new S3Client({
  region: 'eu-west-2', // e.g., 'us-east-1'
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  }
});

const Share = observer(({ store }) => {
  const [uploading, setUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadingPersonal, setUploadingPersonal] = useState(false);
  const [isUploadedPersonal, setIsUploadedPersonal] = useState(false);
  const { user } = useAuthStore();
  const bucketNamePersonal = 'flashkitpersonalsharebucket';
  const project = useProject();


  const handleFileUploadPublic = async (event) => {
    const file = store.toJSON();
    const Shareable = await project.getUploadJSON({ json: file });
    const preview = await project.getUploadImage();
    
    setUploading(true);
    try {
      const command = new PutObjectCommand({
        Bucket: bucketNamePersonal,
        Key: `${user.uid}/shared/${project.id}.json`,
        Body: Shareable,
        ContentType: 'application/json',
      });
      const commandImage = new PutObjectCommand({
        Bucket: bucketNamePersonal,
        Key: `${user.uid}/shared/${project.id}.jpg`,
        Body: preview,
        ContentType: 'image/jpeg',
      });
      console.log('Uploading file:', command);
        if (window.project.name&&window.project.name==='') {
            console.log('Please select a file to upload');
            return;
        }
        else{
            await s3Client.send(command);
            await s3Client.send(commandImage);
            console.log('File uploaded successfully! Could be accesssed on the following link: ', `https://app.flashkit.co.uk/public?awsKey=${user.uid}/${project.id}.json`);
        }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
      setIsUploaded(true);
    }
  };

  const handleFileUploadPersonal = async (event) => {
    const file = store.toJSON();
    const Shareable = await project.getUploadJSON({ json: file })
    const preview = await project.getUploadImage();
    setUploadingPersonal(true);
    try {
      const command = new PutObjectCommand({
        Bucket: bucketNamePersonal,
        Key: `${user.uid}/shared/${project.id}.json`,
        Body: Shareable,
        ContentType: 'application/json',
      });
      const commandImage = new PutObjectCommand({
        Bucket: bucketNamePersonal,
        Key: `${user.uid}/shared/${project.id}.jpg`,
        Body: preview,
        ContentType: 'image/jpeg',
      });
        console.log('Uploading file:', command, commandImage);
        if (window.project.name&&window.project.name==='') {
            console.log('Please select a file to upload');
            return;
        }
        else{
            await s3Client.send(command);
            await s3Client.send(commandImage);
            console.log('File uploaded successfully! Could be accesssed on the following link: ', `https://app.flashkit.co.uk/canvas?awsKey=${user.uid}/${project.id}.json`);
        }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploadingPersonal(false);
      setIsUploadedPersonal(true);
    }
  };
  const fetchImage = async () => {
    try {
      await project.getPreviewImages();
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };
  useEffect(() => {
    if (project.status === 'saving')
    fetchImage();
    else
    return;
  }, [project.status]);

  return (
    <Dialog>
        {window.project.status==="saved"&&window.project.name&&window.project.name!==''&&window.project.name!=='Untitled Design' ? 
          <DialogTrigger>
            <Button className="my-auto">
            <LucideUpload className="h-4 mr-2" />
              Share
            </Button>
        </DialogTrigger>
            :
            <Button className="my-auto" disabled>
            <LucideUpload className="h-4 mr-2" />
              Share
            </Button>
        }
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Share Your Design !!!</DialogTitle>
            <DialogDescription>
                Share your design with the world by uploading it to our servers. 
                <br />
                <div className='overflow-x-auto flex gap-2 my-5'>
                {project.imagesList.length > 0 ? project.imagesList.map((image,index)=> <img src={image} key={index} alt="Design" className="mt-5 h-60 mx-auto" /> ) : <Skeleton className="h-60 w-60 mx-auto" />}
                {/* {images.map((image,index)=> <img src={image} key={index} alt="Design" className="mt-5 h-60 mx-auto" />)} */}
                </div>
                {window.project.name === "Untitled Design" ?<p className="mt-5 text-black font-bold">Please Name your file</p> : <></>}
                {window.project.name === "Untitled Design" ? (
                    <Input
                    className="mt-2"
                    value={window.project.name}
                    onChange={(e) => {
                        window.project.name = e.target.value;
                        window.project.requestSave();
                    }}
                    label="File Name"
                    />
                ) : <></>}
                {isUploadedPersonal && (
                  <>
                    <p className="mt-5 text-green-500">File uploaded successfully! Could be accesssed on the following link: </p>
                    <a href={`https://app.flashkit.co.uk/canvas?awsKey=${user.uid}/shared/${project.id}.json`} target="_blank" rel="noreferrer" className="text-blue-500">{`https://app.flashkit.co.uk/canvas?awsKey=${user.uid}/shared/${project.id}.json`}</a>
                  </>
                )}
                {isUploaded && (
                  <>
                    <p className="mt-5 text-green-500">File uploaded successfully! Could be accesssed on the following link: </p>
                    <a href={`https://app.flashkit.co.uk/public?awsKey=${user.uid}/shared/${project.id}.jpg`} target="_blank" rel="noreferrer" className="text-blue-500">{`https://app.flashkit.co.uk/public?awsKey=${user.uid}/shared/${project.id}.jpg`}</a>
                  </>
                )}
            </DialogDescription>
            </DialogHeader>
            <DialogFooter>
            {/* {uploading ? 
                <Button className="mt-5" disabled>
                  <Loader2 className="animate-spin h-4 mr-2" />
                    Uploading
                </Button>
                :
                window.project.name&&window.project.name!=='' ?
                <Button className="mt-5" onClick={()=>handleFileUpload()}>
                    {isUploaded ? <></>: <LucideUpload className="h-4 mr-2" />}
                    {isUploaded ? "Uploaded": "Share to Marketplace"}
                </Button>
                :
                <Button className="mt-5" disabled >
                    {isUploaded ? <></>: <LucideUpload className="h-4 mr-2" />}
                    {isUploaded ? "Uploaded": "Share to Marketplace"}
                </Button>
            } */}
            {uploadingPersonal ? 
                <Button className="mt-5" disabled>
                  <Loader2 className="animate-spin h-4 mr-2" />
                    Uploading
                </Button>
                :
                window.project.name&&window.project.name!==''&&window.project.name!=='Untitled Design' ?
                <Button className="mt-5" onClick={()=>handleFileUploadPersonal()} >
                    {isUploadedPersonal ? <></>: <LucideUpload className="h-4 mr-2" />}
                    {isUploadedPersonal ? "Uploaded": "Share Via Link"}
                </Button>
                :
                <Button className="mt-5" disabled >
                    {isUploadedPersonal ? <></>: <LucideUpload className="h-4 mr-2" />}
                    {isUploadedPersonal ? "Uploaded": "Share Via Link"}
                </Button>
            }
            {uploading ? 
                <Button className="mt-5" disabled>
                  <Loader2 className="animate-spin h-4 mr-2" />
                    Uploading
                </Button>
                :
                window.project.name&&window.project.name!==''&&window.project.name!=='Untitled Design' ?
                <Button className="mt-5" onClick={()=>handleFileUploadPublic()} >
                    {isUploaded ? <></>: <LucideGlobe className="h-4 mr-2" />}
                    {isUploaded ? "Uploaded": "Public Link"}
                </Button>
                :
                <Button className="mt-5" disabled >
                    {isUploaded ? <></>: <LucideGlobe className="h-4 mr-2" />}
                    {isUploaded ? "Uploaded": "Public Link"}
                </Button>
            }
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
});

export default Share;