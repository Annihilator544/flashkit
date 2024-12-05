"use client";
import Image from "next/image";
import flashkit from "@/../public/flashkit.svg";
import flashkitLogo from "@/../public/flashkitLogo.svg";
import { Roboto } from "next/font/google";
import { useState } from "react";
import AWS from "aws-sdk";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400"]
});

export default function Home() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  interface FormData {
    name: string;
    email: string;
  }

  interface ChangeEvent {
    target: {
      name: string;
      value: string;
    };
  }

  const handleChange = (e: ChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prevFormData: FormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);

    try {
      // Configure AWS SDK
      AWS.config.update({
        region: "eu-west-2", // Replace with your AWS region
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
      });

      // Initialize DynamoDB client
      const dynamodb = new AWS.DynamoDB.DocumentClient();
      const tableName = "flashkitResponses";
      const item = formData;

      // DynamoDB put parameters
      const params = {
        TableName: tableName,
        Item: item
      };

      // Save item to DynamoDB
      console.log("Saving item:", params);
      await dynamodb.put(params).promise(); // Use promise-based method

      // Update state on success
      setSuccess(true);
      console.log("Item saved successfully!");
    } catch (error) {
      console.error("Error saving item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="md:grid md:grid-cols-2 h-screen max-md:h-svh">
      {/* Left section */}
      <div className="flex justify-center items-center radial-gradient max-md:hidden">
        <div className="mx-16 bg-[#FFFFFF10] w-full h-2/3 border-[#FFFFFF50] border-[1px] rounded-2xl p-10 flex flex-col justify-center gap-5 relative">
          <p className="text-[#383838] font-bold text-4xl">Flashkit Is a Game-Changing Platform Made to Empower Content Creators</p>
          <p className="text-[#383838] font-medium text-lg">
            Discover AI-powered tools to effortlessly create, optimise and share stunning social
            media content. Simplify your journey and unlock new monetisation opportunities with
            ease.
          </p>
          <Image
            src={flashkitLogo}
            alt="Flashkit"
            className="h-16 absolute top-0 left-5 z-10 w-16 -translate-y-1/2 translate-x-full animate-bounce-long"
          />
        </div>
      </div>
      <div className=" justify-center items-center radial-gradient md:hidden p-5 rounded-b-2xl">
        <Image src={flashkitLogo} alt="Flashkit" className="h-6 w-6 mr-auto mb-2 " />
        <div className="text-[#383838] font-medium text-sm">Discover <span className="font-bold italic">AI-powered tools</span> {' to'}   create, optimise and share stunning social media content while simplifying your journey to maximise monetisation opportunities.</div>
      </div>

      {/* Right section */}
      <div className="rounded-lg p-8 max-w-[80%] max-md:max-w-[100%] max-md:p-6 mx-auto h-5/6 max-md:h-auto mt-auto flex flex-col overflow-y-auto">
        {/* Logo */}
        <div className="flex justify-center max-md:mt-4">
          <Image src={flashkit} alt="Flashkit" className="md:h-16 max-md:h-10" />
        </div>

        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-2 mt-10 max-md:mt-4 max-md:text-lg">
          Sign Up for Early Access!
        </h1>
        <p className={`${roboto.className} text-[#767676] text-center text-lg mb-6 max-md:text-sm`}>
          Don&apos;t miss out - we&apos;re launching soon!
        </p>

        {/* Form */}
        <form className="space-y-4 mt-5 max-md:mt-5" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : success ? "Form submitted successfully!":  "I'm in!"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-xs text-gray-500 mt-auto text-center max-md:text-[10px]">
          At Flashkit, your privacy is our priority. We comply with GDPR regulations to ensure your
          personal details are secure. By signing up, you agree that your information will be used
          exclusively for Flashkit&apos;s marketing purposes and will not be shared with third parties
          without your explicit consent.
        </p>
      </div>
    </div>
  );
}
