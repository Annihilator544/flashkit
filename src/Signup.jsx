import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from './firebase';
import logo from './assets/logo.png'
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
import SignUp from './assets/SignUp.svg';
import { useAuthStore } from 'store/use-auth-data';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const formSchema = z.object({
    email: z.string().email(),
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

const Signup = () => {
    const navigate = useNavigate();
    const { signIn } = useAuthStore();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
        email: "",
        password: "",
        confirmPassword: "",
        },
    })

    async function onSubmit(values) {
        console.log(values)
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                createdAt: new Date(),
                // Add any other user data you want to save
            });
            await signIn(values.email, values.password);
            console.log(user);
            navigate("/dashboard")
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        }
    }

    async function handleGoogleSignIn() {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log(user);
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) {
                // If new user, save their data to Firestore
                await setDoc(doc(db, 'users', user.uid), {
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    createdAt: new Date(),
                });
            }
            await signIn(user.email, null, true);
            navigate("/dashboard"); // Redirect to dashboard or appropriate page after successful sign-in
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        }
    }

  return (
    <div className='grid grid-cols-[40%,60%] h-screen'>
        <div className='flex flex-col flex-1'>
            <img src={logo} alt='logo' className='aspect-video h-20 mr-auto'/>
            <div className='flex flex-col justify-center align-middle m-auto'>
                <p className='text-4xl font-bold'>Welcome To flashkit</p>
                <p className='text-lg font-normal text-secondary mb-10'>create a new account</p>
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
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input placeholder="confirm password" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" className="w-full">Sign up</Button>
                    </form>
                </Form>
                <div className='my-5 flex gap-2'>
                    <SelectSeparator className="flex-1 my-auto" /> or <SelectSeparator className="flex-1 my-auto" />
                </div>
                <div className="">
                    <Button onClick={handleGoogleSignIn} className="w-full">Sign up with Google</Button>
                </div>
                <div className='mt-4'>
                    <p>Already have an account? <NavLink to="/login" className='text-primary'>Sign in</NavLink></p>
                </div>
            </div>
        </div>
        <div className='bg-[#ff847c] flex-1 flex flex-col m-4 rounded-xl'>
            <div className='m-auto'>
                <img src={SignUp} alt='signup' className='' />
                <p className='font-bold text-xl text-white text-center mt-10'>Create, Share, and Track Your Success</p>
                <p className='font-normal text-base text-white text-center mt-4'>Elevate your content creation with our all-in-one social media</p>
                <p className='font-normal text-base text-white text-center'> kit for stunning visuals and instant performance tracking.</p>
            </div>
        </div>
    </div>
  )
}

export default Signup