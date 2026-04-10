'use client';

import React, { useState } from 'react';
import ClientLayout from '@/components/layout/ClientLayout';
import Link from 'next/link';
import { Scale, ArrowRight, RotateCcw } from 'lucide-react';

export default function BMICalculatorPage() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  const calculateBMI = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w) return;

    let bmiVal: number;
    if (unit === 'metric') {
      bmiVal = w / ((h / 100) ** 2);
    } else {
      bmiVal = (w * 703) / (h ** 2);
    }
    setBmi(Math.round(bmiVal * 10) / 10);
  };

  const getCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500', bg: 'bg-blue-50', advice: 'You may need to gain weight. Consult a nutritionist for a healthy diet plan.' };
    if (bmi < 25) return { label: 'Normal Weight', color: 'text-success', bg: 'bg-green-50', advice: 'Great! You are in the healthy BMI range. Maintain your current lifestyle.' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-warning', bg: 'bg-amber-50', advice: 'Consider increasing physical activity and adjusting your diet to reach a healthier weight.' };
    return { label: 'Obese', color: 'text-error', bg: 'bg-red-50', advice: 'Consult a healthcare provider for a comprehensive weight management plan.' };
  };

  const getPointerPosition = (bmi: number) => {
    const min = 10, max = 40;
    return Math.min(Math.max(((bmi - min) / (max - min)) * 100, 0), 100);
  };

  const reset = () => { setHeight(''); setWeight(''); setBmi(null); };

  return (
    <ClientLayout>
      <div className="min-h-screen bg-surface/30 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center mx-auto mb-4">
              <Scale size={28} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">BMI Calculator</h1>
            <p className="text-text-muted">Quickly assess if your body weight is in the healthy range</p>
          </div>

          <div className="bg-white rounded-2xl border border-border/50 p-6 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {/* Unit toggle */}
            <div className="flex gap-2 mb-6">
              {(['metric', 'imperial'] as const).map(u => (
                <button key={u} onClick={() => setUnit(u)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    unit === u ? 'bg-primary text-white' : 'bg-surface text-text-muted hover:bg-surface-alt'
                  }`}>
                  {u === 'metric' ? 'Metric (cm/kg)' : 'Imperial (in/lbs)'}
                </button>
              ))}
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5">
                  Height ({unit === 'metric' ? 'cm' : 'inches'})
                </label>
                <input
                  type="number" value={height} onChange={e => setHeight(e.target.value)}
                  placeholder={unit === 'metric' ? '170' : '67'}
                  className="w-full px-4 py-3 border border-border rounded-xl outline-none text-lg font-semibold text-primary focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5">
                  Weight ({unit === 'metric' ? 'kg' : 'lbs'})
                </label>
                <input
                  type="number" value={weight} onChange={e => setWeight(e.target.value)}
                  placeholder={unit === 'metric' ? '70' : '154'}
                  className="w-full px-4 py-3 border border-border rounded-xl outline-none text-lg font-semibold text-primary focus:border-accent"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={calculateBMI} className="btn-primary flex-1 justify-center py-3 rounded-xl text-base">
                Calculate BMI
              </button>
              <button onClick={reset} className="p-3 bg-surface rounded-xl hover:bg-surface-alt transition-colors">
                <RotateCcw size={18} className="text-text-muted" />
              </button>
            </div>
          </div>

          {/* Result */}
          {bmi !== null && (
            <div className="mt-6 bg-white rounded-2xl border border-border/50 p-6 shadow-sm animate-fade-in-up">
              <div className="text-center mb-6">
                <p className="text-text-muted text-sm mb-1">Your BMI</p>
                <p className={`text-5xl font-bold ${getCategory(bmi).color}`}>{bmi}</p>
                <p className={`text-lg font-semibold mt-1 ${getCategory(bmi).color}`}>
                  {getCategory(bmi).label}
                </p>
              </div>

              {/* BMI Scale */}
              <div className="relative mb-6">
                <div className="flex h-4 rounded-full overflow-hidden">
                  <div className="bg-blue-400 flex-1" />
                  <div className="bg-green-400 flex-1" />
                  <div className="bg-amber-400 flex-1" />
                  <div className="bg-red-400 flex-1" />
                </div>
                <div className="absolute top-0 h-4" style={{ left: `${getPointerPosition(bmi)}%` }}>
                  <div className="w-1 h-6 bg-primary rounded-full -mt-1" />
                </div>
                <div className="flex justify-between mt-2 text-xs text-text-muted">
                  <span>Underweight<br />&lt;18.5</span>
                  <span className="text-center">Normal<br />18.5-24.9</span>
                  <span className="text-center">Overweight<br />25-29.9</span>
                  <span className="text-right">Obese<br />30+</span>
                </div>
              </div>

              {/* Advice */}
              <div className={`p-4 rounded-xl ${getCategory(bmi).bg} mb-4`}>
                <p className="text-sm text-primary">{getCategory(bmi).advice}</p>
              </div>

              {/* Recommended tests */}
              <div className="border-t border-border/50 pt-4">
                <h3 className="text-sm font-bold text-primary mb-3">Recommended Tests</h3>
                <div className="space-y-2">
                  {['Full Body Checkup', 'Vitamin D & B12', 'Thyroid Profile', 'Diabetes Screening'].map(test => (
                    <Link key={test} href="/search" className="flex items-center justify-between p-3 rounded-xl bg-surface/50 hover:bg-surface transition-colors">
                      <span className="text-sm font-medium text-primary">{test}</span>
                      <ArrowRight size={14} className="text-accent" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
