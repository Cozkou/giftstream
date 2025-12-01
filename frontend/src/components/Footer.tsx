export function Footer() {
  return (
    <footer className="w-full py-3">
      <div className="container mx-auto px-4">
        <p className="text-center text-muted-foreground text-xs">
          © 2025. Built with love using{' '}
          <a 
            href="https://caffeine.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
