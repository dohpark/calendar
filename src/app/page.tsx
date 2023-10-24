import Inline from '@/components/layouts/Inline';
import Layer from '@/components/layouts/Layer';
import Split from '@/components/layouts/Split';

export default function Home() {
  return (
    <>
      <header>
        <Split fraction="auto-start" gap="0">
          <div className="w-[238px]">Logo</div>
          <Inline gap="0" justify="between" align="center">
            <div>Date</div>
            <div>연도 / 월 / 일</div>
          </Inline>
        </Split>
      </header>
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
    </>
  );
}
