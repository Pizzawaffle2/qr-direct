export function DashboardFooter() {
    return (
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} QR Direct. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <a
              href="/privacy"
              className="text-sm text-muted-foreground hover:underline"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="text-sm text-muted-foreground hover:underline"
            >
              Terms
            </a>
            <a
              href="/help"
              className="text-sm text-muted-foreground hover:underline"
            >
              Help
            </a>
          </div>
        </div>
      </footer>
    );
  }