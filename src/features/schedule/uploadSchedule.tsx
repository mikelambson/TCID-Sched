'use client'

import { useState, useRef } from 'react'
import Papa from 'papaparse'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useCallback } from 'react'
import { cn } from '@/lib/utils'

type RawRow = {
  [key: string]: string
}

type ScheduleRow = {
  startTime: Date
  mainLateral: string
  cfs: number
  orderNumber: number
  status: string
  district: string
  lineHead: string
}

function excelDateToJSDate(serial: number): Date {
  const utc_days = serial - 25569
  const utc_value = utc_days * 86400
  const date_info = new Date(utc_value * 1000)
  return new Date(date_info.getTime() + date_info.getTimezoneOffset() * 60000) // adjust for TZ offset
}


export default function UploadSchedule() {
    const [parsedData, setParsedData] = useState<ScheduleRow[]>([])
    const [dragActive, setDragActive] = useState(false)
    const [showInfo, setShowInfo] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [fileName, setFileName] = useState<string | null>(null)


    const parseCSV = useCallback((file: File) => {
        Papa.parse<RawRow>(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        worker: true,
        complete: (results) => {
            const cleaned: ScheduleRow[] = results.data
            .map((row) => {
                const startRaw = row['START DATE | TIME']
                const orderRaw = row['ORDER #']
                if (!startRaw || !orderRaw) return null

                return {
                startTime: excelDateToJSDate(Number(startRaw)),
                mainLateral: (row['MAIN LATERAL'] || '').trim(),
                cfs: Number(row['CFS'] || 0),
                orderNumber: Number(orderRaw),
                status: row['STATUS'] || '',
                district: row['DISTRICT'] || '',
                lineHead: row['LINE / HEAD'] || '',
                }
            })
            .filter(Boolean) as ScheduleRow[]

            console.log('[Cleaned CSV Data]', cleaned)
            setParsedData(cleaned)
        },
        })
    }, [])

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) parseCSV(file)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setDragActive(false)
        const file = e.dataTransfer.files?.[0]
        if (file) parseCSV(file)
    }

    

    
    return (
        <Card className="w-full max-w-xl mx-auto my-6 p-4">
        <CardContent>
            <h2 className="text-xl font-semibold mb-4">Upload Schedule CSV</h2>

            {/* <Input type="file" accept=".csv" onChange={handleFileUpload} /> */}
            {/* Drop Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                    e.preventDefault()
                    setDragActive(true)
                }}
                onDragLeave={() => setDragActive(false)}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                    'w-full border-2 border-dashed rounded-md p-2 text-center transition-colors cursor-pointer',
                    dragActive
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-300 hover:border-gray-400'
                )}
                >
                <p className="text-sm font-medium">
                    Drag & drop your CSV file here, or{' '}
                    <span className="text-blue-600 underline">click to browse</span>
                </p>
                {fileName && (
                    <p className="text-lg text-muted-foreground mt-2">Selected: {fileName}</p>
                )}
                <Input
                    type="file"
                    id="csv-upload"
                    ref={fileInputRef}
                    accept=".csv"
                    onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                        setFileName(file.name)
                        parseCSV(file)
                    }
                    }}
                    className="hidden"
                />
            </div>

            {/* Result Preview */}
            <div className="mt-4">
            {parsedData.length > 0 && (
                <div>
                <p className="text-sm text-muted-foreground mb-2">
                    {parsedData.length} valid rows parsed:
                </p>
                <pre className="bg-muted p-2 rounded text-xs max-h-64 overflow-auto">
                    {JSON.stringify(parsedData, null, 2)} {/* Preview first 5 */}
                </pre>
                </div>
            )}
            </div>
            <CardFooter className="flex justify-end">
                <Button
                    size={'sm'}
                    className="mt-4"
                    onClick={() => {
                        // Handle the parsed data (e.g., send to server)
                        console.log('Parsed Data:', parsedData)
                    }}
                >
                    Submit Schedule
                </Button>
            </CardFooter>
            <div className="-mt-9">
                <Button
                    variant="link"
                    onClick={() => setShowInfo((prev) => !prev)}
                    className="text-sm hover:underline"
                >
                    {showInfo ? 'hide info' : 'more info'}
                </Button>
                {showInfo && (
                    <div className="mt-4 text-left">
                    <p className="text-sm text-muted-foreground">
                        Note: Ensure the CSV file is formatted correctly. The first row should
                        contain headers: <br />
                        <code>START DATE | TIME, MAIN LATERAL, CFS, ORDER #, STATUS, DISTRICT, LINE / HEAD</code>
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Note: The date format is Excel serial date format. The time is in hours since 1900-01-01.
                    </p>
                    </div>
                )}
            </div>

        </CardContent>
        </Card>
    )
}
// Removed conflicting local declaration of useCallback

