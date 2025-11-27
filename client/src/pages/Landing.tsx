import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { stockImages } from '@/lib/assets';

export default function Landing() {
  const setCurrentPage = useStore((state) => state.setCurrentPage);

  return (
    <div className="flex flex-col min-h-screen bg-stone-100 text-stone-900">
      {/* Logo Header */}
      <div className="w-full bg-white shadow-sm py-4 px-6 flex justify-center">
        <motion.img 
          src="https://ibb.co/0jh5cTNw"
          alt="Old Ellicott City Partnership Logo"
          className="rounded object-contain shadow-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src={stockImages[0]} 
          alt="Old Ellicott City Main Street" 
          className="absolute inset-0 w-full h-full object-cover animate-in fade-in zoom-in duration-1000"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 pb-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-sm uppercase tracking-widest mb-2 font-medium opacity-90">Partnership Campaign</h2>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight">
              Memories of<br />Old Ellicott City
            </h1>
            <p className="text-white/90 max-w-xs font-sans leading-relaxed">
              Capture the charm. Share your story. Win your spot on the wall.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col gap-8 bg-background">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            Join our monthly photo competition. Top entries get featured in our sponsoring businesses.
          </p>
          
          <Button 
            onClick={() => setCurrentPage('login')}
            className="w-full h-14 text-lg font-serif bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl"
          >
            Join In
          </Button>
        </div>

        {/* Mini Gallery */}
        <div className="space-y-3">
          <h3 className="font-serif text-xl font-bold text-foreground/80">Previous Winners</h3>
          <div className="grid grid-cols-2 gap-3">
            {stockImages.slice(1).map((img, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="aspect-square rounded-lg overflow-hidden shadow-md"
              >
                <img src={img} alt="Gallery" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
