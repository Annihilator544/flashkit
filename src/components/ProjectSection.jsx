import { Button } from "./ui/button";
import projectSvg from '../assets/project.svg'

function ProjectSection(){

    return (
        <>
            <div className="bg-gradient-to-r relative from-[#584eff] to-[#e365d7] stops-[#e185a9] p-8 rounded-lg mb-6">
              <h1 className="text-4xl font-semibold text-white mb-4">Projects</h1>
              <img src={projectSvg} alt="header" className="absolute right-5 -bottom-16 w-60 h-60" />
            </div>
            <p className=" text-3xl font-semibold">Projects</p>
              <div>
                <p className="text-lg font-semibold">Recent Projects for you</p>
                <p className="text-secondary font-medium text-sm mb-5">Choose a template and craft eye-catching stats</p>
                <div className="flex flex-wrap gap-3">
                {/* {
                  mediaKitData.map((item)=>{
                    return(
                      <TemplateCard url={item.preview} jsonURL={item.json} store={store}/>
                    )
                  })
                } */}
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold mb-5">Bold</p>
                <div className="flex flex-wrap gap-3">
                {/* {
                  boldDesigns.map((item)=>{
                    return(
                      <TemplateCard url={item.preview} jsonURL={item.json} store={store}/>
                    )
                  })
                } */}
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold mb-5">Minimal</p>
                <div className="flex flex-wrap gap-3">
                {/* {
                  minimalDesigns.map((item)=>{
                    return(
                      <TemplateCard url={item.preview} jsonURL={item.json} store={store}/>
                    )
                  })
                } */}
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold mb-5">Classic</p>
                <div className="flex flex-wrap gap-3">
                {/* {
                  classicDesigns.map((item)=>{
                    return(
                      <TemplateCard url={item.preview} jsonURL={item.json} store={store}/>
                    )
                  })
                } */}
                </div>
              </div>
            </>
    )
}

export default ProjectSection