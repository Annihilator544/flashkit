import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./components/ui/accordion";
import { Button } from "./components/ui/button";
import { Link } from "react-router-dom";

function FAQ() {
  return (
    <>
        <Navbar/>
        <Card className="flex flex-col p-6 max-md:p-2 max-md:rounded-none md:mx-52 md:my-16">
            <CardHeader className="items-center pb-4">
                <CardTitle className="text-3xl font-bold">Flashkit FAQ</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                We’re just getting started, and we’re excited to have you here. As an early adopter, your feedback will help shape the future of Flashkit.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <p>If you have ideas, suggestions, or run into any issues, we’d love to hear from you!</p>

                <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-lg font-semibold">General Questions</AccordionTrigger>
                    <AccordionContent className="space-y-4 mt-2">
                    <div>
                        <p className="font-medium">What is Flashkit?</p>
                        <p>
                        Flashkit is a brand-new content creation and optimisation platform designed for influencers, entrepreneurs, and brands. With AI-powered tools and advanced design features, we help users create engaging content quickly and efficiently.
                        </p>
                    </div>
                    <div>
                        <p className="font-medium">Who is Flashkit for?</p>
                        <p>
                        Flashkit is built for content creators, influencers, marketers, and businesses looking to streamline their creative process. Whether you’re just starting out or a seasoned pro, our platform provides the tools you need to produce high-quality content effortlessly.
                        </p>
                    </div>
                    <div>
                        <p className="font-medium">How does Flashkit help content creators?</p>
                        <p>
                        We combine cutting-edge design tools with AI-driven insights to help users create, refine, and enhance their content. Our goal is to provide everything you need to maximise reach and performance—all in one place.
                        </p>
                    </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                    <AccordionTrigger className="text-lg font-semibold">Features & Functionality</AccordionTrigger>
                    <AccordionContent className="space-y-4 mt-2">
                    <div>
                        <p className="font-medium">What can I do with Flashkit?</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Design stunning content with our AI-powered drag-and-drop editor</li>
                        <li>Optimise posts using AI insights to improve engagement</li>
                        <li>Track performance with real-time analytics</li>
                        <li>Customise templates and assets to fit your brand</li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-medium">Does Flashkit include social media scheduling?</p>
                        <p>
                        Not at the moment! We’re focused on making content creation and optimisation as seamless as possible, so users can post directly on their preferred platforms.
                        </p>
                    </div>
                    <div>
                        <p className="font-medium">Can I collaborate with my team on Flashkit?</p>
                        <p>
                        Yes! Flashkit offers collaboration features, allowing teams to work together on creative assets in real time.
                        </p>
                    </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                    <AccordionTrigger className="text-lg font-semibold">Pricing & Plans</AccordionTrigger>
                    <AccordionContent className="space-y-4 mt-2">
                    <div>
                        <p className="font-medium">Is Flashkit free to use?</p>
                        <p>
                        Flashkit is a paid platform, but as an early adopter, you’ll get exclusive benefits! We’re offering a 1-week free trial and a special launch price of £4.99 per month for the first six months.
                        </p>
                    </div>
                    <div>
                        <p className="font-medium">Do you offer refunds?</p>
                        <p>
                        Yes! We offer a 7-day money-back guarantee. If Flashkit isn’t the right fit for you, you can request a refund within this period.
                        </p>
                    </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                    <AccordionTrigger className="text-lg font-semibold">Support & Troubleshooting</AccordionTrigger>
                    <AccordionContent className="space-y-4 mt-2">
                    <div>
                        <p className="font-medium">How do I get help if I have issues?</p>
                        <p>
                        Our support team is here to help! You can reach us at <a href="mailto:akua@flashkit.co.uk">akua@flashkit.co.uk</a>.
                        </p>
                    </div>
                    <div>
                        <p className="font-medium">Can I request new features?</p>
                        <p>
                        Absolutely! We’re actively developing Flashkit and would love your input. Send your feedback and feature requests to <a href="mailto:akua@flashkit.co.uk">akua@flashkit.co.uk</a>—your ideas could shape our next update!
                        </p>
                    </div>
                    <div>
                        <p className="font-medium">Is my data secure on Flashkit?</p>
                        <p>
                        Yes! We take security seriously and use encryption to protect your data. You can read our privacy policy here: <a href="/privacy">[Privacy Policy]</a>
                        </p>
                    </div>
                    </AccordionContent>
                </AccordionItem>
                </Accordion>

                <div className="pt-6">
                <Link to="/signup" className="">
                <Button variant="default" className="mr-4">Get started</Button>
                </Link>
                <Link to="/login" className="">
                <Button variant="outline">Log in</Button>
                </Link>
                </div>
            </CardContent>
        </Card>
        <Footer className="border-t-[1px] border-black" />
    </>
  );
}

export default FAQ;