import Frame from './components/Frame';
import Content from './components/Content';
import TrayContent from './components/TrayContent';
import AppInput from './components/AppInput';

export default function App() {
  if (location.hash) {
    return <TrayContent url={location.hash.slice(1)} />;
  }

  return (
    <div className="h-screen w-screen bg-white flex flex-col border border-solid border-black">
      <Frame>
        <AppInput />
      </Frame>
      <Content />
    </div>
  );
}
