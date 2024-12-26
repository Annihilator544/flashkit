
import React, { useState, useEffect, use } from 'react';
import { S3Client, ListObjectsV2Command, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2, LucideGlobe, LucideSend, LucideShare, LucideUpload } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useProject } from 'plotNoFeatures/project';
import { useAuthStore } from 'store/use-auth-data';
import { Skeleton } from './ui/skeleton';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const region = "eu-west-2";
const credentials = {
  accessKeyId: process.env.REACT_APP_DYNAMO_DB_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_DYNAMO_DB_AWS_SECRET_ACCESS_KEY
};

const Share = observer(({ store }) => {
  const [uploading, setUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadingPersonal, setUploadingPersonal] = useState(false);
  const [isUploadedPersonal, setIsUploadedPersonal] = useState(false);
  const [sharedIdPublic, setSharedIdPublic] = useState(new Set());
  const [sharedIdPersonal, setSharedIdPersonal] = useState(new Set());
  const { user } = useAuthStore();
  const ddbClient = new DynamoDBClient({ region, credentials });
  const docClient = DynamoDBDocumentClient.from(ddbClient);
  const tableName = "flashkitUserData";
  const project = useProject();


  const handleFileUploadPublic = async (event) => {
    
    setUploading(true);
    try {
      const params = {
        TableName: tableName,
        Key: { uid: user.uid },
      };
        const result = await docClient.send(new GetCommand(params));
        if (result.Item && result.Item.sharedDesignsPublic) {
          setSharedIdPublic(new Set(result.Item.sharedDesignsPublic));
        } else {
          setSharedIdPublic(new Set());
        }
        setSharedIdPublic(sharedIdPublic.add(project.id));
        const params2 = {
          TableName: tableName,
          Key: { uid: user.uid },
          UpdateExpression: 'SET sharedDesignsPublic = :new_items',
          ExpressionAttributeValues: {
            ':new_items': Array.from(sharedIdPublic),
          },
          ReturnValues: 'ALL_NEW',
        };
       try {
          await docClient.send(new UpdateCommand (params2));
          console.log("Shared Files saved successfully!");
        } catch (error) {
          console.error("Error saving file directory:", error);
        }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
      setIsUploaded(true);
    }
  };

  const handleFileUploadPersonal = async (event) => {
    setUploadingPersonal(true);
    try {
      const params = {
        TableName: tableName,
        Key: { uid: user.uid },
      };
        const result = await docClient.send(new GetCommand(params));
        if (result.Item && result.Item.sharedDesignsPersonal) {
          setSharedIdPersonal(new Set(result.Item.sharedDesignsPersonal)) 
        } else {
          setSharedIdPersonal(new Set());
        }
        setSharedIdPersonal(sharedIdPersonal.add(project.id));
        const params2 = {
          TableName: tableName,
          Key: { uid: user.uid },
          UpdateExpression: 'SET sharedDesignsPersonal = :new_items',
          ExpressionAttributeValues: {
            ':new_items': Array.from(sharedIdPersonal),
          },
          ReturnValues: 'ALL_NEW',
        };
       try {
          await docClient.send(new UpdateCommand(params2));
          console.log("Shared Files saved successfully!");
        } catch (error) {
          console.error("Error saving file directory:", error);
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
      console.log("fetching image")
      await project.getPreviewImages();
      console.log("fetching donre")
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
              Share
              
            <LucideSend className="h-4 ml-[6px]" />
            </Button>
        </DialogTrigger>
            :
            <Button className="my-auto" disabled>
            <LucideUpload className="h-4 ml-[6px]" />
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
                    <a href={`https://app.flashkit.co.uk/public?awsKey=${user.uid}/shared/${project.id}.json`} target="_blank" rel="noreferrer" className="text-blue-500">{`https://app.flashkit.co.uk/public?awsKey=${user.uid}/shared/${project.id}.json`}</a>
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