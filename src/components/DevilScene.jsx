import { Image } from '@/components/ui/image';
import CartoonFlames from '@/components/CartoonFlames';

const SCENE_URL =
  'https://media.base44.com/images/public/6ae650594346037bc88fa536/69ea550b8_generated_image.png';

export default function DevilScene() {
  return (
    <div className="relative mx-auto mt-1 flex h-64 w-full max-w-[330px] items-end justify-center">
      <div className="absolute bottom-8 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(255,138,42,0.42),transparent_68%)]" />
      <CartoonFlames tone="back" className="absolute inset-x-0 bottom-10 h-44 w-full opacity-90" />
      <Image
        src={SCENE_URL}
        alt="A grinning rubber-hose imp standing in his flames"
        fittingType="fill"
        className="imp-cut relative mb-12 h-44 w-44 -rotate-2 border-[2.5px] border-[#26170b] shadow-[4px_4px_0_rgba(0,0,0,0.55)]"
      />
      <CartoonFlames className="absolute -bottom-1 left-1/2 h-24 w-64 -translate-x-1/2" />
    </div>
  );
}