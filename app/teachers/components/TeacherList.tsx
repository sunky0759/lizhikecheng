'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TeacherEditDialog } from './TeacherEditDialog'
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"
import { addDays } from 'date-fns'

interface Teacher {
  id: number
  name: string
  idNumber: string
  phone: string
  hireDate: string
  bankAccount: string
  bankName: string
  province: string
}

export default function TeacherList() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  useEffect(() => {
    // Fetch teachers data from API
    // For demonstration, we'll use sample data
    const sampleTeachers: Teacher[] = [
      {
        id: 1,
        name: '张三',
        idNumber: '110101199001011234',
        phone: '13800138000',
        hireDate: '2023-01-01',
        bankAccount: '6222021234567890123',
        bankName: '中国工商银行',
        province: '北京市'
      },
      // Add more sample teachers as needed
    ]
    setTeachers(sampleTeachers)
  }, [])

  const handleUpdateTeacher = (updatedTeacher: Teacher) => {
    setTeachers(prevTeachers => 
      prevTeachers.map(teacher => 
        teacher.id === updatedTeacher.id ? updatedTeacher : teacher
      )
    )
  }

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          teacher.phone.includes(searchTerm)
    const hireDate = new Date(teacher.hireDate)
    const matchesDateRange = (!dateRange.from || hireDate >= dateRange.from) &&
                             (!dateRange.to || hireDate <= dateRange.to)
    return matchesSearch && matchesDateRange
  })

  return (
    <>
      <div className="mb-4 flex items-center space-x-4">
        <Input
          type="text"
          placeholder="搜索老师姓名或电话..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <DatePickerWithRange
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>姓名</TableHead>
            <TableHead>身份证号</TableHead>
            <TableHead>手机号</TableHead>
            <TableHead>入职时间</TableHead>
            <TableHead>银行卡账号</TableHead>
            <TableHead>银行名称</TableHead>
            <TableHead>所属省份</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>{teacher.name}</TableCell>
                <TableCell>{teacher.idNumber}</TableCell>
                <TableCell>{teacher.phone}</TableCell>
                <TableCell>{teacher.hireDate}</TableCell>
                <TableCell>{teacher.bankAccount}</TableCell>
                <TableCell>{teacher.bankName}</TableCell>
                <TableCell>{teacher.province}</TableCell>
                <TableCell>
                  <Button size="sm" onClick={() => {
                    setSelectedTeacher(teacher)
                    setIsEditDialogOpen(true)
                  }}>
                    编辑
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center">暂无符合条件的教师数据</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {selectedTeacher && (
        <TeacherEditDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          teacher={selectedTeacher}
          onSave={handleUpdateTeacher}
        />
      )}
    </>
  )
}

