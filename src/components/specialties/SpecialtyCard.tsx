
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Specialty } from '@/types';
import { motion } from 'framer-motion';

interface SpecialtyCardProps {
  specialty: Specialty;
}

export function SpecialtyCard({ specialty }: SpecialtyCardProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    navigate(`/specialty/${specialty.id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="overflow-hidden cursor-pointer h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={specialty.imageUrl || '/placeholder.svg'} 
            alt={specialty.name}
            className="object-cover w-full h-full transition-transform duration-700 ease-in-out"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <h3 className="absolute bottom-4 left-4 right-4 text-white font-semibold text-xl">
            {specialty.name}
          </h3>
        </div>
        <CardContent className="p-4">
          <p className="text-muted-foreground text-sm line-clamp-2">
            {specialty.description || `Explore lectures and questions in ${specialty.name}`}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
