import { LandingNavbar } from '@/layout/landing/LandingNavbar'
import { ScrollProgressBar } from '@/components/motion/ScrollProgressBar'
import { Hero } from './landing-sections/Hero'
import { HowItWorks } from './landing-sections/HowItWorks'
import { Features } from './landing-sections/Features'
import { ProductsShowcase } from './landing-sections/ProductsShowcase'
import { CategoriesPreview } from './landing-sections/CategoriesPreview'
import { SuppliersPreview } from './landing-sections/SuppliersPreview'
import { WhyChooseUs } from './landing-sections/WhyChooseUs'
import { InterfaceShowcase } from './landing-sections/InterfaceShowcase'
import { Contact } from './landing-sections/Contact'
import { Footer } from './landing-sections/Footer'

export default function LandingPage() {
  return (
    <div className="relative bg-bg">
      <ScrollProgressBar />
      <LandingNavbar />
      <Hero />
      <HowItWorks />
      <Features />
      <ProductsShowcase />
      <CategoriesPreview />
      <SuppliersPreview />
      <WhyChooseUs />
      <InterfaceShowcase />
      <Contact />
      <Footer />
    </div>
  )
}
