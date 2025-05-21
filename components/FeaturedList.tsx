import Image from 'next/image';
import Link from 'next/link';

const featuredList = [
  {
    id: 1,
    number: '01',
    title: '5 Gerações de Redes 5G: O Que Esperar da Próxima Revolução da Conectividade',
    date: 'Março 19, 2025',
    imageUrl: '/images/5g.jpg',
    slug: '#',
  },
  {
    id: 2,
    number: '02',
    title: 'Blockchain Além das Criptomoedas: Como a Tecnologia Está Transformando Indústrias Tradicionais',
    date: 'Março 18, 2025',
    imageUrl: '/images/blockchain.jpg',
    slug: '#',
  },
  {
    id: 3,
    number: '03',
    title: 'Dominando TypeScript: Por que a Tipagem Estática Está Transformando o Desenvolvimento',
    date: 'Março 16, 2025',
    imageUrl: '/images/typescript.jpg',
    slug: '#',
  },
];

export default function FeaturedList() {
  return (
    <section className="px-8 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {featuredList.map((item) => (
          <article key={item.id} className="space-y-2">
            <div className="text-4xl font-bold">{item.number}</div>
            <div className="relative w-full h-40 rounded overflow-hidden">
              <Image src={item.imageUrl} alt={item.title} fill style={{ objectFit: 'cover' }} />
            </div>
            <h3 className="text-lg font-semibold leading-snug">
              <Link href={item.slug} className="hover:underline block">
                {item.title}
              </Link>
            </h3>
            <p className="text-sm text-gray-500">{item.date}</p>
          </article>
        ))}
      </div>
    </section>
  );
}