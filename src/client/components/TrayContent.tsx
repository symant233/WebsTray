type Props = {
  url: string;
};

export default function TrayContent({ url }: Props) {
  return (
    <div className="w-screen h-screen p-1 pb-3">
      <div className="w-full h-full bg-gray-100 shadow p-2 pb-8 rounded-lg relative after:content-[''] after:absolute after:-bottom-[12px] after:left-1/2 after:-translate-x-1/2 after:border-x-[12px] after:border-transparent after:border-t-[12px] after:border-t-gray-100">
        <iframe
          src={url}
          className="w-full h-full rounded-lg border border-solid"
        ></iframe>
        <div className="select-none pt-1 text-sm text-gray-600">{url}</div>
      </div>
    </div>
  );
}
