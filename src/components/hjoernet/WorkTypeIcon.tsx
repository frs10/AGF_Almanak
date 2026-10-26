import { WorkType } from '@/lib/supabase'
import {
  BookOpen,
  AlignLeft,
  Music,
  FileText,
  Mail,
  Circle,
} from 'lucide-react'

const icons: Record<WorkType, React.ElementType> = {
  bog: BookOpen,
  digt: AlignLeft,
  sang: Music,
  essay: FileText,
  brev: Mail,
  andet: Circle,
}

const labels: Record<WorkType, string> = {
  bog: 'Bog',
  digt: 'Digt',
  sang: 'Sang',
  essay: 'Essay/artikel',
  brev: 'Besked/brev',
  andet: 'Andet',
}

export default function WorkTypeIcon({
  type,
  size = 16,
}: {
  type: WorkType
  size?: number
}) {
  const Icon = icons[type] ?? Circle
  return (
    <span
      className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white/70 flex-shrink-0"
      role="img"
      aria-label={labels[type]}
    >
      <Icon size={size} strokeWidth={1.5} aria-hidden="true" />
    </span>
  )
}
