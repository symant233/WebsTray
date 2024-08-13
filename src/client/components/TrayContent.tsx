type Props = {
  url: string;
};

export default function TrayContent({ url }: Props) {
  return (
    <div className="w-screen h-screen p-2 bg-gray-100">
      <iframe src={url} className="w-full h-full rounded"></iframe>
    </div>
  );
}
