import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Activity } from '../types';

interface ActivityCardProps {
  activity: Activity;
  compact?: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, compact = false }) => {
  const formattedDate = new Date(activity.date_time).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isFull = (activity.current_participants_count || 1) >= activity.max_participants || activity.status === 'full';
  const isCancelled = activity.status === 'cancelled';
  const isCompleted = activity.status === 'completed';

  return (
    <article className={`group relative bg-[#131B2E] border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl flex flex-col h-full ${
      isCancelled
        ? 'border-rose-900/40 opacity-75'
        : isCompleted
        ? 'border-slate-800 opacity-80'
        : 'border-slate-800 hover:border-violet-500/50 hover:shadow-violet-900/20'
    }`}>

      {/* Image & Header Overlay */}
      <div className={`relative w-full ${compact ? 'h-36' : 'h-48'} overflow-hidden bg-slate-900`}>
        <img
          src={activity.image_url || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800'}
          alt={`Illustration pour ${activity.title}`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131B2E] via-slate-950/30 to-transparent" />

        {/* Category & Status Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          <span className="px-2.5 py-1 bg-violet-600/90 backdrop-blur-md text-white text-[11px] font-bold rounded-lg shadow-md uppercase tracking-wider">
            {activity.category}
          </span>

          {activity.is_spontaneous && !isCancelled && (
            <span className="px-2.5 py-1 bg-amber-500/90 backdrop-blur-md text-slate-950 text-[11px] font-extrabold rounded-lg shadow-md flex items-center gap-1 uppercase tracking-wider">
              <Zap className="w-3 h-3 fill-current" />
              Spontané
            </span>
          )}

          {isCancelled && (
            <span className="px-2.5 py-1 bg-rose-600 text-white text-[11px] font-extrabold rounded-lg shadow-md flex items-center gap-1 uppercase tracking-wider">
              <AlertCircle className="w-3 h-3" />
              Annulée
            </span>
          )}

          {isCompleted && (
            <span className="px-2.5 py-1 bg-slate-800 text-slate-300 text-[11px] font-extrabold rounded-lg shadow-md flex items-center gap-1 uppercase tracking-wider">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Terminée
            </span>
          )}
        </div>

        {/* Budget Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md border border-white/10 text-emerald-400 text-[11px] font-extrabold rounded-lg shadow-md">
            {activity.budget || 'Gratuit'}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Date & Time */}
          <div className="flex items-center gap-1.5 text-violet-300 text-xs font-semibold mb-1">
            <Calendar className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <time dateTime={activity.date_time}>{formattedDate}</time>
          </div>

          {/* Title */}
          <h3 className={`font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-2 ${compact ? 'text-sm' : 'text-base'}`}>
            {activity.title}
          </h3>

          {!compact && (
            <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
              {activity.description}
            </p>
          )}
        </div>

        {/* Meta Info & Organizer */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
          {/* Location & Participants */}
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="font-medium truncate max-w-[90px]">{activity.city}</span>
            </div>

            <div className={`flex items-center gap-1 font-semibold ${isFull ? 'text-amber-400' : 'text-slate-300'}`}>
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span>
                {activity.participants && activity.participants.length > 0 ? activity.participants.length : (activity.current_participants_count || 1)}/{activity.max_participants}
              </span>
            </div>
          </div>

          {/* Action Link */}
          <Link
            to={`/activity/${activity.id}`}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all shrink-0 ${
              isCancelled
                ? 'bg-slate-800 text-slate-400 border-slate-700'
                : isFull
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500 hover:text-slate-950'
                : 'bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white border-violet-500/30 hover:border-violet-500'
            }`}
          >
            {isCancelled ? 'Détails' : isFull ? 'Complet' : 'Voir'}
          </Link>
        </div>
      </div>
    </article>
  );
};
