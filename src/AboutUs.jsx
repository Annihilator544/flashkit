import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";

function AboutUs() {
  return (
    <>
        <Navbar/>
        <Card className="flex flex-col p-6 mx-52 my-16">
            <CardHeader className="items-center pb-4">
                <CardTitle className="text-3xl font-bold">About Us</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                Revolutionising Content Creation for the Future
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <p>
                At Flashkit, we believe in the power of creativity and the influence of digital storytelling. Our journey began with a simple yet ambitious goal—to empower content creators with cutting-edge tools that streamline the creative process and drive success.
                </p>
                <p>
                In an industry where standing out is essential, we recognised the need for a platform that combines smart technology with intuitive design, helping creators produce high-quality content without the steep learning curve. Flashkit was born—bridging the gap between creativity and efficiency.
                </p>
                <section>
                <h2 className="text-xl font-semibold">Our Mission</h2>
                <p className="mt-2">
                    We are on a mission to redefine content creation by making it smarter, faster, and more accessible. Whether you're an influencer, entrepreneur, or brand, FlashKit equips you with the resources to optimise, design, and elevate your content effortlessly.
                </p>
                <p className="mt-2">
                    Our platform doesn’t just enhance visuals; it leverages AI-driven insights to help users refine their strategy, boost engagement, and maximise their creative impact. FlashKit is built for those who want to create with confidence, scale their influence, and achieve long-term success in the digital world.
                </p>
                </section>
                <section>
                <h2 className="text-xl font-semibold">The Future of Creativity Starts Here</h2>
                <p className="mt-2">
                    We’re not just building a platform; we’re shaping the future of digital content. As the industry evolves, so do we—continually innovating to offer creators the best tools and insights available.
                </p>
                <p className="mt-2">
                    Join us on this journey and be part of a new era in content creation. With Flashkit, your creativity knows no limits.
                </p>
                </section>
                <div className="pt-6">
                <Button variant="default" className="mr-4">Log in</Button>
                <Button variant="outline">Sign up</Button>
                </div>
            </CardContent>
        </Card>
        <Footer className="border-t-[1px] border-black" />
    </>
  );
}

export default AboutUs;