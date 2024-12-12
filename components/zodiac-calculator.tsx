"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format, parse, isValid } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const zodiacSigns = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"]
const zodiacEmojis = ["🐭", "🐂", "🐯", "🐰", "🐲", "🐍", "🐴", "🐑", "🐵", "🐔", "🐶", "🐷"]

export default function ZodiacCalculator() {
  const [inputType, setInputType] = useState<'birthdate' | 'age'>('birthdate')
  const [birthDateString, setBirthDateString] = useState<string>('')
  const [age, setAge] = useState<string>('')
  const [zodiac, setZodiac] = useState<string | null>(null)
  const [zodiacEmoji, setZodiacEmoji] = useState<string | null>(null)

  const handleBirthDateChange = (value: string) => {
    setBirthDateString(value)
  }

  const calculateZodiac = () => {
    let birthDate: Date | null = null;
    if (inputType === 'birthdate') {
      birthDate = parse(birthDateString, 'yyyy-MM-dd', new Date())
      if (!isValid(birthDate)) {
        setZodiac("请输入有效的出生日期")
        setZodiacEmoji(null)
        return
      }
    } else {
      const ageNum = parseInt(age)
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
        setZodiac("请输入有效的年龄")
        setZodiacEmoji(null)
        return
      }
      const currentYear = new Date().getFullYear()
      birthDate = new Date(currentYear - ageNum, 0, 1)
    }

    // 简化的农历年份计算（实际应用中应使用更准确的农历转换库）
    const lunarYear = birthDate.getMonth() < 1 || (birthDate.getMonth() === 1 && birthDate.getDate() < 20)
      ? birthDate.getFullYear() - 1
      : birthDate.getFullYear()

    const zodiacIndex = (lunarYear - 4) % 12
    setZodiac(zodiacSigns[zodiacIndex])
    setZodiacEmoji(zodiacEmojis[zodiacIndex])
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-lg rounded-3xl border-0">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">生肖计算器</h1>
          <div className="space-y-6">
            <RadioGroup defaultValue="birthdate" onValueChange={(value) => setInputType(value as 'birthdate' | 'age')} className="flex justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="birthdate" id="birthdate" />
                <Label htmlFor="birthdate">输入出生日期</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="age" id="age" />
                <Label htmlFor="age">输入年龄</Label>
              </div>
            </RadioGroup>
            
            {inputType === 'birthdate' ? (
              <div className="flex flex-col space-y-2">
                <Label htmlFor="birthdate">出生日期</Label>
                <div className="flex space-x-2">
                  <Input
                    type="date"
                    id="birthdate"
                    value={birthDateString}
                    onChange={(e) => handleBirthDateChange(e.target.value)}
                    className="flex-grow"
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="px-3">
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={birthDateString ? parse(birthDateString, 'yyyy-MM-dd', new Date()) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            setBirthDateString(format(date, 'yyyy-MM-dd'))
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Label htmlFor="ageInput">年龄</Label>
                <Input
                  id="ageInput"
                  type="number"
                  placeholder="输入年龄"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full"
                />
              </div>
            )}
            
            <Button 
              onClick={calculateZodiac} 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition duration-200 ease-in-out transform hover:scale-105"
            >
              计算生肖
            </Button>
            
            {zodiac && (
              <div className="text-center mt-8 bg-blue-50 rounded-2xl p-6 shadow-inner">
                <p className="text-xl text-gray-800">
                  {inputType === 'birthdate' 
                    ? `${birthDateString}出生` 
                    : `${age}岁`}的生肖是：
                </p>
                <div className="flex items-center justify-center space-x-4 mt-4">
                  <span className="text-6xl">{zodiacEmoji}</span>
                  <span className="font-bold text-4xl text-blue-600">{zodiac}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

