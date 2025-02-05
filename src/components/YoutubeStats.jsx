import { useYoutubeData } from "store/use-youtube-data";
import CircularProgress from "./CircularProgress"
import { Card, CardContent } from "./ui/card"
import { Separator } from "./ui/separator"
import { LucideArrowDownLeft, LucideArrowUpRight } from "lucide-react";

function YoutubeStats({ className }) {
    const { youtubeData, youtubeCalculatedData, eqs } = useYoutubeData();
    return (
        <Card className={className}>
                <CardContent className="flex flex-row gap-4 p-4 max-md:flex-col">
                  <div className="flex flex-col gap-2 max-md:justify-center max-md:items-center">
                    <CircularProgress score={eqs.eqsPercentage} startColor="#FECAD5" endColor="#FF2853" />
                    <div className="flex gap-1 mx-auto text-sm font-medium">
                    <p className={`${eqs.eqsPercentageChange > 0 ? "text-[#34C759]": eqs.eqsPercentageChange === 0 ? "text-[#FF9500]": "text-[#FF3B30]"} ml-auto flex`}>{eqs.eqsPercentageChange}%{eqs.eqsPercentageChange > 0 ? <LucideArrowUpRight className="w-4 h-4 mt-auto"/> : eqs.eqsPercentageChange === 0 ? <></> : <LucideArrowDownLeft className="w-4 h-4 mt-auto"/>}</p>
                    <p className="text-secondary"> than last week</p></div>
                  </div>
                  <Separator orientation="vertical" className="max-md:hidden"/>
                  <Separator orientation="horizontal" className="md:hidden"/>
                  <div className="flex md:flex-1">
                  <div className="flex flex-col flex-1 gap-2 ">
                        <Card className="border-none rounded-lg shadow-none ">
                            <CardContent className="flex flex-col flex-1 gap-1 p-2">
                            <div className="flex gap-2 text-sm font-medium text-secondary Inter">Total Views</div>
                            <div className="flex justify-between">
                            <p className="my-auto text-3xl font-semibold ">{youtubeCalculatedData.totalViewsThisWeek}</p>
                            <div className="flex flex-col mt-auto text-sm font-medium">
                                <p className={`${youtubeCalculatedData.percentageChangeViews > 0 ? "text-[#34C759]": youtubeCalculatedData.percentageChangeViews === 0 ? "text-[#FF9500]": "text-[#FF3B30]"} ml-auto flex`}>{youtubeCalculatedData.percentageChangeViews}% {youtubeCalculatedData.percentageChangeViews > 0 ? <LucideArrowUpRight className="w-4 h-4 mt-auto"/> : youtubeCalculatedData.percentageChangeViews === 0 ? <></> : <LucideArrowDownLeft className="w-4 h-4 mt-auto"/>}</p>
                                <p className="ml-auto text-secondary max-md:hidden"> than last week</p></div>
                            </div>
                            </CardContent>
                        </Card>
                        <Separator orientation="horizontal"/>
                        <Card className="border-none rounded-lg shadow-none ">
                            <CardContent className="flex flex-col flex-1 gap-1 p-2">
                            <div className="flex gap-2 text-sm font-medium text-secondary Inter">Total Subscribers</div>
                            <div className="flex justify-between">
                            <p className="my-auto text-3xl font-semibold ">{youtubeData?.channel?.statistics?.subscriberCount}</p>
                            <div className="flex flex-col mt-auto text-sm font-medium">
                                <p className={`${youtubeCalculatedData.percentageChangeSubscribers > 0 ? "text-[#34C759]": youtubeCalculatedData.percentageChangeSubscribers === 0 ? "text-[#FF9500]": "text-[#FF3B30]"} ml-auto flex`}>{youtubeCalculatedData.percentageChangeSubscribers}%{youtubeCalculatedData.percentageChangeSubscribers > 0 ? <LucideArrowUpRight className="w-4 h-4 mt-auto"/> : youtubeCalculatedData.percentageChangeSubscribers === 0 ? <></> : <LucideArrowDownLeft className="w-4 h-4 mt-auto"/>}</p>
                                <p className="ml-auto text-secondary max-md:hidden"> than last week</p></div>
                            </div>
                            </CardContent>
                        </Card>
                  </div>
                  <Separator orientation="vertical"/>
                  <div className="flex flex-col flex-1 gap-2">
                        <Card className="border-none rounded-lg shadow-none ">
                            <CardContent className="flex flex-col flex-1 gap-1 p-2">
                            <div className="flex gap-2 text-sm font-medium text-secondary Inter">Total Watch Time</div>
                            <div className="flex justify-between">
                            <p className="my-auto text-3xl font-semibold ">{youtubeCalculatedData.totalWatchTime}</p>
                            <div className="flex flex-col mt-auto text-sm font-medium">
                                <p className={`${youtubeCalculatedData.percentageChangeWatchTime > 0 ? "text-[#34C759]": youtubeCalculatedData.percentageChangeWatchTime === 0 ? "text-[#FF9500]": "text-[#FF3B30]"} ml-auto flex`}>{youtubeCalculatedData.percentageChangeWatchTime}%{youtubeCalculatedData.percentageChangeWatchTime > 0 ? <LucideArrowUpRight className="w-4 h-4 mt-auto"/> : youtubeCalculatedData.percentageChangeWatchTime === 0 ? <></> : <LucideArrowDownLeft className="w-4 h-4 mt-auto"/>}</p>
                                <p className="ml-auto text-secondary max-md:hidden"> than last week</p></div>
                            </div>
                            </CardContent>
                        </Card>
                        <Separator orientation="horizontal"/>
                        <Card className="border-none rounded-lg shadow-none ">
                            <CardContent className="flex flex-col flex-1 gap-1 p-2">
                            <div className="flex gap-2 text-sm font-medium text-secondary Inter">Average View Duration</div>
                            <div className="flex justify-between">
                            <p className="my-auto text-3xl font-semibold ">{youtubeCalculatedData.averageViewDuration}</p>
                            <div className="flex flex-col mt-auto text-sm font-medium">
                                <p className={`${youtubeCalculatedData.percentageChangeAverageViewDuration > 0 ? "text-[#34C759]": youtubeCalculatedData.percentageChangeAverageViewDuration === 0 ? "text-[#FF9500]": "text-[#FF3B30]"} ml-auto flex`}>{youtubeCalculatedData.percentageChangeAverageViewDuration}% {youtubeCalculatedData.percentageChangeAverageViewDuration > 0 ? <LucideArrowUpRight className="w-4 h-4 mt-auto"/> : youtubeCalculatedData.percentageChangeAverageViewDuration === 0 ? <></> : <LucideArrowDownLeft className="w-4 h-4 mt-auto"/>}</p>
                                <p className="ml-auto text-secondary max-md:hidden"> than last week</p></div>
                            </div>
                            </CardContent>
                        </Card>
                  </div>
                  </div>
                </CardContent>
              </Card>
    )
}

export default YoutubeStats