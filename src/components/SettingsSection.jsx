import { useEngagementData } from "store/use-engagement-data";
import ConnectAccount from "./ConnectAccount";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useAuthStore } from "store/use-auth-data";
import { Button } from "./ui/button";
import { LucideCamera, LucidePlus } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

function SettingsSection() {
    const { Engagement } = useEngagementData();
    const { user} = useAuthStore();
    const formSchema = z.object({
        firstname: z.string().min(3,{message:"Username should be minimum 3 letters"}).max(100),
        lastname: z.string().min(3,{message:"Username should be minimum 3 letters"}).max(100),
        language: z.string({required_error: "Please select a language to display.",})
      })
    const form = useForm({
            resolver: zodResolver(formSchema),
            defaultValues: {
            firstname: "",
            lastname: "",
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
    
    async function onSubmit(values) {
        try {
        } catch (error) {
        }
    }
  return (
    <div className="m-10 flex flex-col gap-10">
      <p className="text-3xl font-semibold">Settings</p>
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
          <TabsList className="flex gap-4 bg-white mb-10">
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
          <TabsContent value="profile">
            <Card className="bg-[#f6f8f9]">
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <p className="text-secondary font-medium">Personalise your experience and upload a photo and details</p>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 justify-start items-center pb-6">
                  <Avatar className= "my-auto h-20 w-20">
                    {user&&user.photoURL ? <AvatarImage src={user.photoURL} /> :
                    <AvatarImage src="https://github.com/shadcn.png" />
                    }
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className=""><LucideCamera className="h-4 my-auto mr-1"/> Upload Image</Button>
                  <Button variant="outline" className=""> Remove Image</Button>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="flex gap-4">
                        <FormField
                        control={form.control}
                        name="firstname"
                        render={({ field }) => (
                            <FormItem className="">
                            <FormLabel>First name</FormLabel>
                            <FormControl>
                                <Input placeholder="First name" type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="lastname"
                        render={({ field }) => (
                            <FormItem className="">
                            <FormLabel>Last name</FormLabel>
                            <FormControl>
                                <Input placeholder="Last name" type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                      </div>
                        <FormField
                          control={form.control}
                          name="language"
                          render={({ field }) => (
                            <FormItem className="max-w-[250px]">
                              <FormLabel>Language</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value} >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Language" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="en">English</SelectItem>
                                  <SelectItem value="fr">French</SelectItem>
                                  <SelectItem value="id">Indonesian</SelectItem>
                                  <SelectItem value="ru">Russian</SelectItem>
                                  <SelectItem value="pt">Portugese</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit" className="bg-[#409BFF] mr-2">Save Changes</Button>
                        <Button variant="outline">Discard</Button>
                    </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card className="bg-[#f6f8f9]">
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <p className="text-secondary font-medium">Secure your account with a strong password</p>
              </CardHeader>
              <CardContent>
                <Form {...formPassword}>
                    <form onSubmit={formPassword.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="flex gap-4 mb-6">
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
          <div className="flex flex-col gap-6 p-6">
            <Card className="border bg-[#f6f8f9]">
              <CardHeader>
                <CardTitle className="text-xl">Subscription Plan</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="flex gap-2">
                <CardDescription className="text-sm font-medium text-gray-500">
                  Current Plan
                </CardDescription>
                  <div className="font-semibold">Flashkit Social Monthly Plan</div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-[#409BFF]" variant="default">Change Plan</Button>
              </CardFooter>
            </Card>
            <Card className="border bg-[#f6f8f9]">
              <CardHeader className="flex-row justify-between">
                <CardTitle className="text-xl">Current Plan</CardTitle>
                <Button variant="outline" className="">Cancel Subscription</Button>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
              <div className="font-semibold">Flashkit Social Monthly Plan</div>
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
                <RadioGroup defaultValue="card1" className="flex flex-col gap-3">
                  <div className="flex items-center justify-between border p-4 rounded-xl gap-3">
                    <label htmlFor="card1" className="text-sm flex items-start gap-1 flex-col">
                      <div className="text-xs uppercase font-semibold text-gray-700">Visa</div>
                      <span className="text-sm text-gray-600">•••• •••• •••• ••••</span>
                      <span className="text-sm text-gray-500">expires on 12/25</span>
                    </label>
                    <RadioGroupItem value="card1" id="card1" />
                  </div>
                  <div className="flex items-center justify-between border p-4 rounded-xl gap-3">
                    <label htmlFor="card2" className="text-sm flex items-start gap-1 flex-col">
                      <div className="text-xs uppercase font-semibold text-gray-700">Visa</div>
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
              <CardHeader>
                <CardTitle className="text-xl">Latest Transactions</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Keep track of your most recent activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex justify-end">
                  <Button variant="outline" size="sm">Download</Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/2">Invoices</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
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