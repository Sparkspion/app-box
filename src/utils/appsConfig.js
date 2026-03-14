import { MessageSquare, Hash, Droplets, Sparkles, ArrowLeftRight } from 'lucide-react';

export const ALL_APPS = [
  {
    id: 'my-bit',
    name: 'MyBit',
    path: '/my-bit',
    icon: Sparkles,
    color: 'bg-emerald-500',
    description: 'Atomic habit tracker focusing on habit stacking and consistency mechanics.'
  },
  {
    id: 'wauction',
    name: 'Wauction',
    path: '/wauction',
    icon: MessageSquare,
    color: 'bg-nintendo-red',
    description: 'Advanced auction intelligence engine for analyzing WhatsApp bid streams and cataloging inventory.'
  },
  {
    id: 'convertor',
    name: 'Convertor',
    path: '/convertor',
    icon: ArrowLeftRight,
    color: 'bg-emerald-500',
    description: 'Molecular unit conversion engine supporting volume-to-mass transformations with substance density presets.'
  },
  {
    id: 'random-generator',
    name: 'Randomizer',
    path: '/random-generator',
    icon: Hash,
    color: 'bg-nintendo-blue',
    description: 'True random number generator with hidden Pokemon reveal mechanics.'
  },
  {
    id: 'hydrometer',
    name: 'Hydrometer',
    path: '/hydrometer',
    icon: Droplets,
    color: 'bg-sky-500',
    description: 'Gaming-inspired water intake tracker with custom targets and wave physics.'
  }
];
