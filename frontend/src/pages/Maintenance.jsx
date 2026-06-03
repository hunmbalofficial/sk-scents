import { Wrench } from 'lucide-react';

const Maintenance = () => {
  return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <Wrench className="w-16 h-16 text-luxury-gold mx-auto mb-6" />
        <h1 className="font-display text-4xl text-white mb-4">Under Maintenance</h1>
        <p className="text-luxury-gray leading-relaxed">
          We're currently performing some upgrades. We'll be back shortly with an even better experience.
        </p>
        <div className="mt-8 flex justify-center gap-1.5">
          {[0,1,2].map((i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full bg-luxury-gold/60 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
