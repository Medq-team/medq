
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Specialty } from '@/types';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Brain, 
  Bone, 
  Baby, 
  Scissors, 
  Eye, 
  Microscope, 
  Scan, 
  Stethoscope,
  Thermometer,
  Pill,
  Syringe,
  BookOpen,
  TestTube,
  Hospital,
  Bandage
} from 'lucide-react';

interface SpecialtyCardProps {
  specialty: Specialty;
}

export function SpecialtyCard({ specialty }: SpecialtyCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    router.push(`/specialty/${specialty.id}`);
  };

  const getSpecialtyIcon = () => {
    const name = specialty.name.toLowerCase();
    
    if (name.includes('cardio')) return <Heart className="h-10 w-10 text-red-500" />;
    if (name.includes('neuro')) return <Brain className="h-10 w-10 text-purple-500" />;
    if (name.includes('ortho')) return <Bone className="h-10 w-10 text-gray-600" />;
    if (name.includes('pediatric')) return <Baby className="h-10 w-10 text-pink-500" />;
    if (name.includes('derma')) return <Scissors className="h-10 w-10 text-amber-500" />;
    if (name.includes('ophtha') || name.includes('eye')) return <Eye className="h-10 w-10 text-blue-500" />;
    if (name.includes('patho')) return <Microscope className="h-10 w-10 text-emerald-600" />;
    if (name.includes('radio')) return <Scan className="h-10 w-10 text-indigo-500" />;
    if (name.includes('pulmo') || name.includes('respir')) return <TestTube className="h-10 w-10 text-blue-400" />;
    if (name.includes('emerg')) return <Hospital className="h-10 w-10 text-red-600" />;
    if (name.includes('pharma')) return <Pill className="h-10 w-10 text-green-500" />;
    if (name.includes('immun')) return <Syringe className="h-10 w-10 text-teal-500" />;
    if (name.includes('infect')) return <Bandage className="h-10 w-10 text-orange-500" />;
    if (name.includes('anesth')) return <Thermometer className="h-10 w-10 text-gray-500" />;
    if (name.includes('family') || name.includes('general')) return <Stethoscope className="h-10 w-10 text-green-600" />;
    if (name.includes('psych') || name.includes('mental')) return <BookOpen className="h-10 w-10 text-violet-500" />;
    
    // Default icon if no match
    return <Stethoscope className="h-10 w-10 text-slate-700" />;
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
