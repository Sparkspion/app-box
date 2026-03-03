import { Link } from 'react-router-dom';
import { MessageSquare, Hash } from 'lucide-react';

const apps = [
  {
    name: 'WhatsApp Auction',
    path: '/whatsapp-analyzer',
    icon: MessageSquare,
    color: 'bg-nintendo-red',
    description: 'Analyze WhatsApp auction chats'
  },
  {
    name: 'Randomizer',
    path: '/random-generator',
    icon: Hash,
    color: 'bg-nintendo-blue',
    description: 'Generate random numbers & Pokemon'
  }
];

const Home = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-pixel mb-6 tracking-tight text-accent-main">
          APP BOX
        </h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto font-medium">
          A modular collection of utilities with a Nintendo-inspired experience.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {apps.map((app) => (
          <Link
            key={app.path}
            to={app.path}
            className="group material-card relative overflow-hidden flex flex-col items-center text-center p-10 hover:scale-[1.03] transition-transform active:scale-95"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-main/5 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-700" />
            
            <div className={`${app.color} p-5 rounded-3xl shadow-xl shadow-accent-main/20 mb-6 group-hover:rotate-12 transition-transform`}>
              <app.icon className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-black mb-3 text-text-main group-hover:text-accent-main transition-colors">
              {app.name}
            </h2>
            <p className="text-text-muted font-medium">
              {app.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
