'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CourseDetail {
  id: number
  teacherName: string
  parentName: string
  contactInfo: string
  matchedTeacher: string
  originalPrice: number
  currentPrice: number
  hours: number
  trialFee: number
  type: '预付' | '后付'
  status: '在读' | '结课'
  purchaseDate: string
  consumedHours: number
  settledAmount: number
}

export default function CourseDetailPage() {
  const params = useParams()
  const [course, setCourse] = useState<CourseDetail | null>(null)

  useEffect(() => {
    // 这里应该从API获取课程详情
    // 为了演示,我们使用模拟数据
    setCourse({
      id: Number(params.id),
      teacherName: '张三',
      parentName: '李四',
      contactInfo: '13800138000',
      matchedTeacher: '王五',
      originalPrice: 1200,
      currentPrice: 1000,
      hours: 20,
      trialFee: 100,
      type: '预付',
      status: '在读',
      purchaseDate: '2023-06-01',
      consumedHours: 5,
      settledAmount: 250
    })
  }, [params.id])

  if (!course) {
    return <div>加载中...</div>
  }

  const profit = (course.currentPrice / course.hours * course.consumedHours) - course.settledAmount

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">课程详情</h1>
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="font-semibold">家教名称</dt>
              <dd>{course.teacherName}</dd>
            </div>
            <div>
              <dt className="font-semibold">家长昵称</dt>
              <dd>{course.parentName}</dd>
            </div>
            <div>
              <dt className="font-semibold">联系方式</dt>
              <dd>{course.contactInfo}</dd>
            </div>
            <div>
              <dt className="font-semibold">匹配教员</dt>
              <dd>{course.matchedTeacher}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>课程信息</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="font-semibold">购课原价</dt>
              <dd>{course.originalPrice}</dd>
            </div>
            <div>
              <dt className="font-semibold">购课现价</dt>
              <dd>{course.currentPrice}</dd>
            </div>
            <div>
              <dt className="font-semibold">课时</dt>
              <dd>{course.hours}</dd>
            </div>
            <div>
              <dt className="font-semibold">试课费</dt>
              <dd>{course.trialFee}</dd>
            </div>
            <div>
              <dt className="font-semibold">类型</dt>
              <dd>{course.type}</dd>
            </div>
            <div>
              <dt className="font-semibold">状态</dt>
              <dd>{course.status}</dd>
            </div>
            <div>
              <dt className="font-semibold">购课时间</dt>
              <dd>{course.purchaseDate}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>结算信息</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="font-semibold">已消课时</dt>
              <dd>{course.consumedHours}</dd>
            </div>
            <div>
              <dt className="font-semibold">已结算金额</dt>
              <dd>{course.settledAmount}</dd>
            </div>
            <div>
              <dt className="font-semibold">利润</dt>
              <dd>{profit.toFixed(2)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}

