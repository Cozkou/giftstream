import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePurchaseItem } from '../hooks/useQueries';

type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

interface Item {
  id: number;
  rarity: Rarity;
  position: number;
  name: string;
}

interface ItemModalProps {
  item: Item | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const rarityDescriptions: Record<Rarity, string> = {
  common: 'A standard festive item found throughout the season.',
  rare: 'An uncommon treasure with special holiday charm.',
  epic: 'A magnificent piece radiating Christmas magic.',
  legendary: 'An extraordinary artifact of unparalleled wonder!'
};

export function ItemModal({ item, isOpen, onOpenChange }: ItemModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const { mutate: purchaseItem, isPending } = usePurchaseItem();

  // Reset purchase state when modal opens with a new item
  useEffect(() => {
    if (isOpen && item) {
      setIsPurchased(false);
      setShowConfetti(false);
    }
  }, [isOpen, item?.id]);

  // Handle modal close
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset states when closing
      setIsPurchased(false);
      setShowConfetti(false);
    }
    onOpenChange(open);
  };

  const handlePurchase = () => {
    if (!item) return;
    
    purchaseItem(
      { item },
      {
        onSuccess: () => {
          setIsPurchased(true);
          setShowConfetti(true);
          setTimeout(() => {
            setShowConfetti(false);
          }, 2000);
        },
      }
    );
  };

  // Don't render if no item is selected
  if (!item) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className={`sm:max-w-md backdrop-blur-md border-4 shadow-2xl relative overflow-hidden modal-${item.rarity}`}>
        {/* Decorative snowflake icons in corners */}
        <img 
          src="/assets/generated/snowflake-icon-transparent.dim_64x64.png" 
          alt="" 
          className="absolute top-2 left-2 w-8 h-8 opacity-30 animate-pulse pointer-events-none"
        />
        <img 
          src="/assets/generated/snowflake-icon-transparent.dim_64x64.png" 
          alt="" 
          className="absolute top-2 right-2 w-8 h-8 opacity-30 animate-pulse pointer-events-none"
          style={{ animationDelay: '0.5s' }}
        />
        <img 
          src="/assets/generated/snowflake-icon-transparent.dim_64x64.png" 
          alt="" 
          className="absolute bottom-2 left-2 w-8 h-8 opacity-30 animate-pulse pointer-events-none"
          style={{ animationDelay: '1s' }}
        />
        <img 
          src="/assets/generated/snowflake-icon-transparent.dim_64x64.png" 
          alt="" 
          className="absolute bottom-2 right-2 w-8 h-8 opacity-30 animate-pulse pointer-events-none"
          style={{ animationDelay: '1.5s' }}
        />

        {/* Confetti animation overlay */}
        {showConfetti && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
            <img 
              src="/assets/generated/confetti-sparkles-transparent.dim_200x200.png" 
              alt="" 
              className="w-64 h-64 animate-confetti"
            />
          </div>
        )}

        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2 pt-4">
            <span className={`item-badge item-badge-${item.rarity} shadow-xl`}>
              {item.rarity.toUpperCase()}
            </span>
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            <div className="space-y-4">
              {/* Mystery box preview in modal */}
              <div className={`mystery-box-preview mystery-box-preview-${item.rarity} mx-auto relative`}>
                {/* Gift box body */}
                <div className="mystery-box-preview-body">
                  {/* Decorative pattern */}
                  <div className="mystery-box-preview-pattern" />
                </div>
                
                {/* Ribbon vertical */}
                <div className="mystery-box-preview-ribbon-v" />
                
                {/* Ribbon horizontal */}
                <div className="mystery-box-preview-ribbon-h" />
                
                {/* Bow on top */}
                <div className="mystery-box-preview-bow">
                  <div className="mystery-box-preview-bow-left" />
                  <div className="mystery-box-preview-bow-right" />
                  <div className="mystery-box-preview-bow-center" />
                </div>
                
                {/* Glowing snowflake overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                  <img 
                    src="/assets/generated/snowflake-icon-transparent.dim_64x64.png" 
                    alt="" 
                    className="w-20 h-20 animate-spin-slow"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  {item.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {rarityDescriptions[item.rarity]}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 text-sm">
                <div className={`info-card info-card-${item.rarity}`}>
                  <div className="text-muted-foreground">Item ID</div>
                  <div className="font-semibold text-foreground">#{item.id}</div>
                </div>
                <div className={`info-card info-card-${item.rarity}`}>
                  <div className="text-muted-foreground">Rarity</div>
                  <div className="font-semibold text-foreground capitalize">{item.rarity}</div>
                </div>
              </div>

              {/* Purchase confirmation message */}
              {isPurchased && (
                <div className="bg-christmas-gold/20 border-2 border-christmas-gold rounded-lg p-3 animate-fade-in">
                  <p className="text-christmas-gold font-semibold flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Item purchased successfully!
                    <Sparkles className="w-5 h-5" />
                  </p>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="sm:justify-center gap-3 flex-col sm:flex-row">
          {!isPurchased && (
            <Button 
              onClick={handlePurchase}
              disabled={isPending}
              className={`buy-button buy-button-${item.rarity} font-bold px-8 py-6 text-lg`}
            >
              {isPending ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                  Purchasing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Buy Item
                </>
              )}
            </Button>
          )}
          <Button 
            onClick={() => handleOpenChange(false)}
            variant="outline"
            className="border-2 font-semibold px-8"
          >
            <X className="w-4 h-4 mr-2" />
            {isPurchased ? 'Close' : 'Close & Resume'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
