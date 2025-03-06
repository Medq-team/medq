
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Specialty } from '@/types';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Brain, 
  Bone, 
  HandHeart, 
  Bandage, 
  Eye, 
  Microscope, 
  Scan, 
  Stethoscope 
} from 'lucide-react';

interface SpecialtyCardProps {
  specialty: Specialty;
}

export function SpecialtyCard({ specialty }: SpecialtyCardProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    navigate(`/specialty/${specialty.id}`);
  };

  const getSpecialtyIcon = () => {
    switch (specialty.name.toLowerCase()) {
      case 'cardiology':
        return <Heart className="h-10 w-10 text-red-500" />;
      case 'neurology':
        return <Brain className="h-10 w-10 text-purple-500" />;
      case 'orthopedics':
        return <Bone className="h-10 w-10 text-gray-600" />;
      case 'pediatrics':
        return <HandHeart className="h-10 w-10 text-pink-500" />;
      case 'dermatology':
        return <Bandage className="h-10 w-10 text-amber-500" />;
      case 'ophthalmology':
        return <Eye className="h-10 w-10 text-blue-500" />;
      case 'pathology':
        return <Microscope className="h-10 w-10 text-emerald-600" />;
      case 'radiology':
        return <Scan className="h-10 w-10 text-indigo-500" />;
      default:
        return <Stethoscope className="h-10 w-10 text-slate-700" />;
    }
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
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="absolute inset-0 flex items-center justify-center">
            {getSpecialtyIcon()}
          </div>
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
