import { appIconBase64 } from '@client/constant';
import { version } from '@/../package.json';
import DevLabel from '@client/components/common/DevLabel';

const AboutSetting = () => {
  return (
    <div className="w-full">
      <div className="p-4 text-lg font-bold">About</div>
      <img
        src={appIconBase64}
        className="m-auto w-20 h-20 block my-4"
        draggable="false"
      ></img>
      <p className="text-lg text-center w-full p-2 font-bold">WebsTray</p>
      <div className="p-4 *:pb-2">
        <p>
          <strong>Author:&nbsp;</strong>
          <span
            className="text-blue-500 underline cursor-pointer"
            onClick={() =>
              window.electron.openExternal('https://github.com/symant233')
            }
          >
            symant233
          </span>
        </p>
        <p>
          <strong>Version:</strong> {version} <DevLabel showProd={true} />
        </p>
        <p>
          <strong>Github:&nbsp;</strong>
          <span
            className="text-blue-500 underline cursor-pointer"
            onClick={() =>
              window.electron.openExternal(
                'https://github.com/symant233/WebsTray',
              )
            }
          >
            https://github.com/symant233/WebsTray
          </span>
        </p>
        <p>
          <strong>Check for updates:&nbsp;</strong>
          <span
            className="text-blue-500 underline cursor-pointer"
            onClick={() =>
              window.electron.openExternal(
                'https://github.com/symant233/WebsTray/releases/latest',
              )
            }
          >
            Latest Release
          </span>
        </p>
        <p>
          <strong>License:</strong> GPL-3.0
        </p>
      </div>
    </div>
  );
};

export default AboutSetting;
