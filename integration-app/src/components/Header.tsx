import Image from 'next/image';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-black bg-opacity-50 shadow-lg">
      <div className="flex items-center space-x-4">
        <Image src="/logo.png" alt="Logo de la Empresa" width={100} height={100} priority className="object-contain" />
      </div>

      <div className="italic">Innovación en Reconocimiento Facial</div>
    </header>
  );
}

