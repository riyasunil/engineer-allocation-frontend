import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description?: string;
  buttonText?: string;
  ButtonIcon?: React.ElementType;
  onButtonClick?: () => void;
}

export const PageHeader = ({
  title,
  description,
  buttonText,
  ButtonIcon,
  onButtonClick,
}: PageHeaderProps) => (
  <div className="flex justify-between items-center">
    <div>
      <h1 className="text-2xl font-bold">{title}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
    {buttonText && (
      <Button onClick={onButtonClick}>
        {ButtonIcon && <ButtonIcon className="w-4 h-4" />}
        {buttonText}
      </Button>
    )}
  </div>
);
