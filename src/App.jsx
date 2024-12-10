import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Spinner } from '@blueprintjs/core';

import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
import { Toolbar } from 'polotno/toolbar/toolbar';
import { ZoomButtons } from 'polotno/toolbar/zoom-buttons';
import { SidePanel, DEFAULT_SECTIONS } from 'polotno/side-panel';
import { Workspace } from 'polotno/canvas/workspace';
import { Tooltip } from 'polotno/canvas/tooltip';
import { PagesTimeline } from 'polotno/pages-timeline';
import { setTranslations } from 'polotno/config';

import { loadFile } from './plotNoFeatures/file';

import { MyDesignsSection } from './sections/my-designs-section';

import { AIWriteMenu } from './plotNoFeatures/ai-text';

import { useProject } from './plotNoFeatures/project';

import { ImageRemoveBackground } from './plotNoFeatures/background-remover';

import fr from './translations/fr';
import en from './translations/en';
import id from './translations/id';
import ru from './translations/ru';
import ptBr from './translations/pt-br';
import { LogoSection } from './sections/logo-section.js';
import Topbar from 'topbar/topbar';
import { useSearchParams } from 'react-router-dom';
import { useJsonData } from 'store/use-json-data';
import { ChartSection } from 'sections/chart-section';
import { ElementsSection } from 'sections/element-section';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { LayersSection } from 'sections/layers-section';
import { ResizeSection } from 'sections/resize-section';
import { TemplatesSection } from 'sections/template-section';
import { TextSection } from 'sections/text-section';
import { VideosSection } from 'sections/video-section';

// load default translations
setTranslations(en);
let DEFAULT_SECTIONS2 = [...DEFAULT_SECTIONS];
// replace elements section with just shapes
//DEFAULT_SECTIONS.splice(3, 1, ShapesSection);
// add icons
DEFAULT_SECTIONS2.splice(1, 5);
// add two more sections
DEFAULT_SECTIONS2.unshift(MyDesignsSection);
DEFAULT_SECTIONS2.unshift(LogoSection);
//add elements section at postion 3
DEFAULT_SECTIONS2.splice(3 , 0 , ElementsSection);
DEFAULT_SECTIONS2.splice(4 , 0 , DEFAULT_SECTIONS[1]);
DEFAULT_SECTIONS2.splice(5 , 0 , ChartSection);
DEFAULT_SECTIONS2.splice(5 , 0 , VideosSection);
// DEFAULT_SECTIONS.push(StableDiffusionSection);
const isStandalone = () => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone
  );
};

const getOffsetHeight = () => {
  let safeAreaInsetBottom = 0;

  if (isStandalone()) {
    // Try to get the safe area inset using env() variables
    const safeAreaInsetBottomString = getComputedStyle(
      document.documentElement
    ).getPropertyValue('env(safe-area-inset-bottom)');
    if (safeAreaInsetBottomString) {
      safeAreaInsetBottom = parseFloat(safeAreaInsetBottomString);
    }

    // Fallback values for specific devices if env() is not supported
    if (!safeAreaInsetBottom) {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;

      if (/iPhone|iPad|iPod/i.test(userAgent) && !window.MSStream) {
        // This is an approximation; you might need to adjust this value based on testing
        safeAreaInsetBottom = 20; // Example fallback value for iPhone
      }
    }
  }

  return window.innerHeight - safeAreaInsetBottom;
};

const useHeight = () => {
  const [height, setHeight] = React.useState(getOffsetHeight());
  React.useEffect(() => {
    window.addEventListener('resize', () => {
      setHeight(getOffsetHeight());
    });
  }, []);
  return height;
};

const App = observer(({ store }) => {
  const [searchParams] = useSearchParams();
  const designId = searchParams.get('id');
  const json = searchParams.get('json');
  const awsKey = searchParams.get('awsKey');
  const awsKeyMarket = searchParams.get('awsKeyMarket');
  const project = useProject();
  const { data } = useJsonData();
  const bucketName = 'flashkitpersonalsharebucket';

  const s3Client = new S3Client({
    region: 'eu-west-2', // e.g., 'us-east-1'
    credentials: {
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    }
  });

  React.useEffect(() => {
    async function NewDesign() {
      await project.createNewDesign();
      project.save();
    }
    if (designId === 'create_new_design'){
      NewDesign();
    }
    else if (designId) {
    window.project.loadById(designId);
    }
  }, [designId]);

  React.useEffect(()=>{
    async function JsonDesign(json) {
        if (!json) return;
        await project.createNewDesign();
        store.loadJSON(data);
        project.save();
    }
    JsonDesign(json);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [json]);

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
    }
    AwsDesign(awsKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [awsKey]);

  React.useEffect(()=>{
    async function AwsDesignMarket(awsKeyMarket) {
        if (!awsKeyMarket) return;
        //fetch data from aws whose key is awsKey
        const command = new GetObjectCommand({
          Bucket: 'flashkitmarketplace',
          Key: awsKeyMarket,
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        const response = await fetch(url);
        const dataJSON = await response.json();
        await project.createNewDesign();
        store.loadJSON(dataJSON.json);
        project.save();
    }
    AwsDesignMarket(awsKeyMarket);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [awsKeyMarket]);
  const height = useHeight();
  React.useEffect(() => {
    if (project.language.startsWith('fr')) {
      setTranslations(fr, { validate: true });
    } else if (project.language.startsWith('id')) {
      setTranslations(id, { validate: true });
    } else if (project.language.startsWith('ru')) {
      setTranslations(ru, { validate: true });
    } else if (project.language.startsWith('pt')) {
      setTranslations(ptBr, { validate: true });
    } else {
      setTranslations(en, { validate: true });
    }
  }, [project.language]);

  React.useEffect(() => {
    project.firstLoad();
    console.log('first load');
    console.log(project);
  }, [project]);

  React.useEffect(() => {
    const arr = document.getElementsByClassName('polotno-page-container')
    const children = document.createElement('div');
    children.className = 'plotnocovertookaverylongtimebutitworksnow absolute z-[1] md:h-4 md:w-60 bg-[#e8e8e8] md:bottom-0 md:right-0 max-md:bottom-[75px] max-md:right-0 max-md:h-5 max-md:w-44';
    for (let i = 0; i < arr.length; i++) {
      if (!arr[i].querySelector(`.plotnocovertookaverylongtimebutitworksnow`)) {
        arr[i].appendChild(children.cloneNode(true));
      }
    }
  });

  const handleDrop = (ev) => {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    // skip the case if we dropped DOM element from side panel
    // in that case Safari will have more data in "items"
    if (ev.dataTransfer.files.length !== ev.dataTransfer.items.length) {
      return;
    }
    // Use DataTransfer interface to access the file(s)
    for (let i = 0; i < ev.dataTransfer.files.length; i++) {
      loadFile(ev.dataTransfer.files[i], store);
    }
  };

  return (
    <div className='flex'>
    <div
      style={{
        height: height + 'px',
        display: 'flex',
        flexDirection: 'column',
      }}
      className='flex-1'
      onDrop={handleDrop}
    >
      <div style={{ height: 'calc(100% )' }}>
        <PolotnoContainer className="polotno-app-container">
          <SidePanelWrap>
            <SidePanel store={store} sections={DEFAULT_SECTIONS2} defaultSection="templates"  />
          </SidePanelWrap>
          {/* {localStorage.getItem("flashkitPlan") !== "FLASHKITUNLIMITED" ? 
          <div className='absolute z-[1] md:h-4 md:w-60 bg-[#e8e8e8] md:bottom-0 md:right-0 max-md:bottom-[75px] max-md:right-0 max-md:h-5 max-md:w-44'>

          </div>
          : <div className='absolute z-[1] md:h-4 md:w-60 bg-[#e8e8e8] md:bottom-0 md:right-[15%] max-md:bottom-[75px] max-md:right-0 max-md:h-5 max-md:w-44'>

          </div>} */}
          <WorkspaceWrap>
          <Topbar store={store} />
            <Toolbar
              store={store}
              components={{
                ImageRemoveBackground,
                TextAIWrite: AIWriteMenu,
              }}
            />
            <Workspace
              store={store}
              components={{ Tooltip, TextAIWrite: AIWriteMenu }}
            />
            <ZoomButtons store={store} />
            <PagesTimeline store={store} />
          </WorkspaceWrap>
        </PolotnoContainer>
      </div>
      {project.status === 'loading' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
            }}
          >
            <Spinner />
          </div>
        </div>
      )}
    </div>
    {/* {localStorage.getItem("flashkitPlan") === "FLASHKITUNLIMITED" ? 
        <div className="w-[15%] border-2 border-black ">
            <p className="my-auto">Ad Space</p>
        </div>
        : <></>} */}
    </div>
  );
});

export default App;
