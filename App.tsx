import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ImageArea from './components/ImageArea';
import { ModelType, AspectRatio, Resolution, Preset } from './types';
import { generateImage } from './services/geminiService';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  // Application State
  const [prompt, setPrompt] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<ModelType>(ModelType.NANO);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [resolution, setResolution] = useState<Resolution>('1K');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [tokens, setTokens] = useState<number>(1000); // Simulated token bucket
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // API Key state for agnostic use
  const [apiKey, setApiKey] = useState<string>('');

  // Handlers
  const handlePresetSelect = useCallback((preset: Preset) => {
    setPrompt(preset.basePrompt);
    // On mobile, close menu after selection to show prompt area
    if (window.innerWidth < 768) {
      setMobileMenuOpen(false);
    }
  }, []);

  const handleGenerate = async () => {
    if ((!prompt.trim() && !uploadedImage) || isGenerating) return;

    // Validation for API Key
    if (!apiKey) {
      alert("Por favor, insira uma Chave de API (Gemini) na barra lateral para continuar.");
      setMobileMenuOpen(true); // Open menu on mobile to show input
      return;
    }

    if (tokens <= 0) {
      alert("Você está sem créditos para esta sessão.");
      return;
    }

    setIsGenerating(true);
    // We do NOT clear generated image immediately if we are refining, but UX wise it's better to show loading state.
    setGeneratedImage(null); 

    try {
      const base64Image = await generateImage({
        prompt,
        model: selectedModel,
        aspectRatio,
        resolution,
        image: uploadedImage || undefined
      }, apiKey);
      
      setGeneratedImage(base64Image);
      setTokens(prev => Math.max(0, prev - 10)); // Deduct cost
    } catch (error: any) {
      console.error("Generation failed", error);
      let msg = "Falha ao gerar imagem. Verifique se sua Chave de API é válida e tem permissões.";
      if (error.message.includes('API Key')) msg = error.message;
      alert(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden bg-[#F7F7F7] font-sans text-stone-900">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-stone-200 z-50 flex-shrink-0">
        <span className="font-semibold text-lg flex items-center gap-2">
            <span className="w-6 h-6 bg-stone-900 rounded-md"></span>
            Mirage AI
        </span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-stone-600">
            {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar (Desktop: Static Left, Mobile: Overlay) */}
      <div className={`
        fixed inset-0 z-40 bg-white md:bg-transparent md:relative md:w-[380px] md:block transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar 
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          aspectRatio={aspectRatio}
          onAspectRatioChange={setAspectRatio}
          resolution={resolution}
          onResolutionChange={setResolution}
          onPresetSelect={handlePresetSelect}
          tokens={tokens}
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-full relative z-0 md:py-4 md:pr-4 flex flex-col min-h-0">
        <ImageArea 
          prompt={prompt}
          onPromptChange={setPrompt}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          generatedImage={generatedImage}
          uploadedImage={uploadedImage}
          onUploadImage={setUploadedImage}
          aspectRatio={aspectRatio}
          apiKey={apiKey}
        />
      </div>
    </div>
  );
};

export default App;