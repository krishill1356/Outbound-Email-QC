
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { QualityCheck } from '@/types';

interface ScoreDistributionProps {
  scores?: { name: string; value: number; color: string }[];
  title?: string;
  description?: string;
  badge?: string;
  data?: QualityCheck[]; // Added data prop to accept quality checks
  showBreakdown?: boolean; // Option to show detailed score breakdown
}

/**
 * Enhanced pie chart for score distribution with animations and better tooltips
 */
const ScoreDistributionPie: React.FC<ScoreDistributionProps> = ({ 
  scores: propScores, 
  title = "Score Distribution", 
  description = "Distribution of quality scores",
  badge,
  data = [],
  showBreakdown = false
}) => {
  // Process data if provided
  const scores = propScores || processData(data);
  
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

  // Process score breakdowns if available and requested
  const breakdownData = showBreakdown && data.length > 0 ? 
    processBreakdownData(data) : null;

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
        
        {/* Display breakdown data if available */}
        {breakdownData && (
          <div className="mt-4 border-t pt-4">
            <h4 className="text-sm font-medium mb-2">Score Breakdown</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(breakdownData).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-xs capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                  <span className="text-xs font-medium">{value.toFixed(1)}/10</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Helper function to process quality checks into score distribution data
function processData(data: QualityCheck[]) {
  if (!data.length) return [];

  const scoreGroups = {
    excellent: { name: 'Excellent (8-10)', value: 0, color: '#4ade80' },
    good: { name: 'Good (6-7.9)', value: 0, color: '#facc15' },
    needs_improvement: { name: 'Needs Improvement (0-5.9)', value: 0, color: '#f87171' }
  };

  data.forEach(check => {
    const score = check.overallScore;
    if (score >= 8) {
      scoreGroups.excellent.value += 1;
    } else if (score >= 6) {
      scoreGroups.good.value += 1;
    } else {
      scoreGroups.needs_improvement.value += 1;
    }
  });

  return Object.values(scoreGroups).filter(group => group.value > 0);
}

// New helper function to process score breakdowns
function processBreakdownData(data: QualityCheck[]) {
  if (!data.length) return null;
  
  // Initialize counters for each score category
  const breakdownTotals: {[key: string]: {total: number, count: number}} = {};
  
  // Collect all breakdown scores
  data.forEach(check => {
    check.scores.forEach(score => {
      if (score.breakdown) {
        Object.entries(score.breakdown).forEach(([key, value]) => {
          if (!breakdownTotals[key]) {
            breakdownTotals[key] = { total: 0, count: 0 };
          }
          breakdownTotals[key].total += Number(value);
          breakdownTotals[key].count += 1;
        });
      }
    });
  });
  
  // Calculate averages
  const averages: {[key: string]: number} = {};
  Object.entries(breakdownTotals).forEach(([key, data]) => {
    averages[key] = data.total / data.count;
  });
  
  return averages;
}

export default ScoreDistributionPie;
