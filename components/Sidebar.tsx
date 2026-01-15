import React from 'react';
import { ModelType, Preset, AspectRatio, Resolution } from '../types';
import { MODELS, PRESETS, ASPECT_RATIOS, RESOLUTIONS } from '../constants';
import { 
  Utensils, 
  User, 
  Camera, 
  Briefcase, 
  Mountain, 
  Palette,
  Settings2,
  Zap,
  Star,
  Sparkles,
  Key,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';

interface SidebarProps {
  selectedModel: ModelType;
  onModelChange: (m: ModelType) => void;
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ar: AspectRatio) => void;
  resolution: Resolution;
  onResolutionChange: (r: Resolution) => void;
  onPresetSelect: (preset: Preset) => void;
  tokens: number;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedModel,
  onModelChange,
  aspectRatio,
  onAspectRatioChange,
  resolution,
  onResolutionChange,
  onPresetSelect,
  tokens,
  apiKey,
  onApiKeyChange
}) => {
  const [showKey, setShowKey] = React.useState(false);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Utensils': return <Utensils className="w-5 h-5" />;
      case 'User': return <User className="w-5 h-5" />;
      case 'Mountain': return <Mountain className="w-5 h-5" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5" />;
      case 'Camera': return <Camera className="w-5 h-5" />;
      case 'Palette': return <Palette className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const isProSelected = selectedModel === ModelType.BANANA_PRO;
  const hasKey = apiKey.length > 10; // Basic validation check

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-900 flex items-center gap-2">
          <span className="w-8 h-8 bg-stone-900 text-white rounded-lg flex items-center justify-center shadow-lg shadow-stone-200">
            <Sparkles className="w-4 h-4" />
          </span>
          Mirage AI
        </h1>
        <p className="text-stone-500 text-sm mt-1 ml-1">Studio de Criação</p>
      </div>

      {/* Model Selection */}
      <div className="mb-6">
        <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Modelo de IA</h2>
        <div className="space-y-2">
            {MODELS.map((model) => {
                const isSelected = selectedModel === model.value;
                const isProModel = model.value === ModelType.BANANA_PRO;

                return (
                    <div 
                        key={model.value}
                        className={`relative rounded-xl transition-all duration-300 ${
                            isSelected && isProModel
                                ? "p-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-sm"
                                : ""
                        }`}
                    >
                        <button
                            onClick={() => onModelChange(model.value)}
                            className={`w-full text-left p-2.5 rounded-[10px] border transition-all duration-200 flex items-start gap-3
                                ${isSelected 
                                    ? (isProModel ? 'bg-white border-transparent' : 'bg-white border-stone-800 shadow-sm ring-1 ring-stone-800')
                                    : 'bg-white/50 border-stone-200 hover:bg-white hover:border-stone-300'
                                }`}
                        >
                            <div className={`mt-0.5 rounded-full p-1 
                                ${isSelected 
                                    ? (isProModel ? 'bg-gradient-to-br from-indigo-100 to-purple-100 text-purple-600' : 'bg-stone-100 text-stone-900') 
                                    : 'text-stone-400'}`
                                }>
                                {model.value.includes('Pro') ? <Star className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                            </div>
                            <div>
                                <div className={`font-medium text-sm flex items-center gap-2
                                     ${isProModel && isSelected ? 'bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600 font-bold' : 'text-stone-900'}
                                `}>
                                    {model.label}
                                </div>
                                <div className="text-[11px] text-stone-500 mt-0.5 leading-tight">{model.description}</div>
                            </div>
                        </button>
                    </div>
                );
            })}
        </div>
      </div>

      {/* Configuration: Aspect & Resolution */}
      <div className="mb-8">
        <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Settings2 className="w-3 h-3" /> Configurações
        </h2>
        
        <div className="space-y-4">
            <div>
                <label className="text-xs text-stone-600 mb-2 block font-medium">Proporção</label>
                <div className="flex flex-wrap gap-2">
                    {ASPECT_RATIOS.map((ratio) => (
                        <button
                            key={ratio}
                            onClick={() => onAspectRatioChange(ratio)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
                                ${aspectRatio === ratio 
                                    ? 'bg-stone-900 text-white border-stone-900' 
                                    : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400'
                                }`}
                        >
                            {ratio}
                        </button>
                    ))}
                </div>
            </div>

             {/* Only show resolution for Pro model */}
             {selectedModel === ModelType.BANANA_PRO && (
                <div className="animate-fade-in">
                    <label className="text-xs text-stone-600 mb-2 block font-medium">Resolução (Pro)</label>
                    <div className="flex gap-2">
                        {RESOLUTIONS.map((res) => (
                            <button
                                key={res}
                                onClick={() => onResolutionChange(res)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
                                    ${resolution === res 
                                        ? 'bg-stone-900 text-white border-stone-900' 
                                        : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400'
                                    }`}
                            >
                                {res}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* Presets */}
      <div className="flex-1">
        <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Modelos Prontos</h2>
        <div className="grid grid-cols-1 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onPresetSelect(preset)}
              className="flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-100 shadow-sm hover:shadow-md hover:border-stone-300 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-500 group-hover:bg-stone-100 group-hover:text-stone-800 transition-colors">
                {getIcon(preset.icon)}
              </div>
              <div>
                <div className="text-sm font-medium text-stone-800">{preset.label}</div>
                <div className="text-[10px] text-stone-400">{preset.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer: API Key & Tokens */}
      <div className="mt-6 pt-6 border-t border-stone-200 space-y-4">
        
        {/* API Key Input Section */}
        <div className={`rounded-xl p-3 border transition-colors ${hasKey ? 'bg-green-50 border-green-200' : 'bg-white border-stone-200'}`}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-700 uppercase tracking-wide">
                    <Key className="w-3 h-3" /> API Key (Gemini)
                </div>
                {hasKey && <ShieldCheck className="w-4 h-4 text-green-600" />}
            </div>
            
            <div className="relative">
                <input 
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => onApiKeyChange(e.target.value)}
                    placeholder="Cole sua chave aqui..."
                    className="w-full text-xs p-2 pr-8 rounded-lg border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none bg-white"
                />
                <button 
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                    {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
            </div>
            {!hasKey && (
                <p className="text-[10px] text-stone-400 mt-2 leading-tight">
                    Para usar o software, insira sua chave da Google AI Studio.
                </p>
            )}
        </div>

        {/* Tokens */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-stone-500 font-medium">Créditos da Sessão</span>
              <span className="font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md">{tokens}</span>
          </div>
          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div 
                  className="bg-stone-800 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${(tokens / 1000) * 100}%` }}
              ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;