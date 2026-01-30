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
      { q: "How do I complete the onboarding flow?", a: "Navigate to the Home page and follow the step-by-step onboarding checklist. Complete each section to set up your workspace." },
      { q: "How do I add new users?", a: "Go to Settings > Users & Roles, then click 'Add User' to invite team members via email." },
      { q: "How do I update organisation details?", a: "Visit the Workspace page to update your organisation's name, logo, business details, and contact information." },
    ],
  },
  {
    title: "Products & Features",
    description: "Learn about Care Minutes, NQIP, RN24/7 and more.",
    questions: [
      { q: "How do I access different products?", a: "Use the sidebar navigation under 'Products' to access Care Minutes, NQIP, RN24/7, and Annual Leave modules." },
      { q: "Can I use multiple products at once?", a: "Yes, all products are available based on your subscription. Switch between them using the sidebar." },
      { q: "Where can I find product-specific help?", a: "Each product has its own help section accessible from within that product's navigation menu." },
    ],
  },
  {
    title: "Account & Billing",
    description: "Manage your subscription and payment details.",
    questions: [
      { q: "How do I update my billing information?", a: "Go to Settings and navigate to the billing section to update payment methods and view invoices." },
      { q: "How do I change my subscription plan?", a: "Contact our support team to discuss plan changes and upgrades." },
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
