"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { entriesApi, EntryDetail } from "@/shared/lib/entries";
import { tokenStorage } from "@/shared/lib/storage";
import { queryKeys } from "@/shared/lib/query-keys";

export default function JournalCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get first and last day of current month for API query
  const { firstDay, lastDay } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    return {
      firstDay: first.toISOString().split('T')[0],
      lastDay: last.toISOString().split('T')[0]
    };
  }, [currentDate]);

  // Fetch entries for the current month
  const { data: entriesData } = useQuery({
    queryKey: queryKeys.entries.calendar(firstDay, lastDay),
    queryFn: async () => {
      const accessToken = tokenStorage.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token');
      }
      return entriesApi.getEntries(accessToken, {
        status: 'FINAL',
        from_date: firstDay,
        to_date: lastDay,
        page_size: 50 // Get all entries for the month
      });
    },
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
  });

  // Create a set of dates that have entries
  const datesWithEntries = useMemo(() => {
    if (!entriesData?.items) return new Set<string>();
    
    const dateSet = new Set<string>();
    entriesData.items.forEach((entry: EntryDetail) => {
      dateSet.add(entry.entry_date);
    });
    return dateSet;
  }, [entriesData]);

  // Get calendar data
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get first day of month and its day of week
    const firstDay = new Date(year, month, 1);
    let firstDayOfWeek = firstDay.getDay(); // 0 = Sunday
    // Convert to Monday = 0, Sunday = 6
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    // Get last day of month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Get today's date string in local timezone
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Create array of day objects
    const days = [];

    // Add empty slots for days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      // Format date string in local timezone to avoid timezone conversion issues
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        day,
        date,
        dateStr,
        hasEntry: datesWithEntries.has(dateStr),
        isToday: dateStr === todayStr
      });
    }

    return days;
  }, [currentDate, datesWithEntries]);

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  return (
    <div className="h-full flex flex-col rounded-2xl bg-[var(--app-bg-secondary-color)] shadow-sm">
      {/* Header */}
      <div className="px-5 pt-5 sm:px-6 sm:pt-6 pb-5 sm:pb-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800 text-white/90">
            Calendar
          </h3>
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => changeMonth(-1)}
            className="p-1 rounded hover:bg-gray-100 hover:bg-gray-800 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 text-gray-400" />
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-600 text-gray-400">
            <span>{monthName}</span>
          </div>
          <button
            onClick={() => changeMonth(1)}
            className="p-1 rounded hover:bg-gray-100 hover:bg-gray-800 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="px-5 sm:px-6 flex-shrink-0">
        <div className="border-t border-gray-200/50 border-white/10"></div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 p-5 sm:p-6">
        {/* Day labels */}
        <div className="grid grid-cols-7 mb-3">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
            <div key={i} className="text-center text-sm font-medium text-gray-500 text-gray-400 p-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {calendarData.map((dayData, index) => (
            <div key={index} className="aspect-square p-1">
              {dayData ? (
                <div
                  className={`w-full h-full flex items-center justify-center text-sm transition-colors ${
                    dayData.isToday
                      ? 'rounded-xl bg-brand-500 text-white font-semibold'
                      : dayData.hasEntry
                      ? 'rounded-xl bg-gray-600 text-white'
                      : 'text-gray-400'
                  }`}
                >
                  {dayData.day}
                </div>
              ) : (
                <div></div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
