import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

function Legal() {
  return (
    <>
      <Navbar /> 
        <Card className="flex flex-col p-6 mx-52 my-16">
            <CardHeader className="items-center pb-4">
                <CardTitle className="text-3xl font-bold">Flashkit User Licence Agreement</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                Last Updated: 03/02/25
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <section>
                <h2 className="text-xl font-semibold">1. Introduction</h2>
                <p className="mt-2">
                    This User Licence Agreement ("Agreement") governs the use of FlashKit Pro,
                    including its templates, AI-generated Inisghts, and design tools. By using
                    Flashkit you agree to the terms outlined below.
                </p>
                </section>

                <section>
                <h2 className="text-xl font-semibold">2. Licence Grant</h2>
                <p className="mt-2">
                    Flashkit grants you a non-exclusive, non-transferable, revocable licence to
                    use Flashkit Pro’s tools and resources solely for personal or commercial
                    purposes, subject to the restrictions outlined in this Agreement.
                </p>
                </section>

                <section>
                <h2 className="text-xl font-semibold">3. Permitted Use</h2>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Users may create, edit, and publish content using Flashkit.</li>
                    <li>
                    Users may utilise templates and AI-generated Insights for their personal
                    and business branding.
                    </li>
                    <li>
                    Users may distribute and monetise content created within Flashkit provided
                    it complies with applicable laws and this Agreement.
                    </li>
                </ul>
                </section>

                <section>
                <h2 className="text-xl font-semibold">4. Restrictions on Use</h2>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                    Users may not resell, sublicense, or redistribute Flashkit templates as
                    standalone assets.
                    </li>
                    <li>
                    Users may not use Flashkit tools to create misleading, defamatory, or
                    illegal content.
                    </li>
                    <li>
                    Users may not modify or attempt to reverse engineer Flashkit’s proprietary
                    technology or algorithms.
                    </li>
                </ul>
                </section>

                <section>
                <h2 className="text-xl font-semibold">5. Commercial vs. Non-Commercial Use</h2>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                    <strong>Commercial Use:</strong> Content generated through Flashkit can
                    be used for marketing, branding, and monetisation purposes.
                    </li>
                    <li>
                    <strong>Non-Commercial Use:</strong> Users may create personal projects
                    or experimental designs without monetisation.
                    </li>
                </ul>
                </section>

                <section>
                <h2 className="text-xl font-semibold">6. Intellectual Property</h2>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Users retain ownership of the content they create using Flashkit.</li>
                    <li>
                    Flashkit retains ownership of its underlying software, algorithms, and
                    templates.
                    </li>
                    <li>
                    Users grant Flashkit a limited, non-exclusive, worldwide, royalty-free
                    licence to use generated content solely for improving the Services.
                    </li>
                </ul>
                </section>

                <section>
                <h2 className="text-xl font-semibold">7. Termination</h2>
                <p className="mt-2">
                    Flashkit reserves the right to terminate or suspend access to Flashkit if
                    a user violates this Agreement. Upon termination, users must discontinue
                    use of Flashkit’s tools and delete any restricted assets.
                </p>
                </section>

                <section>
                <h2 className="text-xl font-semibold">8. Dispute Resolution</h2>
                <p className="mt-2">
                    Any disputes arising under this Agreement shall be governed by the laws
                    of the United Kingdom. Users agree to attempt resolution through mediation
                    before pursuing legal action.
                </p>
                <p className="mt-2">
                    For questions regarding this Agreement, please contact <a href="mailto:akua@flashkit.co.uk">akua@flashkit.co.uk.</a>
                </p>
                </section>
            </CardContent>
        </Card>
        <Card className="flex flex-col p-6 mx-52 my-16">
            <CardHeader className="items-center pb-4">
                <CardTitle className="text-3xl font-bold">Flashkit Intellectual Property Policy</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                Last Updated: 03/02/25
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <section>
                <h2 className="text-xl font-semibold">1. Introduction</h2>
                <p className="mt-2">
                    This Intellectual Property (IP) Policy outlines the rights and
                    responsibilities regarding the use of Flashkit’s trademarks, logos,
                    proprietary content, and user-generated content. By using Flashkit, you
                    agree to comply with this policy and respect all intellectual property
                    rights.
                </p>
                </section>

                <section>
                <h2 className="text-xl font-semibold">2. Ownership of Intellectual Property</h2>
                <p className="mt-2">
                    All trademarks, service marks, logos, trade names, and other proprietary
                    content displayed on Flashkit are the exclusive property of Flashkit.
                    Users may not use, copy, or modify Flashkit’s intellectual property
                    without prior written permission.
                </p>
                </section>

                <section>
                <h2 className="text-xl font-semibold">3. Use of Flashkit’s Intellectual Property</h2>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                    You may not use Flashkit’s branding, trademarks, or logos in any way
                    that could mislead or imply an unauthorised association with Flashkit.
                    </li>
                    <li>
                    You may not copy, modify, distribute, or reproduce any proprietary
                    content from Flashkit’s platform without explicit permission.
                    </li>
                    <li>
                    Any unauthorised use of Flashkit’s intellectual property may result in
                    legal action.
                    </li>
                </ul>
                </section>

                <section>
                <h2 className="text-xl font-semibold">4. User-Generated Content</h2>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                    Users retain ownership of any original content they create using
                    Flashkit’s platform.
                    </li>
                    <li>
                    By using Flashkit, you grant Flashkit a non-exclusive, worldwide,
                    royalty-free licence to use, store, and process your content for the
                    purpose of providing and improving our services.
                    </li>
                    <li>
                    Users must ensure that their content does not infringe on third-party
                    copyrights, trademarks, or intellectual property rights.
                    </li>
                </ul>
                </section>

                <section>
                <h2 className="text-xl font-semibold">5. Copyright Infringement and Claims</h2>
                <p className="mt-2">
                    If you believe that any content on Flashkit infringes your intellectual
                    property rights, you may submit a claim by emailing{" "}
                    <a href="mailto:akua@flashkit.co.uk">akua@flashkit.co.uk</a> with:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>A description of the copyrighted work.</li>
                    <li>The location of the infringing material on Flashkit.</li>
                    <li>
                    Your contact details and a statement of good faith belief that the use
                    is unauthorised.
                    </li>
                </ul>
                </section>

                <section>
                <h2 className="text-xl font-semibold">6. Enforcement</h2>
                <p className="mt-2">
                    Flashkit reserves the right to take appropriate action against users who
                    violate this policy, including removal of infringing content, suspension
                    of accounts, and legal proceedings if necessary.
                </p>
                <p className="mt-2">
                    For further questions about this policy, contact{" "}
                    <a href="mailto:akua@flashkit.co.uk">akua@flashkit.co.uk.</a>
                </p>
                </section>
            </CardContent>
        </Card>
        <Card className="flex flex-col p-6 mx-52 my-16">
            <CardHeader className="items-center pb-4">
                <CardTitle className="text-3xl font-bold">FlashKit Data Processing Agreement (DPA)</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                Last Updated: 03/02/25
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <section>
                <h2 className="text-xl font-semibold">1. Introduction</h2>
                <p className="mt-2">
                    This Data Processing Agreement ("DPA") is an agreement between Flashkit and its
                    customers to ensure compliance with data protection regulations, including the
                    UK GDPR and EU GDPR. This DPA applies when Flashkit processes personal data on
                    behalf of its customers.
                </p>
                </section>

                <section>
                <h2 className="text-xl font-semibold">2. Definitions</h2>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                    <strong>"Flashkit":</strong> The service provider processing data on behalf
                    of customers.
                    </li>
                    <li>
                    <strong>"Customer":</strong> The entity using Flashkit’s services and acting
                    as a data controller.
                    </li>
                    <li>
                    <strong>"Personal Data":</strong> Any information relating to an identifiable
                    individual.
                    </li>
                    <li>
                    <strong>"Processing":</strong> Any operation performed on personal data, such
                    as collection, storage, or transmission.
                    </li>
                    <li>
                    <strong>"Subprocessor":</strong> Any third party engaged by Flashkit to
                    process personal data on behalf of the customer.
                    </li>
                </ul>
                </section>

                <section>
                <h2 className="text-xl font-semibold">3. Data Processing Roles</h2>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>The Customer is the <strong>Data Controller</strong> and determines the purpose of processing.</li>
                    <li>Flashkit is the <strong>Data Processor</strong> and processes personal data only on the Customer’s instructions.</li>
                </ul>
                </section>

                <section>
                <h2 className="text-xl font-semibold">4. Processing Details</h2>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><strong>Purpose:</strong> To provide and improve Flashkit’s services.</li>
                    <li><strong>Types of Data:</strong> Name, email address, social media engagement metrics, and other data as required.</li>
                    <li><strong>Duration:</strong> Personal data will be retained only for as long as necessary for service provision unless legally required otherwise.</li>
                </ul>
                </section>

                <section>
                <h2 className="text-xl font-semibold">5. Customer Responsibilities</h2>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Ensure lawful collection and transfer of personal data to Flashkit.</li>
                    <li>Provide accurate data and obtain necessary consents from data subjects.</li>
                </ul>
                </section>

                <section>
                <h2 className="text-xl font-semibold">6. Flashkit’s Responsibilities</h2>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Process personal data only as instructed by the Customer.</li>
                    <li>Implement appropriate technical and organisational measures to protect personal data.</li>
                    <li>Assist the Customer with data subject requests and regulatory compliance.</li>
                </ul>
                </section>

                <section>
                <h2 className="text-xl font-semibold">7. Subprocessing</h2>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Flashkit may engage subprocessors but will ensure they comply with equivalent data protection obligations.</li>
                    <li>A list of subprocessors can be provided upon request.</li>
                </ul>
                </section>

                <section>
                <h2 className="text-xl font-semibold">8. Data Security</h2>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Flashkit will maintain industry-standard security measures, including encryption, access controls, and regular security audits.</li>
                </ul>
                </section>

                <section>
                <h2 className="text-xl font-semibold">9. Data Breach Notification</h2>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                    In case of a data breach, Flashkit will notify the Customer without undue delay,
                    providing relevant details and mitigation measures.
                    </li>
                </ul>
                </section>

                <section>
                <h2 className="text-xl font-semibold">10. Data Transfers</h2>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Flashkit will ensure that international data transfers comply with applicable data protection laws.</li>
                    <li>Standard Contractual Clauses (SCCs) may be used where required.</li>
                </ul>
                </section>

                <section>
                <h2 className="text-xl font-semibold">11. Data Subject Rights</h2>
                <ul className="list-disc list-inside mt-2 space-y-1">
                <li>
                    Flashkit will assist the Customer in responding to data subject requests,
                    including access, rectification, and deletion requests.
                </li>
                </ul>
                </section>

                <section>
                <h2 className="text-xl font-semibold">12. Termination &amp; Data Deletion</h2>
                <ul className="list-disc list-inside mt-2 space-y-1">
                <li>
                    Upon termination of services, Flashkit will delete or return all personal data
                    unless legally required to retain it.
                </li>
                </ul>
                </section>

                <section>
                <h2 className="text-xl font-semibold">13. Governing Law &amp; Jurisdiction</h2>
                <ul className="list-disc list-inside mt-2 space-y-1">
                <li>
                    This DPA shall be governed by and construed in accordance with the laws of the
                    United Kingdom.
                </li>
                </ul>
                </section>
                
                <p className="mt-2">
                    For any inquiries regarding this DPA, please contact akua@flashkit.co.uk.
                </p>
            </CardContent>
        </Card>
      <Footer className="border-t-[1px] border-black" />
    </>
  );
}

export default Legal;