'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AddCourseDialog } from './AddCourseDialog'
import { CourseDetailDialog } from './CourseDetailDialog'
import { RefreshCcw } from 'lucide-react'
import { useToast } from "@/components/ui/toast" // Updated import

interface Course {
  id: number
  teacherName: string
  parentName: string
  contactInfo: string
  originalPrice: number
  currentPrice: number
  hours: number
  consumedHours: number
  settledAmount: number
  type: '预付' | '后付'
  status: '在读' | '结课'
  purchaseDate: string
  settlementRecords?: { hours: number; amount?: number }[]
  purchaseRecords?: { currentPrice: number }[]
}

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([])
  const [filter, setFilter] = useState<'全部' | '在读' | '结课'>('全部')
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const { toast } = useToast()

  const refreshCourses = () => {
    // In a real application, this would fetch fresh data from the API
    // For now, we'll just simulate a refresh by setting the courses again
    setCourses([...courses]);
    toast({
      title: "刷新成功",
      description: "课程列表已更新",
    });
  };

  useEffect(() => {
    // Fetch courses data from API
    // For demonstration, we'll use sample data
    const sampleCourses: Course[] = [
      {
        id: 1,
        teacherName: '张三',
        parentName: '李四',
        contactInfo: '13800138000',
        originalPrice: 1200,
        currentPrice: 1000,
        hours: 20,
        consumedHours: 5,
        settledAmount: 250,
        type: '预付',
        status: '在读',
        purchaseDate: '2023-06-01T10:00:00Z',
        settlementRecords: [{ hours: 5, amount: 250 }],
        purchaseRecords: [{ currentPrice: 200 }],
      },
      {
        id: 2,
        teacherName: '王五',
        parentName: '赵六',
        contactInfo: '13900139000',
        originalPrice: 1500,
        currentPrice: 1400,
        hours: 30,
        consumedHours: 10,
        settledAmount: 500,
        type: '后付',
        status: '在读',
        purchaseDate: '2023-05-15T14:30:00Z',
        settlementRecords: [{ hours: 10, amount: 500 }],
        purchaseRecords: [{ currentPrice: 300 }],
      },
      {
        id: 3,
        teacherName: '钱七',
        parentName: '孙八',
        contactInfo: '13700137000',
        originalPrice: 1000,
        currentPrice: 900,
        hours: 15,
        consumedHours: 15,
        settledAmount: 900,
        type: '预付',
        status: '结课',
        purchaseDate: '2023-04-20T09:15:00Z',
        settlementRecords: [{ hours: 15, amount: 900 }],
        purchaseRecords: [{ currentPrice: 100 }],
      }
    ]
    setCourses(sampleCourses)

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const filteredCourses = courses.filter(course => 
    filter === '全部' || course.status === filter
  )

  const handleDelete = (id: number) => {
    setCourses(courses.filter(course => course.id !== id))
  }

  const handleAddCourse = (newCourse: Course) => {
    setCourses([...courses, newCourse])
  }

  const calculateProfit = (course: Course) => {
    const consumedHours = course.settlementRecords?.reduce((total, record) => total + record.hours, 0) || 0;
    const totalRevenue = (course.currentPrice / course.hours) * consumedHours;
    return totalRevenue - course.settledAmount;
  }

  const handleUpdateCourse = (updatedCourse: Course) => {
    setCourses(prevCourses => 
      prevCourses.map(course => 
        course.id === updatedCourse.id ? updatedCourse : course
      )
    )
  }

  const openDetailDialog = (course: Course) => {
    setSelectedCourse(course)
    setIsDetailDialogOpen(true)
  }

  const handleExport = () => {
    const csvContent = [
      ["教师名称", "家长昵称", "联系方式", "购课原价", "购课现价", "课时", "已消课时", "已结算金额", "类型", "状态", "购课时间"],
      ...filteredCourses.map(course => [
        course.teacherName,
        course.parentName,
        course.contactInfo,
        course.originalPrice.toString(),
        course.currentPrice.toString(),
        course.hours.toString(),
        course.consumedHours.toString(),
        course.settledAmount.toString(),
        course.type,
        course.status,
        course.purchaseDate
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "课程信息.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderTableView = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>创建时间</TableHead>
          <TableHead>家教名称</TableHead>
          <TableHead>昵称/电话</TableHead>
          <TableHead>累计购课/结算</TableHead>
          <TableHead>课时/已上</TableHead>
          <TableHead>利润</TableHead>
          <TableHead>类型</TableHead>
          <TableHead>状态</TableHead>
          <TableHead>操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredCourses.map((course) => (
          <TableRow key={course.id}>
            <TableCell>{new Date(course.purchaseDate).toLocaleDateString()}</TableCell>
            <TableCell>{course.teacherName}</TableCell>
            <TableCell>{course.parentName}/{course.contactInfo}</TableCell>
            <TableCell>
              {(() => {
                const totalPurchaseAmount = course.currentPrice + (course.purchaseRecords?.reduce((sum, record) => sum + record.currentPrice, 0) || 0);
                const totalSettlementAmount = course.settlementRecords?.reduce((sum, record) => sum + (record.amount || 0), 0) || 0;
                return `${totalPurchaseAmount.toFixed(2)}/${totalSettlementAmount.toFixed(2)}`;
              })()}
            </TableCell>
            <TableCell>{course.hours}/{course.settlementRecords?.reduce((total, record) => total + record.hours, 0) || 0}</TableCell>
            <TableCell>{calculateProfit(course).toFixed(2)}</TableCell>
            <TableCell>{course.type}</TableCell>
            <TableCell>{course.status}</TableCell>
            <TableCell>
              <div className="space-x-2">
                <Button size="sm" onClick={() => openDetailDialog(course)}>详情</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">删除</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>确认删除</AlertDialogTitle>
                      <AlertDialogDescription>
                        您确定要删除这个课程吗？此操作不可撤销。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(course.id)}>
                        确认删除
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  const renderCardView = () => (
    <div className="space-y-4">
      {filteredCourses.map((course) => (
        <Card key={course.id}>
          <CardHeader>
            <CardTitle>{course.teacherName}</CardTitle>
            <CardDescription>{course.parentName}/{course.contactInfo}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>创建时间: {new Date(course.purchaseDate).toLocaleDateString()}</p>
            <p>累计购课/结算: 
              {(() => {
                const totalPurchaseAmount = course.currentPrice + (course.purchaseRecords?.reduce((sum, record) => sum + record.currentPrice, 0) || 0);
                const totalSettlementAmount = course.settlementRecords?.reduce((sum, record) => sum + (record.amount || 0), 0) || 0;
                return `${totalPurchaseAmount.toFixed(2)}/${totalSettlementAmount.toFixed(2)}`;
              })()}
            </p>
            <p>课时/已上: {course.hours}/{course.settlementRecords?.reduce((total, record) => total + record.hours, 0) || 0}</p>
            <p>利润: {calculateProfit(course).toFixed(2)}</p>
            <p>类型: {course.type}</p>
            <p>状态: {course.status}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button size="sm" onClick={() => openDetailDialog(course)}>详情</Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">删除</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确认删除</AlertDialogTitle>
                  <AlertDialogDescription>
                    您确定要删除这个课程吗？此操作不可撤销。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(course.id)}>
                    确认删除
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <Tabs defaultValue="全部">
            <TabsList>
              <TabsTrigger value="全部" onClick={() => setFilter('全部')}>全部</TabsTrigger>
              <TabsTrigger value="在读" onClick={() => setFilter('在读')}>在读</TabsTrigger>
              <TabsTrigger value="结课" onClick={() => setFilter('结课')}>结课</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon" onClick={refreshCourses}>
            <RefreshCcw className="h-4 w-4" />
            <span className="sr-only">刷新列表</span>
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={handleExport}>导出</Button>
          <AddCourseDialog onAddCourse={handleAddCourse} />
        </div>
      </div>
      {isSmallScreen ? renderCardView() : renderTableView()}
      {selectedCourse && (
        <CourseDetailDialog
          isOpen={isDetailDialogOpen}
          onClose={() => setIsDetailDialogOpen(false)}
          course={selectedCourse}
          onUpdateCourse={handleUpdateCourse}
        />
      )}
    </div>
  )
}

