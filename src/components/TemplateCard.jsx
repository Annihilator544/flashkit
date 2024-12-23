import { useJsonData } from "store/use-json-data";
import { Card, CardContent, CardFooter } from "./ui/card";

function TemplateCard({ url , jsonURL, BucketKey}){
    const { setData } = useJsonData();
    async function ParseJson(jsonURL){
        await fetch(jsonURL).then(response => response.json()).then(data => setData(data));
        window.location.href = `/canvas?json=TRUE`;
    }
    function setJSON(BucketKey){
        BucketKey = BucketKey.replace("Image/", "Json/");
        window.location.href = `/canvas?awsKeyMarket=${BucketKey}`;
    }
    return (
        BucketKey ? 
        <button onClick={() => setJSON(BucketKey)}>
            <Card className=" overflow-hidden min-w-28 max-w-40">
                <CardContent className="p-0">
                    <img src={url} alt="img" className="w-full"/>
                </CardContent>
            </Card>
            <div className="flex flex-col justify-between items-center py-2">
                    <p className="text-xs font-semibold  mr-auto">Template name</p>
                    <p className="text-xs text-secondary mr-auto">description</p>
            </div>
        </button>
        :
        <button onClick={() => ParseJson(jsonURL)}>
            <Card className=" overflow-hidden min-w-28 max-w-40">
                <CardContent className="p-0">
                    <img src={url} alt="img" className="w-full"/>
                </CardContent>
            </Card>
            <div className="flex flex-col justify-between items-center py-2">
                    <p className="text-xs font-semibold  mr-auto">Template name</p>
                    <p className="text-xs text-secondary mr-auto">description</p>
            </div>
        </button>
    )
}

export default TemplateCard;