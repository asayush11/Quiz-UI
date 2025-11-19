import React from 'react';
import { getAnswers, getMarked } from '../utils/sessionHelpers';

export default function QuestionPalette({ count, current, onJump, onClose }) {
  const answers = getAnswers();
  const marked = getMarked();

  const items = Array.from({ length: count }).map((_, i) => {
    const attempted = answers[i] != null;
    const isMarked = !!marked[i];
    let bg = 'bg-white';
    if (isMarked && attempted) bg = 'bg-blue-400 text-white'; // attempted + marked -> blue
    else if (isMarked && !attempted) bg = 'bg-red-400 text-white'; // not attempted + marked -> red
    else if (attempted) bg = 'bg-green-400 text-white'; // attempted

    return (
      <button
        key={i}
        onClick={() => { onJump(i); onClose && onClose(); }}
        className={`${bg} w-10 h-10 rounded-md flex items-center justify-center font-semibold shadow-sm hover:scale-105 transition-transform duration-150 ${current === i ? 'ring-2 ring-indigo-400' : ''}`}
        title={`Question ${i + 1}`}
      >
        {i + 1}
      </button>
    );
  });

  return (
    <div className="p-4 bg-white/95 rounded-xl shadow-xl border border-gray-200 max-w-md w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold">Question Palette</h3>
        <button onClick={onClose} className="text-sm text-gray-600 hover:text-gray-800">Close</button>
      </div>
      <div className="grid grid-cols-8 gap-2">{items}</div>
      <div className="mt-3 text-sm text-gray-600">
        <div><span className="inline-block w-3 h-3 bg-green-400 mr-2 align-middle rounded-sm"></span>Attempted</div>
        <div><span className="inline-block w-3 h-3 bg-white mr-2 align-middle rounded-sm border" style={{borderColor:'#e5e7eb'}}></span>Unattempted</div>
        <div><span className="inline-block w-3 h-3 bg-blue-400 mr-2 align-middle rounded-sm"></span>Attempted & Marked</div>
        <div><span className="inline-block w-3 h-3 bg-red-400 mr-2 align-middle rounded-sm"></span>Not attempted & Marked</div>
      </div>
    </div>
  );
}
