import { ModelType, Preset, AspectRatio, Resolution } from './types';
import { 
  Utensils, 
  User, 
  Camera, 
  Briefcase, 
  Mountain, 
  Palette,
  Sparkles
} from 'lucide-react';

export const MODELS: { label: string; value: ModelType; description: string }[] = [
  { 
    label: 'Nano', 
    value: ModelType.NANO, 
    description: 'Fast generation for quick concepts (Standard)' 
  },
  { 
    label: 'Nano Banana Flash', 
    value: ModelType.NANO_BANANA_FLASH, 
    description: 'High-speed optimized model (Lite)' 
  },
  { 
    label: 'Banana Pro', 
    value: ModelType.BANANA_PRO, 
    description: 'High fidelity, supports up to 4K resolution (Premium)' 
  },
];

export const ASPECT_RATIOS: AspectRatio[] = ['1:1', '16:9', '9:16', '4:3', '3:4'];
export const RESOLUTIONS: Resolution[] = ['1K', '2K', '4K'];

// Using lucide-react names as strings to map in component
export const PRESETS: Preset[] = [
  {
    id: 'pixar-3d',
    label: 'Estilo Pixar 3D',
    icon: 'Sparkles',
    basePrompt: 'Convert the uploaded photo into a 3D cartoon character portrait while preserving the exact facial gestures, expressions, and features from the reference photo. Maintain the original skin tone, eyebrows, lips, nose shape, facial hair, and overall bone structure, ensuring the mouth, eyes, and expression match the reference with precise accuracy. Exaggerate the proportions for a stylized cartoon look, but keep the facial expression and gestures identical to the one in the original photo—whether that be a smile, shock, or any other emotion captured. The character’s eyes should be large and expressive, fitting the exaggerated cartoon style, while keeping the overall facial expression faithful to the reference. Skin texture should be realistic with visible pores and facial hair. Include accessories like earrings, necklaces, or bandanas, matching the reference. Use sharp, cinematic lighting with a key light from the left, fill from the right, and rim lighting to create depth. Keep the background simple or with a gradient to maintain focus on the character. The rendering style should blend Pixar’s attention to detail with Illumination’s playful proportions, in high resolution with a clay-like finish.',
    description: 'Converta fotos em personagens 3D'
  },
  {
    id: 'ifood-ads',
    label: 'Publicidade iFood',
    icon: 'Utensils',
    basePrompt: 'Transforme esta imagem de comida em uma peça publicitária de alta gastronomia. Preserve a fidelidade do produto original (formato e componentes), mas eleve a qualidade visual para 8k. Use iluminação lateral para criar sombras suaves que deem volume ao alimento. Aumente o contraste de texturas: pães com aspecto macio, carnes suculentas e brilhantes, vegetais com aspecto de acabaram de ser colhidos e queijo fundido com aspecto elástico. Adicione um leve efeito de vapor se o prato for quente. Estética de fotografia comercial de luxo.',
    description: 'Estética de alta gastronomia'
  },
  {
    id: 'portrait',
    label: 'Retrato Realista',
    icon: 'User',
    basePrompt: 'Cinematic portrait, realistic skin texture, studio lighting, bokeh background, sharp focus on eyes, 85mm lens',
    description: 'Foco em pessoas e rostos'
  },
  {
    id: 'food',
    label: 'Melhorar Comida (Geral)',
    icon: 'Utensils',
    basePrompt: 'Professional food photography, michelin star plating, soft natural lighting, 8k resolution, appetizing, macro depth of field',
    description: 'Realce fotos de culinária'
  },
  {
    id: 'landscape',
    label: 'Paisagem',
    icon: 'Mountain',
    basePrompt: 'Breathtaking landscape, golden hour, wide angle, hyperrealistic, detailed nature, dramatic sky',
    description: 'Natureza e ambientes externos'
  },
  {
    id: 'product',
    label: 'Produto Comercial',
    icon: 'Briefcase',
    basePrompt: 'Commercial product photography, clean white background, studio softbox lighting, 4k, sleek design, advertising quality',
    description: 'Ideal para e-commerce'
  },
  {
    id: 'lifestyle',
    label: 'Lifestyle',
    icon: 'Camera',
    basePrompt: 'Candid lifestyle photography, urban setting, natural lighting, modern aesthetic, trendy, authentic vibe',
    description: 'Cenas do cotidiano moderno'
  },
  {
    id: 'art',
    label: 'Arte Digital',
    icon: 'Palette',
    basePrompt: 'Digital art illustration, vibrant colors, fantasy concept art, intricate details, trending on artstation',
    description: 'Estilo criativo e ilustrativo'
  }
];

export const PLACEHOLDER_IMAGE = "https://picsum.photos/1024/1024";