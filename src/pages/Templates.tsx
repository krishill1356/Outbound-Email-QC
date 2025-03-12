
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  Search, 
  Plus, 
  Tag, 
  ArrowUpDown,
  Pencil,
  Trash
} from 'lucide-react';
import { TEMPLATES } from '@/lib/mock-data';
import { motion } from 'framer-motion';

const Templates = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Email Templates</h1>
            <p className="text-muted-foreground mt-1">Manage and create standardized email templates</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search templates..."
                className="w-full md:w-[240px] pl-8"
              />
            </div>
            
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </div>
        </div>
      </section>
      
      <Card>
        <CardHeader>
          <CardTitle>Template Library</CardTitle>
          <CardDescription>
            Standardized templates used for quality assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Templates</TabsTrigger>
              <TabsTrigger value="customer-service">Customer Service</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {TEMPLATES.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </TabsContent>
            
            <TabsContent value="customer-service" className="space-y-4">
              {TEMPLATES.filter(t => t.tags.includes('customer-service')).map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </TabsContent>
            
            <TabsContent value="technical" className="space-y-4">
              {TEMPLATES.filter(t => t.tags.includes('technical')).map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </TabsContent>
            
            <TabsContent value="billing" className="space-y-4">
              {TEMPLATES.filter(t => t.tags.includes('billing')).map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    description: string;
    content: string;
    tags: string[];
  };
}

const TemplateCard = ({ template }: TemplateCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="p-6 flex-1">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-medium text-lg">{template.name}</h3>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <p className="text-muted-foreground text-sm mb-4">{template.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {template.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="flex items-center">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="border-t md:border-t-0 md:border-l border-border p-4 md:p-6 bg-muted/40 w-full md:w-1/2 md:max-w-md">
            <h4 className="text-sm font-medium mb-2">Template Preview:</h4>
            <div className="max-h-40 overflow-y-auto text-sm text-muted-foreground whitespace-pre-line">
              {template.content}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Templates;
