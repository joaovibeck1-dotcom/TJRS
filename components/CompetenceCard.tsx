import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { CompetenciaData } from '../types';

interface CompetenceCardProps {
  item: CompetenciaData;
}

const CompetenceCard: React.FC<CompetenceCardProps> = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = item["Competências"].length > 150;
  const displayLimit = expanded ? item["Competências"].length : 150;
  const displayText = item["Competências"].substring(0, displayLimit) + (isLong && !expanded ? '...' : '');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded border border-slate-200">
          {item["Órgão Julgador"]}
        </span>
        {item["Grupos"] !== item["Órgão Julgador"] && (
          <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded border border-blue-100">
            {item["Grupos"]}
          </span>
        )}
      </div>

      <h3 className="text-gray-900 font-medium text-lg mb-2 leading-snug">
        {displayText}
      </h3>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 text-sm hover:underline font-medium mb-3 focus:outline-none"
        >
          {expanded ? "Ler menos" : "Ler mais"}
        </button>
      )}

      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center gap-1.5" title="Fundamentação Legal">
          <BookOpen className="w-4 h-4" />
          <span>{item["Art. RIT"]}</span>
        </div>
        <span className="text-xs text-gray-400">ID: {item.ID}</span>
      </div>

      {item["Observações"] && expanded && (
        <div className="mt-3 bg-yellow-50 p-3 rounded text-sm text-yellow-800 border border-yellow-100">
          <strong>Obs:</strong> {item["Observações"]}
        </div>
      )}
    </div>
  );
};

export default CompetenceCard;