
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
  Textarea 
} from '@/components/ui/textarea';
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
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const Settings = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [zammadUrl, setZammadUrl] = useState('');
  
  const handleSaveConnection = () => {
    // Here you would actually save the connection settings
    toast({
      title: "Settings updated",
      description: "Your Zammad connection settings have been saved."
    });
  };
  
  const handleTestConnection = () => {
    // Here you would actually test the connection
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
    >
      <section className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your Email QC application</p>
      </section>
      
      <Tabs defaultValue="integrations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            User Profile
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Plug className="h-4 w-4 mr-2" />
            Integrations
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
        
        <TabsContent value="integrations" className="space-y-4">
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
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sync-frequency">Sync Frequency</Label>
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
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch id="auto-sync" defaultChecked />
                <Label htmlFor="auto-sync">Enable automatic sync</Label>
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
