import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Spinner,
} from '@blueprintjs/core';

import { CloudWarning } from '../plotNoFeatures/cloud-warning';

import { SectionTab } from 'polotno/side-panel';
import { useProject } from '../plotNoFeatures/project';
import * as api from '../plotNoFeatures/api';
import { LucideCopy, LucideFolderOpen, LucideMoreHorizontal, LucideMoreVertical, LucidePlus, LucideTrash2 } from 'lucide-react';
import { Card } from '../components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { Button } from '../components/ui/button';


const DesignCard = observer(({ design, store, onDelete, onDuplicate }) => {
  const [loading, setLoading] = useState(false);
  const [previewURL, setPreviewURL] = useState(design.previewURL);

  useEffect(() => {
    const load = async () => {
      const url = await api.getPreview({ id: design.id });
      setPreviewURL(url);
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const handleSelect = async () => {
    setLoading(true);
    window.location.href = `/canvas?id=${design.id}`;
    setLoading(false);
  };

  return (
    <div className="flex flex-col my-2">
    <Card
      style={{  padding: '3px', position: 'relative' }}
      interactive
      className="fit-content w-fit mb-auto mx-1 group"
      onClick={() => {
        handleSelect();
      }}
    >
      <div className="rounded-2xl overflow-hidden">
      <img src={previewURL} style={{ width: '200px' }} alt="url" />
      </div>
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Spinner />
        </div>
      )}
      <div
        className="absolute top-1 right-1 "
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
      <DropdownMenu>
      <DropdownMenuTrigger>
        <Button className="p-2 rounded-2xl bg-[#00000040] hover:bg-[#00000080] border hidden group-hover:block"><LucideMoreVertical className="h-4"/></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white mx-1 absolute">
        <DropdownMenuItem className="flex gap-2" onClick={() => {
                  handleSelect();
                }}>
            <LucideFolderOpen className='h-4'/>Open
        </DropdownMenuItem>
        <DropdownMenuItem className="flex gap-2" onClick={() => {
                    onDelete({ id: design.id });
                }}>
            <LucideTrash2 className='h-4'/>Delete
        </DropdownMenuItem>
        <DropdownMenuItem className="flex gap-2" onClick={() => {
                    onDuplicate({ id: design.id });
                }}>
            <LucideCopy className='h-4'/>Duplicate
        </DropdownMenuItem>
      </DropdownMenuContent>
      </DropdownMenu>
      </div>
    </Card>
    </div>
  );
});

export const MyDesignsPanel = observer(({ store }) => {
  const project = useProject();
  const [designsLoadings, setDesignsLoading] = React.useState(false);
  const [designs, setDesigns] = React.useState([]);

  const loadDesigns = async () => {
    setDesignsLoading(true);
    const list = await api.listDesigns();
    setDesigns(list);
    setDesignsLoading(false);
  };

  const handleProjectDelete = ({ id }) => {
    setDesigns(designs.filter((design) => design.id !== id));
    api.deleteDesign({ id });
  };

  React.useEffect(() => {
    loadDesigns();
  }, [project.cloudEnabled, project.designsLength]);

  const half1 = [];
  const half2 = [];

  designs.forEach((design, index) => {
    if (index % 2 === 0) {
      half1.push(design);
    } else {
      half2.push(design);
    }
  });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Button
        variant="outline"
        onClick={async () => {
          project.createNewDesign();
        }}
      >
        Create new design
      </Button>
      {!designsLoadings && !designs.length && (
        <div style={{ paddingTop: '20px', textAlign: 'center', opacity: 0.6 }}>
          You have no saved designs yet...
        </div>
      )}
      {/* {!project.cloudEnabled && (
        <div style={{ padding: '15px' }}>
          <CloudWarning />
        </div>
      )} */}
      {/* {project.cloudEnabled && (
        <div style={{ padding: '10px', textAlign: 'center' }}>
          Cloud data saving powered by{' '}
          <a href="https://puter.com" target="_blank" rel="noreferrer">
            Puter.com
          </a>
        </div>
      )} */}
      {designsLoadings && (
        <div style={{ padding: '30px' }}>
          <Spinner />
        </div>
      )}
      <div
        style={{
          display: 'flex',
          paddingTop: '5px',
          height: '100%',
          overflow: 'auto',
        }}
      >
        <div style={{ width: '50%' }}>
          {half1.map((design) => (
            <DesignCard
              design={design}
              key={design.id}
              store={store}
              onDelete={handleProjectDelete}
            />
          ))}
        </div>
        <div style={{ width: '50%' }}>
          {half2.map((design) => (
            <DesignCard
              design={design}
              key={design.id}
              store={store}
              onDelete={handleProjectDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

// define the new custom section
export const MyDesignsSection = {
  name: 'Add Design',
  Tab: (props) => (
    <SectionTab name="Add Design" {...props}>
      <div  className="bg-[#004b8c] max-md:p-[2px] md:p-1 max-md:m-auto md:rounded-lg max-md:rounded-sm ">
        <LucidePlus size={16} fill="#fff"  color="#fff" className='md:hidden'/>
        <LucidePlus size={20} fill="#fff"  color="#fff" className='max-md:hidden'/>
      </div>
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: MyDesignsPanel,
};
