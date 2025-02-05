import { useInstagramData } from "store/use-instagram-data";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { LucideHeart, LucideMessageSquare, LucideSend, LucideTrendingUp } from "lucide-react";

function InstagramContent() {
    const { instagramData } = useInstagramData();

    function formatDate(date) {
        const options = {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        };
      
        return date.toLocaleDateString("en-US", options).replace(",", "");
      }

    return (
        <Card className="flex flex-col gap-4 bg-[#f6f8f9]">
                    <CardHeader className="flex-row justify-between pb-0">
                        <CardTitle className="text-lg font-semibold">Top content by reach</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2 md:grid-cols-4">
                    {instagramData.posts.filter((item) => item.media_type !== "VIDEO").slice(0, 4).map((item, index) => (
                        <Card key={index} className="overflow-hidden">
                            <CardContent className="p-0 h-[200px] bg-[#e3e3e3] justify-center flex overflow-hidden">
                                    <img src={item.media_url} alt={item.caption} className="max-h-full my-auto " />
                            </CardContent>
                            <CardFooter className="flex-col p-4 ">
                                <p className="mr-auto text-xs font-semibold line-clamp-1">{item.caption}</p>
                                <p className=" text-secondary text-xs mr-auto mt-[6px]">{formatDate(new Date(item.timestamp))}</p>
                                <div className="flex justify-around w-full mt-3  gap-2">
                                    <div className="flex gap-2 mr-auto">
                                        <div className="flex gap-1 text-xs"><LucideHeart className="w-3 h-3 my-auto text-red-600" fill="red"/> <p>{item.like_count}</p></div>
                                        <div className="flex gap-1 text-xs"><LucideMessageSquare className="w-3 h-3 my-auto text-blue-500" fill="#409bff"/> <p>{item.comments_count}</p></div>
                                    </div>
                                    
                                </div>
                            </CardFooter>
                        </Card>
                        ))}
                    </CardContent>
                </Card>
    );
}

export default InstagramContent;