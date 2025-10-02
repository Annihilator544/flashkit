import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import logo from './assets/logoNew.png'
import logIn from './assets/LogIn.png'  
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "./components/ui/form"
import { Input } from "./components/ui/input"
import { Button } from './components/ui/button';
import { SelectSeparator } from './components/ui/select';
import GoogleButton from './assets/GoogleButton.svg';
import { useAuthStore } from 'store/use-auth-data';
import localforage from 'localforage';

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8,{message:"Password should be minimum 8 letters"}).max(100),
  })

const Login = () => {
    const {  setUser } = useAuthStore();
    const navigate = useNavigate();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
        email: "",
        password: "",
        },
    })

    async function onSubmit(values) {
        await signInWithEmailAndPassword(auth, values.email, values.password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            setUser(user)
            localforage.clear()
            navigate("/dashboard")
        })
        .catch((error) => {
            const errorCode = error.code;
            if(errorCode === "auth/user-not-found"){
                form.setError("email", { type: "manual", message: "User not found" });
            }
            else if(errorCode === "auth/invalid-credential"){
                form.setError("password", { type: "manual", message: "Invalid password" });
            }
        });

    }

    async function handleGoogleSignIn() {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            setUser(user);
            localforage.clear()
            navigate("/dashboard")
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        }
    }

  return (
    <div className='grid grid-cols-[60%,40%] h-screen max-md:grid-cols-1'>
        <div className='flex-1 flex flex-col rounded-r-[50px] max-md:hidden overflow-hidden'>
            <img src={logIn} alt='logIn' className=' h-full object-cover object-left-top '/>
        </div>
        <div className='flex flex-col flex-1 overflow-y-auto'>
            <div className='flex flex-col justify-center align-middle w-[50%] max-md:w-[90%] m-auto'>
            <img src={logo} alt='logo' className=' h-12 mr-auto mb-10'/>
                <p className='text-base font-normal text-secondary mb-10'>Please login to continue to your account</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="email" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="password" type="password" {...field} />
                            </FormControl>
                            <FormMessage error = {"hello"} />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" className="w-full">Sign in</Button>
                    </form>
                </Form>
                <div className='my-5 flex gap-2'>
                    <SelectSeparator className="flex-1 my-auto" /> or <SelectSeparator className="flex-1 my-auto" />
                </div>
                <button class="gsi-material-button" onClick={handleGoogleSignIn}>
                    <div class="gsi-material-button-state"></div>
                    <div class="gsi-material-button-content-wrapper">
                        <div class="gsi-material-button-icon">
                            <img src={GoogleButton} alt="GoogleButton" className='m-[2px]' />
                        </div>
                        <span class="gsi-material-button-contents">Sign in with Google</span>
                        <span style={{display: "none"}}>Sign in with Google</span>
                    </div>
                </button>
                <div className='mt-4'>
                    <p>Need an account? <NavLink to="/signup" className='text-primary'>Create One</NavLink></p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login