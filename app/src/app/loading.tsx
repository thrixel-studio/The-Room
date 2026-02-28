import ContentSpinner from '@/shared/components/ContentSpinner';

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full min-h-[200px]">
      <ContentSpinner size="md" />
    </div>
  );
}
