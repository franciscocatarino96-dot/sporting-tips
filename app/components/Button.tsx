type ButtonProps = {
  text: string;
};

export default function Button({ text }: ButtonProps) {
  return (
    <button className="rounded-xl bg-green-600 px-8 py-4 text-xl font-semibold hover:bg-green-500">
      {text}
    </button>
  );
}