
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SubmissionSection from '@/components/SubmissionSection';
import ProfessorsSection from '@/components/ProfessorsSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen font-inter">
      <Header />
      <HeroSection />
      <AboutSection />
      <SubmissionSection />
      <ProfessorsSection />
      <Footer />
    </div>
  );
};

export default Index;
