import { SizeSection as defaultSizeSection, SectionTab } from "polotno/side-panel";
import ResizeVector from '../assets/ResizeVector.svg';

export const ResizeSectionTab =  (props) => (
    <SectionTab name="Resize" {...props}>
        <img src={ResizeVector} alt="Resize" className="w-6 h-6" />
    </SectionTab>
)

defaultSizeSection.Tab = ResizeSectionTab;

export const ResizeSection = defaultSizeSection