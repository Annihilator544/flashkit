import { useEngagementData } from "store/use-engagement-data";
import ConnectAccount from "./ConnectAccount";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useAuthStore } from "store/use-auth-data";
import { Button } from "./ui/button";
import { LucideBell, LucideCamera, LucideDownload, LucidePlus, LucideSettings } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { useRef, useState } from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { NavUser } from "./nav-user";
import NavbarLeftComponent from "./NavbarLeftComponent";
import DashboardHeader from "./DashboardHeader";
import { getAuth, updateProfile } from "firebase/auth";
import { useToast } from "../hooks/use-toast";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

function SettingsSection() {
    const ref = useRef(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const handleFileChange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        setUploadedImage({
          type: file.type,
          name: file.name,
          file: file,
          url: URL.createObjectURL(file)
        });
      }
      e.target.value = null;
    };
    const { user} = useAuthStore();
    const auth = getAuth();
    const { toast } = useToast();
    const [selectedCard, setSelectedCard] = useState("card1")
    const formSchema = z.object({
        username: z.union([
          z.string().length(0), // allow empty string
          z.string().min(3, { message: "Username should be minimum 3 letters" }).max(100)
        ]),
      })
    const form = useForm({
            resolver: zodResolver(formSchema),
            defaultValues: {
            username: "",
            },
        })
    const formSchemaPassword = z.object({
      password: z.string().min(8,{message:"Password should be minimum 8 letters"}).max(100),
      confirmPassword: z.string().min(8,{message:"Password should be minimum 8 letters"}).max(100),
    }).superRefine(({ confirmPassword, password }, ctx) => {
      if (confirmPassword !== password) {
        ctx.addIssue({
          code: "custom",
          message: "The passwords did not match",
          path: ['confirmPassword']
        });
      }
    });
    const formPassword = useForm({
            resolver: zodResolver(formSchemaPassword),
            defaultValues: {
            password: "",
            confirmPassword: "",
            },
        })
    async function onSubmitProfile(values) {
        try {
          if(uploadedImage && auth.currentUser){
            const bucketNamePersonal = 'flashkitpersonalbucket';
            const s3Client = new S3Client({
                  region: 'eu-west-2', // e.g., 'us-east-1'
                  credentials: {
                    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
                  }
                });
            const command = new PutObjectCommand({
              Bucket: bucketNamePersonal,
              Key: `${user.uid}/profile/${uploadedImage.name}`,
              Body: uploadedImage.file,
              ContentType: uploadedImage.type,
            });
            await s3Client.send(command);
            if(values.username){
            await updateProfile(auth.currentUser, {
              displayName: values.username,
              photoURL: `https://${bucketNamePersonal}.s3.eu-west-2.amazonaws.com/${user.uid}/profile/${uploadedImage.name}`
              })
              
           toast({
            title: "Profile Updated",
            description: "Your Image and Display Name has been updated successfully",
            variant: "success"
            });
            }
            else{
              await updateProfile(auth.currentUser, {
                  photoURL: `https://${bucketNamePersonal}.s3.eu-west-2.amazonaws.com/${user.uid}/profile/${uploadedImage.name}`
              })
              toast({
                title: "Profile Updated",
                description: "Your Image has been updated successfully",
                variant: "success"
                });
            }
          }
          else if(values.username){
            await updateProfile(auth.currentUser, {
              displayName: values.username,
            })
            toast({
                title: "Profile Updated",
                description: "Your Display Name has been updated successfully",
                variant: "success"
                });
          }
        } catch (error) {
          console.error(error);
        } finally {
          formPassword.reset();
        }
    }
    async function onSubmitPassword(values) {
        try {
          await updateProfile(auth.currentUser, {
            password: values.password,
          })
          toast({
                title: "Password Updated",
                description: "Your password has been updated successfully",
                variant: "success"
                });
        } catch (error) {
          console.error(error);
        } finally {
          formPassword.reset();
        }
    }
  return (
    <div className="flex flex-col">
            <header className="flex shrink-0 h-10 items-center gap-2 transition-[width,height] ease-linear justify-end mb-2 max-md:justify-between">
            <SidebarTrigger className=" md:hidden"/>
                <NavbarLeftComponent/>
            </header>
            <DashboardHeader
              title={"Settings"}
              buttonText={"Explore Project"}
              bottomSection={false}
            />
        {/* <div className="m-10">
            <ConnectAccount/>
            </div>
            <div className="m-10">
            {Engagement && typeof Engagement ==='object' && Object.keys(Engagement).length > 0 ?
            <Card className="flex gap-4">
                <CardContent className="flex-1 p-6">
                <pre>{Engagement.analysis[0].text}</pre>
                </CardContent>
            </Card>
            :<></>
            }
        </div> */}
        <Tabs defaultValue="profile">
          <TabsList className="flex gap-4 mb-10 bg-white">
            <TabsTrigger value="profile" className="p-2 px-4 rounded-full border-2 hover:border-[#409BFF] hover:text-[#409BFF] data-[state=active]:border-[#409BFF] data-[state=active]:text-[#409BFF]">
                Profile
            </TabsTrigger>
            <TabsTrigger value="password" className="p-2 px-4 rounded-full border-2 hover:border-[#409BFF] hover:text-[#409BFF] data-[state=active]:border-[#409BFF] data-[state=active]:text-[#409BFF]">
                Password
            </TabsTrigger>
            <TabsTrigger value="billings" className="p-2 px-4 rounded-full border-2 hover:border-[#409BFF] hover:text-[#409BFF] data-[state=active]:border-[#409BFF] data-[state=active]:text-[#409BFF]">
                Plans & Billing
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="flex flex-col gap-6">
            <Card className="bg-[#f6f8f9]">
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <p className="font-medium text-secondary">Personalise your experience and upload a photo and details</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-start gap-4 pb-6 ">
                  <Avatar className= "w-20 h-20 my-auto">
                    {user&&user.photoURL ? uploadedImage?.url ? <AvatarImage src={uploadedImage?.url} /> : <AvatarImage src={user.photoURL} /> :
                    <AvatarImage src="https://github.com/shadcn.png" />
                    }
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex max-md:flex-col md:gap-4 max-md:gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    ref={ref}
                    className="hidden"
                    onInput={handleFileChange}
                  />
                  <Button variant="outline" onClick={()=>ref?.current?.click()} className=""><LucideCamera className="h-4 my-auto mr-1"/> Upload Image</Button>
                  <Button variant="outline" onClick={()=>setUploadedImage(null)} className=""> Remove Image</Button>
                  </div>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitProfile)} className="space-y-4">
                      <div className="flex gap-4 max-md:flex-col ">
                        <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem className="">
                            <FormLabel>User name</FormLabel>
                            <FormControl>
                                <Input placeholder="User name" type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                      </div>
                        <Button type="submit" className="bg-[#409BFF] mr-2">Save Changes</Button>
                        <Button variant="outline">Discard</Button>
                    </form>
                </Form>
              </CardContent>
            </Card>
            <ConnectAccount/>
          </TabsContent>
          <TabsContent value="password">
            <Card className="bg-[#f6f8f9]">
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <p className="font-medium text-secondary">Secure your account with a strong password</p>
              </CardHeader>
              <CardContent>
                <Form {...formPassword}>
                    <form onSubmit={formPassword.handleSubmit(onSubmitPassword)} className="space-y-4">
                      <div className="flex gap-4 mb-6 max-md:flex-col">
                        <FormField
                          control={formPassword.control}
                          name="password"
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                  <Input placeholder="password" type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                          />
                          <FormField
                          control={formPassword.control}
                          name="confirmPassword"
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>Confirm New Password</FormLabel>
                              <FormControl>
                                  <Input placeholder="confirm password" type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                          />
                      </div>
                        <Button type="submit" className="bg-[#409BFF] mr-2">Save Changes</Button>
                        <Button variant="outline">Discard</Button>
                    </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="billings">
          <div className="flex flex-col gap-6">
            <Card className="border bg-[#f6f8f9]">
              <CardHeader>
                <CardTitle className="text-xl">Subscription Plan</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="flex gap-2">
                <CardDescription className="text-sm font-medium text-gray-500">
                  Current Plan
                </CardDescription>
                  <div className="font-semibold">Flashkit Monthly Plan</div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-[#409BFF]" variant="default">Buy Plan</Button>
              </CardFooter>
            </Card>
            <Card className="border bg-[#f6f8f9]">
              <CardHeader className="flex-row justify-between">
                <CardTitle className="text-xl">Current Plan</CardTitle>
                <Button variant="outline" className="">Cancel Subscription</Button>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
              <div className="font-semibold">Flashkit Monthly Plan</div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="text-sm text-gray-600">
                    Your payment is <span className="font-semibold">$59.00 USD</span>, to be charged on <span className="font-semibold">July 08, 2024</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border bg-[#f6f8f9]">
              <CardHeader>
                <CardTitle className="text-xl">Payment Methods</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Choose your preferred payment method for making future payments
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <RadioGroup value={selectedCard} onValueChange={(value) => setSelectedCard(value)} defaultValue="card1" className="flex flex-col gap-3">
                  <div className={`flex items-center justify-between border p-4 rounded-xl gap-3 ${selectedCard === "card1" ? " border-blue-300" : ""}`}>
                    <label htmlFor="card1" className="flex flex-col items-start gap-1 text-sm">
                      <div className="text-xs font-semibold text-gray-700 uppercase">Visa</div>
                      <span className="text-sm text-gray-600">•••• •••• •••• ••••</span>
                      <span className="text-sm text-gray-500">expires on 12/25</span>
                    </label>
                    <RadioGroupItem value="card1" id="card1" />
                  </div>
                  <div className={`flex items-center justify-between border p-4 rounded-xl gap-3 ${selectedCard === "card2" ? " border-blue-300" : ""}`}>
                    <label htmlFor="card2" className="flex flex-col items-start gap-1 text-sm">
                      <div className="text-xs font-semibold text-gray-700 uppercase">Visa</div>
                      <span className="text-sm text-gray-600">•••• •••• •••• ••••</span>
                      <span className="text-sm text-gray-500">expires on 12/25</span>
                    </label>
                    <RadioGroupItem value="card2" id="card2" />
                  </div>
                </RadioGroup>
                <Button variant="outline" className="mr-auto"><LucidePlus className="h-4 my-auto mr-1"/> Add New Payment Method</Button>
              </CardContent>
            </Card>
            <Card className="border bg-[#f6f8f9]">
              <CardHeader className="flex-row justify-between">
              <div>
                <CardTitle className="text-xl">Latest Transactions</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Keep track of your most recent activities
                </CardDescription>
              </div> 
                <div className="flex justify-end mb-4">
                  <Button variant="outline" size="sm"><LucideDownload className="h-4 mr-1"/>Download</Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 mx-6 mb-6 overflow-hidden border rounded-xl">
                <Table className="">
                  <TableHeader className="bg-[#f0f9fe]">
                    <TableRow>
                      <TableHead className="w-1/2">Invoices</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="bg-white">
                    <TableRow>
                      <TableCell>Flashkit Social Plan</TableCell>
                      <TableCell>16/12/24</TableCell>
                      <TableCell>$40.00</TableCell>
                      <TableCell className="text-green-600">Completed</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Flashkit Social Plan</TableCell>
                      <TableCell>16/12/24</TableCell>
                      <TableCell>$40.00</TableCell>
                      <TableCell className="text-green-600">Completed</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Flashkit Social Plan</TableCell>
                      <TableCell>16/12/24</TableCell>
                      <TableCell>$40.00</TableCell>
                      <TableCell className="text-green-600">Completed</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Flashkit Social Plan</TableCell>
                      <TableCell>16/12/24</TableCell>
                      <TableCell>$40.00</TableCell>
                      <TableCell className="text-green-600">Completed</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Flashkit Social Plan</TableCell>
                      <TableCell>16/12/24</TableCell>
                      <TableCell>$40.00</TableCell>
                      <TableCell className="text-green-600">Completed</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          </TabsContent>
        </Tabs>
    </div>
  );
}

export default SettingsSection;
