"use client";
import React, { useMemo } from "react";
import { useGetEntriesByDateRangeQuery } from '@/features/journal/api/journal.endpoints';
import { Check } from 'lucide-react';
import { SkeletonBase } from '@/shared/ui/skeletons/SkeletonBase';

const MonthlyTarget = React.memo(function MonthlyTarget() {
  // Calculate current week days (Monday to Sunday)
  const weekDays = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // Get to Monday

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + mondayOffset + i);
      days.push({
        date: date,
        dateStr: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
        isToday: date.toDateString() === today.toDateString()
      });
    }
    return days;
  }, []);

  const firstDay = weekDays[0].dateStr;
  const lastDay = weekDays[6].dateStr;

  // RTK Query for entries in the current week
  const { data: weekEntriesData, isLoading } = useGetEntriesByDateRangeQuery(
    { from_date: firstDay, to_date: lastDay, status: 'FINAL', page_size: 50 },
    {
      selectFromResult: ({ data, isLoading }) => ({ data, isLoading }),
    }
  );

  // Create a set of dates that have entries (client-side, same pattern as Calendar)
  const datesWithEntries = useMemo(() => {
    if (!weekEntriesData?.items) return new Set<string>();
    const dateSet = new Set<string>();
    weekEntriesData.items.forEach(entry => {
      dateSet.add(entry.entry_date);
    });
    return dateSet;
  }, [weekEntriesData]);

  // Use local timezone date string to match how the backend stores entry_date
  const todayLocalStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  const hasWrittenToday = datesWithEntries.has(todayLocalStr);

  return (
    <div className="bg-[var(--app-bg-secondary-color)] shadow-sm rounded-2xl">
      <div className="p-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <h3 className="text-sm font-semibold text-white/90">
              Journaling Progress
            </h3>
            <p className="mt-0.5 font-normal text-xs text-gray-400">
              Track your progress and keep consistency.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-px h-full bg-white/10"></div>
            <div className="flex flex-col items-center flex-1">
              <p className="mb-1 text-xs text-gray-400">
                Status
              </p>
              {isLoading ? (
                <div style={{ width: '75px', height: '20px' }}>
                  <SkeletonBase width="w-full" height="h-full" rounded="full" />
                </div>
              ) : (
                <span
                  className={`inline-flex items-center px-2 py-0.5 justify-center gap-1 rounded-full font-medium text-xs ${
                    hasWrittenToday
                      ? 'bg-[var(--app-accent-secondary-color)] text-white'
                      : 'bg-[var(--app-accent-color)] text-white'
                  }`}
                >
                  {hasWrittenToday ? 'Completed' : 'Awaiting'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4">
        <div className="border-t border-white/10"></div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center gap-1">
          {weekDays.map((day) => {
            const hasEntry = datesWithEntries.has(day.dateStr);
            return (
              <div key={day.dateStr} className="flex flex-col items-center gap-1">
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                  hasEntry
                    ? 'text-[var(--app-accent-secondary-color)]'
                    : 'text-white'
                }`}>
                  {hasEntry ? (
                    <Check className="w-4 h-4" strokeWidth={3} />
                  ) : (
                    <span className="text-sm font-medium">{day.dayNumber}</span>
                  )}
                </div>
                <span className="text-xs text-[var(--app-text-secondary-color)]">
                  {day.dayName}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

MonthlyTarget.displayName = 'MonthlyTarget';

export default MonthlyTarget;
