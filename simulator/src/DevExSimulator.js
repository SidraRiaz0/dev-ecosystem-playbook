import React, { useState } from 'react';
import auditData from './audit-questions.json';

const DevExSimulator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [monthlyVisits, setMonthlyVisits] = useState(1000);
  const [cac, setCac] = useState(10);

  const allQuestions = auditData.categories.flatMap(cat => 
    cat.questions.map(q => ({ ...q, categoryLabel: cat.label, categoryId: cat.id }))
  );

  const handleAnswer = (option) => {
    const newAnswers = [...answers, { ...option, weight: allQuestions[currentStep].revenue_leakage_weight, categoryId: allQuestions[currentStep].categoryId, categoryLabel: allQuestions[currentStep].categoryLabel }];
    setAnswers(newAnswers);

    if (currentStep < allQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setShowResults(true);
      }, 3000);
    }
  };

  const calculateFinalMetrics = () => {
    const totalScore = answers.reduce((acc, curr) => acc + curr.score_impact, 0);
    const maxScore = allQuestions.length * 10;
    const finalGrade = (totalScore / maxScore) * 100;
    const leakageFactor = answers.reduce((acc, curr) => acc + (10 - curr.score_impact) * curr.weight, 0);

    const totalBudget = monthlyVisits * cac;
    const wastedSpend = (leakageFactor * totalBudget * 0.12).toFixed(0);
    const supportCost = (leakageFactor * totalBudget * 0.06).toFixed(0);

    const categoryBreakdown = auditData.categories.map(cat => {
      const catAnswers = answers.filter(a => a.categoryId === cat.id);
      const catMax = catAnswers.length * 10;
      const catScore = catAnswers.reduce((acc, curr) => acc + curr.score_impact, 0);
      const catGrade = catMax > 0 ? (catScore / catMax) * 100 : 0;
      return {
        label: cat.label,
        grade: catGrade.toFixed(0),
        status: catGrade >= 70 ? 'STABLE' : catGrade >= 40 ? 'AT RISK' : 'LEAKING'
      };
    });

    return {
      score: finalGrade.toFixed(0),
      wastedSpend,
      supportCost,
      categoryBreakdown
    };
  };

  // 0. BASELINE INPUT STATE
  if (!hasStarted) {
    return (
      <div className="bg-black text-green-500 font-mono p-8 rounded-lg border border-green-900 shadow-2xl max-w-2xl mx-auto">
        <div className="mb-4 text-xs opacity-50 border-b border-green-900 pb-2">
          SIDRA_OS v1.0.4 // CONFIGURE_BASELINE
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Set Your Baseline Metrics</h2>
        <p className="text-xs opacity-50 mb-8">These values calibrate the financial output to your actual business context.</p>

        <div className="space-y-6 mb-8">
          <div>
            <label className="text-xs uppercase opacity-70 block mb-2">Monthly Developer Visits</label>
            <input
              type="number"
              value={monthlyVisits}
              onChange={e => setMonthlyVisits(Number(e.target.value))}
              className="w-full bg-black border border-green-900 text-white p-3 font-mono focus:outline-none focus:border-green-400"
            />
          </div>
          <div>
            <label className="text-xs uppercase opacity-70 block mb-2">Customer Acquisition Cost (CAC) per Developer ($)</label>
            <input
              type="number"
              value={cac}
              onChange={e => setCac(Number(e.target.value))}
              className="w-full bg-black border border-green-900 text-white p-3 font-mono focus:outline-none focus:border-green-400"
            />
          </div>
          <p className="text-xs opacity-30">
            Estimated monthly budget: ${(monthlyVisits * cac).toLocaleString()}
          </p>
        </div>

        <button
          onClick={() => setHasStarted(true)}
          className="w-full border border-green-500 py-3 hover:bg-green-500 hover:text-black font-bold transition-all uppercase text-sm tracking-widest"
        >
          Initialize Audit
        </button>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="bg-black text-green-500 font-mono p-8 rounded-lg border border-green-900 shadow-2xl max-w-2xl mx-auto">
        <div className="space-y-4 animate-pulse">
          <p className="text-blue-400">>> INITIALIZING SIDRA_ANALYTICS_ENGINE...</p>
          <p>>> CROSS-REFERENCING APAC/US MARKET BENCHMARKS...</p>
          <p>>> ANALYZING 5-POINT FRICTION VECTORS...</p>
          <p>>> CALCULATING CONVERSION DECAY & SUPPORT OVERHEAD...</p>
          <div className="mt-6 h-2 w-full bg-green-900 rounded-full overflow-hidden">
            <div className="h-full bg-green-500"></div>
          </div>
          <p className="text-xs text-center opacity-50 italic">Compiling Business Impact Report...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const metrics = calculateFinalMetrics();
    return (
      <div className="bg-black text-green-500 font-mono p-8 rounded-lg border border-green-900 shadow-2xl max-w-2xl mx-auto">
        <div className="mb-4 text-xs opacity-50 border-b border-green-900 pb-2 flex justify-between">
          <span>SIDRA_OS v1.0.4 // AUDIT_COMPLETE</span>
          <span className="text-blue-400">SECURE_REPORT</span>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-white underline decoration-green-900">EXECUTIVE IMPACT SUMMARY</h2>

        <div className="grid grid-cols-1 gap-6 mb-8">
          <div className="border border-green-900 p-4 bg-green-950/20">
            <p className="text-xs uppercase opacity-70">DevEx Readiness Score</p>
            <p className="text-4xl font-bold text-white">{metrics.score}%</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-green-900 p-4">
              <p className="text-[10px] uppercase opacity-70">Annual Marketing Leakage</p>
              <p className="text-xl font-bold text-red-400">${(metrics.wastedSpend * 12).toLocaleString()}</p>
            </div>
            <div className="border border-green-900 p-4">
              <p className="text-[10px] uppercase opacity-70">Annual Support OpEx</p>
              <p className="text-xl font-bold text-red-400">${(metrics.supportCost * 12).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-green-900 pt-4 mb-8">
          <p className="text-xs uppercase text-blue-400 mb-3">Impact Breakdown by Category:</p>
          <div className="space-y-2">
            {metrics.categoryBreakdown.map(cat => (
              <div key={cat.label} className="flex justify-between text-xs">
                <span className="opacity-70">{cat.label}</span>
                <span className={cat.status === 'STABLE' ? 'text-green-400' : cat.status === 'AT RISK' ? 'text-yellow-400' : 'text-red-400'}>
                  {cat.status} ({cat.grade}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs opacity-30 border-t border-green-900 pt-4 mb-4">
          Based on {monthlyVisits.toLocaleString()} visits/month at ${cac} CAC. Weights adjustable in audit-questions.json.
        </p>

        <button
          onClick={() => { setAnswers([]); setCurrentStep(0); setShowResults(false); setHasStarted(false); }}
          className="w-full border border-green-500 py-3 hover:bg-green-500 hover:text-black font-bold transition-all uppercase text-sm tracking-widest"
        >
          Initialize New Audit
        </button>
      </div>
    );
  }

  const activeQuestion = allQuestions[currentStep];
  return (
    <div className="bg-black text-green-500 font-mono p-8 rounded-lg border border-green-900 shadow-2xl max-w-2xl mx-auto">
      <div className="mb-4 text-xs opacity-50 border-b border-green-900 pb-2">
        SIDRA_OS v1.0.4 // SYSTEM_AUDIT_MODE // STEP {currentStep + 1} OF {allQuestions.length}
      </div>
      <div className="mb-8">
        <p className="text-blue-400 mb-1 text-xs tracking-widest">[{activeQuestion.categoryLabel.toUpperCase()}]</p>
        <h2 className="text-xl font-bold text-white leading-tight">{activeQuestion.text}</h2>
      </div>
      <div className="space-y-4">
        {activeQuestion.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(option)}
            className="w-full text-left p-4 border border-green-900 hover:border-green-400 hover:bg-green-950/50 transition-all group flex justify-between items-center"
          >
            <span className="text-sm font-medium">{idx + 1}. {option.label}</span>
            <span className="text-[10px] opacity-0 group-hover:opacity-100 bg-green-500 text-black px-1 font-bold">SELECT</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DevExSimulator;
