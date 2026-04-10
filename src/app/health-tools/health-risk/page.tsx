'use client';

import React, { useState } from 'react';
import ClientLayout from '@/components/layout/ClientLayout';
import Link from 'next/link';
import { ClipboardCheck, ArrowRight, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

const questions = [
  { id: 'age', question: 'What is your age group?', options: ['Under 30', '30-45', '45-60', 'Above 60'] },
  { id: 'exercise', question: 'How often do you exercise?', options: ['Daily', '3-4 times/week', 'Occasional', 'Rarely/Never'] },
  { id: 'diet', question: 'How would you describe your diet?', options: ['Balanced & healthy', 'Moderate', 'High in processed food', 'Irregular meals'] },
  { id: 'smoking', question: 'Do you smoke or use tobacco?', options: ['Never', 'Quit', 'Occasionally', 'Regularly'] },
  { id: 'family', question: 'Family history of chronic diseases?', options: ['No history', 'Diabetes', 'Heart disease', 'Multiple conditions'] },
  { id: 'sleep', question: 'How many hours do you sleep daily?', options: ['7-8 hours', '6-7 hours', '5-6 hours', 'Less than 5'] },
  { id: 'stress', question: 'How stressed do you feel daily?', options: ['Rarely stressed', 'Sometimes', 'Often', 'Constantly'] },
  { id: 'checkup', question: 'When was your last health checkup?', options: ['Within 6 months', '6-12 months ago', '1-2 years ago', 'More than 2 years'] },
];

export default function HealthRiskPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (questionId: string, optionIndex: number) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const totalScore = Object.values(answers).reduce((sum, v) => sum + v, 0);
  const maxScore = questions.length * 3;
  const riskPercentage = Math.round((totalScore / maxScore) * 100);

  const getRisk = () => {
    if (riskPercentage < 25) return { level: 'Low', color: 'text-success', bg: 'bg-green-50', icon: CheckCircle, desc: 'Your health risk appears to be low. Keep up your healthy lifestyle!' };
    if (riskPercentage < 50) return { level: 'Moderate', color: 'text-warning', bg: 'bg-amber-50', icon: AlertTriangle, desc: 'You have some risk factors. Consider preventive health checkups.' };
    if (riskPercentage < 75) return { level: 'High', color: 'text-orange-500', bg: 'bg-orange-50', icon: AlertTriangle, desc: 'Multiple risk factors detected. We recommend a comprehensive health checkup.' };
    return { level: 'Very High', color: 'text-error', bg: 'bg-red-50', icon: AlertCircle, desc: 'Significant risk factors found. Please consult a healthcare provider immediately.' };
  };

  const recommendedTests = riskPercentage < 25
    ? ['Basic Health Checkup', 'Vitamin Profile']
    : riskPercentage < 50
    ? ['Full Body Checkup', 'Diabetes Screening', 'Thyroid Profile']
    : ['Annual Full Body Checkup - Advance', 'Heart Health Checkup', 'Diabetes Screening', 'Liver & Kidney Function'];

  const allAnswered = Object.keys(answers).length === questions.length;

  return (
    <ClientLayout>
      <div className="min-h-screen bg-surface/30 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center mx-auto mb-4">
              <ClipboardCheck size={28} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">Health Risk Assessment</h1>
            <p className="text-text-muted">Answer 8 quick questions to understand your health risk level</p>
          </div>

          {!submitted ? (
            <div className="space-y-4">
              {questions.map((q, qi) => (
                <div key={q.id} className="bg-white rounded-2xl border border-border/50 p-5 animate-fade-in-up" style={{ animationDelay: `${qi * 0.05}s` }}>
                  <h3 className="text-sm font-bold text-primary mb-3">
                    <span className="text-accent mr-2">Q{qi + 1}.</span>
                    {q.question}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt, oi) => (
                      <button
                        key={opt}
                        onClick={() => handleAnswer(q.id, oi)}
                        className={`p-3 rounded-xl text-sm text-left transition-all border-2 ${
                          answers[q.id] === oi
                            ? 'border-accent bg-accent/5 text-accent font-semibold'
                            : 'border-transparent bg-surface hover:bg-surface-alt text-text-muted'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={() => setSubmitted(true)}
                disabled={!allAnswered}
                className="btn-primary w-full justify-center py-3.5 rounded-xl text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Get My Risk Assessment <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-border/50 p-6 shadow-sm animate-fade-in-up">
              {/* Risk result */}
              <div className="text-center mb-6">
                {React.createElement(getRisk().icon, { size: 48, className: `mx-auto mb-3 ${getRisk().color}` })}
                <p className="text-text-muted text-sm mb-1">Your Health Risk Level</p>
                <p className={`text-4xl font-bold ${getRisk().color}`}>{getRisk().level}</p>
                <p className="text-text-muted text-sm mt-1">Score: {riskPercentage}%</p>
              </div>

              {/* Risk bar */}
              <div className="relative mb-6">
                <div className="h-3 rounded-full bg-surface overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      riskPercentage < 25 ? 'bg-success' :
                      riskPercentage < 50 ? 'bg-warning' :
                      riskPercentage < 75 ? 'bg-orange-500' : 'bg-error'
                    }`}
                    style={{ width: `${riskPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-text-muted">
                  <span>Low</span><span>Moderate</span><span>High</span><span>Very High</span>
                </div>
              </div>

              <div className={`p-4 rounded-xl ${getRisk().bg} mb-6`}>
                <p className="text-sm text-primary">{getRisk().desc}</p>
              </div>

              {/* Recommended tests */}
              <h3 className="text-sm font-bold text-primary mb-3">Recommended Health Tests</h3>
              <div className="space-y-2 mb-6">
                {recommendedTests.map(test => (
                  <Link key={test} href="/search" className="flex items-center justify-between p-3 rounded-xl bg-surface/50 hover:bg-surface transition-colors">
                    <span className="text-sm font-medium text-primary">{test}</span>
                    <ArrowRight size={14} className="text-accent" />
                  </Link>
                ))}
              </div>

              <div className="flex gap-3">
                <Link href="/search" className="btn-primary flex-1 justify-center py-3 rounded-xl">
                  Book Recommended Tests
                </Link>
                <button onClick={() => { setSubmitted(false); setAnswers({}); }} className="btn-secondary flex-1 justify-center py-3 rounded-xl">
                  Retake Assessment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
