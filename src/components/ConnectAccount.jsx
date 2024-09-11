import { Instagram, Linkedin, LucideLogIn, Twitter, Youtube } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import axios from "axios";
import { useYoutubeData } from "store/use-youtube-data";
import YoutubeOauth from "../Oauth/YoutubeOauth";

function ConnectAccount(){
    const [selectedAccount, setSelectedAccount] = useState('');
    return (
        <Card className="mb-auto">
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
                        <SelectItem value="Instagram"><div className="flex gap-2"><Instagram className="h-5"/>Instagram </div></SelectItem>
                        <SelectItem value="Twitter"><div className="flex gap-2"><Twitter className="h-5"/>Twitter </div></SelectItem>
                        <SelectItem value="Youtube"><div className="flex gap-2"><Youtube className="h-5"/>Youtube</div></SelectItem>
                        <SelectItem value="LinkedIn"><div className="flex gap-2"><Linkedin className="h-5"/>LinkedIn </div></SelectItem>
                        {/* <SelectItem value="TikTok"><div className="flex gap-2"><TikTok className="h-5"/>Instagram </div></SelectItem> */}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  </CardContent>
                  <CardFooter className="mt-auto">
                       {selectedAccount==='Youtube' && <YoutubeOauth/>}
                  </CardFooter>
                </Card>
    )
}

export default ConnectAccount;