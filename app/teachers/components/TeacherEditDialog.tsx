'use client'

import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from 'lucide-react'

interface TeacherEditDialogProps {
  isOpen: boolean
  onClose: () => void
  teacher: {
    id: number
    name: string
    idNumber: string
    phone: string
    hireDate: string
    bankAccount: string
    bankName: string
    province: string
  }
  onSave: (teacher: any) => void
}

export function TeacherEditDialog({ isOpen, onClose, teacher, onSave }: TeacherEditDialogProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: teacher
  })

  const onSubmit = (data: any) => {
    onSave(data)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>编辑教师信息</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="text-sm">姓名</Label>
            <Input id="name" {...register("name", { required: "姓名是必填项" })} className="mt-1" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="idNumber" className="text-sm">身份证号</Label>
            <Input id="idNumber" {...register("idNumber", { required: "身份证号是必填项" })} className="mt-1" />
            {errors.idNumber && <p className="text-red-500 text-xs mt-1">{errors.idNumber.message}</p>}
          </div>
          <div>
            <Label htmlFor="phone" className="text-sm">手机号</Label>
            <Input id="phone" {...register("phone", { required: "手机号是必填项" })} className="mt-1" />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <Label htmlFor="hireDate" className="text-sm">入职时间</Label>
            <Input id="hireDate" type="date" {...register("hireDate", { required: "入职时间是必填项" })} className="mt-1" />
            {errors.hireDate && <p className="text-red-500 text-xs mt-1">{errors.hireDate.message}</p>}
          </div>
          <div>
            <Label htmlFor="bankAccount" className="text-sm">银行卡账号</Label>
            <Input id="bankAccount" {...register("bankAccount", { required: "银行卡账号是必填项" })} className="mt-1" />
            {errors.bankAccount && <p className="text-red-500 text-xs mt-1">{errors.bankAccount.message}</p>}
          </div>
          <div>
            <Label htmlFor="bankName" className="text-sm">银行名称</Label>
            <Input id="bankName" {...register("bankName", { required: "银行名称是必填项" })} className="mt-1" />
            {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName.message}</p>}
          </div>
          <div className="col-span-2">
            <Label htmlFor="province" className="text-sm">所属省份</Label>
            <Input id="province" {...register("province", { required: "所属省份是必填项" })} className="mt-1" />
            {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province.message}</p>}
          </div>
          <Button type="submit" className="col-span-2 mt-4">保存</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

