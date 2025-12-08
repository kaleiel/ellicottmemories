import { useState, useRef, useEffect } from 'react';
import { useStore, Post } from '@/lib/store';
import { MessageCircle, Share2, Send, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getCurrentMonthYear } from '@/lib/dates';
import { stockImages } from '@/lib/assets';

export default function Feed() {
  const user = useStore((state) => state.user);
  const posts = useStore((state) => state.posts);
  const toggleLike = useStore((state) => state.toggleLike);
  const addComment = useStore((state) => state.addComment);

  const [openCommentsId, setOpenCommentsId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [voteConfirmId, setVoteConfirmId] = useState<string | null>(null);

  // per-post carousel index (0 => retro/original, 1 => recreation)
  const [carouselIndex, setCarouselIndex] = useState<Record<string, number>>({});
  const getCarouselIndex = (postId: string) => carouselIndex[postId] || 0;
  const toggleCarousel = (postId: string, direction: 'next' | 'prev') => {
    const current = getCarouselIndex(postId);
    const maxIndex = 1;
    let next = current;
    if (direction === 'next') {
      next = current >= maxIndex ? 0 : current + 1;
    } else {
      next = current <= 0 ? maxIndex : current - 1;
    }
    setCarouselIndex({ ...carouselIndex, [postId]: next });
  };

  // We'll always show exactly 3 posts in the feed. For each post we will assign
  // two random images (retro + recreated) from stockImages (distinct images).
  const [displayPosts, setDisplayPosts] = useState<Post[]>([]);

  const pickTwoDistinctImages = () => {
    if (!stockImages || stockImages.length < 2) return [undefined, undefined];
    const firstIdx = Math.floor(Math.random() * stockImages.length);
    let secondIdx = Math.floor(Math.random() * stockImages.length);
    while (secondIdx === firstIdx && stockImages.length > 1) {
      secondIdx = Math.floor(Math.random() * stockImages.length);
    }
    return [stockImages[firstIdx], stockImages[secondIdx]];
  };

  useEffect(() => {
    // Build three posts for the feed
    const source = posts && posts.length > 0 ? [...posts].sort(() => Math.random() - 0.5) : [];
    const result: Post[] = [];

    for (let i = 0; i < 3; i++) {
      const base = source[i] ?? {
        id: `placeholder-${i}-${Math.random().toString(36).slice(2)}`,
        user: `User${i + 1}`,
        description: `A memory from the community.`,
        comments: [],
        likes: 0,
      } as Post;

      const [retroImg, recreatedImg] = pickTwoDistinctImages();
      // ensure unique id per feed render so keys are stable and distinct
      const id = `${base.id}-feed-${Math.random().toString(36).slice(2)}`;

      result.push({
        ...base,
        id,
        retroImage: retroImg ?? base.retroImage,
        image: recreatedImg ?? base.image,
      });
    }

    setDisplayPosts(result);
    // reset carousel indexes when feed regenerates
    setCarouselIndex({});
  }, [posts]);

  const handleAddComment = (postId: string) => {
    if (commentText.trim()) {
      addComment(postId, commentText);
      setCommentText('');
      setOpenCommentsId(null);
    }
  };

  // helper for drag end (Instagram-like swipe for toggling slide)
  const onDragEnd = (postId: string, _: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    const threshold = 50; // px
    if (info.offset.x < -threshold || info.velocity.x < -500) {
      toggleCarousel(postId, 'next');
    } else if (info.offset.x > threshold || info.velocity.x > 500) {
      toggleCarousel(postId, 'prev');
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      <header className="mb-6 px-2">
        <h1 className="text-3xl font-serif font-bold text-primary">Hello, {user?.username} 👋</h1>
        <p className="text-muted-foreground text-sm">Vote for your favorites in {getCurrentMonthYear()}.</p>
      </header>

      {displayPosts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.06 }}
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
                  {post.retroLocation && post.recreatedLocation ? `${post.retroLocation} → ${post.recreatedLocation}` : '2 hours ago'}
                </p>
              </div>
            </CardHeader>

            {/* Image area: swipe horizontally (drag) to toggle between retro/recreated.
                No buttons are shown — swipe only like Instagram. */}
            <div className="relative aspect-[4/5] w-full bg-stone-200 overflow-hidden">
              <motion.div
                className="absolute inset-0 w-full h-full"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={(event, info) => onDragEnd(post.id, event as any, info)}
              >
                <AnimatePresence initial={false} mode="wait">
                  <motion.img
                    key={`${post.id}-slide-${getCarouselIndex(post.id)}`}
                    src={getCarouselIndex(post.id) === 0 && post.retroImage ? post.retroImage : post.image}
                    alt={post.description || 'Photo'}
                    className="absolute inset-0 w-full h-full object-cover select-none"
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.28, ease: 'easeInOut' }}
                    draggable={false}
                  />
                </AnimatePresence>
              </motion.div>

              {/* indicator label */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {getCarouselIndex(post.id) === 0 ? 'Original' : 'Recreation'}
              </div>
            </div>

            <CardContent className="p-4 pt-3 space-y-3">
              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={post.user === user?.username}
                  className={cn('flex items-center gap-2 hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed', post.isLiked ? 'text-primary' : 'text-muted-foreground')}
                  onClick={() => toggleLike(post.id)}
                >
                  <ThumbsUp className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.likes}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpenCommentsId(openCommentsId === post.id ? null : post.id)}
                  data-testid={`button-comment-${post.id}`}
                >
                  <MessageCircle className="w-6 h-6" />
                </Button>

                <Button variant="ghost" size="icon" className="ml-auto" onClick={() => navigator.share?.({ title: post.user, text: post.description, url: window.location.href })}>
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
                    <Button size="icon" className="h-9 w-9" onClick={() => handleAddComment(post.id)} data-testid={`button-send-comment-${post.id}`}>
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
            <Button variant="outline" onClick={() => setVoteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (voteConfirmId) {
                  toggleLike(voteConfirmId);
                }
                setVoteConfirmId(null);
              }}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
