import { LucideArrowDownLeft, LucideArrowUpRight } from "lucide-react";
import CircularProgress from "./CircularProgress";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { useInstagramData } from "store/use-instagram-data";

function InstagramStats({ className }) {
    const { instagramData, instagramCalculatedData, instagramEQS } = useInstagramData();
    return (
        <Card className={className}>
                <CardContent className="flex flex-row gap-4 p-4 max-md:flex-col">
                  <div className="flex flex-col gap-2 max-md:justify-center max-md:items-center">
                    <CircularProgress score={instagramEQS.eqsPercentage} startColor="#BD65F6" endColor="#FEB559" />
                    <div className="flex gap-1 mx-auto text-sm font-medium">
                    <p className={`${instagramEQS.eqsPercentageChange > 0 ? "text-[#34C759]": instagramEQS.eqsPercentageChange === 0 ? "text-[#FF9500]": "text-[#FF3B30]"} ml-auto flex`}>{instagramEQS.eqsPercentageChange}%{instagramEQS.eqsPercentageChange > 0 ? <LucideArrowUpRight className="w-4 h-4 mt-auto"/> : instagramEQS.eqsPercentageChange === 0 ? <></> : <LucideArrowDownLeft className="w-4 h-4 mt-auto"/>}</p>                    
                    <p className="text-secondary"> than last week</p></div>
                  </div>
                  <Separator orientation="vertical" className="max-md:hidden"/>
                  <Separator orientation="horizontal" className="md:hidden"/>
                  <div className="flex md:flex-1">
                    <div className="flex flex-col flex-1 gap-2 ">
                        <Card className="border-none rounded-lg shadow-none ">
                            <CardContent className="flex flex-col flex-1 gap-1 p-2">
                            <div className="flex gap-2 text-sm font-medium text-secondary Inter">Total Followers</div>
                            <div className="flex justify-between">
                            <p className="my-auto text-3xl font-semibold ">{instagramData.userData.followers_count}</p>
                            <div className="flex flex-col mt-auto text-sm font-medium">
                                <p className={`${instagramCalculatedData.percentageChangeFollowers > 0 ? "text-[#34C759]": instagramCalculatedData.percentageChangeFollowers === 0 ? "text-[#FF9500]": "text-[#FF3B30]"} ml-auto flex`}>{instagramCalculatedData.percentageChangeFollowers}% {instagramCalculatedData.percentageChangeFollowers > 0 ? <LucideArrowUpRight className="w-4 h-4 mt-auto"/> : instagramCalculatedData.percentageChangeFollowers === 0 ? <></> : <LucideArrowDownLeft className="w-4 h-4 mt-auto"/>}</p>
                                <p className="ml-auto text-secondary max-md:hidden"> than last week</p></div>
                            </div>
                            </CardContent>
                        </Card>
                        <Separator orientation="horizontal"/>
                        <Card className="border-none rounded-lg shadow-none ">
                            <CardContent className="flex flex-col flex-1 gap-1 p-2">
                            <div className="flex gap-2 text-sm font-medium text-secondary Inter">Total Impressions</div>
                            <div className="flex justify-between">
                            <p className="my-auto text-3xl font-semibold ">{instagramCalculatedData.totalImpressions}</p>
                            <div className="flex flex-col mt-auto text-sm font-medium">
                                <p className={`${instagramCalculatedData.percentageChangeImpressions > 0 ? "text-[#34C759]": instagramCalculatedData.percentageChangeImpressions === 0 ? "text-[#FF9500]": "text-[#FF3B30]"} ml-auto flex`}>{instagramCalculatedData.percentageChangeImpressions}%{instagramCalculatedData.percentageChangeImpressions > 0 ? <LucideArrowUpRight className="w-4 h-4 mt-auto"/> : instagramCalculatedData.percentageChangeImpressions === 0 ? <></> : <LucideArrowDownLeft className="w-4 h-4 mt-auto"/>}</p>
                                <p className="ml-auto text-secondary max-md:hidden"> than last week</p></div>
                            </div>
                            </CardContent>
                        </Card>
                        </div>
                        <Separator orientation="vertical"/>
                        <div className="flex flex-col flex-1 gap-2">
                        <Card className="border-none rounded-lg shadow-none ">
                            <CardContent className="flex flex-col flex-1 gap-1 p-2">
                            <div className="flex gap-2 text-sm font-medium text-secondary Inter">Total Reach</div>
                            <div className="flex justify-between">
                            <p className="my-auto text-3xl font-semibold ">{instagramCalculatedData.totalReach}</p>
                            <div className="flex flex-col mt-auto text-sm font-medium">
                                <p className={`${instagramCalculatedData.percentageChangeReach > 0 ? "text-[#34C759]": instagramCalculatedData.percentageChangeReach === 0 ? "text-[#FF9500]": "text-[#FF3B30]"} ml-auto flex`}>{instagramCalculatedData.percentageChangeReach}%{instagramCalculatedData.percentageChangeReach > 0 ? <LucideArrowUpRight className="w-4 h-4 mt-auto"/> : instagramCalculatedData.percentageChangeReach === 0 ? <></> : <LucideArrowDownLeft className="w-4 h-4 mt-auto"/>}</p>
                                <p className="ml-auto text-secondary max-md:hidden"> than last week</p></div>
                            </div>
                            </CardContent>
                        </Card>
                        <Separator orientation="horizontal"/>
                        <Card className="border-none rounded-lg shadow-none ">
                            <CardContent className="flex flex-col flex-1 gap-1 p-2">
                            <div className="flex gap-2 text-sm font-medium text-secondary Inter">Top Country</div>
                            <p className="my-auto text-3xl font-semibold ">{instagramCalculatedData.topCountry}</p>
                            </CardContent>
                        </Card>
                  </div>
                  </div>
                </CardContent>
              </Card>
    )
}

export default InstagramStats;