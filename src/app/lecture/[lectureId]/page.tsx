'use client'

import { useParams } from 'next/navigation'
import LecturePage from '@/pages/LecturePage'

export default function LecturePageRoute() {
  const params = useParams()
  
  if (!params?.lectureId) {
    return <div>Lecture ID not found</div>
  }
  
  const lectureId = params.lectureId as string
  
  return <LecturePage lectureId={lectureId} />
} 