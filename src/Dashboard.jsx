import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { LucideChartLine, LucideCircleHelp, LucideCircleUser, LucideCrown, LucideLayoutDashboard, LucideLogOut, LucideTvMinimalPlay } from "lucide-react";
import React from "react";
import { useProject } from "project";
import { observer } from "mobx-react-lite";
import * as api from "api";
import { Card, MenuItem, Popover, Position, Spinner,Button } from "@blueprintjs/core";
import { Menu } from "@blueprintjs/icons";

function DashBoard({ store }) {
  return (
    <div className="h-screen flex">
      <Tabs className="flex flex-1 " defaultValue="2" >
        <TabsList className="flex flex-col p-3 gap-2">
            <TabsTrigger value="1" className="aspect-square"><LucideCrown/></TabsTrigger>
            <TabsTrigger value="2" className="aspect-square"><LucideLayoutDashboard/></TabsTrigger>
            <TabsTrigger value="3" className="aspect-square"><LucideChartLine/></TabsTrigger>
            <TabsTrigger value="4" className="aspect-square"><LucideTvMinimalPlay/></TabsTrigger>
            <TabsTrigger value="5" className="aspect-square"><LucideCircleUser/></TabsTrigger>
            <TabsTrigger value="6" className=" mt-auto aspect-square"><LucideCircleHelp/></TabsTrigger>
            <TabsTrigger value="7" className="aspect-square"><LucideLogOut/></TabsTrigger>
        </TabsList>
        <TabsContent value="1" className="flex-1">Tab 1 content</TabsContent>
        <TabsContent value="2" className="flex-1">
          <div>
            <DashboardProjects store={store} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const DashboardProjects = observer(({ store }) => {
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
  return (
    <div className="flex">
      <Button
        fill
        intent="primary"
        onClick={async () => {
          window.location.href = `/canvas?id=create_new_design`;
        }}
      >
        Create new design
      </Button>
      {!designsLoadings && !designs.length && (
        <div style={{ paddingTop: '20px', textAlign: 'center', opacity: 0.6 }}>
          You have no designs yet.
        </div>
      )}
      {designsLoadings && (
        <div style={{ paddingTop: '20px', textAlign: 'center', opacity: 0.6 }}>
          Loading designs...
        </div>
      )}
      {designs.map((design) => (
        <DesignCard
          key={design.id}
          design={design}
          onDelete={handleProjectDelete}
        />
      ))}
    </div>
  );});

  const DesignCard = observer(({ design, store, onDelete }) => {
    const [loading, setLoading] = React.useState(false);
    const [previewURL, setPreviewURL] = React.useState(design.previewURL);
  
    React.useEffect(() => {
      const load = async () => {
        const url = await api.getPreview({ id: design.id });
        setPreviewURL(url);
      };
      load();
    }, []);
  
    const handleSelect = async () => {
      setLoading(true);
      window.location.href = `/canvas?id=${design.id}`;
      setLoading(false);
    };
  
    return (
      <Card
        style={{ margin: '3px', padding: '0px', position: 'relative' }}
        interactive
        onClick={() => {
          handleSelect();
        }}
      >
        <img src={previewURL} style={{ width: '100%' }} />
        <div
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            padding: '3px',
          }}
        >
          {design.name || 'Untitled'}
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
          style={{ position: 'absolute', top: '5px', right: '5px' }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Popover
            content={
              <Menu>
                <MenuItem
                  icon="document-open"
                  text="Open"
                  onClick={() => {
                    handleSelect();
                  }}
                />
                {/* <MenuItem
                  icon="duplicate"
                  text="Copy"
                  onClick={async () => {
                    handleCopy();
                  }}
                /> */}
                <MenuItem
                  icon="trash"
                  text="Delete"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete it?')) {
                      onDelete({ id: design.id });
                    }
                  }}
                />
              </Menu>
            }
            position={Position.BOTTOM}
          >
            <Button icon="more" />
          </Popover>
        </div>
      </Card>
    );
  });

export default DashBoard;