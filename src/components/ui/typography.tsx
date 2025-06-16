export function TypographyH1({ text }: { text: string }) {
  return (
    <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
      {text}
    </h1>
  );
}

export function TypographyH2({ text }: { text: string }) {
  return (
    <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
      {text}
    </h2>
  );
}

export function TypographyH3({ text }: { text: string }) {
  return (
    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
      {text}
    </h2>
  );
}

export function TypographyH4({ text }: { text: string }) {
  return (
    <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">{text}</h2>
  );
}

export function TypographyP({ text, className, muted }: { text: string, className?: string, muted? : boolean }) {
  return <p className={`p-0 m-0 ${className? className : ''} ${muted? 'text-muted-foreground' : ''}`}>{text}</p>
}
