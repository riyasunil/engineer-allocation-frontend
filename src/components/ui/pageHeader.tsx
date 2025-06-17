import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export const PageHeader = ({
  title,
  description,
  buttonText,
  onButtonClick,
}: PageHeaderProps) => (
  <div className="flex justify-between items-center">
    <div>
      <h1 className="text-2xl font-bold">{title}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
    {buttonText && <Button onClick={onButtonClick}>{buttonText}</Button>}
  </div>
);
