'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/toast" // Updated import

interface CourseFormData {
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
}

export default function CourseForm({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { register, handleSubmit, formState: { errors } } = useForm<CourseFormData>()

  const onSubmit = async (data: CourseFormData) => {
    // 这里应该发送数据到API
    console.log(data)
    toast({
      title: "成功",
      description: "课程信息已保存",
    })
    router.push('/courses')
  }

  return (
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
        <Label htmlFor="matchedTeacher">匹配教员</Label>
        <Input id="matchedTeacher" {...register("matchedTeacher", { required: "匹配教员是必填项" })} />
        {errors.matchedTeacher && <p className="text-red-500">{errors.matchedTeacher.message}</p>}
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
        <Label htmlFor="trialFee">试课费</Label>
        <Input id="trialFee" type="number" {...register("trialFee", { required: "试课费是必填项" })} />
        {errors.trialFee && <p className="text-red-500">{errors.trialFee.message}</p>}
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
      <div>
        <Label htmlFor="purchaseDate">购课时间</Label>
        <Input id="purchaseDate" type="date" {...register("purchaseDate", { required: "购课时间是必填项" })} />
        {errors.purchaseDate && <p className="text-red-500">{errors.purchaseDate.message}</p>}
      </div>
      <Button type="submit">保存</Button>
    </form>
  )
}

