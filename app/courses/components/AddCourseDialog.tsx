'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CourseFormData {
  teacherName: string
  parentName: string
  contactInfo: string
  originalPrice: number
  currentPrice: number
  hours: number
  type: '预付' | '后付'
  status: '在读' | '结课'
}

export function AddCourseDialog({ onAddCourse }: { onAddCourse: (course: any) => void }) {
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CourseFormData>()

  const onSubmit = (data: CourseFormData) => {
    const newCourse = {
      ...data,
      id: Date.now(),
      purchaseDate: new Date().toISOString(),
      consumedHours: 0,
      settledAmount: 0,
    }
    onAddCourse(newCourse)
    setOpen(false)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>新增课程</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新增课程</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="teacherName">家教名称</Label>
            <Input id="teacherName" {...register("teacherName", { required: "家教名称是必填项" })} />
            {errors.teacherName && <p className="text-red-500">{errors.teacherName.message}</p>}
          </div>
          <div>
            <Label htmlFor="parentName">家长昵称</Label>
            <Input id="parentName" {...register("parentName", { required: "家长昵称是必填项" })} />
            {errors.parentName && <p className="text-red-500">{errors.parentName.message}</p>}
          </div>
          <div>
            <Label htmlFor="contactInfo">联系方式</Label>
            <Input id="contactInfo" {...register("contactInfo", { required: "联系方式是必填项" })} />
            {errors.contactInfo && <p className="text-red-500">{errors.contactInfo.message}</p>}
          </div>
          <div>
            <Label htmlFor="originalPrice">购课原价</Label>
            <Input id="originalPrice" type="number" {...register("originalPrice", { required: "购课原价是必填项" })} />
            {errors.originalPrice && <p className="text-red-500">{errors.originalPrice.message}</p>}
          </div>
          <div>
            <Label htmlFor="currentPrice">购课现价</Label>
            <Input id="currentPrice" type="number" {...register("currentPrice", { required: "购课现价是必填项" })} />
            {errors.currentPrice && <p className="text-red-500">{errors.currentPrice.message}</p>}
          </div>
          <div>
            <Label htmlFor="hours">课时</Label>
            <Input id="hours" type="number" {...register("hours", { required: "课时是必填项" })} />
            {errors.hours && <p className="text-red-500">{errors.hours.message}</p>}
          </div>
          <div>
            <Label htmlFor="type">类型</Label>
            <Select onValueChange={(value) => register("type").onChange({ target: { value } })}>
              <SelectTrigger>
                <SelectValue placeholder="选择类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="预付">预付</SelectItem>
                <SelectItem value="后付">后付</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-red-500">{errors.type.message}</p>}
          </div>
          <div>
            <Label htmlFor="status">状态</Label>
            <Select onValueChange={(value) => register("status").onChange({ target: { value } })}>
              <SelectTrigger>
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="在读">在读</SelectItem>
                <SelectItem value="结课">结课</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-red-500">{errors.status.message}</p>}
          </div>
          <Button type="submit">保存</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

