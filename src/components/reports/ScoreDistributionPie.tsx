
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Badge } from '@/components/ui/badge';

interface ScoreDistributionProps {
  scores: { name: string; value: number; color: string }[];
  title?: string;
  description?: string;
  badge?: string;
}

/**
 * Enhanced pie chart for score distribution with animations and better tooltips
 */
const ScoreDistributionPie: React.FC<ScoreDistributionProps> = ({ 
  scores, 
  title = "Score Distribution", 
  description = "Distribution of quality scores",
  badge
}) => {
  // If no data, return empty state
  if (!scores.length) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>
            {description} {badge && <Badge variant="outline" className="ml-2">{badge}</Badge>}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">
              No data available yet. Complete some quality checks to see score distribution.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>
          {description} {badge && <Badge variant="outline" className="ml-2">{badge}</Badge>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={scores}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
                animationBegin={0}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {scores.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    className="hover:opacity-80 transition-opacity" 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [value, 'Count']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: 'none'
                }}
                animationDuration={200}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreDistributionPie;
