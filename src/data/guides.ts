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
      <h2>Understanding Storm Damage Assessment</h2>
      <p>A thorough damage assessment is crucial for both insurance claims and repair planning. This guide will walk you through the essential steps to document and assess storm damage properly.</p>

      <h3>Initial Safety Considerations</h3>
      <ul>
        <li>Wait until authorities declare the area safe</li>
        <li>Watch for downed power lines</li>
        <li>Check for structural stability</li>
        <li>Use proper safety equipment</li>
      </ul>

      <h3>Documentation Steps</h3>
      <ol>
        <li>Photograph all damaged areas</li>
        <li>Take videos when possible</li>
        <li>Document the date and time of the storm</li>
        <li>Keep a detailed inventory of damaged items</li>
      </ol>

      <h3>Common Areas to Inspect</h3>
      <ul>
        <li>Roof and gutters</li>
        <li>Windows and doors</li>
        <li>Siding and exterior walls</li>
        <li>Foundation</li>
        <li>Interior walls and ceilings</li>
      </ul>
    `
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
