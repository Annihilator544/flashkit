import { LayersSection as defaultLayersSection, SectionTab } from "polotno/side-panel";
import LayersVector from '../assets/LayersVector.svg';

export const LayersSectionTab =  (props) => (
    <SectionTab name="Layers" {...props}>
        <img src={LayersVector} alt="Layers" className="w-6 h-6" />
    </SectionTab>
)

defaultLayersSection.Tab = LayersSectionTab;

export const LayersSection = defaultLayersSection
