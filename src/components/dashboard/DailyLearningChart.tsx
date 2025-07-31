'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, XAxis, YAxis, Tooltip } from 'recharts';
import { Activity } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DailyLearningChartProps {
  data: Array<{
    date: string;
    questions: number;
  }>;
  isLoading?: boolean;
}

export function DailyLearningChart({ data, isLoading = false }: DailyLearningChartProps) {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  // Generate sample data if no real data is available
  const chartData = data && data.length > 0 ? data : [
    { date: '2024-01-01', questions: 5 },
    { date: '2024-01-02', questions: 8 },
    { date: '2024-01-03', questions: 3 },
    { date: '2024-01-04', questions: 12 },
    { date: '2024-01-05', questions: 7 },
    { date: '2024-01-06', questions: 9 },
    { date: '2024-01-07', questions: 6 }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{formatDate(label)}</p>
          <p className="text-sm text-muted-foreground">
            {t('dashboard.chart.questionsAnswered')}: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          {t('dashboard.chart.dailyActivity')}
          {(!data || data.length === 0) && (
            <span className="text-sm text-muted-foreground">(Données d'exemple)</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px] flex items-center justify-center">
          {isClient && (
            <BarChart width={600} height={280} data={chartData}>
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="questions" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 