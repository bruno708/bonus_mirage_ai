import React, { useRef, useEffect, useState } from 'react';
import { Download, Sparkles, Loader2, Maximize2, Wand2, ImagePlus, X, Columns, MoveHorizontal } from 'lucide-react';
import { AspectRatio } from '../types';
import { improvePrompt } from '../services/geminiService';

interface ImageAreaProps {
  prompt: string;
  onPromptChange: (text: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  generatedImage: string | null;
  uploadedImage: string | null;
  onUploadImage: (image: string | null) => void;
  aspectRatio: AspectRatio;
  apiKey: string;
}

// Improved ComparisonSlider implementation specifically for object-contain images:
const ComparisonSliderContain: React.FC<{ before: string; after: string }> = ({ before, after }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
  
    const handleMove = (clientX: number) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        setSliderPosition((x / rect.width) * 100);
      }
    };
  
    const onMouseDown = () => { isDragging.current = true; };
    const onMouseUp = () => { isDragging.current = false; };
  
    useEffect(() => {
        const handleWinMove = (e: MouseEvent) => { if (isDragging.current) handleMove(e.clientX); };
        const handleWinUp = () => { isDragging.current = false; };
        const handleTouchMove = (e: TouchEvent) => { if (isDragging.current) handleMove(e.touches[0].clientX); };
        
        window.addEventListener('mousemove', handleWinMove);
        window.addEventListener('mouseup', handleWinUp);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleWinUp);
        
        return () => {
            window.removeEventListener('mousemove', handleWinMove);
            window.removeEventListener('mouseup', handleWinUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleWinUp);
        };
    }, []);

    return (
        <div ref={containerRef} className="relative w-full h-full" onMouseDown={onMouseDown} onTouchStart={onMouseDown}>
            <img src={after} className="w-full h-full object-contain select-none" draggable={false} />
            
            <div 
                className="absolute top-0 left-0 h-full overflow-hidden select-none"
                style={{ width: `${sliderPosition}%` }}
            >
                <div className="w-full h-full relative" style={{ width: containerRef.current?.clientWidth }}>
                   <img src={before} className="w-full h-full object-contain" draggable={false} />
                </div>
            </div>

            <div 
                className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize z-10 flex items-center justify-center shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                style={{ left: `${sliderPosition}%` }}
            >
                 <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg text-stone-800">
                    <Columns className="w-4 h-4" />
                </div>
            </div>
        </div>
    );
};


const ImageArea: React.FC<ImageAreaProps> = ({
  prompt,
  onPromptChange,
  onGenerate,
  isGenerating,
  generatedImage,
  uploadedImage,
  onUploadImage,
  aspectRatio,
  apiKey
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [isImproving, setIsImproving] = useState(false);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [prompt]);

  // Turn off comparison if image changes
  useEffect(() => {
    setIsComparing(false);
  }, [generatedImage]);

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `mirage-ai-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUploadImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearUpload = () => {
    onUploadImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImprovePrompt = async () => {
    if (!prompt.trim() || isImproving) return;
    
    if (!apiKey) {
        alert("Por favor, insira sua Chave de API na barra lateral antes de usar este recurso.");
        return;
    }

    setIsImproving(true);
    try {
        const enhancedPrompt = await improvePrompt(prompt, apiKey);
        onPromptChange(enhancedPrompt);
    } catch (error) {
        console.error("Failed to improve prompt");
        alert("Falha ao melhorar prompt. Verifique se sua Chave de API está correta.");
    } finally {
        setIsImproving(false);
    }
  };

  return (
    <div className="h-full flex flex-col relative bg-stone-50 md:rounded-l-[2rem] overflow-hidden">
      
      {/* Canvas Area - Uses flex-1 and overflow-y-auto to allow scrolling if content is too tall, but Image is contained */}
      <div className="flex-1 w-full min-h-0 relative bg-stone-50 overflow-y-auto p-4 md:p-8">
        <div className="min-h-full flex flex-col justify-center items-center">
            
          {/* Image Container */}
          <div 
            className={`relative w-full h-full md:h-auto md:aspect-video mx-auto rounded-2xl shadow-sm border border-stone-200 overflow-hidden group flex items-center justify-center bg-white min-h-[300px]
               ${!generatedImage && !uploadedImage ? 'bg-stone-100 border-dashed' : ''}
            `}
          >
            {isGenerating && (
                <div className="absolute inset-0 z-30 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                    <Loader2 className="w-10 h-10 text-stone-800 animate-spin mb-4" />
                    <p className="text-stone-600 font-medium animate-pulse">Criando sua obra de arte...</p>
                </div>
            )}

            {isComparing && generatedImage && uploadedImage ? (
                <ComparisonSliderContain before={uploadedImage} after={generatedImage} />
            ) : (
                <>
                    {(generatedImage || uploadedImage) ? (
                        <img 
                            src={generatedImage || uploadedImage || ''} 
                            alt="Content" 
                            className="max-w-full max-h-full object-contain"
                        />
                    ) : (
                        <div className="text-center p-8">
                            <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold text-stone-700 mb-2">Pronto para criar?</h3>
                            <p className="text-stone-500 max-w-xs mx-auto">
                                Selecione um modelo à esquerda ou digite seu prompt abaixo para começar.
                            </p>
                        </div>
                    )}

                    {/* Overlay actions */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        {uploadedImage && generatedImage && (
                            <button 
                                onClick={() => setIsComparing(true)}
                                className="p-2.5 bg-white/90 backdrop-blur text-stone-800 rounded-full hover:bg-white shadow-lg transition-transform hover:scale-105"
                                title="Comparar Antes/Depois"
                            >
                                <Columns className="w-5 h-5" />
                            </button>
                        )}

                        {generatedImage && (
                            <button 
                                onClick={handleDownload}
                                className="p-2.5 bg-white/90 backdrop-blur text-stone-800 rounded-full hover:bg-white shadow-lg transition-transform hover:scale-105"
                                title="Baixar imagem"
                            >
                                <Download className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </>
            )}
          </div>
        </div>
      </div>

      {/* Floating Prompt Bar - Sticky to bottom to never overflow out */}
      <div className="sticky bottom-0 left-0 right-0 p-4 md:p-8 z-50 bg-gradient-to-t from-stone-50 via-stone-50 to-transparent">
        <div className="max-w-3xl mx-auto bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-stone-100 p-3 flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-end">
            
            {/* Input Area */}
            <div className="flex-1 w-full flex flex-col gap-2">
                <div className="flex items-center justify-between px-2 pt-1 min-h-[20px]">
                    <div className="flex items-center gap-2">
                        <Wand2 className="w-3 h-3 text-stone-400" />
                        <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Prompt Customizado</span>
                    </div>

                    <div className="flex items-center gap-2">
                         {/* Improve Prompt Button */}
                         <button 
                            onClick={handleImprovePrompt}
                            disabled={!prompt.trim() || isImproving}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium transition-colors border
                                ${!prompt.trim() 
                                    ? 'text-stone-300 border-transparent cursor-default' 
                                    : 'text-indigo-600 bg-indigo-50 border-indigo-100 hover:bg-indigo-100 cursor-pointer'
                                }
                            `}
                         >
                            {isImproving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                            <span>{isImproving ? 'Melhorando...' : 'Melhorar Prompt'}</span>
                         </button>

                        {uploadedImage && (
                            <div className="flex items-center gap-2 bg-stone-100 rounded-full px-2 py-1 max-w-[50%]">
                                <span className="text-[10px] text-stone-500 font-medium truncate">Imagem anexada</span>
                                <button onClick={clearUpload} className="text-stone-400 hover:text-red-500 flex-shrink-0">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-2 items-start">
                     {/* Upload Button */}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileSelect} 
                        accept="image/*" 
                        className="hidden" 
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                            flex-shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-xl border flex items-center justify-center transition-colors
                            ${uploadedImage ? 'border-stone-800 bg-stone-50' : 'border-stone-200 hover:bg-stone-50 text-stone-400 hover:text-stone-600'}
                        `}
                        title="Anexar imagem de referência"
                    >
                        {uploadedImage ? (
                            <img src={uploadedImage} alt="Preview" className="w-9 h-9 md:w-10 md:h-10 object-cover rounded-lg" />
                        ) : (
                            <ImagePlus className="w-5 h-5" />
                        )}
                    </button>

                    <textarea
                        ref={textareaRef}
                        value={prompt}
                        onChange={(e) => onPromptChange(e.target.value)}
                        placeholder={uploadedImage ? "Como alterar a imagem..." : "Descreva sua ideia..."}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-stone-800 placeholder-stone-400 resize-none max-h-24 md:max-h-32 py-2 px-2 text-sm md:text-lg leading-relaxed min-h-[44px]"
                        rows={1}
                        style={{ height: 'auto' }}
                    />
                </div>
            </div>

            {/* Generate Button */}
            <button
                onClick={onGenerate}
                disabled={isGenerating || (!prompt.trim() && !uploadedImage)}
                className={`
                    w-full md:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-md h-12 md:h-auto flex-shrink-0
                    ${isGenerating || (!prompt.trim() && !uploadedImage)
                        ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                        : 'bg-stone-900 text-white hover:bg-stone-800 hover:scale-[1.02] hover:shadow-lg'
                    }
                `}
            >
                {isGenerating ? (
                    <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                ) : (
                    <>
                        <Sparkles className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                        <span>{uploadedImage ? 'Melhorar' : 'Gerar'}</span>
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ImageArea;