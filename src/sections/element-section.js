
import { observer } from 'mobx-react-lite';
import { SectionTab } from 'polotno/side-panel';
import { Shapes } from 'polotno/side-panel/elements-panel';
import { t } from 'polotno/utils/l10n';
import { VideosSection } from './video-section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { IconsSection } from './icons-section';
import { DEFAULT_SECTIONS } from 'polotno/side-panel';
import { QrSection } from './qr-section';
import ElementsVector from '../assets/ElementsVector.svg';
import { UploadSection } from './upload-section';

export const ElementsPanel = ({ store }) => {
    const TextSection = DEFAULT_SECTIONS[1];
    const ImageSection = DEFAULT_SECTIONS[2];
    const ShapesSection = DEFAULT_SECTIONS[3];
    const backgroundSection = DEFAULT_SECTIONS[5];
  return (
    <Tabs defaultValue="images" className="sidePanelHeight flex flex-col">
        <TabsList className="flex flex-wrap gap-1">
            {/* <TabsTrigger value="videos">Videos</TabsTrigger> */}
            <TabsTrigger value="icons">Icons</TabsTrigger>
            {/* <TabsTrigger value="texts">Texts</TabsTrigger> */}
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="shapes">Shapes</TabsTrigger>
            <TabsTrigger value="uploads">Uploads</TabsTrigger>
            <TabsTrigger value="backgrounds">Backgrounds</TabsTrigger>
            <TabsTrigger value="qr">QR</TabsTrigger>
        </TabsList>
        {/* <TabsContent value="videos" className="flex-1 overflow-hidden"><VideosSection.Panel store={store} /></TabsContent> */}
        <TabsContent value="icons" className="flex-1 overflow-hidden"><IconsSection.Panel store={store} /></TabsContent>
        {/* <TabsContent value="texts" className="flex-1 overflow-hidden"><TextSection.Panel store={store} /></TabsContent> */}
        <TabsContent value="images" className="flex-1 overflow-hidden"><ImageSection.Panel store={store} /></TabsContent>
        <TabsContent value="shapes" className="flex-1 overflow-hidden"><ShapesSection.Panel store={store} /></TabsContent>
        <TabsContent value="uploads" className="flex-1 overflow-hidden"><UploadSection.Panel store={store} /></TabsContent>
        <TabsContent value="backgrounds" className="flex-1 overflow-hidden"><backgroundSection.Panel store={store} /></TabsContent>
        <TabsContent value="qr" className="flex-1 overflow-hidden"><QrSection.Panel store={store} /></TabsContent>
    </Tabs>
  );
};

// // define the new custom section
export const ElementsSection = {
  name: 'Elements',
  Tab: observer((props) => (
    <SectionTab name={t('sidePanel.elements')} {...props}>
      <img src={ElementsVector} alt="Elements" className="w-6 h-6" />
    </SectionTab>
  )),
  // we need observer to update component automatically on any store changes
  Panel: ElementsPanel,
};
