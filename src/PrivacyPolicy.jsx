import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./components/ui/card";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const description = "Privacy Policy Component";

function PrivacyPolicy() {
  return (
    <>
        <Navbar />
        <Card className="flex flex-col p-6 mx-52 my-16">
        <CardHeader className="items-center pb-4">
            <CardTitle className="text-3xl font-bold">Flashkit Privacy Policy</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
            Last Updated: 03/02/25
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <section>
            <h2 className="text-xl font-semibold">1. Introduction</h2>
            <p className="mt-2">
            At Flashkit, we are committed to protecting your privacy and ensuring that your personal data is handled responsibly. This Privacy Policy explains how we collect, use, share, and safeguard your information when you use our services, website, and applications (collectively, the "Services"). By accessing or using Flashkit, you consent to the data practices described in this policy. 
            If you do not agree with the terms, please discontinue use of our platform.

            </p>
            </section>

            <section>
            <h2 className="text-xl font-semibold">2. Flashkit Services</h2>
            <p className="mt-2">
                Flashkit is a UK-based platform designed for Influencers, Content Creators,
                and Social Media Managers.
            </p>
            <p className="mt-1 font-medium">Our services include: </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
                <li>AI-powered content creation and optimisation</li>
                <li>AI-driven insights for improving social media performance</li>
                <li>Performance analytics to track engagement and content impact</li>
                <li>Social media kit generation and real-time updates</li>
            </ul>
            <p className="mt-2">
                When linking your social media accounts to Flashkit, you retain control
                over the data shared and can manage your account preferences at any time.
            </p>
            </section>

            <section>
            <h2 className="text-xl font-semibold">3. Information We Collect and How We Use It</h2>
            <p className="mt-2">
            We collect various types of data to provide and enhance our Services. 
            This includes:

            </p>
            <section>
                <h3 className="text-lg font-medium mt-4">3.1 Account Information</h3>
                <ul className="list-disc list-inside mt-2 space-y-1">
                <li>
                    <strong>Personal Details:</strong> Name, email address, organisation name, language preferences.
                </li>
                <li>
                    <strong>Social Network Profile Information:</strong> If you use social login (e.g., Facebook, Instagram), we may collect your username and profile details.
                </li>
                <li>
                    <strong>Billing Information:</strong> If you purchase a paid plan, we collect necessary payment details securely.
                </li>
                </ul>
                <p className="mt-2">How We Use It:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                <li>To create and manage your account</li>
                <li>To communicate important updates, surveys, and offers</li>
                <li>To process payments and provide customer support</li>
                </ul>
            </section>

            <section>
                <h3 className="text-lg font-medium mt-4">3.2 Content and Usage Data</h3>
                <ul className="list-disc list-inside mt-2 space-y-1">
                <li>
                    <strong>Uploaded Content:</strong> Social media posts, images, AI-generated content.
                </li>
                <li>
                    <strong>Chat &amp; Conversational Data:</strong> Messages and interactions with our chatbot or support team.
                </li>
                <li>
                    <strong>Social Media Metrics:</strong> Engagement statistics, post performance, and follower analytics.
                </li>
                </ul>
                <p className="mt-2">How We Use It:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                <li>To provide AI-powered insights and content recommendations</li>
                <li>To enhance platform functionality and improve AI models</li>
                <li>To compile social media performance reports</li>
                </ul>
            </section>

            <section>
                <h3 className="text-lg font-medium mt-4">3.3 Cookies &amp; Tracking Data</h3>
                <ul className="list-disc list-inside mt-2 space-y-1">
                <li>
                    <strong>Log Data &amp; General Location:</strong> IP address, browser settings, device type, date and time of access.
                </li>
                <li>
                    <strong>Usage Analytics:</strong> Frequency of login, interactions with features, and engagement patterns.
                </li>
                </ul>
                <p className="mt-2">How We Use It:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                <li>To improve platform performance and security</li>
                <li>To personalise user experience and recommendations</li>
                <li>To conduct analytics and monitor service health</li>
                </ul>
            </section>
            </section>

            <section>
            <h2 className="text-xl font-semibold">4. Who We Share Your Information With</h2>
            <p className="mt-2">
                We do not sell your personal data. However, we may share information in
                the following cases:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Service Providers: </strong> Third-party vendors assisting in analytics, hosting, or payment processing.</li>
                <li><strong>Legal Compliance: </strong> If required by law or to respond to regulatory authorities.</li>
                <li><strong>Business Transfers: </strong> In case of a merger, acquisition, or company restructuring.</li>
            </ul>
            </section>

            <section>
            <h2 className="text-xl font-semibold">5. Social Networks &amp; Third-Party Services</h2>
            <p className="mt-2">
                When you connect your social media accounts, Flashkit integrates with
                platforms like Facebook, Instagram, and YouTube. Their respective privacy
                policies govern how they manage your data. You may revoke access at any
                time through the settings of these platforms.
            </p>
            </section>

            <section>
            <h2 className="text-xl font-semibold">6. How We Use Analytics Data</h2>
            <p className="mt-2">
                We utilise analytics tools to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Improve user experience</li>
                <li>Optimise platform performance</li>
                <li>Identify trends and make data-driven decisions</li>
                <li>Personalise recommendations</li>
            </ul>
            <p className="mt-2">
                You can opt-out of analytics tracking via your browser settings or by contacting us.
            </p>
            </section>

            <section>
            <h2 className="text-xl font-semibold">7. Data Security Measures</h2>
            <p className="mt-2">
                We take security seriously and implement safeguards such as:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security assessments and compliance checks</li>
                <li>Access control measures for authorised personnel only</li>
                <li>Secure payment processing via PCI-compliant providers</li>
            </ul>
            <p className="mt-2">
                Despite these measures, no system is entirely secure. Users are encouraged
                to adopt best security practices for account protection.
            </p>
            </section>

            <section>
            <h2 className="text-xl font-semibold">8. Data Retention</h2>
            <p className="mt-2">
                We retain personal data only for as long as necessary to fulfil the purpose
                for which it was collected or as required by law. Upon request, we will
                securely delete or anonymise data that is no longer needed.
            </p>
            </section>

            <section>
            <h2 className="text-xl font-semibold">9. Your Rights &amp; Choices</h2>
            <section>
                <h3 className="text-lg font-medium mt-4">9.1 Access and Correction</h3>
                <p className="mt-2">
                You may access and update your personal information through your account
                settings or by contacting us.
                </p>
            </section>
            <section>
                <h3 className="text-lg font-medium mt-4">9.2 Data Portability</h3>
                <p className="mt-2">
                You can request a copy of your data in a structured format for portability.
                </p>
            </section>
            <section>
                <h3 className="text-lg font-medium mt-4">9.3 Deletion Requests</h3>
                <p className="mt-2">
                You have the right to request deletion of your data. However, certain
                information may be retained for legal or business purposes.
                </p>
            </section>
            <section>
                <h3 className="text-lg font-medium mt-4">9.4 Marketing Preferences</h3>
                <p className="mt-2">
                You can opt out of marketing communications by clicking "unsubscribe"
                in our emails or updating your preferences.
                </p>
            </section>
            </section>

            <section>
            <h2 className="text-xl font-semibold">10. International Data Transfers</h2>
            <p className="mt-2">
                If we transfer data outside the UK/EEA, we ensure appropriate safeguards
                are in place, such as Standard Contractual Clauses (SCCs).
            </p>
            </section>

            <section>
            <h2 className="text-xl font-semibold">11. Children's Privacy</h2>
            <p className="mt-2">
                Our services are not intended for users under 16 years old. If we become
                aware of data collected from a minor, we will take steps to delete it.
            </p>
            </section>

            <section>
            <h2 className="text-xl font-semibold">12. Changes to This Privacy Policy</h2>
            <p className="mt-2">
                We may update this policy periodically. Material changes will be notified
                via email or platform notices. Continued use of Flashkit constitutes
                acceptance of the updated terms.
            </p>
            </section>

            <section>
            <h2 className="text-xl font-semibold">13. How to Contact Us</h2>
            <p className="mt-2">
                For privacy-related inquiries, you can reach us at:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
            <li className="mt-2 font-medium"><strong>Support Team:</strong> <a href="mailto:akua@flashkit.co.uk" >akua@flashkit.co.uk</a></li>
            </ul>
            </section>
        </CardContent>
        </Card>
        <Footer className="border-t-[1px] border-black" />
    </>
  );
}

export default PrivacyPolicy;
