import Link from 'next/link'
import { Button } from "@/components/ui/button"
import TeacherList from './components/TeacherList'

export default function TeachersPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">老师管理</h1>
      <Button asChild className="mb-4">
        <Link href="/teachers/new">新增老师</Link>
      </Button>
      <TeacherList />
    </div>
  )
}

