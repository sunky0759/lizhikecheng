'use client'

import { useState, useEffect } from 'react'
import CourseList from './components/CourseList'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCourses, setTotalCourses] = useState(0)
  const [coursesPerPage] = useState(10)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentPageCourses, setCurrentPageCourses] = useState(0);
  const [searchTrigger, setSearchTrigger] = useState(0);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page when search term changes
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value)
    setCurrentPage(1)
  }

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value)
    setCurrentPage(1)
  }

  const handleSubmit = () => {
    setCurrentPage(1);
    setSearchTrigger(prev => prev + 1);
  };

  const handleReset = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  }


  const updateTotalCourses = (total: number) => {
    setTotalCourses(total);
    const maxPage = Math.max(1, Math.ceil(total / coursesPerPage));
    setCurrentPage(prev => Math.min(prev, maxPage));
  };

  useEffect(() => {
    console.log('Search term updated:', searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    console.log('Search parameters:', { searchTerm, startDate, endDate, currentPage, searchTrigger });
    // Here you would typically call a function to fetch courses based on these parameters
  }, [searchTerm, startDate, endDate, currentPage, searchTrigger]);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">课程管理</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="搜索课程名称、家长昵称、电话或教员姓名..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-80"
          />
          <div className="flex items-center space-x-2">
            <Input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className="w-40"
            />
            <span>至</span>
            <Input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              className="w-40"
            />
            <Button onClick={handleSubmit} disabled={!searchTerm && !startDate && !endDate}>提交</Button>
            <Button variant="outline" onClick={handleReset}>重置</Button>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          总共 {totalCourses} 条记录，当前显示 {Math.min(currentPage * coursesPerPage, totalCourses)} 条中的 {currentPageCourses} 条
        </div>
      </div>
      <CourseList
        searchTerm={searchTerm}
        startDate={startDate}
        endDate={endDate}
        currentPage={currentPage}
        coursesPerPage={coursesPerPage}
        onUpdateTotalCourses={updateTotalCourses}
        onUpdateCurrentPageCourses={setCurrentPageCourses}
        searchTrigger={searchTrigger}
      />
      <div className="mt-4 flex justify-center">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="mr-2"
        >
          上一页
        </Button>
        <span className="mx-2 self-center">
          第 {currentPage} 页，共 {totalCourses > 0 ? Math.ceil(totalCourses / coursesPerPage) : 1} 页
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(totalCourses / coursesPerPage)}
          className="ml-2"
        >
          下一页
        </Button>
      </div>
    </div>
  )
}

