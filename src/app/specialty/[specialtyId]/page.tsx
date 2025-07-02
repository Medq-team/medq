'use client'

import { useParams } from 'next/navigation'
import SpecialtyPage from '@/pages/SpecialtyPage'

export default function SpecialtyPageRoute() {
  const params = useParams()
  const specialtyId = params.specialtyId as string
  
  return <SpecialtyPage specialtyId={specialtyId} />
} 