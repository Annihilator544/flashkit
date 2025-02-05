import axios from "axios";
import { useEffect, useState } from "react";
import { useYoutubeData } from "store/use-youtube-data";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { LucideHeart, LucideMessageSquare, LucideSend, LucideTrendingUp } from "lucide-react";

function YoutubeContent() {
    const [videos, setVideos] = useState([]);
    const { youtubeData } = useYoutubeData();

    const getRecentVideos = async ( channelResponse ) => {
      const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
      try {
        const uploadPlaylistId =
          channelResponse.contentDetails.relatedPlaylists.uploads;
    
        // Step 2: Get Videos from the Upload Playlist
        const playlistResponse = await axios.get(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadPlaylistId}&maxResults=4&key=${API_KEY}`
        );
    
        const videoIds = playlistResponse.data.items.map(
          (item) => item.snippet.resourceId.videoId
        );
    
        // Step 3: Fetch Video Statistics
        const videoResponse = await axios.get(
          `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds.join(",")}&key=${API_KEY}`
        );
    
        const videos = videoResponse.data.items.map((video) => ({
          title: video.snippet.title,
          description: video.snippet.description,
          publishedAt: video.snippet.publishedAt,
          thumbnails: video.snippet.thumbnails,
          viewCount: video.statistics.viewCount,
          likeCount: video.statistics.likeCount,
          commentCount: video.statistics.commentCount,
        }));
        setVideos(videos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
     useEffect(() => {
          // round to 2 decimal places
        if(Object.keys(youtubeData).length){
        getRecentVideos( youtubeData.channel )
        }
        }, []);
  return (
    <Card className="flex flex-col gap-4 bg-[#f6f8f9]">
                    <CardHeader className="flex-row justify-between pb-0">
                        <CardTitle className="text-lg font-semibold">Top content by reach</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2 md:grid-cols-4">
                    {videos.map((video, index) => (
                        <Card key={index} className="overflow-hidden">
                            <CardContent className="p-0 h-[200px] bg-[#e3e3e3] justify-center flex overflow-hidden">
                                    <img src={video.thumbnails?.high.url} alt={video.title} className="max-h-full my-auto " />
                            </CardContent>
                            <CardFooter className="flex-col p-4 ">
                                <p className="mr-auto text-xs font-semibold line-clamp-1">{video.title}</p>
                                <p className=" text-secondary text-xs mr-auto mt-[6px]">{new Date(video.publishedAt).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                    })}</p>
                                <div className="flex justify-start gap-2 w-full mt-3 mr-auto max-w-56">
                                    <div className="flex gap-1 text-xs"><LucideHeart className="w-3 h-3 my-auto text-red-600" fill="red"/> <p>{video.commentCount}</p></div>
                                    <div className="flex gap-1 text-xs"><LucideMessageSquare className="w-3 h-3 my-auto text-blue-500" fill="#409bff"/> <p>{video.likeCount}</p></div>
                                    <div className="flex gap-1 text-xs"><LucideTrendingUp className="w-3 h-3 my-auto text-green-500"/> <p>{video.viewCount.toLocaleString()}</p></div>
                                </div>
                            </CardFooter>
                        </Card>
                        ))}
                    </CardContent>
                </Card>
  );
}

export default YoutubeContent;