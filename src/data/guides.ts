import { Guide } from '../types/guides';
import { Clipboard, Users, FileText, Calculator, Shield } from 'lucide-react';

export const guides: Guide[] = [
  {
    id: '1',
    title: 'Complete Guide to Storm Damage Assessment',
    description: 'Learn how to properly assess and document storm damage to your property, ensuring you capture all necessary details for insurance claims and repairs.',
    category: 'homeowner',
    slug: 'damage-assessment-guide',
    readingTime: '5 min read',
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
    readingTime: '4 min read',
    publishDate: 'March 18, 2024',
    coverImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12',
    content: `
<h2>Finding the Right Construction Team</h2>
    <p>Your choice of contractors will significantly impact the quality and success of your restoration project. Here's how to make an informed decision.</p>

    <h3>Key Qualifications to Look For</h3>
    <p>When selecting a construction team, ensuring they meet essential criteria will set your project up for success. Look for the following:</p>
    <ul>
        <li><strong>Valid state licensing:</strong> Confirm that your contractor has up-to-date licenses as required by your state. Licensing demonstrates professionalism and adherence to safety standards.</li>
        <li><strong>Proper insurance coverage:</strong> Verify that the contractor carries liability insurance and workers' compensation. This protects you from financial responsibility in case of accidents or damage.</li>
        <li><strong>Storm damage restoration experience:</strong> Choose a team that has hands-on experience with storm recovery. They should be familiar with the unique challenges posed by wind, water, and structural damage.</li>
        <li><strong>Local presence and reputation:</strong> A contractor with an established local presence is more likely to provide reliable service and be around for any follow-up needs. Check reviews and ask for local references.</li>
    </ul>

    <h3>Red Flags to Watch For</h3>
    <p>It’s just as important to know what to avoid. Watch for these warning signs:</p>
    <ul>
        <li><strong>Pressure to sign immediately:</strong> Be cautious if a contractor insists you sign a contract or pay a deposit right away. Quality teams will give you time to make an informed decision.</li>
        <li><strong>Unusually low bids:</strong> If a bid seems too good to be true, it probably is. Low-ball offers often lead to poor-quality work, hidden fees, or unfinished projects.</li>
        <li><strong>Lack of written contracts:</strong> Always require a detailed written contract outlining the scope of work, costs, and timeline. Avoid contractors who want to work solely on a verbal agreement.</li>
        <li><strong>No physical business address:</strong> A trustworthy contractor should have a local office or a physical address where you can reach them. Be wary of teams that operate solely from a van or provide vague contact details.</li>
    </ul>

    <h3>How to Interview Potential Contractors</h3>
    <p>Once you’ve narrowed down your options, conduct interviews to make a confident choice. Here are some helpful questions to ask:</p>
    <ul>
        <li><strong>Can you provide references from past clients?</strong> A reputable contractor will be happy to share references and examples of completed work.</li>
        <li><strong>What is your timeline for this project?</strong> Make sure their schedule aligns with your needs and ask how they handle delays.</li>
        <li><strong>Who will be the project manager, and how can I reach them?</strong> Clear communication is crucial. Establish points of contact and preferred methods of communication.</li>
        <li><strong>Do you handle permits and inspections?</strong> The best contractors manage permits and arrange for necessary inspections to ensure compliance with local building codes.</li>
    </ul>

    <h3>Building a Strong Relationship with Your Construction Team</h3>
    <p>Establishing a solid working relationship will ensure your project runs smoothly. Be upfront about your expectations and listen to the contractor’s recommendations. Remember, collaboration and mutual respect are key to a successful outcome.</p>

    <div class="highlight">
        <strong>Tip:</strong> Keep a project journal to track progress, note any concerns, and document conversations with your contractor. This will help you stay organized and provide a record if issues arise.
    </div>

    <h3>Final Thoughts</h3>
    <p>Choosing the right construction team can feel daunting, but with these steps, you’ll be prepared to make the best decision for your restoration project. Remember, a thoughtful and informed approach today will set you up for success and peace of mind tomorrow. Together, let’s rebuild with confidence and strength!</p>
    `
  },
  {
    id: '3',
    title: 'Understanding Construction Contracts',
    description: 'A comprehensive guide to construction contracts, terms, and what you need to know to protect your interests during storm damage repairs.',
    category: 'homeowner',
    slug: 'construction-contracts',
    readingTime: '4 min read',
    publishDate: 'March 20, 2024',
    coverImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85',
    content: `
    <h2>Essential Contract Elements</h2>
    <p>Understanding your construction contract is crucial for a successful restoration project. This guide explains key terms and provisions you should know.</p>

    <h3>Key Contract Components</h3>
    <p>Your contract outlines the foundation of your project and protects both you and your contractor. Here are the essential components:</p>
    <ul>
        <li><strong>Scope of work details:</strong> A detailed description of what work will be done, materials to be used, and specific tasks. Ensure every aspect of the project is clearly outlined to avoid misunderstandings.</li>
        <li><strong>Timeline and completion dates:</strong> The contract should specify when the work will start and finish, as well as any milestones or phases. Make sure there’s a plan for handling delays.</li>
        <li><strong>Payment terms and schedule:</strong> Understand when and how payments will be made, whether in installments or upon reaching certain milestones. Never agree to pay the full amount upfront.</li>
        <li><strong>Change order procedures:</strong> Defines how any changes to the original plan will be handled, including documentation, cost adjustments, and how both parties will agree to modifications.</li>
        <li><strong>Warranty information:</strong> Specifies what aspects of the work are guaranteed, for how long, and under what conditions. A solid warranty gives you peace of mind that issues will be addressed if they arise later.</li>
    </ul>

    <h3>Your Rights and Protections</h3>
    <p>Your contract should also include provisions that protect your rights as a property owner:</p>
    <ul>
        <li><strong>Right to cancel within 3 business days:</strong> In many places, you have the right to cancel a contract without penalty within a specified period. Make sure this clause is included and understand your rights.</li>
        <li><strong>Insurance claim provisions:</strong> If you’re using insurance to cover the restoration, your contract should outline how payments from your insurer will be managed and any relevant conditions.</li>
        <li><strong>Workmanship guarantees:</strong> Your contractor should guarantee the quality of their work. This provision outlines what will be done if the work is defective or doesn’t meet agreed-upon standards.</li>
        <li><strong>Dispute resolution procedures:</strong> Details how conflicts will be resolved, whether through mediation, arbitration, or court proceedings. Having a clear process for dispute resolution can save time and stress.</li>
    </ul>

    <h3>Common Contract Terms Explained</h3>
    <p>Here’s a breakdown of some common terms you might encounter:</p>
    <ul>
        <li><strong>Substantial completion:</strong> Refers to the point when the work is mostly done, and the property can be used as intended, even if minor tasks remain. Know when substantial completion occurs and what it means for payment and warranties.</li>
        <li><strong>Force majeure clauses:</strong> Protects both parties from obligations if unexpected events (like natural disasters or severe weather) prevent work from continuing. Understand how this affects your timeline.</li>
        <li><strong>Indemnification:</strong> An agreement to hold one party harmless from certain claims or damages. Make sure you know who is responsible for what and how this impacts your liability.</li>
        <li><strong>Lien waivers:</strong> A legal document from the contractor that releases you from any claims or liens once payment is made. This is crucial to prevent subcontractors from placing a lien on your property for unpaid work.</li>
    </ul>

    <div class="highlight">
        <strong>Tip:</strong> Always review your contract with a trusted advisor or attorney, especially for large or complex projects. A little extra diligence now can prevent significant headaches later.
    </div>

    <h3>Final Thoughts</h3>
    <p>Your construction contract is a vital tool that sets expectations and safeguards your interests. By understanding each section, you’ll be equipped to move forward confidently with your restoration project. Remember, clarity and communication are your best allies on this journey. Let’s build a safer and stronger future together!</p>
    `
  },
  {
    id: '4',
    title: 'Estimating Construction Costs',
    description: 'Learn how to understand and evaluate construction cost estimates for your storm damage repairs.',
    category: 'business',
    slug: 'estimating-costs',
    readingTime: '3 min read',
    publishDate: 'March 22, 2024',
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
    content: `
<h2>Understanding Construction Estimates</h2>
<p>Accurate cost estimation is crucial for budgeting your restoration project. Learn how to read and evaluate construction estimates effectively.</p>

<h3>Components of a Detailed Estimate</h3>
<p>A reliable construction estimate should break down the following components:</p>
<ul>
    <li><strong>Material costs and quantities:</strong> Lists the materials needed for the project, along with their estimated costs and quantities. Ensure that the materials listed align with the quality and specifications discussed.</li>
    <li><strong>Labor rates and hours:</strong> Details the labor involved, including hourly rates and the estimated time required to complete the work. Verify that these figures seem reasonable based on the complexity of the project.</li>
    <li><strong>Equipment costs:</strong> Outlines any specialized equipment needed and associated rental or usage fees. This might include heavy machinery or tools required for specific tasks.</li>
    <li><strong>Overhead and profit margins:</strong> Includes the contractor’s business expenses and profit. This is a standard part of any estimate and should be transparent and in line with industry norms.</li>
    <li><strong>Contingency allowances:</strong> A buffer for unexpected expenses that may arise during construction. Typically, this is a percentage of the total project cost and helps manage unforeseen issues.</li>
</ul>

<h3>Common Cost Variables</h3>
<p>Several factors can influence the final cost of your project. Be aware of these variables:</p>
<ul>
    <li><strong>Material price fluctuations:</strong> The cost of materials, like lumber or concrete, can vary due to supply chain disruptions or market demand. Consider locking in material prices early if possible.</li>
    <li><strong>Seasonal labor rates:</strong> Labor costs may increase during peak construction seasons. Plan your project timeline strategically to avoid higher rates when possible.</li>
    <li><strong>Regional cost differences:</strong> Construction costs can vary significantly based on your location. Be prepared for higher expenses in areas with a higher cost of living or increased demand for construction services.</li>
    <li><strong>Permit and inspection fees:</strong> Don’t overlook the cost of obtaining necessary permits and paying for inspections. These fees vary by municipality and can impact your overall budget.</li>
</ul>

<h3>Red Flags in Estimates</h3>
<p>Watch out for these warning signs when reviewing estimates:</p>
<ul>
    <li><strong>Vague line items:</strong> Estimates should be specific. Avoid contractors who use ambiguous terms like “miscellaneous” or “as needed” without providing further details.</li>
    <li><strong>Missing scope elements:</strong> Make sure the estimate covers all aspects of the project, including site cleanup and waste disposal. Missing items can lead to unexpected costs later.</li>
    <li><strong>Unrealistic timelines:</strong> A timeline that seems too short or doesn’t account for potential delays can signal inexperience or an attempt to win your business with false promises.</li>
    <li><strong>Inadequate detail:</strong> A good estimate should be comprehensive and transparent. If an estimate lacks detail or feels rushed, it may be worth getting a second opinion.</li>
</ul>
    `
  },
  {
    id: '5',
    title: 'Navigating Insurance Claims',
    description: 'A step-by-step guide to managing your insurance claim process for storm damage repairs.',
    category: 'business',
    slug: 'insurance-claims-process',
    readingTime: '4 min read',
    publishDate: 'March 25, 2024',
    coverImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85',
    content: `
<h2>Understanding the Claims Process</h2>
<p>Successfully navigating your insurance claim is crucial for getting the coverage you deserve. This guide walks you through each step of the process.</p>

<h3>Initial Steps</h3>
<p>Begin the claims process as soon as possible to ensure timely coverage. Here are the first steps to take:</p>
<ul>
    <li><strong>Document all damage immediately:</strong> Take clear photos and videos of all affected areas before starting any cleanup. Keep a detailed inventory of damaged items, including descriptions, estimated values, and purchase dates if possible.</li>
    <li><strong>Contact your insurance provider:</strong> Report the damage promptly. Your insurance company will guide you through their specific claims process and may provide information about temporary repairs or accommodations if needed.</li>
    <li><strong>Understand your policy coverage:</strong> Review your insurance policy to understand what is covered and what is excluded. Take note of your deductible and any limits on coverage amounts for certain items or damage types.</li>
    <li><strong>Schedule an adjuster inspection:</strong> Your insurance company will send an adjuster to inspect the damage. Be sure to coordinate a convenient time and be prepared to discuss the extent of the damage.</li>
</ul>

<h3>Working with Adjusters</h3>
<p>Adjusters play a crucial role in determining the value of your claim. Here’s how to work effectively with them:</p>
<ul>
    <li><strong>Preparing for the inspection:</strong> Before the adjuster arrives, prepare a list of damages and any supporting documentation, such as repair estimates or receipts for emergency expenses.</li>
    <li><strong>Providing documentation:</strong> Share your photos, videos, and a detailed damage inventory with the adjuster. The more evidence you provide, the more accurately your claim can be assessed.</li>
    <li><strong>Understanding the adjustment process:</strong> The adjuster will evaluate the damage and prepare a report for the insurance company. Be sure to ask questions if you don’t understand any part of the process.</li>
    <li><strong>Negotiating your claim:</strong> If the initial settlement offer is lower than expected, you have the right to negotiate. Be prepared to provide additional documentation or seek the assistance of a public adjuster if necessary.</li>
</ul>

<h3>Common Claim Challenges</h3>
<p>Filing an insurance claim can be complicated, and challenges may arise. Here’s what to watch for:</p>
<ul>
    <li><strong>Coverage disputes:</strong> Sometimes insurance companies may dispute the extent or type of coverage for your claim. Review your policy and consider seeking professional advice if you disagree with their determination.</li>
    <li><strong>Depreciation calculations:</strong> Insurance companies often calculate depreciation based on the age and condition of damaged items, which may reduce your payout. Understand how depreciation is calculated and if your policy includes replacement cost coverage.</li>
    <li><strong>Supplemental claims:</strong> If you discover additional damage after your claim has been filed, you may need to submit a supplemental claim. Document the new damage thoroughly and notify your insurer as soon as possible.</li>
    <li><strong>Appeals process:</strong> If your claim is denied or you receive a lower settlement than expected, you have the right to appeal. Gather additional evidence and consider seeking professional assistance, such as a contractor’s assessment or legal advice, to strengthen your case.</li>
</ul>
    `
  }
];
