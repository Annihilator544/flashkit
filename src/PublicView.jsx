import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';

import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
import { Workspace } from 'polotno/canvas/workspace';
import { setTranslations } from 'polotno/config';


import { useProject } from './plotNoFeatures/project';
import en from './translations/en';
import { useSearchParams } from 'react-router-dom';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import Navbar from './components/Navbar';
import { Skeleton } from './components/ui/skeleton';
import EmblaCarousel from './components/EmblaCarousel/EmblaCarousel';
import { LucideLoader2 } from 'lucide-react';

const OPTIONS = {}

// load default translations
setTranslations(en);
const PublicView = observer(({ store }) => {
  const [searchParams] = useSearchParams();
  const awsKey = searchParams.get('awsKey');
  const project = useProject();
  const bucketName = 'flashkitpersonalsharebucket';

  const s3Client = new S3Client({
    region: 'eu-west-2', // e.g., 'us-east-1'
    credentials: {
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    }
  });

  React.useEffect(()=>{
    async function AwsDesign(awsKey) {
        if (!awsKey) return;
        //fetch data from aws whose key is awsKey
        const command = new GetObjectCommand({
          Bucket: bucketName,
          Key: awsKey,
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        const response = await fetch(url);
        const dataJSON = await response.json();
        console.log(dataJSON);
        await project.createNewDesign();
        store.loadJSON(dataJSON.json);
        project.save();
        project.getPreviewImages();
    }
    AwsDesign(awsKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [awsKey]);
  return (
    <div className=''>
        <Navbar />
        <PolotnoContainer className="polotno-app-container">
          <WorkspaceWrap>
            <Workspace
              store={store}
            />
          </WorkspaceWrap>
        </PolotnoContainer>
        <div className='h-[90vh] flex'>
        {project.imagesList.length > 0 ?
        <EmblaCarousel slides={project.imagesList} options={OPTIONS} />
        : 
        <LucideLoader2 className="h-10 w-10 m-auto text-[#F56B63] animate-spin" />}
        </div>
    </div>
  );
});

export default PublicView;
