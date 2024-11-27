'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from "@/lib/utils"

interface CourseDetailDialogProps {
  isOpen: boolean
  onClose: () => void
  course: {
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
  }
  onUpdateCourse: (updatedCourse: any) => void
}

export function CourseDetailDialog({ isOpen, onClose, course, onUpdateCourse }: CourseDetailDialogProps) {
  const [activeTab, setActiveTab] = useState("课程信息")
  const [purchaseRecords, setPurchaseRecords] = useState<any[]>([])
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [purchaseHours, setPurchaseHours] = useState('');
  const [purchaseOriginalPrice, setPurchaseOriginalPrice] = useState('');
  const [purchaseCurrentPrice, setPurchaseCurrentPrice] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // New state for settlement records
  const [settlementRecords, setSettlementRecords] = useState<any[]>([]);
  const [settlementMonth, setSettlementMonth] = useState(new Date().toISOString().split('-').slice(0, 2).join('-'));
  const [settlementAmount, setSettlementAmount] = useState('');
  const [settlementHours, setSettlementHours] = useState('');

  // Add state for editing settlement records
  const [editingSettlementIndex, setEditingSettlementIndex] = useState<number | null>(null);

  // Add new state for edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Add new state to manage editable course data
  const [editableCourse, setEditableCourse] = useState({ ...course });

  const [teachers, setTeachers] = useState([])
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  useEffect(() => {
    // Fetch teachers from your API
    // This is a mock implementation. Replace with actual API call.
    setTeachers([
      { value: "teacher1", label: "张老师" },
      { value: "teacher2", label: "李老师" },
      { value: "teacher3", label: "王老师" },
    ])
  }, [])

  const calculateTotals = () => {
    const totalSettledAmount = settlementRecords.reduce((sum, record) => sum + record.amount, 0);
    const totalConsumedHours = settlementRecords.reduce((sum, record) => sum + record.hours, 0);
    return { totalSettledAmount, totalConsumedHours };
  };

  const handleAddPurchaseRecord = () => {
    const newRecord = {
      date: purchaseDate,
      hours: Number(purchaseHours),
      originalPrice: Number(purchaseOriginalPrice),
      currentPrice: Number(purchaseCurrentPrice)
    }
    setPurchaseRecords([...purchaseRecords, newRecord]);
    // Reset input fields
    setPurchaseDate(new Date().toISOString().split('T')[0]);
    setPurchaseHours('');
    setPurchaseOriginalPrice('');
    setPurchaseCurrentPrice('');
    setEditingIndex(null);
  }

  const handleEditRecord = (index: number) => {
    const recordToEdit = purchaseRecords[index];
    setPurchaseDate(recordToEdit.date);
    setPurchaseHours(recordToEdit.hours.toString());
    setPurchaseOriginalPrice(recordToEdit.originalPrice.toString());
    setPurchaseCurrentPrice(recordToEdit.currentPrice.toString());
    setEditingIndex(index);
  };

  const handleDeleteRecord = (index: number) => {
    setPurchaseRecords(purchaseRecords.filter((_, i) => i !== index));
    setEditingIndex(null);
  };

  const handleConfirmEdit = () => {
    if (editingIndex !== null) {
      const updatedRecords = [...purchaseRecords];
      updatedRecords[editingIndex] = {
        date: purchaseDate,
        hours: Number(purchaseHours),
        originalPrice: Number(purchaseOriginalPrice),
        currentPrice: Number(purchaseCurrentPrice)
      };
      setPurchaseRecords(updatedRecords);
      setEditingIndex(null);
      // Reset input fields
      setPurchaseDate(new Date().toISOString().split('T')[0]);
      setPurchaseHours('');
      setPurchaseOriginalPrice('');
      setPurchaseCurrentPrice('');
    }
  };

  // New function to handle adding settlement records
  const handleAddSettlementRecord = () => {
    setSettlementRecords(prevRecords => [
      ...prevRecords,
      {
        month: settlementMonth,
        amount: Number(settlementAmount),
        hours: Number(settlementHours)
      }
    ]);
    // Reset input fields
    setSettlementMonth(new Date().toISOString().split('-').slice(0, 2).join('-'));
    setSettlementAmount('');
    setSettlementHours('');
  };

  // Add functions to handle editing and deleting settlement records
  const handleEditSettlementRecord = (index: number) => {
    const recordToEdit = settlementRecords[index];
    setSettlementMonth(recordToEdit.month);
    setSettlementAmount(recordToEdit.amount.toString());
    setSettlementHours(recordToEdit.hours.toString());
    setEditingSettlementIndex(index);
  };

  const handleDeleteSettlementRecord = (index: number) => {
    setSettlementRecords(prevRecords => prevRecords.filter((_, i) => i !== index));
    setEditingSettlementIndex(null);
  };

  const handleConfirmSettlementEdit = () => {
    if (editingSettlementIndex !== null) {
      setSettlementRecords(prevRecords => {
        const updatedRecords = [...prevRecords];
        updatedRecords[editingSettlementIndex] = {
          month: settlementMonth,
          amount: Number(settlementAmount),
          hours: Number(settlementHours)
        };
        return updatedRecords;
      });
      setEditingSettlementIndex(null);
      setSettlementMonth(new Date().toISOString().split('-').slice(0, 2).join('-'));
      setSettlementAmount('');
      setSettlementHours('');
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    onUpdateCourse(editableCourse);
    // Remove the onClose() call to keep the dialog open
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px] w-full">
        <DialogHeader>
          <DialogTitle>课程详情 - {course.teacherName}</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="课程信息">课程信息</TabsTrigger>
            <TabsTrigger value="购课信息">购课信息</TabsTrigger>
            <TabsTrigger value="结算信息">结算信息</TabsTrigger>
          </TabsList>
          <TabsContent value="课程信息" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>家教名称</Label>
                <Input value={editableCourse.teacherName} disabled={!isEditing} onChange={(e) => setEditableCourse({ ...editableCourse, teacherName: e.target.value })} />
              </div>
              <div>
                <Label>匹配教员</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                      disabled={!isEditing}
                    >
                      {value
                        ? teachers.find((teacher) => teacher.value === value)?.label
                        : "选择教员..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="搜索教员..." />
                      <CommandEmpty>未找到匹配的教员。</CommandEmpty>
                      <CommandGroup>
                        {teachers.map((teacher) => (
                          <CommandItem
                            key={teacher.value}
                            onSelect={(currentValue) => {
                              setValue(currentValue === value ? "" : currentValue)
                              setEditableCourse({ ...editableCourse, matchedTeacher: teacher.label })
                              setOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                value === teacher.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {teacher.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>家长昵称</Label>
                <Input value={editableCourse.parentName} disabled={!isEditing} onChange={(e) => setEditableCourse({ ...editableCourse, parentName: e.target.value })} />
              </div>
              <div>
                <Label>联系方式</Label>
                <Input value={editableCourse.contactInfo} disabled={!isEditing} onChange={(e) => setEditableCourse({ ...editableCourse, contactInfo: e.target.value })} />
              </div>
              <div>
                <Label>购课原价</Label>
                <Input value={editableCourse.originalPrice} disabled={!isEditing} onChange={(e) => setEditableCourse({ ...editableCourse, originalPrice: Number(e.target.value) })} />
              </div>
              <div>
                <Label>购课现价</Label>
                <Input 
                  value={editableCourse.currentPrice} 
                  disabled={!isEditing} 
                  onChange={(e) => {
                    const newPrice = Number(e.target.value);
                    if (newPrice <= editableCourse.originalPrice) {
                      setEditableCourse({ ...editableCourse, currentPrice: newPrice });
                    } else {
                      // You might want to show an error message here
                      console.error("购课现价不能高于原价");
                    }
                  }} 
                />
              </div>
              <div>
                <Label>购课课时</Label>
                <Input value={editableCourse.hours} disabled={!isEditing} onChange={(e) => setEditableCourse({ ...editableCourse, hours: Number(e.target.value) })} />
              </div>
              <div>
                <Label>类型</Label>
                <Select
                  disabled={!isEditing}
                  value={editableCourse.type}
                  onValueChange={(value) => setEditableCourse({ ...editableCourse, type: value as '预付' | '后付' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="预付">预付</SelectItem>
                    <SelectItem value="后付">后付</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>状态</Label>
                <Select
                  disabled={!isEditing}
                  value={editableCourse.status}
                  onValueChange={(value) => setEditableCourse({ ...editableCourse, status: value as '在读' | '结课' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="在读">在读</SelectItem>
                    <SelectItem value="结课">结课</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>购课时间</Label>
                <Input
                  type="date"
                  value={editableCourse.purchaseDate.split('T')[0]}
                  disabled={!isEditing}
                  onChange={(e) => setEditableCourse({ ...editableCourse, purchaseDate: e.target.value })}
                />
              </div>
              <div>
                <Label>试课费金额</Label>
                <Input value={"100"} disabled={!isEditing} onChange={(e) => setEditableCourse({ ...editableCourse, trialFee: Number(e.target.value) })} />
              </div>
            </div>
            <Button className="mt-4" onClick={isEditing ? handleSave : () => setIsEditing(true)}>
              {isEditing ? '保存' : '编辑'}
            </Button>
          </TabsContent>
          <TabsContent value="购课信息" className="mt-4">
            <div className="space-y-4">
              <div className="flex justify-between mb-4">
                <div>累计购课课时: {course.hours + purchaseRecords.reduce((sum, record) => sum + record.hours, 0)} 小时</div>
                <div>累计购课金额: {course.currentPrice + purchaseRecords.reduce((sum, record) => sum + record.currentPrice, 0)} 元</div>
              </div>
              <div>
                <Label>购课时间</Label>
                <Input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
              </div>
              <div>
                <Label>购课课时</Label>
                <Input type="number" value={purchaseHours} onChange={(e) => setPurchaseHours(e.target.value)} />
              </div>
              <div>
                <Label>购课原价</Label>
                <Input type="number" value={purchaseOriginalPrice} onChange={(e) => setPurchaseOriginalPrice(e.target.value)} />
              </div>
              <div>
                <Label>购课现价</Label>
                <Input 
                  type="number" 
                  value={purchaseCurrentPrice} 
                  onChange={(e) => {
                    const newPrice = Number(e.target.value);
                    if (newPrice <= Number(purchaseOriginalPrice)) {
                      setPurchaseCurrentPrice(e.target.value);
                    } else {
                      console.error("购课现价不能高于原价");
                    }
                  }} 
                />
              </div>
              <Button onClick={editingIndex !== null ? handleConfirmEdit : handleAddPurchaseRecord}>
                {editingIndex !== null ? '保存编辑' : '添加购课记录'}
              </Button>
              {[
                {
                  date: new Date(course.purchaseDate).toLocaleDateString(),
                  hours: course.hours,
                  originalPrice: course.originalPrice,
                  currentPrice: course.currentPrice,
                  isInitial: true
                },
                ...purchaseRecords
              ].length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>购课时间</TableHead>
                      <TableHead>购课课时</TableHead>
                      <TableHead>购课原价</TableHead>
                      <TableHead>购课现价</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        date: new Date(course.purchaseDate).toLocaleDateString(),
                        hours: course.hours,
                        originalPrice: course.originalPrice,
                        currentPrice: course.currentPrice,
                        isInitial: true
                      },
                      ...purchaseRecords
                    ].map((record, index) => (
                      <TableRow key={index} className={editingIndex === index ? "bg-muted" : record.isInitial ? "bg-gray-100" : ""}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.hours}</TableCell>
                        <TableCell>{record.originalPrice}</TableCell>
                        <TableCell>{record.currentPrice}</TableCell>
                        <TableCell>
                          {record.isInitial ? (
                            <span className="text-sm text-gray-500">初始购课信息</span>
                          ) : (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="mr-2" 
                                onClick={() => handleEditRecord(index - 1)}
                                disabled={editingIndex === index - 1}
                              >
                                编辑
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => handleDeleteRecord(index - 1)}
                                disabled={editingIndex === index - 1}
                              >
                                删除
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>
          <TabsContent value="结算信息" className="mt-4">
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>累计结算金额: {calculateTotals().totalSettledAmount} 元</div>
                <div>累计消课课时: {calculateTotals().totalConsumedHours} 小时</div>
              </div>
              <div>
                <Label>结算月份</Label>
                <Input 
                  type="month" 
                  value={settlementMonth}
                  onChange={(e) => setSettlementMonth(e.target.value)}
                />
              </div>
              <div>
                <Label>结算金额</Label>
                <Input 
                  type="number"
                  value={settlementAmount}
                  onChange={(e) => setSettlementAmount(e.target.value)}
                />
              </div>
              <div>
                <Label>课时</Label>
                <Input 
                  type="number"
                  value={settlementHours}
                  onChange={(e) => setSettlementHours(e.target.value)}
                />
              </div>
              <Button onClick={editingSettlementIndex !== null ? handleConfirmSettlementEdit : handleAddSettlementRecord}>
                {editingSettlementIndex !== null ? '保存编辑' : '添加结算记录'}
              </Button>
              {settlementRecords.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>结算月份</TableHead>
                      <TableHead>结算金额</TableHead>
                      <TableHead>课时</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {settlementRecords.map((record, index) => (
                      <TableRow key={index} className={editingSettlementIndex === index ? "bg-muted" : ""}>
                        <TableCell>{record.month}</TableCell>
                        <TableCell>{record.amount}</TableCell>
                        <TableCell>{record.hours}</TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="mr-2" 
                            onClick={() => handleEditSettlementRecord(index)}
                            disabled={editingSettlementIndex === index}
                          >
                            编辑
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleDeleteSettlementRecord(index)}
                            disabled={editingSettlementIndex === index}
                          >
                            删除
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

