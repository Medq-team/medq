'use client'

import { useParams } from 'next/navigation'
import { AdminRoute } from '@/components/auth/AdminRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { LectureHeader } from '@/components/admin/LectureHeader'
import { QuestionsList } from '@/components/admin/QuestionsList'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Lecture, Question } from '@/types'
import { toast } from '@/hooks/use-toast'
import { useTranslation } from 'react-i18next'

export default function AdminLecturePageRoute() {
  const params = useParams()
  const router = useRouter()
  const { t } = useTranslation()
  const [lecture, setLecture] = useState<Lecture | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false)
  
  if (!params?.lectureId) {
    return <div>Lecture ID not found</div>
  }
  
  const lectureId = params.lectureId as string

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        
        // Fetch lecture
        const lectureResponse = await fetch(`/api/lectures/${lectureId}`)
        if (!lectureResponse.ok) {
          throw new Error('Failed to fetch lecture')
        }
        const lectureData = await lectureResponse.json()
        setLecture(lectureData)

        // Fetch questions
        const questionsResponse = await fetch(`/api/questions?lectureId=${lectureId}`)
        if (!questionsResponse.ok) {
          throw new Error('Failed to fetch questions')
        }
        const questionsData = await questionsResponse.json()
        setQuestions(questionsData)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          title: t('common.error'),
          description: t('common.tryAgain'),
          variant: "destructive",
        })
        router.push('/admin')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [lectureId, router, t])

  const handleBack = () => {
    router.push('/admin')
  }

  const handleAddQuestion = () => {
    setIsAddQuestionOpen(true)
  }

  const handleQuestionDeleted = (questionId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId))
  }

  const handleQuestionAdded = () => {
    // Refresh questions list
    fetch(`/api/questions?lectureId=${lectureId}`)
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(console.error)
  }

  return (
    <AdminRoute>
      <AppLayout>
        <div className="space-y-6">
          <LectureHeader
            lecture={lecture}
            onBack={handleBack}
            onAddQuestion={handleAddQuestion}
          />

          <QuestionsList />
        </div>
      </AppLayout>
    </AdminRoute>
  )
} 