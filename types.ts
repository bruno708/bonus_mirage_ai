export enum ModelType {
  NANO = 'Nano',
  BANANA_PRO = 'Banana Pro',
  NANO_BANANA_FLASH = 'Nano Banana Flash'
}

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
export type Resolution = '1K' | '2K' | '4K'; // Only relevant for Pro models usually

export interface Preset {
  id: string;
  label: string;
  icon: string;
  basePrompt: string;
  description: string;
}

export interface GenerationConfig {
  prompt: string;
  model: ModelType;
  aspectRatio: AspectRatio;
  resolution: Resolution;
  image?: string; // Base64 string of the input image
}
