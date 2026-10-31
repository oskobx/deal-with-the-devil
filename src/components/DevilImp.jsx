import { Image } from '@/components/ui/image';
import { cn } from '@/lib/utils';

const IMP_URL =
  'https://media.base44.com/images/public/6ae650594346037bc88fa536/16109deff_generated_e8d084c7.png';

export default function DevilImp({ className, alt = 'A grinning cartoon devil with a pitchfork' }) {
  return (
    <Image
      src={IMP_URL}
      alt={alt}
      fittingType="fill"
      className={cn(
        'imp-cut shrink-0 border-[2.5px] border-[#26170b] bg-[#f2e3c0] shadow-[3px_3px_0_rgba(0,0,0,0.55)]',
        className
      )}
    />
  );
}