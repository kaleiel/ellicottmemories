import { useState, useRef } from 'react';
import { useStore } from '@/lib/store';
import { MessageCircle, Share2, Send, ThumbsUp, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getCurrentMonthYear } from '@/lib/dates';

export default function Feed() {
  const user = useStore((state) => state.user);
  const posts = useStore((state) => state.posts);
  const toggleLike = useStore((state) => state.toggleLike);
  const addComment = useStore((state) => state.addComment);
  
  const [openCommentsId, setOpenCommentsId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [voteConfirmId, setVoteConfirmId] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState<Record<string, number>>({});
  const touchStartRef = useRef<Record<string, number>>({});

  const getCarouselIndex = (postId: string) => carouselIndex[postId] || 0;
  
  const toggleCarousel = (postId: string, direction: 'next' | 'prev') => {
    const current = getCarouselIndex(postId);
    if (direction === 'next') {
      setCarouselIndex({ ...carouselIndex, [postId]: current === 0 ? 1 : 0 });
    } else {
      setCarouselIndex({ ...carouselIndex, [postId]: current === 0 ? 1 : 0 });
    }
  };

  const handleTouchStart = (postId: string, e: React.TouchEvent) => {
    touchStartRef.current[postId] = e.touches[0].clientX;
  };

  const handleTouchEnd = (postId: string, e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const touchStart = touchStartRef.current[postId] || 0;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        toggleCarousel(postId, 'next');
      } else {
        toggleCarousel(postId, 'prev');
      }
    }
  };

  const handleAddComment = (postId: string) => {
    if (commentText.trim()) {
      addComment(postId, commentText);
      setCommentText('');
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      <header className="mb-6 px-2">
        <h1 className="text-3xl font-serif font-bold text-primary">Hello, {user?.username} 👋</h1>
        <p className="text-muted-foreground text-sm">Vote for your favorites in {getCurrentMonthYear()}.</p>
      </header>

      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="overflow-hidden border-none shadow-md bg-card/50 backdrop-blur-sm">
            <CardHeader className="p-4 flex flex-row items-center gap-3">
              <Avatar className="h-10 w-10 border border-border">
                <AvatarFallback className="bg-secondary text-secondary-foreground">
                  {post.user.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">{post.user}</p>
                <p className="text-xs text-muted-foreground">
                  {post.retroLocation && post.recreatedLocation 
                    ? `${post.retroLocation} → ${post.recreatedLocation}`
                    : '2 hours ago'
                  }
                </p>
              </div>
            </CardHeader>
            
            <div 
              className="relative aspect-[4/5] w-full bg-stone-200 cursor-grab active:cursor-grabbing"
              onTouchStart={(e) => handleTouchStart(post.id, e)}
              onTouchEnd={(e) => handleTouchEnd(post.id, e)}
            >
              {getCarouselIndex(post.id) === 0 && post.retroImage ? (
                <img 
                  src={post.retroImage} 
                  alt="Retro photo" 
                  className="absolute inset-0 w-full h-full object-cover select-none"
                />
              ) : (
                <img 
                  src={post.image} 
                  alt={post.description} 
                  className="absolute inset-0 w-full h-full object-cover select-none"
                />
              )}
              
              {post.retroImage && (
                <>
                  <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
                    <button
                      onClick={() => toggleCarousel(post.id, 'prev')}
                      className="pointer-events-auto bg-black/50 hover:bg-black/70 active:bg-black/80 text-white p-2 rounded-full transition-colors"
                      data-testid={`button-prev-carousel-${post.id}`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => toggleCarousel(post.id, 'next')}
                      className="pointer-events-auto bg-black/50 hover:bg-black/70 active:bg-black/80 text-white p-2 rounded-full transition-colors"
                      data-testid={`button-next-carousel-${post.id}`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {getCarouselIndex(post.id) === 0 ? 'Original' : 'Recreation'}
                  </div>
                </>
              )}
            </div>

            <CardContent className="p-4 pt-3 space-y-3">
              <div className="flex gap-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  disabled={post.user === user?.username}
                  className={cn("flex items-center gap-2 hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed", post.isLiked ? "text-primary" : "text-muted-foreground")}
                  onClick={() => setVoteConfirmId(post.id)}
                  data-testid={`button-vote-${post.id}`}
                  title={post.user === user?.username ? "You can't vote on your own submission" : ""}
                >
                  <ThumbsUp className={cn("w-5 h-5", post.isLiked ? "fill-primary" : "")} />
                  <span className="text-sm font-medium">Vote</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setOpenCommentsId(openCommentsId === post.id ? null : post.id)}
                  data-testid={`button-comment-${post.id}`}
                >
                  <MessageCircle className="w-6 h-6" />
                </Button>
                <Button variant="ghost" size="icon" className="ml-auto">
                  <Share2 className="w-6 h-6" />
                </Button>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-bold" data-testid={`text-votes-${post.id}`}>{post.likes} votes</p>
                <p className="text-sm">
                  <span className="font-semibold mr-2">{post.user}</span>
                  {post.description}
                </p>
              </div>

              {/* Comments Section */}
              {openCommentsId === post.id && (
                <div className="pt-3 border-t border-border/50 space-y-3">
                  {post.comments.length > 0 && (
                    <div className="space-y-2">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="text-sm">
                          <span className="font-semibold text-xs">{comment.user}</span>
                          <p className="text-xs text-muted-foreground">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2 items-center pt-2">
                    <Input 
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                      className="h-9 text-sm bg-background"
                      data-testid={`input-comment-${post.id}`}
                    />
                    <Button 
                      size="icon" 
                      className="h-9 w-9"
                      onClick={() => handleAddComment(post.id)}
                      data-testid={`button-send-comment-${post.id}`}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Vote Confirmation Dialog */}
      <Dialog open={!!voteConfirmId} onOpenChange={(open) => !open && setVoteConfirmId(null)}>
        <DialogContent className="max-w-sm">
          <DialogTitle className="font-serif text-xl">Confirm Your Vote</DialogTitle>
          <DialogDescription className="text-base">
            Are you sure you want to vote for this photo? Your vote helps determine the monthly winners.
          </DialogDescription>
          <div className="flex gap-3 justify-end pt-4">
            <Button 
              variant="outline"
              onClick={() => setVoteConfirmId(null)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (voteConfirmId) {
                  toggleLike(voteConfirmId);
                  setVoteConfirmId(null);
                }
              }}
              className="bg-primary hover:bg-primary/90"
            >
              Vote
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
