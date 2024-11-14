// components/features/FeatureCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@material-ui/core';

interface FeatureCardProps {
  feature: {
    icon: React.ElementType;
    color: string;
    title: string;
    description: string;
  };
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index }) => {
  const Icon = feature.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="glass-morphism h-full">
        <CardContent className="p-6">
          <Icon className={`h-12 w-12 ${feature.color} mb-4`} />
          <h3 className="text-xl font-semibold text-white mb-2">
            {feature.title}
          </h3>
          <p className="text-gray-400">
            {feature.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeatureCard;
