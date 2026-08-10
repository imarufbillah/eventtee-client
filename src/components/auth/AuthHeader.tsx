interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="space-y-1.5 text-center">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h1>
      <p className="font-sans text-xs text-muted-foreground sm:text-sm">
        {subtitle}
      </p>
    </div>
  );
}
