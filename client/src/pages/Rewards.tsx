import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Rewards() {
  const userRewards = useStore((state) => state.userRewards);

  if (!userRewards) {
    return <div className="p-6">Loading rewards...</div>;
  }

  return (
    <div className="p-6 space-y-6 pb-24">
      <h1 className="text-3xl font-serif font-bold text-primary mb-6">Rewards</h1>

      {/* Points Balance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Gift className="w-6 h-6 text-accent" />
                <p className="text-muted-foreground text-sm">Your Points Balance</p>
              </div>
              <p className="text-5xl font-serif font-bold text-primary">{userRewards.points}</p>
              <p className="text-xs text-muted-foreground mt-3">
                = ${(userRewards.points / 100).toFixed(2)} at participating businesses
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary" />
              How to Earn Points
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-semibold text-foreground mb-1">📸 Photo Competition</p>
              <p className="text-muted-foreground">16 votes on a submission = 10,000 points</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">🏪 In-Store Redemption</p>
              <p className="text-muted-foreground">100 points = $1 at participating Old Ellicott City businesses</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* QR Code */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Get Scanned to Earn Points</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <div className="bg-background p-4 rounded-lg">
              <img src="/qr-code.png" alt="Rewards QR Code" className="w-48 h-48 rounded" />
            </div>
          </CardContent>
          <CardContent className="text-center text-xs text-muted-foreground pb-6">
            Show this QR code to earn points at participating businesses
          </CardContent>
        </Card>
      </motion.div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userRewards.transactions.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center p-3 bg-background rounded-lg">
                  <div>
                    <p className="font-semibold text-sm text-foreground">{transaction.store}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="font-bold text-accent">+{transaction.points}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
