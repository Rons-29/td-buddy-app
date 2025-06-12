import { EnhancedCSVGenerator } from '../../components/csv/EnhancedCSVGenerator';

export default function CSVDetailedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full px-4 py-6 lg:px-8">
        <EnhancedCSVGenerator />
      </div>
    </div>
  );
}
