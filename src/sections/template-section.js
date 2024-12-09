import { TemplatesSection as defaultTemplatesSection, SectionTab } from "polotno/side-panel";
import TemplatesVector from '../assets/TemplatesVector.svg';

export const TemplatesSectionTab =  (props) => (
    <SectionTab name="Templates" {...props}>
        <img src={TemplatesVector} alt="Templates" className="w-6 h-6" />
    </SectionTab>
)

defaultTemplatesSection.Tab = TemplatesSectionTab;

export const TemplatesSection = defaultTemplatesSection