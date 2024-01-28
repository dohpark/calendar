import Sidebar from '@/components/Sidebar';
import Split from '@/components/shared/layouts/Split';
import Header from '@/components/Header';
import Main from '@/components/Main';

export default function Home() {
  return (
    <>
      <Header />
      <Split fraction="auto-start" gap="0">
        <Sidebar />
        <Main />
      </Split>
    </>
  );
}
