import React from 'react';
import { Button } from "./ui/button";
import { 
  Layout, 
  Film, 
  Image, 
  FileText, 
  Share2, 
  Globe, 
  Upload,
  MoreHorizontal,
  Instagram,
} from "lucide-react";
import headerSvg from '../assets/header.svg'

const DashboardHeader = ({ title, buttonText, bottomSection }) => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#E4F0FA] to-[#9DD3FF] stops-[#9DD3FF] rounded-lg mb-6 p-8 h-[140px]">
        <h1 className="text-3xl font-light text-black mb-4">{title}</h1>
      </div>

      {/* Tools Grid */}
      {bottomSection ?
      <div className="grid grid-cols-5 gap-4 mb-8 md:grid-cols-10">
        <ToolButton icon={<FileText />} label="Doc" color="text-cyan-800" />
        <ToolButton icon={<Layout />} label="Canvas" color="text-green-800" />
        <ToolButton icon={<Image />} label="Graphics" color="text-orange-800" />
        <ToolButton icon={<Share2 />} label="Share" color="text-pink-800" />
        <ToolButton icon={<Film />} label="Video" color="text-purple-800" />
        <ToolButton icon={<FileText />} label="Media Kit" color="text-indigo-800" />
        <ToolButton icon={<Instagram />} label="Instagram" color="text-pink-800" />
        <ToolButton icon={<Layout />} label="Custom" color="text-gray-800" />
        <ToolButton icon={<Upload />} label="Upload" color="text-slate-800" />
        <ToolButton icon={<MoreHorizontal />} label="More" color="text-gray-700" />
      </div>
      :
      <></>}
    </div>
  );
};

const ToolButton = ({ icon, label, color }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        variant="ghost"
        onClick={() =>
        window.location.href = '/canvas'
        }
        className={` aspect-square flex flex-col p-4 h-20 w-20 ${color} hover:bg-gray-100`}
      >
        <div>{icon}</div>
        <span className="text-xs text-gray-600 mt-4">{label}</span>
      </Button>
    </div>
  );
};


export default DashboardHeader;