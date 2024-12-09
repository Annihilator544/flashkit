import { TextSection as defaultTextSection, SectionTab } from "polotno/side-panel";
import TextVector from '../assets/TextVector.svg';

export const TextSectionTab =  (props) => (
    <SectionTab name="Text" {...props}>
        <img src={TextVector} alt="Text" className="w-6 h-6" />
    </SectionTab>
)

defaultTextSection.Tab = TextSectionTab;

export const TextSection = defaultTextSection