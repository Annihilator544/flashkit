import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
// import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import projectSvg from '../assets/project.svg'
import { useEffect, useState } from "react";
import { LucideCopy, LucideFilter, LucideFolder, LucideFolderOpen, LucideMoreVertical, LucidePlus, LucideSearch, LucideTrash2 } from "lucide-react"
import { Spinner } from "@blueprintjs/core"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Card } from "./ui/card"
import { observer } from "mobx-react-lite"
import { useProject } from "plotNoFeatures/project"
import * as api from "../plotNoFeatures/api";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel"
import DashboardHeader from "./DashboardHeader"
import { useAuthStore } from "store/use-auth-data"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

const categories = [
    { label: "All" },
    { label: "Folders" },
    { label: "Design" },
  ]

  const DashboardProjects = observer(({ store }) => {
    const project = useProject();
    const [designsLoadings, setDesignsLoading] = useState(false);
    const [designs, setDesigns] = useState([]);
  
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
  
    const handleProjectDuplicate = async({ id }) => {
      await api.duplicateDesign({ id: id});
      await loadDesigns();
    } 
  
    useEffect(() => {
      loadDesigns();
    }, [project.cloudEnabled, project.designsLength]);
    return (
      <div className="flex flex-col flex-wrap w-full">
        <div className="flex gap-5 flex-wrap">
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
        <Carousel>
            <CarouselContent>
                {designs.map((design) => (
                <CarouselItem className="basis-[200px]" key={design.id}>
                    <DesignCard
                        key={design.id}
                        design={design}
                        onDelete={handleProjectDelete}
                        onDuplicate={handleProjectDuplicate}
                    />
                </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
        </div>
      </div>
    );});
  
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
        <div className="flex flex-col">
        <Card
          style={{  padding: '3px', position: 'relative' }}
          interactive
          className="fit-content w-fit mb-auto mx-1"
          onClick={() => {
            handleSelect();
          }}
        >
          <div className="rounded-lg overflow-hidden">
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
            style={{ position: 'absolute', top: '5px', right: '5px' }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
          <DropdownMenu>
          <DropdownMenuTrigger>
            <Button className="p-2 bg-transparent hover:bg-primary border "><LucideMoreVertical className="h-4"/></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white mx-1">
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
        
        <div className="mx-2">
          <p className="text-sm font-semibold">{design.name}</p>
          <div className="flex justify-between">
          <p className="text-xs text-secondary">{design.lastModified&&design.lastModified.split("T")[0]}</p>
          <p className="text-xs text-secondary">{design.lastModified&&design.lastModified.replace(/^[^:]*([0-2]\d:[0-5]\d).*$/, "$1")}</p>
          </div>
        </div>
        </div>
      );
    });


    function ProjectSection({ store }) {
      const [open, setOpen] = useState(false);
      const [popoverOpen, setPopoverOpen] = useState(false);
      const [fileDirectory, setFileDirectory] = useState([]);
      const [newProjectName, setNewProjectName] = useState("");
      const { user } = useAuthStore();
      const region = "eu-west-2";
      const credentials = {
        accessKeyId: process.env.REACT_APP_DYNAMO_DB_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_DYNAMO_DB_AWS_SECRET_ACCESS_KEY
      };
  
      const ddbClient = new DynamoDBClient({ region, credentials });
      const docClient = DynamoDBDocumentClient.from(ddbClient);
      const tableName = "flashkitUserData";
  
      useEffect(() => {
        if (user && user.uid) {
          getFileDirectory(user.uid);
        }
      }, [user]);
  
      async function getFileDirectory(uid) {
        const params = {
          TableName: tableName,
          Key: { uid: uid },
        };
  
        try {
          const result = await docClient.send(new GetCommand(params));
          if (result.Item && result.Item.projectDirectory) {
            setFileDirectory(result.Item.projectDirectory);
          } else {
            setFileDirectory([]);
          }
        } catch (error) {
          console.error("Error fetching file directory:", error);
          setFileDirectory([]);
        }
      }
  
      async function saveFileDirectory(uid, directoryData) {
        const params = {
          TableName: tableName,
          Key: { uid: uid },
          UpdateExpression: 'SET projectDirectory = :pd',
          ExpressionAttributeValues: {
            ':pd': directoryData,
          },
          ReturnValues: 'ALL_NEW',
        };
  
        try {
          await docClient.send(new UpdateCommand (params));
        } catch (error) {
          console.error("Error saving file directory:", error);
        }
      }
  
      async function handleCreateNewProject() {
        if (!newProjectName || !user || !user.uid) return;
  
        // Create new project object
        const newProject = {
          name: newProjectName,
          files: [],
          createdAt: new Date().toISOString(),
        };
  
        const updatedDirectory = [...fileDirectory, newProject];
        setFileDirectory(updatedDirectory);
  
        // Save updated directory to DynamoDB
        await saveFileDirectory(user.uid, updatedDirectory);
  
        // Reset dialog state
        setNewProjectName("");
        setOpen(false);
      }
  
      return (
          <div className="flex flex-col">
            <DashboardHeader title={"Project"} buttonText={"Explore Project"} bottomSection={false}/>
            <div>
                <div className="flex items-center justify-between py-4 rounded-md">
                    <div className="relative flex flex-1 items-center">
                      <Input
                          type="search"
                          placeholder="Search Templates ..."
                          className="rounded-full w-1/2"
                      />
                      <div className="absolute right-[51%] text-gray-400">
                          <LucideSearch className="h-5"/>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline"><LucideFilter className="h-4 my-auto mr-2"/>Filters</Button>
                      <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <div className=" p-[2px] rounded-sm bg-[#fe5655] mr-2 ">
                                    <LucidePlus size={14} fill="#fff" color="#fff"/>
                                </div>Add New
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="p-4">
                            <DialogHeader>
                              <DialogTitle>Add New Project</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col space-y-4">
                              <Input
                                type="text"
                                placeholder="Project Name"
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                              />
                              <Button onClick={handleCreateNewProject}>Create Project</Button>
                            </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                </div>
                <div className="flex gap-2 overflow-x-auto">
                    {/* Map through categories if available */}
                    {categories && categories.map((cat, i) => (
                        <Button key={i} variant="outline" className="whitespace-nowrap rounded-full">
                        {cat.icon && <span className="mr-1">{cat.icon}</span>}
                        {cat.label}
                        </Button>
                    ))}
                </div>
            </div>
            <div className="max-w-[80vw] my-10">
              <p className="text-lg font-semibold mb-3">Recent Designs</p>
              <DashboardProjects store={store}/>
            </div>
            <p className="text-lg font-semibold">Projects</p>
            <div className="flex flex-wrap gap-3 mt-3">
                {fileDirectory && fileDirectory.map((project, index) => (
                  <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                  <div key={index} className="flex min-w-80 gap-3 border p-4 rounded-md">
                    <LucideFolder className="h-8 my-auto"/>
                    <p className="font-semibold my-auto">{project.name}</p>
                  </div>
                  </TooltipTrigger>
                      <TooltipContent>
                          <p className="text-sm text-gray-500">Created: {new Date(project.createdAt).toLocaleString()}</p>
                          <p className="text-sm">Files: {project.files.length}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
            </div>
          </div>
      );
  }

export default ProjectSection