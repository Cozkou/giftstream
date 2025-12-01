import * as React from 'react';

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | undefined>(undefined);

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        />
        {/* Content */}
        {children}
      </div>
    </DialogContext.Provider>
  );
}

export function DialogContent({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error('DialogContent must be used within Dialog');

  return (
    <div
      className={`relative z-50 bg-background text-foreground rounded-lg p-6 shadow-lg max-w-lg w-full mx-4 ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

export function DialogHeader({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}>{children}</div>;
}

export function DialogTitle({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h2>;
}

export function DialogDescription({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>;
}

export function DialogFooter({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}>{children}</div>;
}

