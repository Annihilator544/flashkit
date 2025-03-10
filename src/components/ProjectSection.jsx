import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import projectSvg from "../assets/project.svg";
import { useEffect, useState } from "react";
import {
  LucideArrowDownZA,
  LucideArrowUpZA,
  LucideBell,
  LucideCopy,
  LucideFilter,
  LucideFolderOpen,
  LucideLoader2,
  LucideMoreVertical,
  LucidePlus,
  LucideSearch,
  LucideSettings,
  LucideTrash2,
} from "lucide-react";
import { Spinner } from "@blueprintjs/core";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Card } from "./ui/card";
import { observer } from "mobx-react-lite";
import { useProject } from "plotNoFeatures/project";
import * as api from "../plotNoFeatures/api";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import DashboardHeader from "./DashboardHeader";
import { useAuthStore } from "store/use-auth-data";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { NavUser } from "./nav-user";
import folderSVG from "../assets/folder.svg";
import { nanoid } from "nanoid";
import { SidebarTrigger } from "./ui/sidebar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import NavbarLeftComponent from "./NavbarLeftComponent";
import { startAfter } from "firebase/firestore";

// Category filters
const categories = [
  { label: "All" },
  { label: "Folders" },
  { label: "Design" },
];

/* -----------------------------------------
   Shared Dashboard Projects: Recent Designs
   ----------------------------------------- */
const DashboardProjects = observer(({ 
  store, 
  addFiles, 
  fileDirectory, 
  handleProjectDelete,
  handleProjectDuplicate,
  designs,
  designsLoadings,
}) => {

  return (
    <div className="flex flex-col flex-wrap w-full">
      <div className="md:flex md:gap-2 md:flex-wrap max-md:grid max-md:grid-cols-2 max-md:gap-2">
        {!designsLoadings && !designs.length && (
          <div style={{ paddingTop: "20px", textAlign: "center", opacity: 0.6 }}>
            You have no designs yet.
          </div>
        )}
        {designsLoadings && (
          <div style={{ paddingTop: "20px", textAlign: "center", opacity: 0.6 }}>
            Loading designs...
          </div>
        )}
        {/* last 5 designs, in reverse order */}
        {designs
          .slice(-5)
          .reverse()
          .map((design) => (
            <DesignCard3
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
  );
});

/* -------------------------------------
   Single Design Card (recent designs)
   ------------------------------------- */
const DesignCard = observer(({ design, onDelete, onDuplicate, addFiles, fileDirectory, onSelected }) => {
  const [loading, setLoading] = useState(false);
  const [previewURL, setPreviewURL] = useState(design.previewURL);

  useEffect(() => {
    const load = async () => {
      const url = await api.getPreview({ id: design.id });
      setPreviewURL(url);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = async () => {
    setLoading(true);
    window.location.href = `/canvas?id=${design.id}`;
    setLoading(false);
  };

  return (
    <div className="flex flex-col">
      <Card
        style={{ padding: "3px", position: "relative" }}
        interactive
        className="mx-1 mb-auto fit-content w-fit group"
        onClick={handleSelect}
      >
        <div className="overflow-hidden rounded-2xl">
          <img src={previewURL} style={{ width: "200px" }} alt="preview" />
        </div>
        {loading && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Spinner />
          </div>
        )}
        <div className={`absolute top-2 left-2 md:hidden group-hover:block`}>
          <Input type="checkbox" className="w-6 h-6 rounded-2xl" onClick={(e)=>e.stopPropagation()} onChange={(e) => onSelected(e.target.checked)} />
        </div>
        <div
          className="absolute top-1 right-1 "
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button className="p-2 rounded-2xl bg-[#00000040] hover:bg-[#00000080] border md:hidden group-hover:block">
                <LucideMoreVertical className="h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="absolute mx-1 bg-white">
              <DropdownMenuItem
                className="flex gap-2"
                onClick={() => {
                  handleSelect();
                }}
              >
                <LucideFolderOpen className="h-4" />
                Open
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex gap-2"
                onClick={() => {
                  onDelete({ id: design.id });
                }}
              >
                <LucideTrash2 className="h-4" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex gap-2"
                onClick={() => {
                  onDuplicate({ id: design.id });
                }}
              >
                <LucideCopy className="h-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex gap-2">
                  <LucideFolderOpen className="h-4" />
                  Project
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {fileDirectory.map((project, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={() => {
                          addFiles(project.id, [design]);
                        }}
                      >
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
          <p className="text-xs text-secondary">
            {design.lastModified && design.lastModified.split("T")[0]}
          </p>
          <p className="text-xs text-secondary">
            {design.lastModified &&
              design.lastModified.replace(/^[^:]*([0-2]\d:[0-5]\d).*$/, "$1")}
          </p>
        </div>
      </div>
    </div>
  );
});

const DesignCard3 = observer(({ design, onDelete, onDuplicate, addFiles, fileDirectory }) => {
  const [loading, setLoading] = useState(false);
  const [previewURL, setPreviewURL] = useState(design.previewURL);

  useEffect(() => {
    const load = async () => {
      const url = await api.getPreview({ id: design.id });
      setPreviewURL(url);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = async () => {
    setLoading(true);
    window.location.href = `/canvas?id=${design.id}`;
    setLoading(false);
  };

  return (
    <div className="flex flex-col">
      <Card
        style={{ padding: "3px", position: "relative" }}
        interactive
        className="mx-1 mb-auto fit-content w-fit group"
        onClick={handleSelect}
      >
        <div className="overflow-hidden rounded-2xl">
          <img src={previewURL} style={{ width: "200px" }} alt="preview" />
        </div>
        {loading && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
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
              <Button className="p-2 rounded-2xl bg-[#00000040] hover:bg-[#00000080] border md:hidden group-hover:block">
                <LucideMoreVertical className="h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="absolute mx-1 bg-white">
              <DropdownMenuItem
                className="flex gap-2"
                onClick={() => {
                  handleSelect();
                }}
              >
                <LucideFolderOpen className="h-4" />
                Open
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex gap-2"
                onClick={() => {
                  onDelete({ id: design.id });
                }}
              >
                <LucideTrash2 className="h-4" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex gap-2"
                onClick={() => {
                  onDuplicate({ id: design.id });
                }}
              >
                <LucideCopy className="h-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex gap-2">
                  <LucideFolderOpen className="h-4" />
                  Project
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {fileDirectory.map((project, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={() => {
                          addFiles(project.id, [design]);
                        }}
                      >
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
          <p className="text-xs text-secondary">
            {design.lastModified && design.lastModified.split("T")[0]}
          </p>
          <p className="text-xs text-secondary">
            {design.lastModified &&
              design.lastModified.replace(/^[^:]*([0-2]\d:[0-5]\d).*$/, "$1")}
          </p>
        </div>
      </div>
    </div>
  );
});

/* --------------------------------------------
   Single Design Card (folder-based designs)
   -------------------------------------------- */
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
  }, []);

  const handleSelect = async () => {
    setLoading(true);
    window.location.href = `/canvas?id=${design.id}`;
    setLoading(false);
  };

  return (
    <div className="flex flex-col">
      <Card
        style={{ padding: "3px", position: "relative" }}
        interactive
        className="mx-1 mb-auto fit-content w-fit group"
        onClick={handleSelect}
      >
        <div className="overflow-hidden rounded-2xl">
          <img src={previewURL} style={{ width: "200px" }} alt="preview" />
        </div>
        {loading && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
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
              <Button className="p-2 rounded-2xl bg-[#00000040] hover:bg-[#00000080] border hidden group-hover:block">
                <LucideMoreVertical className="h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="absolute mx-1 bg-white">
              <DropdownMenuItem
                className="flex gap-2"
                onClick={() => {
                  handleSelect();
                }}
              >
                <LucideFolderOpen className="h-4" />
                Open
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex gap-2"
                onClick={() => {
                  onDelete({ id: design.id });
                }}
              >
                <LucideTrash2 className="h-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      <div className="mx-2 mt-3">
        <p className="text-xs font-semibold">{design.name}</p>
        <div className="flex justify-between">
          <p className="text-xs text-secondary">
            {design.lastModified && design.lastModified.split("T")[0]}
          </p>
          <p className="text-xs text-secondary">
            {design.lastModified &&
              design.lastModified.replace(/^[^:]*([0-2]\d:[0-5]\d).*$/, "$1")}
          </p>
        </div>
      </div>
    </div>
  );
});

/* ----------------------------------
   All Designs (Full listing)
   ---------------------------------- */
const DashboardProjects2 = observer(({ 
  store, 
  addFiles, 
  fileDirectory,  
  handleProjectDelete, 
  handleProjectDuplicate, 
  handleMultipleDelete, 
  designs, 
  designsLoadings, 
  selectedDesign, 
  setSelectedDesign,
  deleting
}) => {

  return (
    <div className="flex flex-col flex-wrap">
      <div className="flex justify-between mb-4">
        <p className="mb-3 text-lg font-semibold">Designs</p>
        {selectedDesign.length > 0 && (
          deleting ?(
          <Button
            onClick={()=>{}}
          >
            <LucideLoader2 className={`h-7 w-7 animate-spin p-1`}/> Deleting...
          </Button>
          ): (
          <Button
            onClick={()=>handleMultipleDelete(selectedDesign)}
          >
            Delete Selected
          </Button>
          )
        )}
      </div>
      <div className="md:flex md:gap-2 md:flex-wrap max-md:grid max-md:grid-cols-2 max-md:gap-2">
        <Button
          variant="dotted"
          className="h-full px-10 py-8 aspect-square max-md:w-full max-md:px-2"
          onClick={async () => {
            window.location.href = `/canvas?id=create_new_design`;
          }}
        >
          <LucidePlus className="h-4" />
          Create new project
        </Button>
        {!designsLoadings && !designs.length && (
          <div style={{ paddingTop: "20px", textAlign: "center", opacity: 0.6 }}>
            You have no designs yet.
          </div>
        )}
        {designsLoadings && (
          <div style={{ paddingTop: "20px", textAlign: "center", opacity: 0.6 }}>
            Loading designs...
          </div>
        )}
        {designs.map((design) => (
          <DesignCard
            key={design.id}
            design={design}
            onDelete={handleProjectDelete}
            onSelected={(selected) => {
              if (selected) {
                setSelectedDesign([...selectedDesign, design]);
              } else {
                setSelectedDesign(selectedDesign.filter((d) => d.id !== design.id));
              }
            }}
            onDuplicate={handleProjectDuplicate}
            fileDirectory={fileDirectory}
            addFiles={addFiles}
          />
        ))}
      </div>
    </div>
  );
});

/* ----------------------------------
   Folder-based designs
   ---------------------------------- */
const DashboardProjects3 = observer(({ store, files, deleteFiles, projectId }) => {
  const project = useProject();
  const [designsLoadings, setDesignsLoading] = useState(false);
  const [designs, setDesigns] = useState([]);

  const loadDesigns = async () => {
    setDesignsLoading(true);
    // Here we just reflect what's passed in as 'files'
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
      <div className="md:flex md:gap-2 md:flex-wrap max-md:grid max-md:grid-cols-2 max-md:gap-2">
        {!designsLoadings && !designs.length && (
          <div style={{ paddingTop: "20px", textAlign: "center", opacity: 0.6 }}>
            You have no designs yet.
          </div>
        )}
        {designsLoadings && (
          <div style={{ paddingTop: "20px", textAlign: "center", opacity: 0.6 }}>
            Loading designs...
          </div>
        )}
        {designs.map((design) => (
          <DesignCard2 key={design.id} design={design} onDelete={handleProjectDelete} />
        ))}
      </div>
    </div>
  );
});

/* -------------------------------
   Main Project Section Component
   ------------------------------- */
function ProjectSection({ store }) {
  const [open, setOpen] = useState(false);
  const [fileDirectory, setFileDirectory] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const { user } = useAuthStore();

  const region = "eu-west-2";
  const credentials = {
    accessKeyId: process.env.REACT_APP_DYNAMO_DB_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_DYNAMO_DB_AWS_SECRET_ACCESS_KEY,
  };

  const ddbClient = new DynamoDBClient({ region, credentials });
  const docClient = DynamoDBDocumentClient.from(ddbClient);
  const tableName = "flashkitUserData";

  // Filtering states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState({
    startDate: "",
    endDate: "",
    sort: "",
    alphabetical:""
  });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const project = useProject();
  const [designsLoadings, setDesignsLoading] = useState(false);
  const [designs, setDesigns] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState([]);
  const [deleting, setDeleting] = useState(false);
  
  const loadDesigns = async () => {
    setDesignsLoading(true);
    const list = await api.listFilteredDesigns(searchTerm, searchDate);
    setDesigns(list);
    setDesignsLoading(false);
  };

  const handleProjectDelete = ({ id }) => {
    setDesigns(designs.filter((design) => design.id !== id));
    api.deleteDesign({ id });
  };

  const handleProjectDuplicate = async ({ id }) => {
    await api.duplicateDesign({ id });
    await loadDesigns();
  };

  const handleMultipleDelete = async (selectedDesign) => {
    setDeleting(true);
    const ids = Array.from(selectedDesign, (d) => d.id);
    await api.deleteMultipleDesigns({ ids });
    await loadDesigns();
    setSelectedDesign([]);
    setDeleting(false);
  };

  // Filtered list of Folders (Projects) - search only applies to project names
  const filteredFileDirectory = fileDirectory.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (user && user.uid) {
      getFileDirectory(user.uid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function addFilesToProject(projectId, files) {
    const updatedDirectory = fileDirectory.map((project) => {
      if (project.id === projectId) {
        return {
          ...project,
          files: [...project.files, ...files],
        };
      }
      return project;
    });
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
      }
      return project;
    });
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
      UpdateExpression: "SET projectDirectory = :pd",
      ExpressionAttributeValues: {
        ":pd": directoryData,
      },
      ReturnValues: "ALL_NEW",
    };

    try {
      await docClient.send(new UpdateCommand(params));
    } catch (error) {
      console.error("Error saving file directory:", error);
    }
  }

  async function handleCreateNewProject() {
    if (!newProjectName || !user || !user.uid) return;

    const newProject = {
      name: newProjectName,
      id: nanoid(10),
      files: [],
      createdAt: new Date().toISOString(),
    };

    const updatedDirectory = [...fileDirectory, newProject];
    setFileDirectory(updatedDirectory);
    await saveFileDirectory(user.uid, updatedDirectory);

    setNewProjectName("");
    setOpen(false);
  }

  async function handleDeleteProject(projectId) {
    const updatedDirectory = fileDirectory.filter(
      (project) => project.id !== projectId
    );
    setFileDirectory(updatedDirectory);
    await saveFileDirectory(user.uid, updatedDirectory);
  }

  useEffect(() => {
    loadDesigns();
  }, [project.cloudEnabled, project.designsLength, searchTerm, searchDate]);

  return (
    <div className="flex flex-col">
      <header className="flex shrink-0 h-10 items-center gap-2 transition-[width,height] ease-linear justify-end mb-2">
        <SidebarTrigger className="md:hidden" />
        <NavbarLeftComponent />
      </header>
      <DashboardHeader
        title={"Projects"}
        buttonText={"Explore Project"}
        bottomSection={false}
      />
      <div className="flex items-center justify-between py-4 rounded-md max-md:grid max-md:grid-cols-[70%,30%] max-md:gap-2">
        <div className="flex gap-2 max-md:flex-col">
          <div className="flex min-w-80 max-md:min-w-40">
            <div className="flex items-center flex-1 px-1 border rounded-full">
              <div className="text-gray-400">
                <LucideSearch className="h-5" />
              </div>
              <Input
                type="search"
                placeholder="Search ..."
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
          {categories.map((cat, i) => (
            <Button
              key={i}
              variant="outline"
              className="rounded-full whitespace-nowrap"
              onClick={() => setSelectedCategory(cat.label)}
            >
              {cat.label}
            </Button>
          ))}
          </div>
        </div>
        <div className="flex items-center space-x-2 max-md:flex-col-reverse max-md:gap-2 max-md:items-end" >
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <div className="p-[2px] rounded-sm bg-[#409BFF] mr-2">
                  <LucidePlus size={14} fill="#fff" color="#fff" />
                </div>
                Add New
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
          <Popover>
          <PopoverTrigger asChild>
          <Button variant="outline">
            <LucideFilter className="h-4 my-auto" />
            Filters
          </Button>
          </PopoverTrigger>
          <PopoverContent className="p-4 bg-white rounded-md shadow-md min-w-fit">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
              <p className="text-sm font-semibold my-auto">Filter by</p>
              <Button variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSearchDate({ startDate: "", endDate: "", sort: "", alphabetical: "" });
              }}
              >
                clear all
              </Button>
              </div>
              <div className="flex align-center gap-2">
                <Input
                  type="date"
                  value={searchDate.startDate}
                  onChange={(e) => setSearchDate((prev) => ({ ...prev, startDate: e.target.value }))}
                />
                <p className="my-auto">to</p>
                <Input
                  type="date"
                  value={searchDate.endDate}
                  onChange={(e) => setSearchDate((prev) => ({ ...prev, endDate: e.target.value }))}
                />
                </div>
            {/* buttons to toggle alphabetical sorting and newest oldest design */}
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => setSearchDate((prev) => ({ ...prev, sort: prev.sort === "newest" ? "oldest" : "newest" }))}
              >
                {searchDate.sort === "asc" ? "Newest" : "Oldest"}
              </Button>
              <Button
                onClick={() => setSearchDate((prev) => ({ ...prev, alphabetical: prev.alphabetical === "asc" ? "desc" : "asc" }))}
                className="flex gap-2"
              >
              Alphabetical Sort 
                {searchDate.alphabetical === "asc" ? <LucideArrowUpZA/> : <LucideArrowDownZA/>}
              </Button>
            </div>
            
            </div>
          </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Show "Recent Designs" if category is "All" or "Design" */}
      {(selectedCategory === "All" || selectedCategory === "Design") && (
        <div className="max-w-[80vw] max-md:max-w-full my-10">
          <p className="mb-3 text-lg font-semibold">Recent Designs</p>
          <DashboardProjects
            store={store}
            addFiles={addFilesToProject}
            fileDirectory={fileDirectory}
            handleProjectDelete={handleProjectDelete}
            handleProjectDuplicate={handleProjectDuplicate}
            designs={designs}
            designsLoadings={designsLoadings}
            selectedDesign={selectedDesign}
            setSelectedDesign={setSelectedDesign}
          />
        </div>
      )}

      {/* Show "Folders" if category is "All" or "Folders" */}
      {(selectedCategory === "All" || selectedCategory === "Folders") && (
        <>
          <p className="text-lg font-semibold">Folders</p>
          <div className="gap-3 mt-3 md:flex md:flex-wrap max-md:grid max-md:grid-cols-2 max-md:gap-3">
            {filteredFileDirectory.map((project, index) => (
              <TooltipProvider key={index}>
                <Dialog>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DialogTrigger asChild>
                        <div className="flex min-w-80 gap-3 hover:bg-[#f9f9f9] p-4 rounded-md cursor-pointer max-md:min-w-20">
                          <img src={folderSVG} alt="folder" className="h-5" />
                          <p className="my-auto font-semibold">{project.name}</p>
                        </div>
                      </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(project.createdAt).toLocaleString()}
                      </p>
                      <p className="text-sm">Files: {project.files.length}</p>
                    </TooltipContent>
                  </Tooltip>
                  <DialogContent className="sm:max-w-[60%]">
                    <DialogHeader>
                      <DialogTitle>{project.name}</DialogTitle>
                      <DialogDescription>
                        Make changes to your Folder here. Click save when
                        you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <DashboardProjects3
                      store={store}
                      projectId={project.id}
                      files={project.files}
                      deleteFiles={deleteFilesFromProject}
                    />
                    <DialogFooter className="max-md:grid max-md:grid-cols-2 max-md:gap-2">
                      <Button
                        onClick={() => {
                          handleDeleteProject(project.id);
                        }}
                        variant="destructive"
                      >
                        Delete Folder
                      </Button>
                      <Button type="submit">Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TooltipProvider>
            ))}
          </div>
        </>
      )}

      {/* Show "Designs" if category is "All" or "Design" */}
      {(selectedCategory === "All" || selectedCategory === "Design") && (
        <div className="my-10">
          <DashboardProjects2
            store={store}
            addFiles={addFilesToProject}
            fileDirectory={fileDirectory}
            handleProjectDelete={handleProjectDelete}
            handleProjectDuplicate={handleProjectDuplicate}
            handleMultipleDelete={handleMultipleDelete}
            designs={designs}
            designsLoadings={designsLoadings}
            selectedDesign={selectedDesign}
            setSelectedDesign={setSelectedDesign}
            deleting={deleting}
          />
        </div>
      )}
    </div>
  );
}

export default ProjectSection;
