import { useRef, useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sponsoringBusinesses } from '@/lib/businesses';

export default function Submit() {
  const addPost = useStore((state) => state.addPost);
  const setCurrentPage = useStore((state) => state.setCurrentPage);
  const { toast } = useToast();
  const retroFileInputRef = useRef<HTMLInputElement>(null);
  const recreatedFileInputRef = useRef<HTMLInputElement>(null);
  
  const [description, setDescription] = useState('');
  const [retroImage, setRetroImage] = useState<string | null>(null);
  const [recreatedImage, setRecreatedImage] = useState<string | null>(null);
  const [retroLocation, setRetroLocation] = useState('');
  const [retroCustomLocation, setRetroCustomLocation] = useState('');
  const [recreatedLocation, setRecreatedLocation] = useState('');
  const [recreatedCustomLocation, setRecreatedCustomLocation] = useState('');
  
  const isLocationValid = (location: string, customLocation: string) => {
    if (location === 'custom') return customLocation && customLocation.trim() !== '';
    return location && location !== '';
  };
  
  const isFormReady = retroImage && 
    recreatedImage && 
    isLocationValid(retroLocation, retroCustomLocation) && 
    isLocationValid(recreatedLocation, recreatedCustomLocation);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, isRetro: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (isRetro) {
          setRetroImage(result);
        } else {
          setRecreatedImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = (isRetro: boolean) => {
    if (isRetro) {
      retroFileInputRef.current?.click();
    } else {
      recreatedFileInputRef.current?.click();
    }
  };

  const handleSubmit = () => {
    if (!isFormReady) return;
    
    const finalRetroLocation = retroLocation === 'custom' ? retroCustomLocation : retroLocation;
    const finalRecreatedLocation = recreatedLocation === 'custom' ? recreatedCustomLocation : recreatedLocation;
    
    addPost(recreatedImage, description, retroImage || undefined, finalRetroLocation, finalRecreatedLocation);
    
    setDescription('');
    setRetroImage(null);
    setRecreatedImage(null);
    setRetroLocation('');
    setRetroCustomLocation('');
    setRecreatedLocation('');
    setRecreatedCustomLocation('');
    
    toast({
      title: "Submission Received!",
      description: "Your photo has been added to the competition.",
    });
    setCurrentPage('feed');
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-3xl font-serif font-bold text-primary mb-6">Submit Entry</h1>
      
      <div className="flex-1 space-y-6 overflow-y-auto">
        <div className="space-y-2">
          <Label>Retro Photo (Original Memory)</Label>
          <p className="text-xs text-muted-foreground mb-2">Upload the original photo</p>
          <input 
            ref={retroFileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e, true)}
            className="hidden"
            data-testid="input-file-retro"
          />
          <div 
            onClick={() => triggerFileInput(true)}
            className="border-2 border-dashed border-border rounded-lg aspect-video flex flex-col items-center justify-center bg-background cursor-pointer hover:bg-muted transition-colors relative overflow-hidden group"
          >
            {retroImage ? (
              <>
                <img src={retroImage} alt="Retro Photo" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-medium">Change Photo</span>
                </div>
              </>
            ) : (
              <>
                <div className="bg-primary/10 p-3 rounded-full mb-2">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <p className="font-medium text-muted-foreground text-sm">Tap to upload</p>
                <p className="text-xs text-muted-foreground/70">Original photo</p>
              </>
            )}
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="retro-location" className="text-sm">Location</Label>
            <select 
              id="retro-location"
              value={retroLocation}
              onChange={(e) => setRetroLocation(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              data-testid="select-retro-location"
            >
              <option value="">-- Select Location --</option>
              <option value="custom">Type your own...</option>
              {sponsoringBusinesses.map((business) => (
                <option key={business} value={business}>{business}</option>
              ))}
            </select>
          </div>

          {retroLocation === 'custom' && (
            <div>
              <Input 
                type="text"
                placeholder="Enter location name"
                value={retroCustomLocation}
                onChange={(e) => setRetroCustomLocation(e.target.value)}
                className="h-9 text-sm"
                data-testid="input-retro-custom-location"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Recreated Photo (Your Version)</Label>
          <p className="text-xs text-muted-foreground mb-2">Upload your recreation of the original photo</p>
          <input 
            ref={recreatedFileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e, false)}
            className="hidden"
            data-testid="input-file-recreated"
          />
          <div 
            onClick={() => triggerFileInput(false)}
            className="border-2 border-dashed border-border rounded-lg aspect-video flex flex-col items-center justify-center bg-background cursor-pointer hover:bg-muted transition-colors relative overflow-hidden group"
          >
            {recreatedImage ? (
              <>
                <img src={recreatedImage} alt="Recreated Photo" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-medium">Change Photo</span>
                </div>
              </>
            ) : (
              <>
                <div className="bg-primary/10 p-3 rounded-full mb-2">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <p className="font-medium text-muted-foreground text-sm">Tap to upload</p>
                <p className="text-xs text-muted-foreground/70">Your recreation</p>
              </>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="recreated-location" className="text-sm">Location</Label>
            <select 
              id="recreated-location"
              value={recreatedLocation}
              onChange={(e) => setRecreatedLocation(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              data-testid="select-recreated-location"
            >
              <option value="">-- Select Location --</option>
              <option value="custom">Type your own...</option>
              {sponsoringBusinesses.map((business) => (
                <option key={business} value={business}>{business}</option>
              ))}
            </select>
          </div>

          {recreatedLocation === 'custom' && (
            <div>
              <Input 
                type="text"
                placeholder="Enter location name"
                value={recreatedCustomLocation}
                onChange={(e) => setRecreatedCustomLocation(e.target.value)}
                className="h-9 text-sm"
                data-testid="input-recreated-custom-location"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="desc">Story / Caption</Label>
          <Textarea 
            id="desc" 
            placeholder="Tell us about this memory and how you recreated it..." 
            className="min-h-[120px] bg-background resize-none text-base"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-auto pt-6">
        <Button 
          onClick={handleSubmit} 
          disabled={!isFormReady}
          className="w-full h-12 text-lg font-serif"
        >
          Submit Entry
        </Button>
      </div>
    </div>
  );
}
