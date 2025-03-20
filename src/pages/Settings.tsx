
import { useState, useEffect } from 'react';
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
  Database,
  Check,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import Logo from '@/components/common/Logo';
import { CRITERIA } from '@/lib/mock-data';
import { 
  getZammadSettings, 
  saveZammadSettings, 
  testConnection 
} from '@/services/zammadService';
import { 
  getGeneralSettings, 
  saveGeneralSettings,
  getSettings,
  saveThemeSettings,
  applyTheme
} from '@/services/settingsService';

const Settings = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [zammadUrl, setZammadUrl] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generalSettings, setGeneralSettings] = useState({
    language: 'en',
    timezone: 'utc',
    defaultView: 'dashboard'
  });
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  
  // Load saved settings on component mount
  useEffect(() => {
    // Load Zammad settings
    const zSettings = getZammadSettings();
    if (zSettings) {
      setZammadUrl(zSettings.apiUrl || '');
      setApiKey(zSettings.apiToken || '');
      setIsConfigured(!!zSettings.apiUrl && !!zSettings.apiToken);
    }
    
    // Load general settings
    const gSettings = getGeneralSettings();
    setGeneralSettings(gSettings);
    
    // Load appearance settings
    const aSettings = getSettings('appearance');
    if (aSettings?.theme) {
      setTheme(aSettings.theme);
    } else {
      setTheme('system');
    }
  }, []);
  
  const handleSaveConnection = () => {
    if (!zammadUrl || !apiKey) {
      toast({
        title: "Validation Error",
        description: "Please provide both Zammad URL and API Key",
        variant: "destructive"
      });
      return;
    }
    
    // Save the connection settings
    saveZammadSettings({
      apiUrl: zammadUrl,
      apiToken: apiKey
    });
    
    setIsConfigured(true);
    toast({
      title: "Settings updated",
      description: "Your Zammad connection settings have been saved."
    });
  };
  
  const handleTestConnection = async () => {
    if (!zammadUrl || !apiKey) {
      toast({
        title: "Validation Error",
        description: "Please provide both Zammad URL and API Key",
        variant: "destructive"
      });
      return;
    }
    
    setIsTesting(true);
    
    try {
      const isConnected = await testConnection({
        apiUrl: zammadUrl,
        apiToken: apiKey
      });
      
      if (isConnected) {
        toast({
          title: "Connection successful",
          description: "Successfully connected to Zammad API."
        });
      } else {
        toast({
          title: "Connection failed",
          description: "Could not connect to Zammad API. Please check your URL and API key.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      toast({
        title: "Connection error",
        description: "An error occurred while testing the connection.",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };
  
  const handleSaveGeneralSettings = () => {
    setIsSaving(true);
    
    try {
      saveGeneralSettings(generalSettings);
      toast({
        title: "Settings saved",
        description: "General settings have been updated successfully."
      });
    } catch (error) {
      console.error('Error saving general settings:', error);
      toast({
        title: "Save failed",
        description: "Failed to save general settings.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleChangeTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    saveThemeSettings(newTheme);
    toast({
      title: "Theme updated",
      description: `Theme changed to ${newTheme}.`
    });
  };
  
  const handleSaveQCSettings = () => {
    // Implement QC settings save
    toast({
      title: "QC Settings saved",
      description: "Quality check criteria have been updated."
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
        <TabsList className="bg-card border">
          <TabsTrigger value="zammad" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Mail className="h-4 w-4 mr-2" />
            Zammad Integration
          </TabsTrigger>
          <TabsTrigger value="qc-settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Database className="h-4 w-4 mr-2" />
            QC Settings
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Moon className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <User className="h-4 w-4 mr-2" />
            User Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Lock className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <SettingsIcon className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="zammad" className="space-y-4">
          <Card className="hover-card">
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
              <Button variant="outline" onClick={handleTestConnection} disabled={isTesting}>
                {isTesting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Test Connection
                  </>
                )}
              </Button>
              <Button onClick={handleSaveConnection}>
                <Save className="h-4 w-4 mr-2" />
                Save Connection
              </Button>
            </CardFooter>
          </Card>
          
          {isConfigured && (
            <Card className="hover-card">
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
          <Card className="hover-card">
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
                      className="w-full accent-primary"
                    />
                    <p className="text-sm text-muted-foreground">{criteria.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveQCSettings}>
                <Save className="h-4 w-4 mr-2" />
                Save QC Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card className="hover-card">
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Theme</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Button 
                    variant={theme === 'light' ? 'default' : 'outline'} 
                    className="flex flex-col items-center justify-center h-24 gap-2"
                    onClick={() => handleChangeTheme('light')}
                  >
                    <Sun className="h-8 w-8" />
                    <span>Light</span>
                    {theme === 'light' && <Check className="absolute top-2 right-2 h-4 w-4" />}
                  </Button>
                  
                  <Button 
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    className="flex flex-col items-center justify-center h-24 gap-2"
                    onClick={() => handleChangeTheme('dark')}
                  >
                    <Moon className="h-8 w-8" />
                    <span>Dark</span>
                    {theme === 'dark' && <Check className="absolute top-2 right-2 h-4 w-4" />}
                  </Button>
                  
                  <Button 
                    variant={theme === 'system' ? 'default' : 'outline'}
                    className="flex flex-col items-center justify-center h-24 gap-2"
                    onClick={() => handleChangeTheme('system')}
                  >
                    <Monitor className="h-8 w-8" />
                    <span>System</span>
                    {theme === 'system' && <Check className="absolute top-2 right-2 h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile" className="space-y-4">
          <Card className="hover-card">
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
          <Card className="hover-card">
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
          <Card className="hover-card">
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
          <Card className="hover-card">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={generalSettings.language}
                  onValueChange={(value) => setGeneralSettings({...generalSettings, language: value})}
                >
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
                <Select 
                  value={generalSettings.timezone}
                  onValueChange={(value) => setGeneralSettings({...generalSettings, timezone: value})}
                >
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
                <Select 
                  value={generalSettings.defaultView}
                  onValueChange={(value) => setGeneralSettings({...generalSettings, defaultView: value})}
                >
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
              <Button onClick={handleSaveGeneralSettings} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Settings;
