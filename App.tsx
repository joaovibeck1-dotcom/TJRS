import React, { useState, useMemo } from 'react';
import { Filter, Scale, Search, X, SearchX } from 'lucide-react';
import { RAW_DATA } from './constants';
import CompetenceCard from './components/CompetenceCard';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrgaos, setSelectedOrgaos] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Extract Unique Organs for Filter
  const allOrgaos = useMemo(() => {
    const unique = Array.from(new Set(RAW_DATA.map(i => i["Órgão Julgador"])));
    return unique.sort();
  }, []);

  // Filtering Logic
  const filteredData = useMemo(() => {
    return RAW_DATA.filter(item => {
      const matchesSearch = item["Competências"].toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item["ID"].toString().includes(searchTerm);
      const matchesOrgao = selectedOrgaos.length === 0 || selectedOrgaos.includes(item["Órgão Julgador"]);

      return matchesSearch && matchesOrgao;
    });
  }, [searchTerm, selectedOrgaos]);

  const toggleOrgao = (orgao: string) => {
    setSelectedOrgaos(prev =>
      prev.includes(orgao) ? prev.filter(o => o !== orgao) : [...prev, orgao]
    );
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900 font-sans">

      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
        <h1 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-600" />
            Competências TJ
        </h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
          <Filter className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Sidebar Filters */}
      <aside className={`
          fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col shadow-xl md:shadow-none
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0
      `}>
        <div className="p-6 border-b border-gray-100 hidden md:block">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Scale className="w-6 h-6 text-blue-600" />
            Competências
          </h2>
          <p className="text-xs text-gray-500 mt-1">Base de dados atualizada</p>
        </div>

        <div className="p-4 flex-1 overflow-y-auto custom-scroll">
            <div className="flex justify-between items-center mb-3 md:hidden">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Filtros</h3>
                <button onClick={() => setIsSidebarOpen(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 hidden md:block">Órgão Julgador</h3>
          <div className="space-y-1">
            {allOrgaos.map(orgao => (
              <label key={orgao} className="flex items-start gap-3 cursor-pointer group p-2 hover:bg-slate-50 rounded transition-colors">
                <div className="relative flex items-center mt-0.5">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    checked={selectedOrgaos.includes(orgao)}
                    onChange={() => toggleOrgao(orgao)}
                  />
                </div>
                <span className="text-sm text-gray-700 group-hover:text-gray-900 leading-tight select-none">
                  {orgao}
                </span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Clear Filters Button */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
            <button
            onClick={() => { setSelectedOrgaos([]); setSearchTerm(""); }}
            className="w-full py-2 px-4 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors shadow-sm"
            >
            Limpar Filtros
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-[calc(100vh-65px)] md:h-screen overflow-hidden flex flex-col relative">
        {/* Search Header */}
        <div className="bg-white border-b border-gray-200 p-6 md:p-8 flex-shrink-0 z-10">
          <div className="max-w-4xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all shadow-sm"
                placeholder="Buscar por competência, ID ou palavras-chave..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="mt-3 text-sm text-gray-500 flex justify-between items-center">
              <span>Mostrando <strong>{filteredData.length}</strong> resultados</span>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 custom-scroll">
          <div className="max-w-4xl mx-auto pb-10">
            {filteredData.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredData.map(item => (
                  <CompetenceCard key={item.ID} item={item} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center mt-10">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <SearchX className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Nenhum resultado encontrado</h3>
                <p className="text-gray-500 mt-2 max-w-sm">
                    Não encontramos competências correspondentes à sua busca. Tente ajustar os termos ou remover os filtros.
                </p>
                <button 
                    onClick={() => {setSearchTerm(''); setSelectedOrgaos([]);}}
                    className="mt-6 text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                    Limpar toda a busca
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default App;