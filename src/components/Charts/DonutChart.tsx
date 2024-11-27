import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface DonutChartProps {
  data: { name: string; value: number }[]; // Accept dynamic data
  colors?: string[]; // Custom colors for the chart
  innerRadius?: string | number; // Customize inner radius
  outerRadius?: string | number; // Customize outer radius
  label?: React.ReactNode; // Custom label for the center of the donut
  tooltipFormatter?: (
    value: number,
    name: string,
    percentage: string
  ) => string; // Tooltip formatting
  className?: string; // Additional CSS classes
  showPercentages?: boolean; // Show percentages on tooltip
}

// Custom Tooltip Component
const CustomTooltip = ({
  active,
  payload,
  total,
  showPercentages = false,
  tooltipFormatter = (value, name, percentage) => (
    <>
      <strong>{name}:</strong> {value}{' '}
      {showPercentages ? `(${percentage})` : ''}
    </>
  ),
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  total: number;
  tooltipFormatter?: (
    value: number,
    name: string,
    percentage: string
  ) => React.ReactNode;
  showPercentages?: boolean;
}) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    const percentage = `${((value / total) * 100).toFixed(2)}%`;

    return (
      <div
        style={{
          backgroundColor: '#1F2937',
          padding: '10px',
          borderRadius: '5px',
          color: '#F9FAFB',
        }}
      >
        {tooltipFormatter(value, name, percentage)}
      </div>
    );
  }

  return null;
};

const DonutChart: React.FC<DonutChartProps> = ({
  data,
  colors = ['#34D399', '#4B5563', '#F59E0B'], // Default colors
  innerRadius = '70%',
  outerRadius = '100%',
  label,
  tooltipFormatter = (value, name, percentage) =>
    `${name}: ${value} ${percentage}`,
  className = '',
  showPercentages = false,
}) => {
  // Calculate total value for percentage calculation or validations
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={`relative ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            dataKey="value"
            startAngle={90}
            endAngle={-450}
            paddingAngle={5}
          >
            {data.map((entry, index) => (
              <Cell
                // eslint-disable-next-line react/no-array-index-key
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip
            content={
              <CustomTooltip
                tooltipFormatter={tooltipFormatter}
                total={total}
                showPercentages={showPercentages}
              />
            }
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center Label */}
      {label && (
        <div className="absolute inset-0 flex items-center justify-center">
          {label}
        </div>
      )}
    </div>
  );
};

export default DonutChart;
