'use client'

import { useParams } from 'next/navigation'
import SpecialtyPage from '@/pages/SpecialtyPage'

export default function SpecialtyPageRoute() {
  const params = useParams()
  
  if (!params?.specialtyId) {
    return <div>Specialty ID not found</div>
  }
  
  const specialtyId = params.specialtyId as string
  
  return <SpecialtyPage specialtyId={specialtyId} />
} 