'use client';

import Layer from '@/components/layouts/Layer';
import Split from '@/components/layouts/Split';

export default function Home() {
  return (
    <main>
      <Split fraction="auto-start" gap="0">
        <Layer classExtend={['w-[256px]']} gap="0">
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
        </Layer>
        <div>2</div>
      </Split>
    </main>
  );
}
