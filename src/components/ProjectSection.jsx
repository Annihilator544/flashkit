import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
// import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import projectSvg from '../assets/project.svg'
import { useEffect, useState } from "react";
import { LucideBell, LucideCopy, LucideFilter, LucideFolder, LucideFolderOpen, LucideMoreVertical, LucidePlus, LucideSearch, LucideSettings, LucideTrash2 } from "lucide-react"
import { Spinner } from "@blueprintjs/core"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "./ui/dropdown-menu"
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
import { NavUser } from "./nav-user"
import folderSVG from "../assets/folder.svg"
import { file } from "jszip"
import { nanoid } from "nanoid"
import { Label } from "./ui/label"
import { SidebarTrigger } from "./ui/sidebar"
const categories = [
    { label: "All" },
    { label: "Folders" },
    { label: "Design" },
  ]

  const DashboardProjects = observer(({ store, addFiles, fileDirectory }) => {
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
        <div className="md:flex md:gap-5 md:flex-wrap max-md:grid max-md:grid-cols-2 max-md:gap-2">
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
        {/*last 5 designs*/ }
                {designs.slice(-5).reverse().map((design) => (
                    <DesignCard
                        key={design.id}
                        design={design}
                        onDelete={handleProjectDelete}
                        onDuplicate={handleProjectDuplicate}
                        fileDirectory={fileDirectory}
                        addFiles={addFiles}
                    />
                ))}
        </div>
      </div>
    );});
  
    const DesignCard = observer(({ design, store, onDelete, onDuplicate, addFiles, fileDirectory }) => {
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
          className="fit-content w-fit mb-auto mx-1 group"
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
            className="absolute top-1 right-1 "
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
          <DropdownMenu>
          <DropdownMenuTrigger>
            <Button className="p-2  bg-[#00000040] hover:bg-[#00000080] border md:hidden group-hover:block"><LucideMoreVertical className="h-4"/></Button>
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
            <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex gap-2"><LucideFolderOpen className='h-4'/>Project</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {fileDirectory.map((project, index) => (
                  <DropdownMenuItem key={index} onClick={() => {
                    addFiles(project.id, [design]);
                  }}>
                    {project.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </Card>
        
        <div className="mx-2 mt-3">
          <p className="text-xs font-semibold">{design.name}</p>
          <div className="flex justify-between">
          <p className="text-xs text-secondary">{design.lastModified&&design.lastModified.split("T")[0]}</p>
          <p className="text-xs text-secondary">{design.lastModified&&design.lastModified.replace(/^[^:]*([0-2]\d:[0-5]\d).*$/, "$1")}</p>
          </div>
        </div>
        </div>
      );
    });

    const DesignCard2 = observer(({ design, onDelete }) => {
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
          className="fit-content w-fit mb-auto mx-1 group"
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
            className="absolute top-1 right-1 "
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
          <DropdownMenu>
          <DropdownMenuTrigger>
            <Button className="p-2  bg-[#00000040] hover:bg-[#00000080] border hidden group-hover:block"><LucideMoreVertical className="h-4"/></Button>
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
          </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </Card>
        
        <div className="mx-2 mt-3">
          <p className="text-xs font-semibold">{design.name}</p>
          <div className="flex justify-between">
          <p className="text-xs text-secondary">{design.lastModified&&design.lastModified.split("T")[0]}</p>
          <p className="text-xs text-secondary">{design.lastModified&&design.lastModified.replace(/^[^:]*([0-2]\d:[0-5]\d).*$/, "$1")}</p>
          </div>
        </div>
        </div>
      );
    });

    const DashboardProjects2 = observer(({ store, addFiles, fileDirectory }) => {
        const project = useProject();
        const [designsLoadings, setDesignsLoading] = useState(false);
        const [designs, setDesigns] =  useState([]);
      
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
          <div className="flex flex-col flex-wrap">
            <div className="md:flex md:gap-5 md:flex-wrap max-md:grid max-md:grid-cols-2 max-md:gap-2">
              <Button
                variant="dotted"
                className="px-10 py-8 aspect-square h-full max-md:w-full max-md:px-2"
                  onClick={async () => {
                    window.location.href = `/canvas?id=create_new_design`;
                  }}
                >
                  <LucidePlus className=" h-4"/>Create new project
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
                fileDirectory={fileDirectory}
                addFiles={addFiles}
                onDuplicate={handleProjectDuplicate}
              />
            ))}
            </div>
          </div>
        );});

        const DashboardProjects3 = observer(({ store, files, deleteFiles, projectId }) => {
          const project = useProject();
          const [designsLoadings, setDesignsLoading] = useState(false);
          const [designs, setDesigns] =  useState([]);
        
          const loadDesigns = async () => {
            setDesignsLoading(true);
            const list = files;
            setDesigns(list);
            setDesignsLoading(false);
          };
        
          const handleProjectDelete = ({ id }) => {
            setDesigns(designs.filter((design) => design.id !== id));
            deleteFiles(projectId, id);
          };
        
          useEffect(() => {
            loadDesigns();
          }, [project.cloudEnabled, project.designsLength]);
          return (
            <div className="flex flex-col flex-wrap">
              <div className="md:flex md:gap-5 md:flex-wrap max-md:grid max-md:grid-cols-2 max-md:gap-2">
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
                <DesignCard2
                  key={design.id}
                  design={design}
                  onDelete={handleProjectDelete}
                />
              ))}
              </div>
            </div>
          );});


    function ProjectSection({ store }) {
      const [open, setOpen] = useState(false);
      const [popoverOpen, setPopoverOpen] = useState(false);
      const [fileDirectory, setFileDirectory] = useState([]);
      console.log(fileDirectory)
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
          console.log(fileDirectory)
        }
      }, [user]);
      
      async function addFilesToProject(projectId, files) {
        const updatedDirectory = fileDirectory.map((project) => {
          if (project.id === projectId) {
            return {
              ...project,
              files: [...project.files, ...files],
            };
          }});
        setFileDirectory(updatedDirectory);
        await saveFileDirectory(user.uid, updatedDirectory);
      }

      async function deleteFilesFromProject(projectId, fileId) {
        const updatedDirectory = fileDirectory.map((project) => {
          if (project.id === projectId) {
            return {
              ...project,
              files: project.files.filter((file) => file.id !== fileId),
            };
          }});
        setFileDirectory(updatedDirectory);
        await saveFileDirectory(user.uid, updatedDirectory);
      }

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
          id : nanoid(10),
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

      async function handleDeleteProject(projectId) {
        const updatedDirectory = fileDirectory.filter((project) => project.id !== projectId);
        setFileDirectory(updatedDirectory);
        await saveFileDirectory(user.uid, updatedDirectory);
      }
  
      return (
          <div className="flex flex-col">
            <header className="flex shrink-0 h-10 items-center gap-2 transition-[width,height] ease-linear justify-end mb-2">
            <search className=" min-w-80 flex">
            <div className="flex flex-1 items-center border rounded-full px-1">
                <div className=" text-gray-400">
                <LucideSearch className="h-5"/>
                </div>
                <Input
                type="search"
                placeholder="Search ..."
                className=" border-none focus:outline-none focus:ring-0 bg-transparent w-full focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
            </div>
            </search>
              <SidebarTrigger className=" md:hidden"/>
              <div className="flex gap-3 ml-auto">
                    <LucideSettings className="h-5 my-auto" />
                    <LucideBell className="h-5 my-auto" />
                  <NavUser/>
              </div>
            </header>
            <DashboardHeader title={"Projects"} buttonText={"Explore Project"} bottomSection={false}/>
                <div className="flex items-center justify-between py-4 rounded-md">
                      {/* <div className="flex gap-2">
                        <search className=" min-w-80 flex">
                        <div className="flex flex-1 items-center border rounded-full px-1">
                            <div className=" text-gray-400">
                            <LucideSearch className="h-5"/>
                            </div>
                            <Input
                            type="search"
                            placeholder="Search ..."
                            className=" border-none focus:outline-none focus:ring-0 bg-transparent w-full focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </div>
                        </search>
                        {categories.map((cat, i) => (
                        <Button key={i} variant="outline" className="whitespace-nowrap rounded-full">
                            {cat.icon && <span className="mr-1">{cat.icon}</span>}
                            {cat.label}
                        </Button>
                        ))}
                      </div> */}
                    <div className="flex items-center space-x-2">
                      <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <div className=" p-[2px] rounded-sm bg-[#409BFF] mr-2 ">
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
                      <Button variant="outline"><LucideFilter className="h-4 my-auto "/>Filters</Button>
                    </div>
                </div>
            <div className="max-w-[80vw] max-md:max-w-full my-10">
              <p className="text-lg font-semibold mb-3">Recent Designs</p>
              <DashboardProjects store={store} addFiles={addFilesToProject} fileDirectory={fileDirectory}/>
            </div>
            <p className="text-lg font-semibold">Folders</p>
            <div className="flex flex-wrap gap-3 mt-3">
                {fileDirectory && fileDirectory.map((project, index) => (
                  <TooltipProvider key={index}>
                    <Dialog>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DialogTrigger asChild>
                            <div className="flex min-w-80 gap-3 hover:bg-[#f9f9f9] p-4 rounded-md">
                              <img src={folderSVG} alt="folder" className="h-5" />
                              <p className="font-semibold my-auto">{project.name}</p>
                            </div>
                          </DialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-sm text-gray-500">Created: {new Date(project.createdAt).toLocaleString()}</p>
                            <p className="text-sm">Files: {project.files.length}</p>
                        </TooltipContent>
                      </Tooltip>
                      <DialogContent className="sm:max-w-[60%]">
                      <DialogHeader>
                        <DialogTitle>{project.name}</DialogTitle>
                        <DialogDescription>
                          Make changes to your Folder here. Click save when you're done.
                        </DialogDescription>
                      </DialogHeader>
                        <DashboardProjects3 store={store} projectId={project.id} files={project.files} deleteFiles={deleteFilesFromProject}/>
                      <DialogFooter className="max-md:grid max-md:grid-cols-2 max-md:gap-2">
                        <Button onClick={()=>{handleDeleteProject(project.id)}} variant="destructive">Delete Folder</Button>
                        <Button type="submit">Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                    </Dialog>
                  </TooltipProvider>
                ))}
            </div>
            <div className=" my-10">
              <p className="text-lg font-semibold mb-3">Designs</p>
              <DashboardProjects2 store={store} addFiles={addFilesToProject} fileDirectory={fileDirectory}/>
            </div>
          </div>
      );
  }

export default ProjectSection