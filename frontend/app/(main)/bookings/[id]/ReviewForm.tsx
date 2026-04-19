'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

interface ReviewFormProps {
  bookingId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

// ReviewForm — форма написания отзыва на завершённую запись
// Только для статуса COMPLETED, одна запись на один booking (раздел 8.5 ТЗ)
export default function ReviewForm({ bookingId, onSuccess, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Выберите оценку');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/reviews', { bookingId, rating, comment: comment.trim() || undefined });
      toast.success('Отзыв опубликован!');
      onSuccess();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Не удалось оставить отзыв');
    } finally {
      setSubmitting(false);
    }
  };

  const displayRating = hoveredRating || rating;

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-4 space-y-4">
      <h3 className="font-semibold text-foreground">Ваш отзыв</h3>

      {/* Звёздная оценка */}
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onMouseEnter={() => setHoveredRating(i + 1)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => setRating(i + 1)}
            className="text-2xl transition-colors"
          >
            <span className={i < displayRating ? 'text-yellow-400' : 'text-muted-foreground/30'}>
              ★
            </span>
          </button>
        ))}
      </div>

      {/* Комментарий */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Расскажите о вашем опыте..."
        rows={3}
        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:border-primary focus:outline-none resize-none"
      />

      <div className="flex gap-2">
        <Button type="submit" disabled={submitting || rating === 0}>
          {submitting ? 'Публикуем...' : 'Опубликовать'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  );
}
