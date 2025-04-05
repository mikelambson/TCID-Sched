'use client';

import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { submitSchedule } from '@/services/schedule';
import { ScheduleRow } from '@/lib/types';

type RawRow = {
  [key: string]: string;
};

function excelDateToJSDate(serial: number): Date {
  const utc_days = serial - 25569;
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  return new Date(date_info.getTime() + date_info.getTimezoneOffset() * 60000);
}

export default function UploadSchedule() {
  const [parsedData, setParsedData] = useState<ScheduleRow[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  // Reset component state
  const resetComponent = useCallback(() => {
    setParsedData([]);
    setFileName(null);
    setDragActive(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear file input
    }
  }, []);

  const parseCSV = useCallback((file: File) => {
    Papa.parse<RawRow>(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      worker: true,
      complete: (results) => {
        const cleaned: ScheduleRow[] = results.data
          .map((row) => {
            const startRaw = row['START DATE | TIME'];
            const orderRaw = row['ORDER #'];
            if (!startRaw || !orderRaw) return null;

            // Clean district by removing everything after " - "
            const rawDistrict = row['DISTRICT'] || '';
            const district = rawDistrict.split(' - ')[0].trim();

            return {
              startTime: excelDateToJSDate(Number(startRaw)),
              mainLateral: String(row['MAIN LATERAL'] || '').trim(),
              cfs: Number(row['CFS'] || 0),
              orderNumber: Number(orderRaw),
              status: row['STATUS'] || '',
              district,
              lineHead: row['LINE / HEAD'] || '',
            };
          })
          .filter(Boolean) as ScheduleRow[];

        console.log('[Cleaned CSV Data]', cleaned);
        setParsedData(cleaned);
      },
    });
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      resetComponent(); // Reset before parsing new file
      setFileName(file.name);
      parseCSV(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      resetComponent(); // Reset before parsing new file
      setFileName(file.name);
      parseCSV(file);
    }
  };

  // React Query mutation for submitting data
  const { mutate, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: submitSchedule,
    onSuccess: (data) => {
      console.log('Schedule submitted successfully:', data);
      resetComponent(); // Reset after successful submission
    },
    onError: (err) => {
      console.error('Submission failed:', err);
    },
  });

  return (
    <Card className="w-full max-w-xl mx-auto my-6 p-4">
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">Upload Schedule CSV</h2>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'w-full border-2 border-dashed rounded-md p-2 text-center transition-colors cursor-pointer',
            dragActive ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300 hover:border-gray-400'
          )}
        >
          <p className="text-sm font-medium">
            Drag & drop your CSV file here, or{' '}
            <span className="text-blue-600 underline">click to browse</span>
          </p>
          {fileName && <p className="text-lg text-muted-foreground mt-2">Selected: {fileName}</p>}
          <Input
            type="file"
            id="csv-upload"
            ref={fileInputRef}
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        <div className="mt-4">
          {parsedData.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {parsedData.length} valid rows parsed:
              </p>
              <pre className="bg-muted p-2 rounded text-xs max-h-64 overflow-auto">
                {JSON.stringify(parsedData, null, 2)}
              </pre>
            </div>
          )}
          {isSuccess && (
            <p className="text-sm text-green-600 mt-2">Schedule submitted successfully!</p>
          )}
          {isError && (
            <p className="text-sm text-red-600 mt-2">
              Failed to submit: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          )}
        </div>
        <CardFooter className="flex justify-end">
          <Button
            size="sm"
            className="mt-4"
            disabled={parsedData.length === 0 || isPending}
            onClick={() => mutate(parsedData)}
          >
            {isPending ? 'Submitting...' : 'Submit Schedule'}
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
                Note: Ensure the CSV file is formatted correctly. The first row should contain
                headers: <br />
                <code>START DATE | TIME, MAIN LATERAL, CFS, ORDER #, STATUS, DISTRICT, LINE / HEAD</code>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Note: The date format is Excel serial date format. The time is in hours since
                1900-01-01.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}