import WizardProgress from '../WizardProgress';

export default function WizardProgressExample() {
  const steps = [
    { number: 1, title: 'Basics', completed: true, current: false },
    { number: 2, title: 'Customization', completed: false, current: true },
    { number: 3, title: 'Uploads', completed: false, current: false },
    { number: 4, title: 'Review', completed: false, current: false },
  ];

  return <WizardProgress steps={steps} />;
}
