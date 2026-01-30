import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HelpCircle } from "lucide-react";

const faqCategories = [
  {
    title: "Getting Started",
    description: "Everything you need to launch Loop and invite your team.",
    questions: [
      { q: "How do I complete the onboarding flow?", a: "Follow the guided steps to enter your organisation details, verify key contacts, and set up required integrations. Once all steps are complete, your workspace is ready to use." },
      { q: "How do I add new users?", a: "Navigate to your organisation settings, select 'Users & Permissions', and click 'Invite User'. Enter their email address and assign appropriate roles. They'll receive an invitation email to join your workspace." },
      { q: "How do I update organisation details?", a: "Go to Settings > Organisation, where you can update your organisation name, contact information, address, and other key details. Changes are saved automatically." },
    ],
  },
  {
    title: "Security & Protection",
    description: "Learn how Loop keeps your organisation's data safe.",
    questions: [
      { q: "Why do I need to complete identity verification?", a: "Identity verification ensures that only authorized individuals can access your organisation's sensitive data and perform critical actions. This helps protect against unauthorized access and maintains compliance with security standards." },
      { q: "How is my data protected?", a: "We use industry-standard encryption for data at rest and in transit, implement multi-factor authentication, maintain regular security audits, and follow strict access controls to ensure your data remains secure at all times." },
      { q: "What IP or device restrictions apply?", a: "Administrators can configure IP whitelisting to restrict access to specific locations and enable device management to control which devices can access your Loop workspace. These settings can be managed in Security Settings." },
    ],
  },
];

const Help = () => (
  <div className="space-y-8 animate-fade-in">
    {/* Support Header Card */}
    <Card className="bg-primary/5 border-primary/10">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="flex -space-x-2">
            <Avatar className="h-10 w-10 border-2 border-background">
              <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" />
              <AvatarFallback>SU</AvatarFallback>
            </Avatar>
            <Avatar className="h-10 w-10 border-2 border-background bg-primary">
              <AvatarFallback className="text-primary-foreground text-sm font-medium">S</AvatarFallback>
            </Avatar>
            <div className="h-10 w-10 rounded-full bg-accent border-2 border-background flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-accent-foreground" />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-semibold text-foreground">Need help or support?</h2>
          <p className="text-muted-foreground mt-1">
            If you're feeling overwhelmed, remember you don't have to face it alone.<br />
            We're here to help you get the support you need.
          </p>
        </div>
        <div className="flex gap-3 mt-5">
          <Button>Submit Support Ticket</Button>
          <Button variant="outline">Support History</Button>
        </div>
      </CardContent>
    </Card>

    {/* FAQ Section */}
    <div>
      <h2 className="text-2xl font-semibold text-foreground">FAQ</h2>
      <p className="text-muted-foreground mt-1">Find quick answers to common questions about Loop</p>
    </div>

    <div className="space-y-6">
      {faqCategories.map((category) => (
        <Card key={category.title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{category.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{category.description}</p>
          </CardHeader>
          <CardContent className="pt-0">
            <Accordion type="single" collapsible className="w-full">
              {category.questions.map((item, idx) => (
                <AccordionItem key={idx} value={`${category.title}-${idx}`} className="border-b last:border-b-0">
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default Help;
