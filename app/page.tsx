import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturedList from '@/components/FeaturedList';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturedList />
      </main>
    </>
  );
}