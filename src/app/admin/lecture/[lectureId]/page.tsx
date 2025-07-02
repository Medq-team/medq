'use client'

import { useParams } from 'next/navigation'
import AdminLecturePage from '@/pages/AdminLecturePage'

export default function AdminLecturePageRoute() {
  const params = useParams()
  
  if (!params?.lectureId) {
    return <div>Lecture ID not found</div>
  }
  
  const lectureId = params.lectureId as string
  
  return <AdminLecturePage lectureId={lectureId} />
} 