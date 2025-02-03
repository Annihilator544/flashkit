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

function TermsOfService() {
  return (
    <>
        <Navbar />
        <Card className="flex flex-col p-6 mx-52 my-16">
          <CardHeader className="items-center pb-4">
            <CardTitle className="text-3xl font-bold">Flashkit Terms of Service</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Last Updated: 03/02/25
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold">1. Introduction</h2>
              <p className="mt-2">
                Welcome to Flashkit. These Terms of Service ("Agreement") govern your access
                to and use of Flashkit&apos;s website, applications, and services (collectively,
                the "Services"). By using our Services, you agree to be bound by these terms.
                If you do not agree, please discontinue use of Flashkit.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">2. Changes to Terms</h2>
              <p className="mt-2">
                Flashkit reserves the right to update or modify these Terms at any time.
                If we make material changes, we will notify you by posting an update on our
                website. Your continued use of the Services after changes are made constitutes
                your acceptance of the revised Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">3. Eligibility</h2>
              <p className="mt-2">
                You must be at least 16 years old to use Flashkit. If you are between 13 and
                16 years old, you may only use our Services with the consent of a legal guardian.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">4. Description of Services</h2>
              <p className="mt-2">
                Flashkit provides a platform that allows users to:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Create social media content</li>
                <li>Receive AI-driven insights to optimise content</li>
                <li>Access social media performance analytics</li>
              </ul>
              <p className="mt-2">
                AI-generated insights are based on publicly available information, user inputs,
                and platform data. While we tailor recommendations to each user, the underlying
                data may come from various public sources.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">5. Content Rights</h2>
              <p className="mt-2">
                The content you create using Flashkit&apos;s Services is owned by you. However,
                by using our Services, you grant Flashkit a non-exclusive, worldwide,
                royalty-free licence to store, process, and display your content solely for
                the purpose of providing and improving our Services.
              </p>
              <p className="mt-2">
                This licence does not grant Flashkit the right to commercially exploit, sell,
                or publicly distribute your content outside of the platform without your
                explicit consent. If you delete your content or account, Flashkit will take
                reasonable steps to remove it, except where retention is required for legal
                compliance or service functionality (e.g., backups).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">6. Usage Restrictions</h2>
              <p className="mt-2">
                You may not:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Copy, scrape, or mass-extract data from Flashkit&apos;s Services without authorisation.</li>
                <li>Use Flashkit to generate or distribute unlawful, harmful, or misleading content.</li>
                <li>Interfere with or attempt to compromise the security of Flashkit&apos;s systems.</li>
                <li>Attempt to reverse engineer or extract proprietary algorithms from FlashKit.</li>
              </ul>
              <p className="mt-2">
                Violations may result in suspension or termination of your access.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">7. Data Sources</h2>
              <p className="mt-2">
                To provide our Services, Flashkit utilises API services from third parties,
                including but not limited to Facebook, Tik Tok, Instagram, and YouTube.
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>We collect only publicly available data unless specific access is granted by you.</li>
                <li>If you provide access via API tokens, these are used to personalise your experience and improve AI models. You may revoke access at any time.</li>
                <li>If you delete your Flashkit account, we will remove all associated private data.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">8. AI-Generated Insights</h2>
              <p className="mt-2">
                Flashkit uses AI to provide insights for social media content optimisation.
                However:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>AI-generated insights may not be error-free, unbiased, or suitable for all use cases.</li>
                <li>Users are responsible for reviewing and adapting AI-driven recommendations before implementing them.</li>
                <li>Flashkit does not guarantee improved performance based on AI insights, as outcomes depend on external factors.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">9. Service Limitations</h2>
              <p className="mt-2">
              While Flashkit employs best practices in AI and analytics, we do not guarantee:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>We do not guarantee uninterrupted or error-free Services.</li>
                <li>We do not guarantee AI-generated recommendations will always be accurate or beneficial.</li>
                <li>We do not guarantee performance outcomes for content optimised using Flashkit.</li>
              </ul>
              <p className="mt-2">
                Users should exercise discretion when using AI-generated recommendations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">10. Intellectual Property</h2>
              <p className="mt-2">
                All software, algorithms, and interface designs associated with Flashkit are
                the intellectual property of Flashkit. Users are granted a limited,
                non-exclusive licence to use the platform for its intended purpose. Reverse
                engineering, decompiling, or unauthorised extraction of proprietary
                algorithms is strictly prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">11. Disclaimer of Warranties</h2>
              <p className="mt-2">
                Flashkit provides its Services "as is" and "as available." We do not warrant:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>The Services will function without interruptions or security issues.</li>
                <li>AI-generated content will be free from errors or inaccuracies.</li>
                <li>Any reliance on our insights will guarantee success.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">12. Limitation of Liability</h2>
              <p className="mt-2">
                To the fullest extent permitted by law, Flashkit shall not be liable for:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Any indirect, incidental, special, consequential, or punitive damages.</li>
                <li>Loss of profits, data, or goodwill resulting from the use of our Services.</li>
                <li>Any decisions or actions taken based on AI-generated insights.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold">13. Dispute Resolution</h2>
              <p className="mt-2">
                If you have concerns about Flashkit, please contact us first at <a href="mailto:akua@flashkit.co.uk">akua@flashkit.co.uk.</a>
                In the event of a dispute, both parties agree to attempt resolution through
                mediation before resorting to legal action.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">14. Governing Law</h2>
              <p className="mt-2">
                This Agreement shall be governed by and construed in accordance with the laws
                of the United Kingdom. Any disputes arising under these Terms shall be subject
                to the exclusive jurisdiction of the UK courts.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">15. Contact Information</h2>
              <p className="mt-2">
                For questions regarding these Terms, contact us at <a href="mailto:akua@flashkit.co.uk">akua@flashkit.co.uk.</a>
              </p>
            </section>
          </CardContent>
        </Card>
        <Footer className="border-t-[1px] border-black" />
    </>
  );
}

export default TermsOfService;
