interface Step {
  number: number;
  title: string;
  completed: boolean;
  current: boolean;
}

interface WizardProgressProps {
  steps: Step[];
}

export default function WizardProgress({ steps }: WizardProgressProps) {
  return (
    <div className="sticky top-16 z-40 bg-background border-b border-border py-4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex items-center gap-3">
                <div 
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold text-sm transition-colors ${
                    step.completed 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : step.current 
                      ? 'border-primary text-primary' 
                      : 'border-border text-muted-foreground'
                  }`}
                  data-testid={`step-indicator-${step.number}`}
                >
                  {step.number}
                </div>
                <div className="hidden sm:block">
                  <div className={`text-sm font-medium ${step.current ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.title}
                  </div>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-4 bg-border">
                  <div 
                    className={`h-full transition-all ${step.completed ? 'bg-primary w-full' : 'bg-transparent w-0'}`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
