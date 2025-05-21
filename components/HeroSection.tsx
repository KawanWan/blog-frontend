import Image from 'next/image';
import Link from 'next/link';

const featuredArticle = {
  title: "Desvendando o JavaScript: Dicas e Técnicas Essenciais para Desenvolvedores",
  author: "John Doe",
  date: "Março 20, 2025",
  imageUrl: '/images/hero.jpg',
  slug: '/articles/javascript-dicas',
};

const newArticles = [
  { title: 'Inteligência Artificial: O Futuro da Automação e da Transformação Digital', slug: '#' },
  { title: 'Computação Quântica: O Próximo Grande Salto para a Tecnologia', slug: '#' },
  { title: 'Como a Internet das Coisas (IoT) Está Moldando o Futuro das Cidades Inteligentes', slug: '#' },
  { title: 'O Impacto da Realidade Virtual e Aumentada no Setor de Educação', slug: '#' },
];

export default function HeroSection() {
  return (
    <section className="flex flex-col lg:flex-row gap-8 px-8 py-10">
      <div className="lg:w-2/3 space-y-4">
        <div className="relative w-full h-80 rounded overflow-hidden">
          <Image src={featuredArticle.imageUrl} alt={featuredArticle.title} fill style={{ objectFit: 'cover' }} />
        </div>
        <h1 className="text-3xl font-bold leading-snug">{featuredArticle.title}</h1>
        <p className="text-sm text-gray-500">Por {featuredArticle.author} - {featuredArticle.date}</p>
        <Link href={featuredArticle.slug} className="inline-block bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition">
          Ler Mais
        </Link>
      </div>
      <aside className="lg:w-1/3">
        <h2 className="text-2xl font-semibold mb-4">New</h2>
        <ul className="space-y-3">
          {newArticles.map((art, i) => (
            <li key={i}>
              <Link href={art.slug} className="text-gray-700 hover:text-black block">
                {art.title}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}