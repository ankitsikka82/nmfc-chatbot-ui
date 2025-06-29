import { useState } from 'react';

const qaFlow = [
  {
    field: "material",
    question: "What material are the bottles made of?",
    options: ["glass", "plastic", "aluminum", "steel", "other"]
  },
  {
    field: "volume_per_unit",
    question: "What is the size or volume of each bottle?",
    type: "free_text"
  },
  {
    field: "filled",
    question: "Are they empty or filled?",
    options: ["empty", "filled"]
  },
  {
    field: "contents",
    question: "If filled, what is the content?",
    type: "free_text",
    conditional_on: { filled: "filled" }
  },
  {
    field: "packaging",
    question: "How are they packaged?",
    options: ["boxed", "palletized", "shrink-wrapped", "loose"]
  },
  {
    field: "fragile",
    question: "Are they fragile or require special handling?",
    options: ["yes", "no"]
  },
  {
    field: "total_weight",
    question: "What is the total weight of the shipment?",
    type: "free_text"
  },
  {
    field: "dimensions",
    question: "What are the total dimensions (LxWxH)?",
    type: "free_text"
  }
];

export default function NMFCChat() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const current = qaFlow[step];
  const shouldSkip = current?.conditional_on &&
    Object.entries(current.conditional_on).some(
      ([key, val]) => answers[key] !== val
    );

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [current.field]: value });
    nextStep();
  };

  if (step >= qaFlow.length) {
    return (
      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-xl font-bold mb-4">Summary</h2>
        <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(answers, null, 2)}</pre>
      </div>
    );
  }

  if (shouldSkip) {
    nextStep();
    return null;
  }

  return (
    <div className="bg-white shadow-md rounded p-6">
      <h2 className="text-lg font-semibold mb-4">{current.question}</h2>
      {current.options ? (
        <div className="space-y-2">
          {current.options.map(option => (
            <button
              key={option}
              className="block w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              onClick={() => handleAnswer(option)}
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Type your answer..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAnswer(e.target.value);
          }}
          autoFocus
        />
      )}
    </div>
  );
}
