interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-black text-white flex flex-col justify-center items-center px-10">
        <h1 className="text-7xl font-serif">M.</h1>
        <p className="mt-2 text-center text-sm">Inovação ao Seu Alcance.</p>
      </div>

      <div className="w-1/2 flex flex-col justify-center items-center px-10">
        <h2 className="text-2xl font-semibold mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
}