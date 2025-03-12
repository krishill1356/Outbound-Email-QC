import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  User, 
  Lock, 
  Bell, 
  Plug, 
  Settings as SettingsIcon,
  Save,
  RefreshCw,
  Mail,
  Database
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import Logo from '@/components/common/Logo';
import { CRITERIA } from '@/lib/mock-data';

const Settings = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [zammadUrl, setZammadUrl] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  
  const handleSaveConnection = () => {
    if (!zammadUrl || !apiKey) {
      toast({
        title: "Validation Error",
        description: "Please provide both Zammad URL and API Key",
        variant: "destructive"
      });
      return;
    }
    
    // This would actually save the connection settings in a real app
    setIsConfigured(true);
    toast({
      title: "Settings updated",
      description: "Your Zammad connection settings have been saved."
    });
  };
  
  const handleTestConnection = () => {
    if (!zammadUrl || !apiKey) {
      toast({
        title: "Validation Error",
        description: "Please provide both Zammad URL and API Key",
        variant: "destructive"
      });
      return;
    }
    
    // This would actually test the connection in a real app
    toast({
      title: "Connection successful",
      description: "Successfully connected to Zammad API."
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto"
    >
      <section className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-1">Configure your Email QC application</p>
          </div>
          <Logo size="medium" />
        </div>
      </section>
      
      <Tabs defaultValue="zammad" className="space-y-4">
        <TabsList>
          <TabsTrigger value="zammad">
            <Mail className="h-4 w-4 mr-2" />
            Zammad Integration
          </TabsTrigger>
          <TabsTrigger value="qc-settings">
            <Database className="h-4 w-4 mr-2" />
            QC Settings
          </TabsTrigger>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            User Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="general">
            <SettingsIcon className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="zammad" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Zammad Integration</CardTitle>
              <CardDescription>
                Configure your connection to Zammad for email quality assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="zammad-url">Zammad URL</Label>
                <Input 
                  id="zammad-url" 
                  placeholder="https://your-zammad-instance.com" 
                  value={zammadUrl}
                  onChange={(e) => setZammadUrl(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  The URL of your Zammad instance (e.g., https://support.example.com)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input 
                  id="api-key" 
                  type="password" 
                  placeholder="Your Zammad API key" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Generate an API key in your Zammad admin settings
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sync-frequency">Data Sync Frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger id="sync-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="manual">Manual Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-2">
                  <Switch id="auto-sync" defaultChecked />
                  <Label htmlFor="auto-sync">Enable automatic sync</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="fetch-closed" />
                  <Label htmlFor="fetch-closed">Include closed tickets</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="fetch-internal" />
                  <Label htmlFor="fetch-internal">Include internal notes</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleTestConnection}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Test Connection
              </Button>
              <Button onClick={handleSaveConnection}>
                <Save className="h-4 w-4 mr-2" />
                Save Connection
              </Button>
            </CardFooter>
          </Card>
          
          {isConfigured && (
            <Card>
              <CardHeader>
                <CardTitle>Data Import</CardTitle>
                <CardDescription>
                  Import emails from Zammad for quality assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select defaultValue="last-week">
                    <SelectTrigger id="date-range">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="yesterday">Yesterday</SelectItem>
                      <SelectItem value="last-week">Last 7 days</SelectItem>
                      <SelectItem value="last-month">Last 30 days</SelectItem>
                      <SelectItem value="custom">Custom range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="agent-filter">Filter by Agent</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="agent-filter">
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Agents</SelectItem>
                      {/* Agent options would be populated from Zammad API */}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Import Emails for QC
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="qc-settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quality Check Settings</CardTitle>
              <CardDescription>
                Configure quality check criteria and weights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {CRITERIA.map((criteria) => (
                  <div key={criteria.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`weight-${criteria.id}`}>{criteria.name}</Label>
                      <span className="text-sm text-muted-foreground">{criteria.weight * 100}%</span>
                    </div>
                    <Input 
                      id={`weight-${criteria.id}`}
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.05"
                      defaultValue={criteria.weight.toString()}
                      className="w-full"
                    />
                    <p className="text-sm text-muted-foreground">{criteria.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save QC Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>
                Manage your account information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" defaultValue="Admin User" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Your email" defaultValue="admin@example.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select defaultValue="admin">
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="reviewer">QC Reviewer</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive notifications from the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifs">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about new quality checks via email
                    </p>
                  </div>
                  <Switch id="email-notifs" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="weekly-summary">Weekly Summary</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a weekly summary of all quality check activity
                    </p>
                  </div>
                  <Switch id="weekly-summary" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="poor-score-alert">Poor Score Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when an agent receives a score below 6
                    </p>
                  </div>
                  <Switch id="poor-score-alert" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="browser-notifs">Browser Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Show desktop notifications in your browser
                    </p>
                  </div>
                  <Switch id="browser-notifs" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              
              <div className="pt-2">
                <Label>Two-Factor Authentication</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Switch id="enable-2fa" />
                  <Label htmlFor="enable-2fa">Enable 2FA</Label>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Enhance your account security by enabling two-factor authentication.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Update Security Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">Eastern Time (ET)</SelectItem>
                    <SelectItem value="cst">Central Time (CT)</SelectItem>
                    <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                    <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="default-view">Default View</Label>
                <Select defaultValue="dashboard">
                  <SelectTrigger id="default-view">
                    <SelectValue placeholder="Select default view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dashboard">Dashboard</SelectItem>
                    <SelectItem value="quality-check">Quality Check</SelectItem>
                    <SelectItem value="reports">Reports</SelectItem>
                    <SelectItem value="agents">Agents</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Settings;
