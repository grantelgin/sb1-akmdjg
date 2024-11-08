import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title: string;
  items: FAQItem[];
}

function FAQSection({ title, items }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="border rounded-lg">
            <button
              className="w-full px-6 py-4 flex justify-between items-center text-left"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-medium text-gray-900">{item.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transform transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4">
                <p className="text-gray-600">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FAQ() {
  const homeownerFAQs = [
    {
      question: "What should I do after storm damage to my home?",
      answer: "After storm damage, ensure your safety first. Check for any structural damage and avoid using electrical appliances if there's water damage. Document the damage with photos and contact your insurance company to report the damage. Secure your property to prevent further damage and consider hiring a professional for a detailed assessment."
    },
    {
      question: "How can I find a reliable contractor for storm repairs?", 
      answer: "To find a reliable contractor, start by asking for recommendations from friends and family. Check online reviews and ratings. Verify the contractor's license and insurance. Request multiple quotes and ensure the contractor provides a detailed written estimate. Be wary of contractors who demand full payment upfront."
    },
    {
      question: "How long does storm damage repair take?",
      answer: "The duration of storm damage repair depends on the extent of the damage. Minor repairs may take a few days, while significant structural repairs could take weeks or even months. Factors such as contractor availability, weather conditions, and insurance processing times can also affect the timeline."
    },
    {
      question: "How can I know if a contractor is trustworthy?",
      answer: "When choosing a contractor, look for proper licensing, insurance, and certifications that demonstrate their expertise. At Restoration Response Network, we ensure every contractor in our network passes a rigorous vetting process. This includes verifying credentials, checking for local licenses, confirming insurance, and reviewing past customer feedback. We connect you only with trusted, reputable professionals, so you can rebuild with confidence."
    },
    {
      question: "What should I do immediately after my property is damaged by a storm?",
      answer: "First, ensure your safety and the safety of anyone on your property. If there's significant structural damage, avoid entering the building until it's been inspected. Next, document the damage by taking photos or videos, and contact your insurance company to initiate a claim. Restoration Response Network can help with a free damage assessment report, designed to fast-track your insurance claim and connect you with reliable local contractors."
    },
    {
      question: "How long does storm damage repair usually take?",
      answer: "The timeline for storm damage repair varies depending on the severity of the damage, the type of repairs needed, and weather conditions. Minor repairs could take a few days, while more extensive damage might require several weeks. At Restoration Response Network, we work closely with vetted contractors to expedite the process and keep you informed every step of the way."
    },
    {
      question: "Will my homeowner's insurance cover the cost of storm damage repairs?",
      answer: "Most standard homeowner's insurance policies cover storm damage, including damage caused by wind, hail, and falling trees. However, coverage can vary depending on your policy and the nature of the storm. We help by providing a detailed damage assessment report that ensures all necessary information is available to your insurer, making it easier to process claims."
    },
    {
      question: "What types of storm damage can contractors repair?",
      answer: "Contractors in our network specialize in a wide range of storm damage repairs, including roof repairs, siding replacement, window and door repairs, water damage restoration, and structural fixes. Whether it's wind, hail, water, or debris-related damage, we connect you with professionals who have the expertise to restore your property."
    },
    {
      question: "What is included in the free damage assessment report?",
      answer: "Our free damage assessment report includes a detailed analysis of the damage, estimated repair costs, and documentation (photos or videos) to help expedite your insurance claim. This report is designed to streamline the process for both contractors and insurers, ensuring a faster and more accurate repair estimate."
    },
    {
      question: "How do I prevent further damage to my home after a storm?",
      answer: "After a storm, it's important to temporarily secure your property to prevent further damage. This might include covering roof leaks with a tarp, boarding up broken windows, or removing debris. Our contractors can help with emergency tarping and boarding services until permanent repairs are made."
    },
    {
      question: "How do I start the storm damage repair process?",
      answer: "To begin the process, simply complete our 8-question damage assessment form. Once we have your information, you'll receive a free, personalized damage assessment report. From there, we'll match you with trusted, local contractors who can handle your repair needs and assist with your insurance claim."
    },
    {
      question: "How can I avoid storm damage repair scams?",
      answer: "Unfortunately, storms often attract unqualified or dishonest contractors looking to take advantage of homeowners. To avoid scams, always ask for proof of licensing and insurance, read reviews, and get everything in writing. Restoration Response Network takes the guesswork out of the process by thoroughly vetting every contractor in our network, ensuring you work only with trustworthy professionals."
    },
    {
      question: "What makes Restoration Response Network different from other contractor referral services?",
      answer: "Unlike other services, Restoration Response Network focuses specifically on storm damage repair and has a strict vetting process to ensure that every contractor in our network is licensed, insured, and experienced. We offer a free damage assessment report and provide end-to-end support, including help with insurance claims, so you can focus on rebuilding."
    },
    {
      question: "Can I choose my own contractor after getting the damage assessment report?",
      answer: "Yes, while we provide a network of vetted contractors for your storm damage repair needs, you are free to choose your own contractor. However, we recommend selecting a professional who has experience with storm damage repairs to ensure quality work and insurance claim support."
    }
  ];

  const businessFAQs = [
    {
      question: "How can I minimize business disruption during storm damage repairs?",
      answer: "Minimizing business disruption during repairs depends on the extent of the damage and your specific operational needs. Restoration Response Network works with contractors who can create a phased repair plan, focusing on high-priority areas first and scheduling work during non-peak hours when possible. We prioritize getting your business back on track with minimal downtime."
    },
    {
      question: "What types of storm damage repairs do commercial contractors specialize in?", 
      answer: "Commercial contractors in our network specialize in various types of storm damage, including roof repairs (especially for flat roofs commonly used in commercial buildings), HVAC system restoration, siding replacement, water damage mitigation, structural repairs, and restoring large-scale windows and storefronts. We connect you with professionals who understand the complexities of commercial construction."
    },
    {
      question: "How do I know if a commercial contractor is qualified to handle storm damage repairs?",
      answer: "It's crucial to hire contractors with experience in commercial buildings, as they are often built with different materials and require compliance with specific local codes. Every contractor in our network is fully vetted, licensed, and insured, with proven experience in commercial storm damage repairs. We verify their expertise in working with commercial properties and ensuring compliance with safety and building regulations."
    },
    {
      question: "Will insurance cover storm damage repairs for my business?",
      answer: "Most commercial property insurance policies cover storm damage, but the exact coverage will depend on your policy details and the nature of the damage. Restoration Response Network helps business owners by providing a detailed damage assessment report tailored for commercial buildings, which can be used to support your insurance claim and expedite the process."
    },
    {
      question: "What should I do immediately after my business is damaged by a storm?",
      answer: "After ensuring everyone's safety, document the damage by taking photos or videos and contact your insurance company. You should also mitigate further damage by securing the property (e.g., boarding up windows, tarping roofs). Restoration Response Network can assist with a free commercial damage assessment report, which helps you get fast, accurate repair estimates and connects you with reliable contractors."
    },
    {
      question: "What materials and systems are typically affected in a commercial building after a storm?",
      answer: "Commercial buildings can experience different types of damage depending on their construction. Commonly affected areas include flat or low-slope roofs, HVAC systems, large windows or glass storefronts, electrical systems, and building facades made from materials like metal or synthetic siding. Contractors in our network are equipped to handle repairs on all these systems, using industry-approved methods and materials to restore your building."
    },
    {
      question: "How long do commercial storm damage repairs typically take?",
      answer: "The timeframe for repairs will depend on the severity of the damage and the complexity of the building systems involved. While minor damage may be repaired within days, larger-scale repairs involving structural elements or specialized systems can take weeks or longer. Restoration Response Network partners with contractors who work efficiently to minimize downtime and keep you informed throughout the process."
    },
    {
      question: "How can I protect my business from future storm damage?",
      answer: "Preventative measures can reduce the risk of future storm damage. Regular maintenance of your building's roof, windows, and drainage systems is key. After repairs, our contractors can provide guidance on stormproofing strategies, including installing impact-resistant windows, reinforcing roofs, or improving drainage systems to minimize water damage. We also recommend conducting annual inspections before storm seasons."
    },
    {
      question: "How do I handle storm damage to essential building systems like HVAC, electrical, or plumbing?",
      answer: "Damage to essential building systems requires specialized expertise. Restoration Response Network connects you with contractors who have experience restoring HVAC, electrical, and plumbing systems in commercial buildings. This ensures that critical services are restored as quickly as possible, minimizing disruption to your business."
    },
    {
      question: "What should I look for in a commercial storm damage contractor?",
      answer: "A qualified commercial contractor should have experience with large-scale, multi-system repairs, and be knowledgeable about local building codes and compliance requirements. They should be licensed, insured, and familiar with the specific materials and construction methods used in commercial buildings. Restoration Response Network only works with contractors who meet these criteria, ensuring your business is in good hands."
    },
    {
      question: "How can I expedite my insurance claim for commercial storm damage?",
      answer: "To speed up the insurance claims process, it's important to provide detailed documentation of the damage. Restoration Response Network offers a free, comprehensive damage assessment report that includes photos, repair estimates, and a clear summary of the damage. This report is designed to help business owners fast-track their insurance claims, ensuring your repairs are not delayed."
    },
    {
      question: "How does the size of my commercial property affect the storm damage repair process?",
      answer: "Larger commercial properties often require more complex repairs, especially if they involve multiple floors, extensive HVAC systems, or significant structural elements. Contractors in our network are experienced in handling properties of all sizes and can coordinate large-scale projects efficiently to minimize business interruptions."
    },
    {
      question: "Can your contractors assist with emergency repairs to secure my property?",
      answer: "Yes, we work with contractors who provide emergency repair services, including tarping roofs, boarding up windows, and securing entrances to prevent further damage. These services are crucial for protecting your business while permanent repairs are being scheduled."
    },
    {
      question: "What are the risks of delaying storm damage repairs for my business?",
      answer: "Delaying repairs can lead to more extensive damage, such as water intrusion, mold growth, and compromised structural integrity. This can also increase repair costs and result in longer business interruptions. It's important to address storm damage as soon as possible. Restoration Response Network helps business owners quickly connect with reliable contractors to prevent further damage and get repairs underway."
    },
    {
      question: "Why should I choose Restoration Response Network for my business's storm damage repairs?",
      answer: "Restoration Response Network specializes in connecting business owners with trusted, experienced contractors who understand the unique challenges of commercial storm damage repair. We ensure that every contractor is licensed, insured, and equipped to handle complex repairs for businesses. We also provide a free damage assessment report to support your insurance claim, making the process faster and less stressful."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900">Frequently Asked Questions</h1>
          <p className="mt-4 text-xl text-gray-600">
            Find answers to common questions about storm damage repair and our services
          </p>
        </div>

        <FAQSection title="For Homeowners" items={homeownerFAQs} />
        <FAQSection title="For Business Owners" items={businessFAQs} />
      </div>
    </div>
  );
} 