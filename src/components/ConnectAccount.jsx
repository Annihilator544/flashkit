import { Instagram, Linkedin, LucideMoreVertical, Twitter, Youtube } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";
import YoutubeOauth from "../Oauth/YoutubeOauth";
import FacebookLogin from "Oauth/InstagramOauth";
import YoutubeSvg from "../assets/youtube.svg"
import instagramSvg from "../assets/instagram.svg"

function ConnectAccount(){
    const [selectedAccount, setSelectedAccount] = useState('');
    return (
        <Card className="mb-auto bg-[#f6f8f9]">
                  <CardHeader>
                    <CardTitle>Social Accounts</CardTitle>
                    <CardDescription>Choose a Social Account to Connect</CardDescription>
                  </CardHeader>
                  <CardContent>
                  <Select onValueChange={setSelectedAccount}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select an Account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Instagram"><span className="flex gap-2"><img src={instagramSvg} alt="Instagram Logo" className=""/>Instagram</span></SelectItem>
                        {/* <SelectItem value="Twitter"><div className="flex gap-2"><Twitter className="h-5"/>Twitter </div></SelectItem> */}
                        <SelectItem value="Youtube"><span className="flex gap-2"><img src={YoutubeSvg} alt="youtube Logo" className=""/>Youtube</span></SelectItem>
                        {/* <SelectItem value="LinkedIn"><div className="flex gap-2"><Linkedin className="h-5"/>LinkedIn </div></SelectItem> */}
                        {/* <SelectItem value="TikTok"><div className="flex gap-2"><TikTok className="h-5"/>Instagram </div></SelectItem> */}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  </CardContent>
                  <CardFooter className="mt-auto flex flex-col gap-5 items-start">
                       {selectedAccount==='Youtube' && <YoutubeOauth/>}
                       {selectedAccount==='Instagram' && <FacebookLogin/>}
                       <div className="flex flex-col gap-2 ">
                       {localStorage.getItem('youtubeAccessToken') && ConnectedSocialMediaCard({icon:<Youtube className="h-5"/>, title:'Youtube'})}
                       {localStorage.getItem('instagramAccessToken') && ConnectedSocialMediaCard({icon:<Instagram className="h-5"/>, title:'Instagram'})}
                       </div>
                  </CardFooter>
                </Card>
    )
}

function ConnectedSocialMediaCard({icon, title}){
    return (
        <Card className="bg-white flex w-96">
            <CardContent className="flex gap-2 p-4 w-full">
                {icon}
                <p>{title}</p>
                <LucideMoreVertical className="h-4 my-auto ml-auto"/>
            </CardContent>
        </Card>
    )
}

export default ConnectAccount;