import { MessageSquare, Hash, Droplets, Sparkles } from 'lucide-react';

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
    id: 'whatsapp-analyzer',
    name: 'WhatsApp Auction',
    path: '/whatsapp-analyzer',
    icon: MessageSquare,
    color: 'bg-nintendo-red',
    description: 'Specialized parser for WhatsApp chat exports to detect auction bids and winners.'
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
    id: 'hydration-meter',
    name: 'Hydration Meter',
    path: '/hydration-meter',
    icon: Droplets,
    color: 'bg-sky-500',
    description: 'Gaming-inspired water intake tracker with vitality decay and wave physics.'
  }
];
