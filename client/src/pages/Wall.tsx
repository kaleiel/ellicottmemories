import { useStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Trophy, Calendar } from 'lucide-react';
import { getPastThreeMonths } from '@/lib/dates';
import { getRandomBusiness } from '@/lib/businesses';

export default function Wall() {
  const wallOfFame = useStore((state) => state.wallOfFame);
  const pastThreeMonths = getPastThreeMonths();
  
  // Generate random businesses for each winner (consistent per component render)
  const businesses = wallOfFame.map(() => getRandomBusiness());

  return (
    <div className="p-0 pb-24">
      <div className="bg-primary text-primary-foreground p-8 pb-16 rounded-b-[2rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 text-center">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-accent" />
          <h1 className="text-4xl font-serif font-bold mb-2">The Wall</h1>
          <p className="text-white/80 max-w-xs mx-auto">Celebrating the top photos from previous months.</p>
        </div>
      </div>

      <div className="px-6 -mt-10 space-y-8">
        {wallOfFame.map((post, i) => (
          <div key={post.id} className="relative">
            {/* Connector Line */}
            {i !== wallOfFame.length - 1 && (
              <div className="absolute left-1/2 top-full h-8 w-px bg-border -ml-px z-0" />
            )}
            
            <Card className="overflow-hidden shadow-lg border-none relative z-10">
              <div className="relative aspect-video">
                <img src={post.image} alt={post.description} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 bg-card">
                <div className="flex items-center gap-2 mb-3 text-primary font-serif font-bold">
                  <Calendar className="w-4 h-4" />
                  <span>{pastThreeMonths[i]?.monthYear}</span>
                </div>
                <p className="text-sm font-medium mb-2">by {post.user}</p>
                <p className="text-sm text-muted-foreground">
                  Visit <a 
                    href={`https://www.google.com/maps/search/${encodeURIComponent(businesses[i] + ' Ellicott City, MD')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-foreground hover:text-primary transition-colors underline"
                  >
                    {businesses[i]}
                  </a> to see this photo and the other winners!
                </p>
              </div>
            </Card>
          </div>
        ))}
        
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground italic">
            Visit our sponsoring businesses to see these printed on the real wall!
          </p>
        </div>
      </div>
    </div>
  );
}
