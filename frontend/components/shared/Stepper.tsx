import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Step {
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number; // индекс текущего шага (0-based)
  className?: string;
}

// Stepper — компонент прогресса многошаговой формы записи
// Показывает: завершённые шаги (галочка), текущий (выделен), будущие (серые)
export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn('flex items-center', className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div key={index} className="flex items-center flex-1">
            {/* Круглый индикатор шага */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200',
                  isCompleted && 'bg-primary text-primary-foreground',
                  isCurrent && 'bg-primary text-primary-foreground ring-4 ring-primary/20',
                  !isCompleted && !isCurrent && 'bg-muted text-muted-foreground',
                )}
              >
                {/* Завершённые шаги показывают галочку, текущий и будущие — номер */}
                {isCompleted ? <Check className="w-4 h-4" /> : <span>{index + 1}</span>}
              </div>

              {/* Подпись под шагом (только на десктопе) */}
              <span
                className={cn(
                  'mt-1 text-xs text-center hidden sm:block max-w-[80px]',
                  isCurrent ? 'text-primary font-medium' : 'text-muted-foreground',
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Линия-соединитель между шагами (кроме последнего) */}
            {!isLast && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2 transition-all duration-200',
                  isCompleted ? 'bg-primary' : 'bg-muted',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
