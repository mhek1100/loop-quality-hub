import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Plus, Upload, Trash2, MoreHorizontal, Copy } from "lucide-react";

type TabKey = "basic" | "advanced" | "representative";

const tabs: { key: TabKey; label: string }[] = [
  { key: "basic", label: "Basic Information" },
  { key: "advanced", label: "Advanced" },
  { key: "representative", label: "Business representative" },
];

const Workspace = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("basic");

  return (
    <div className="flex gap-8 animate-fade-in">
      {/* Left sidebar tabs */}
      <div className="w-48 shrink-0">
        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
                activeTab === tab.key
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-2xl space-y-8">
        {/* Basic Information Section */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Basic information</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Workspace name</Label>
              <Input id="workspace-name" defaultValue="Dummy Provider" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workspace-link">Workspace link</Label>
              <div className="relative">
                <Input 
                  id="workspace-link" 
                  defaultValue="https://evelyn_technologies.your_workspace" 
                  className="pr-10"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Workspace logo</Label>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-primary rounded-md flex items-center justify-center text-primary-foreground text-xs font-medium">
                  Logo
                </div>
                <Button variant="default" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Upload new logo
                </Button>
                <span className="text-sm text-muted-foreground">No file chosen</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Min 300x200 px, PNG or JPG</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Time zone</Label>
              <Select defaultValue="sydney">
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sydney">(UTC+10) Sydney</SelectItem>
                  <SelectItem value="melbourne">(UTC+10) Melbourne</SelectItem>
                  <SelectItem value="brisbane">(UTC+10) Brisbane</SelectItem>
                  <SelectItem value="perth">(UTC+8) Perth</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <Separator />

        {/* Advanced Section */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Advanced</h2>
          
          {/* Business type */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Business type</h3>
            
            <div className="space-y-2">
              <Label htmlFor="location">Choose location</Label>
              <Select defaultValue="australia">
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="australia">Australia</SelectItem>
                  <SelectItem value="nz">New Zealand</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-type">Business type</Label>
              <Select defaultValue="company">
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="sole-trader">Sole Trader</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="trust">Trust</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-structure">Business structure</Label>
              <Select defaultValue="proprietary">
                <SelectTrigger>
                  <SelectValue placeholder="Select business structure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="proprietary">Proprietary company</SelectItem>
                  <SelectItem value="public">Public company</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Business details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Business details</h3>

            <div className="space-y-2">
              <Label htmlFor="legal-business-name">Legal business name</Label>
              <Input id="legal-business-name" defaultValue="Dummy Provider" />
              <p className="text-xs text-muted-foreground">
                The name you provide must closely match the name associated with your tax ID.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="acn">Australian company number (ACN)</Label>
              <Input id="acn" defaultValue="123 456 789" />
              <p className="text-xs text-muted-foreground">
                We need your ACN so we can verify the identity of your business.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="abn">Australian business number (ABN)</Label>
              <Input id="abn" defaultValue="1 420 322 258" />
              <p className="text-xs text-muted-foreground">
                We need your ABN <a href="#" className="text-primary hover:underline">Australian business number</a>.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-address">Business address</Label>
              <Select defaultValue="australia">
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="australia">Australia</SelectItem>
                  <SelectItem value="nz">New Zealand</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Input placeholder="Street address" />
            </div>

            <div className="space-y-2">
              <Input placeholder="Apartment, unit or other" />
            </div>

            <div className="space-y-2">
              <Input placeholder="City" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nsw">New South Wales</SelectItem>
                  <SelectItem value="vic">Victoria</SelectItem>
                  <SelectItem value="qld">Queensland</SelectItem>
                  <SelectItem value="wa">Western Australia</SelectItem>
                  <SelectItem value="sa">South Australia</SelectItem>
                  <SelectItem value="tas">Tasmania</SelectItem>
                  <SelectItem value="act">ACT</SelectItem>
                  <SelectItem value="nt">Northern Territory</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Postal code" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Business phone number</Label>
              <Input id="phone" placeholder="+61 02 3456 7890" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Please select your industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="aged-care">Aged Care</SelectItem>
                  <SelectItem value="disability">Disability Services</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Business website</Label>
              <Input id="website" placeholder="www.example.com" />
            </div>
          </div>
        </section>

        <Separator />

        {/* Business representative Section */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Business representative</h2>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Representative details</h3>

            <div className="space-y-2">
              <Label>Legal name</Label>
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Legal first name" />
                <Input placeholder="Legal last name" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rep-email">Email address</Label>
              <Input id="rep-email" placeholder="example@email.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job-title">Job title</Label>
              <Input id="job-title" placeholder="CEO, Manager, Partner" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rep-phone">Phone number</Label>
              <Input id="rep-phone" placeholder="+61 02 3456 7890" />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="director" />
              <Label htmlFor="director" className="text-sm font-normal">
                I'm a director of the company or member of the governing body
              </Label>
            </div>
          </div>
        </section>

        <Separator />

        {/* Business owner Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Business owner</h2>
          
          <PersonCard name="Leah Sailor" email="leahsailor.whale@gmail.com" />

          <Button variant="link" className="text-primary p-0 h-auto gap-1">
            <Plus className="h-4 w-4" />
            Add someone new
          </Button>
        </section>

        <Separator />

        {/* Business directors Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Business directors</h2>
          
          <PersonCard name="Leah Sailor" email="leahsailor.whale@gmail.com" />

          <Button variant="link" className="text-primary p-0 h-auto gap-1">
            <Plus className="h-4 w-4" />
            Add another director
          </Button>
        </section>

        <Separator />

        {/* Business executives Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Business executives</h2>
          
          <PersonCard name="Leah Sailor" email="leahsailor.whale@gmail.com" />

          <Button variant="link" className="text-primary p-0 h-auto gap-1">
            <Plus className="h-4 w-4" />
            Add another executive
          </Button>
        </section>

        {/* Bottom padding */}
        <div className="h-8" />
      </div>
    </div>
  );
};

function PersonCard({ name, email }: { name: string; email: string }) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <p className="font-medium text-sm">{name}</p>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default Workspace;
