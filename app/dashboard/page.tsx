'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from 'react'
import { useToast } from "@/components/ui/toast"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState({ totalCourses: 0, totalAmount: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Replace this with your actual API call
        const response = await fetch('/api/dashboard')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setDashboardData(data)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        setError('获取数据失败，请稍后再试')
        toast({
          title: "错误",
          description: "获取数据失败，请稍后再试",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [toast])

  const chartData = [
    { name: '购课数', value: dashboardData.totalCourses },
    { name: '购课金额', value: dashboardData.totalAmount },
  ]

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">数据看板</h1>
      <h2 className="text-4xl font-bold text-center text-red-600 blink mb-8 tracking-normal leading-[2] md:text-5xl lg:text-6xl">
        <span className="block mb-4">业绩都是干出来的，</span>
        <span className="block">撸起袖子加油！</span>
      </h2>
      <div className="mb-6">
        <select className="p-2 border rounded">
          <option>今日</option>
          <option>本周</option>
          <option>本月</option>
          <option>上月</option>
        </select>
      </div>
      {isLoading ? (
        <div className="text-center text-red-500">
          <p>课程管理模块数据加载中...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">
          获取数据失败，请稍后再试
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">总购课数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold mb-4">{dashboardData.totalCourses}</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[{ name: '购课数', value: dashboardData.totalCourses }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">购课金额</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold mb-4">¥{dashboardData.totalAmount.toLocaleString()}</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[{ name: '购课金额', value: dashboardData.totalAmount }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

