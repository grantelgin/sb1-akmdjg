import { Guide } from '../types/guides';
import { Clipboard, Users, FileText, Calculator, Shield } from 'lucide-react';

export const guides: Guide[] = [
  {
    id: '1',
    title: 'Complete Guide to Storm Damage Assessment',
    description: 'Learn how to properly assess and document storm damage to your property, ensuring you capture all necessary details for insurance claims and repairs.',
    category: 'homeowner',
    slug: 'damage-assessment-guide',
    readingTime: '8 min read',
    publishDate: 'March 15, 2024',
    coverImage: 'https://images.unsplash.com/photo-1523294587484-bae6cc870010',
    content: `
    <h2>Comprehensive Guide to Storm Damage Assessment</h2>
    <p>Welcome! If you’re reading this, you’ve likely experienced the overwhelming aftermath of a storm. As an experienced project manager in storm restoration, I’m here to guide you step by step through the process of assessing your home or business for damage. Remember, you are not alone—this is your first step toward recovery, and I’m here to support you every step of the way.</p>

    <div class="highlight">
        <strong>Key Reminder:</strong> Safety comes first! If your property has structural damage or if you suspect there are safety hazards (like downed power lines or gas leaks), call emergency services or a licensed professional immediately. Do not enter a property until it’s deemed safe.
    </div>

    <h3>1. Document Everything</h3>
    <p>Before you start any cleanup, document the damage. Use your smartphone or a camera to take clear photos and videos of all affected areas, both inside and outside the property. These visuals will be essential for your insurance claim and for getting an accurate estimate from contractors.</p>
    <ul>
        <li>Take wide-angle shots of entire rooms or exterior areas.</li>
        <li>Zoom in on specific damage, such as roof shingles, broken windows, or water-damaged walls.</li>
        <li>Capture any standing water or debris.</li>
    </ul>

    <h3>2. Inspect the Exterior</h3>
    <p>Start your assessment by walking around the outside of your property. Here’s what to look for:</p>
    <ul>
        <li><strong>Roof Damage:</strong> Missing or loose shingles, dents from hail, or visible holes. If you can’t safely inspect the roof, use binoculars or hire a professional.</li>
        <li><strong>Siding and Windows:</strong> Cracks, chips, or holes in siding, and shattered or cracked windows.</li>
        <li><strong>Gutters and Downspouts:</strong> Check for loose or detached gutters and ensure water is flowing away from the foundation.</li>
        <li><strong>Foundation:</strong> Look for any new cracks or signs of shifting.</li>
    </ul>

    <h3>3. Check the Interior</h3>
    <p>Once you’ve inspected the exterior, move indoors to evaluate the inside of your property. Pay close attention to the following:</p>
    <ul>
        <li><strong>Ceilings and Walls:</strong> Look for water stains, bulging areas, or cracks that may indicate structural issues.</li>
        <li><strong>Floors:</strong> Check for warping, buckling, or soft spots, especially near doors and windows.</li>
        <li><strong>Basement or Crawl Space:</strong> Inspect for standing water, seepage, or mold growth.</li>
    </ul>
    <div class="important">
        <strong>Important:</strong> If you spot mold, wear a mask and gloves. Mold spreads quickly and can cause health issues.
    </div>

    <h3>4. Assess Utility Systems</h3>
    <p>Storms can also damage your property’s utility systems. Check these essential components:</p>
    <ul>
        <li><strong>Electrical:</strong> If you see frayed wires or experience power issues, call an electrician. Do not attempt to fix electrical problems yourself.</li>
        <li><strong>Plumbing:</strong> Check for leaks or broken pipes. If you find any issues, turn off the main water supply and call a plumber.</li>
        <li><strong>HVAC:</strong> Inspect your heating and cooling systems for signs of damage or water intrusion.</li>
    </ul>

    <h3>5. Prioritize Your Repairs</h3>
    <p>Once you have a full understanding of the damage, make a list of necessary repairs. Prioritize issues that impact the safety and security of your property, such as:</p>
    <ul>
        <li>Structural damage</li>
        <li>Roof or window repairs</li>
        <li>Water damage mitigation</li>
    </ul>
    <p>Next, reach out to reputable contractors for estimates. Be cautious of storm-chaser scams—always verify licenses and read reviews.</p>

    <h3>6. File an Insurance Claim</h3>
    <p>Contact your insurance company as soon as possible to file a claim. Provide them with all the documentation you’ve gathered, including photos, videos, and a detailed list of damaged items. Be persistent and follow up regularly to stay on top of your claim.</p>

    <h3>7. Take Care of Yourself</h3>
    <p>Experiencing storm damage is stressful. Remember to lean on friends and family for support, and don’t hesitate to ask for help. Your well-being is just as important as the restoration of your property.</p>

    <p>Rebuilding after a storm can feel daunting, but with the right approach and support, your property—and your peace of mind—will be restored. You’re not just repairing a building; you’re reclaiming your space and your sense of security. Let's rebuild together!</p>    `
  },
  {
    id: '2',
    title: 'Selecting Your Construction Team',
    description: 'Essential guidelines for choosing the right contractors and construction professionals for your storm damage repairs.',
    category: 'homeowner',
    slug: 'selecting-construction-team',
    readingTime: '10 min read',
    publishDate: 'March 18, 2024',
    coverImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12',
    content: `
      <h2>Finding the Right Construction Team</h2>
      <p>Your choice of contractors will significantly impact the quality and success of your restoration project. Here's how to make an informed decision.</p>

      <h3>Key Qualifications to Look For</h3>
      <ul>
        <li>Valid state licensing</li>
        <li>Proper insurance coverage</li>
        <li>Storm damage restoration experience</li>
        <li>Local presence and reputation</li>
      </ul>

      <h3>Red Flags to Watch For</h3>
      <ul>
        <li>Pressure to sign immediately</li>
        <li>Unusually low bids</li>
        <li>Lack of written contracts</li>
        <li>No physical business address</li>
      </ul>
    `
  },
  {
    id: '3',
    title: 'Understanding Construction Contracts',
    description: 'A comprehensive guide to construction contracts, terms, and what you need to know to protect your interests during storm damage repairs.',
    category: 'homeowner',
    slug: 'construction-contracts',
    readingTime: '12 min read',
    publishDate: 'March 20, 2024',
    coverImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85',
    content: `
      <h2>Essential Contract Elements</h2>
      <p>Understanding your construction contract is crucial for a successful restoration project. This guide explains key terms and provisions you should know.</p>

      <h3>Key Contract Components</h3>
      <ul>
        <li>Scope of work details</li>
        <li>Timeline and completion dates</li>
        <li>Payment terms and schedule</li>
        <li>Change order procedures</li>
        <li>Warranty information</li>
      </ul>

      <h3>Your Rights and Protections</h3>
      <ul>
        <li>Right to cancel within 3 business days</li>
        <li>Insurance claim provisions</li>
        <li>Workmanship guarantees</li>
        <li>Dispute resolution procedures</li>
      </ul>

      <h3>Common Contract Terms Explained</h3>
      <ul>
        <li>Substantial completion</li>
        <li>Force majeure clauses</li>
        <li>Indemnification</li>
        <li>Lien waivers</li>
      </ul>
    `
  },
  {
    id: '4',
    title: 'Estimating Construction Costs',
    description: 'Learn how to understand and evaluate construction cost estimates for your storm damage repairs.',
    category: 'business',
    slug: 'estimating-costs',
    readingTime: '15 min read',
    publishDate: 'March 22, 2024',
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
    content: `
      <h2>Understanding Construction Estimates</h2>
      <p>Accurate cost estimation is crucial for budgeting your restoration project. Learn how to read and evaluate construction estimates effectively.</p>

      <h3>Components of a Detailed Estimate</h3>
      <ul>
        <li>Material costs and quantities</li>
        <li>Labor rates and hours</li>
        <li>Equipment costs</li>
        <li>Overhead and profit margins</li>
        <li>Contingency allowances</li>
      </ul>

      <h3>Common Cost Variables</h3>
      <ul>
        <li>Material price fluctuations</li>
        <li>Seasonal labor rates</li>
        <li>Regional cost differences</li>
        <li>Permit and inspection fees</li>
      </ul>

      <h3>Red Flags in Estimates</h3>
      <ul>
        <li>Vague line items</li>
        <li>Missing scope elements</li>
        <li>Unrealistic timelines</li>
        <li>Inadequate detail</li>
      </ul>
    `
  },
  {
    id: '5',
    title: 'Navigating Insurance Claims',
    description: 'A step-by-step guide to managing your insurance claim process for storm damage repairs.',
    category: 'business',
    slug: 'insurance-claims-process',
    readingTime: '20 min read',
    publishDate: 'March 25, 2024',
    coverImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85',
    content: `
      <h2>Understanding the Claims Process</h2>
      <p>Successfully navigating your insurance claim is crucial for getting the coverage you deserve. This guide walks you through each step of the process.</p>

      <h3>Initial Steps</h3>
      <ul>
        <li>Document all damage immediately</li>
        <li>Contact your insurance provider</li>
        <li>Understand your policy coverage</li>
        <li>Schedule an adjuster inspection</li>
      </ul>

      <h3>Working with Adjusters</h3>
      <ul>
        <li>Preparing for the inspection</li>
        <li>Providing documentation</li>
        <li>Understanding the adjustment process</li>
        <li>Negotiating your claim</li>
      </ul>

      <h3>Common Claim Challenges</h3>
      <ul>
        <li>Coverage disputes</li>
        <li>Depreciation calculations</li>
        <li>Supplemental claims</li>
        <li>Appeals process</li>
      </ul>
    `
  }
];
