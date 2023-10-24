'use client';

import Split from '@/components/layouts/Split';

export default function Home() {
  return (
    <main>
      <Split fraction="auto-start" gap="0">
        <div className="w-[256px]">1</div>
        <div>2</div>
      </Split>
    </main>
  );
}
