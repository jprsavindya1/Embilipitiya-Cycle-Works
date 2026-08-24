import React from 'react';
import { ShoppingCart, UserCheck, CreditCard, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface CheckoutStepperProps {
  currentStep: number; // 1: Cart, 2: Checkout, 3: Payment/Complete
}

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const steps = [
    { num: 1, title: 'Cart', icon: ShoppingCart, link: '/cart' },
    { num: 2, title: 'Checkout', icon: UserCheck, link: '/checkout' },
    { num: 3, title: 'Complete', icon: CheckCircle, link: '#' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <div className="relative flex justify-between items-center">
        {/* Connecting Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full z-0"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[var(--color-brand-primary)] rounded-full z-0 transition-all duration-500 ease-in-out"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        {/* Steps */}
        {steps.map((step, idx) => {
          const isActive = currentStep === step.num;
          const isCompleted = currentStep > step.num;
          const Icon = step.icon;

          return (
            <div key={step.num} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300
                  ${isActive ? 'bg-[var(--color-brand-primary)] border-white dark:border-zinc-950 text-white shadow-md scale-110' : ''}
                  ${isCompleted ? 'bg-[var(--color-brand-primary)] border-white dark:border-zinc-950 text-white' : ''}
                  ${!isActive && !isCompleted ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-400' : ''}
                `}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className={`absolute -bottom-7 text-xs font-bold whitespace-nowrap transition-colors
                ${isActive || isCompleted ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}
              `}>
                {step.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
