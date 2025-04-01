// Seed script for EU AI Act articles
import { db } from './server/db';
import { euAiActArticles, type InsertEuAiActArticle } from './shared/schema';

async function seedEuAiActArticles() {
  console.log('Seeding EU AI Act articles...');

  try {
    // Check if articles already exist to avoid duplicates
    const existingArticles = await db.select().from(euAiActArticles);
    if (existingArticles.length > 0) {
      console.log(`Found ${existingArticles.length} existing articles. Skipping seed.`);
      return;
    }

    // Array of EU AI Act article data
    const articleData = [
      {
        articleId: "Article 5",
        number: 5,
        title: "Prohibited Artificial Intelligence Practices",
        content: `<h3>Article 5: Prohibited Artificial Intelligence Practices</h3>
        <p>1. The following artificial intelligence practices shall be prohibited:</p>
        <p>(a) the placing on the market, putting into service or use of an AI system that deploys subliminal techniques beyond a person's consciousness with the objective to or the effect of materially distorting a person's behavior in a manner that causes or is reasonably likely to cause that person or another person physical or psychological harm;</p>
        <p>(b) the placing on the market, putting into service or use of an AI system that exploits any of the vulnerabilities of a specific group of persons due to their age, physical or mental disability or social or economic situation, with the objective to or the effect of materially distorting the behavior of a person pertaining to that group in a manner that causes or is reasonably likely to cause that person or another person physical or psychological harm;</p>
        <p>(c) the placing on the market, putting into service or use of AI systems by public authorities or on their behalf for the evaluation or classification of the trustworthiness of natural persons over a certain period of time based on their social behavior or known or predicted personal or personality characteristics, where the social score leads to either or both of the following:
        <br>(i) detrimental or unfavorable treatment of certain natural persons or whole groups in social contexts which are unrelated to the contexts in which the data was originally generated or collected;
        <br>(ii) detrimental or unfavorable treatment of certain natural persons or whole groups that is unjustified or disproportionate to their social behavior or its gravity;</p>`,
        officialUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        riskLevel: "prohibited",
        keyPoints: JSON.stringify([
          "Prohibition of subliminal manipulation techniques",
          "Ban on exploiting vulnerabilities of specific groups",
          "Prohibition of social scoring systems by public authorities",
          "Ban on real-time remote biometric identification systems in publicly accessible spaces (with exceptions)"
        ]),
        version: "1.0",
        lastUpdated: new Date(),
        isLatest: true,
        exampleSummary: "This article prohibits AI systems that manipulate human behavior, exploit vulnerabilities of specific groups, or implement social scoring systems by public authorities.",
        imageUrl: "https://euaiact.com/images/article5-screenshot.png"
      },
      {
        articleId: "Article 6",
        number: 6,
        title: "Classification of High-Risk AI Systems",
        content: `<h3>Article 6: Classification of High-Risk AI Systems</h3>
        <p>1. An AI system that is itself a product covered by the Union harmonisation legislation listed in Annex I, Section A shall be considered as high-risk where both of the following conditions are fulfilled:</p>
        <p>(a) the product is required to undergo a third-party conformity assessment with a view to the placing on the market or putting into service of that product pursuant to the Union harmonisation legislation listed in Annex I, Section A;</p>
        <p>(b) the AI system is a safety component of a product, or is itself a product, as defined by the Union harmonisation legislation in Annex I, Section A.</p>
        <p>2. An AI system intended to be used as a safety component of a product that is covered by the Union harmonisation legislation listed in Annex I, Section B, or that is itself such a product, shall be considered as high-risk where both of the following conditions are fulfilled:</p>
        <p>(a) the product whose safety component is the AI system, or the AI system itself as a product, is required to undergo a third-party conformity assessment with a view to the placing on the market or putting into service of that product pursuant to the Union harmonisation legislation listed in Annex I, Section B;</p>
        <p>(b) the AI system is a safety component of a product, or is itself a product, as defined by the Union harmonisation legislation in Annex I, Section B.</p>`,
        officialUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        riskLevel: "high",
        keyPoints: JSON.stringify([
          "AI systems as safety components of products",
          "Products covered by EU safety legislation",
          "Systems used in critical infrastructure",
          "Educational or vocational training systems"
        ]),
        version: "1.0",
        lastUpdated: new Date(),
        isLatest: true,
        exampleSummary: "This article establishes criteria for classifying AI systems as high-risk, particularly for products under EU safety legislation and in specific critical applications.",
        imageUrl: "https://euaiact.com/images/article6-screenshot.png"
      },
      {
        articleId: "Article 9",
        number: 9,
        title: "Risk Management System",
        content: `<h3>Article 9: Risk Management System</h3>
        <p>1. A risk management system shall be established, implemented, documented and maintained in relation to high-risk AI systems.</p>
        <p>2. The risk management system shall consist of a continuous iterative process run throughout the entire life cycle of a high-risk AI system, requiring regular systematic updating. It shall comprise the following steps:</p>
        <p>(a) identification and analysis of the known and foreseeable risks that the high-risk AI system can pose:</p>
        <p>(i) when the high-risk AI system is used in accordance with its intended purpose and under conditions of reasonably foreseeable misuse;</p>
        <p>(ii) as regards possible effects on health, safety, fundamental rights, the environment, democracy and the rule of law;</p>
        <p>(iii) in light of the intended purpose of the high-risk AI system;</p>
        <p>(b) estimation and evaluation of the risks that may emerge when the high-risk AI system is used in accordance with its intended purpose and under conditions of reasonably foreseeable misuse;</p>
        <p>(c) where appropriate, adoption of suitable risk management measures in accordance with the provisions of the following paragraphs.</p>`,
        officialUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        riskLevel: "high",
        keyPoints: JSON.stringify([
          "Establishment of continuous risk identification and analysis",
          "Implementation of risk management measures",
          "Testing to identify risks",
          "Ongoing monitoring throughout the AI lifecycle"
        ]),
        version: "1.0",
        lastUpdated: new Date(),
        isLatest: true,
        exampleSummary: "This article requires a comprehensive risk management system for high-risk AI systems throughout their entire lifecycle, with ongoing monitoring and risk mitigation.",
        imageUrl: "https://euaiact.com/images/article9-screenshot.png"
      },
      {
        articleId: "Article 10",
        number: 10,
        title: "Data and Data Governance",
        content: `<h3>Article 10: Data and Data Governance</h3>
        <p>1. High-risk AI systems which make use of techniques involving the training of models with data shall be developed on the basis of training, validation and testing data sets that meet the quality criteria referred to in paragraphs 2 to 5.</p>
        <p>2. Training, validation and testing data sets shall be subject to appropriate data governance and management practices. Those practices shall concern in particular:</p>
        <p>(a) the relevant design choices;</p>
        <p>(b) data collection and procurement;</p>
        <p>(c) relevant data preparation processing operations, such as annotation, labelling, cleaning, enrichment and aggregation;</p>
        <p>(d) the formulation of relevant assumptions, notably with respect to the information that the data are supposed to measure and represent;</p>
        <p>(e) a prior assessment of the availability, quantity and suitability of the data sets that are needed;</p>
        <p>(f) examination in view of possible biases that are likely to affect health, safety, fundamental rights, the environment, democracy and the rule of law;</p>
        <p>(g) the identification of any possible data gaps or shortcomings, and how those gaps and shortcomings can be addressed.</p>`,
        officialUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        riskLevel: "high",
        keyPoints: JSON.stringify([
          "Training datasets must be relevant and representative",
          "Data preparation must address biases",
          "Establishment of data governance practices",
          "Processing of special categories of personal data"
        ]),
        version: "1.0",
        lastUpdated: new Date(),
        isLatest: true,
        exampleSummary: "This article establishes requirements for data used in AI systems, focusing on relevance, representativeness, and appropriate data governance practices.",
        imageUrl: "https://euaiact.com/images/article10-screenshot.png"
      },
      {
        articleId: "Article 13",
        number: 13,
        title: "Transparency and Provision of Information to Users",
        content: `<h3>Article 13: Transparency and Provision of Information to Users</h3>
        <p>1. High-risk AI systems shall be designed and developed in such a way to ensure that their operation is sufficiently transparent to enable users to interpret the system's output and use it appropriately. An appropriate type and degree of transparency shall be ensured, with a view to achieving compliance with the relevant obligations of the user and of the provider set out in Chapter 3.</p>
        <p>2. High-risk AI systems shall be accompanied by instructions for use in an appropriate digital format or otherwise that include concise, complete, correct and clear information that is relevant, accessible and comprehensible to users, and that enables them to understand and appropriately use the high-risk AI system.</p>
        <p>3. The information referred to in paragraph 2 shall specify:</p>
        <p>(a) the identity and the contact details of the provider and, where applicable, of its authorised representative;</p>
        <p>(b) the characteristics, capabilities and limitations of performance of the high-risk AI system, including:</p>
        <p>(i) its intended purpose;</p>
        <p>(ii) the level of accuracy, robustness and cybersecurity referred to in Article 15 against which the high-risk AI system has been tested and validated and which can be expected, and any known and foreseeable circumstances that may have an impact on that expected level of accuracy, robustness and cybersecurity;</p>
        <p>(iii) any known or foreseeable circumstance, related to the use of the high-risk AI system in accordance with its intended purpose or under conditions of reasonably foreseeable misuse, which may lead to risks to the health and safety or fundamental rights;</p>
        <p>(iv) its performance as regards the persons or groups of persons on which the system is intended to be used;</p>
        <p>(v) the human oversight measures referred to in Article 14, including the technical measures put in place to facilitate the interpretation of the outputs of AI systems by the users;</p>
        <p>(vi) for general purpose AI systems and, as appropriate, for general purpose AI models on which high-risk AI systems are based, as far as possible, information regarding the specifications of the model and the upstream training data, as well as information regarding the expected useful lifespan of the system and any necessary maintenance measures, including as regards software updates;</p>`,
        officialUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        riskLevel: "high",
        keyPoints: JSON.stringify([
          "Systems must be designed to be sufficiently transparent",
          "Instructions must be provided in appropriate digital format",
          "Information must specify capabilities and limitations",
          "Documentation of accuracy, robustness, and cybersecurity measures"
        ]),
        version: "1.0",
        lastUpdated: new Date(),
        isLatest: true,
        exampleSummary: "This article requires high-risk AI systems to be transparent and provide sufficient information to users about their capabilities, limitations, and proper usage.",
        imageUrl: "https://euaiact.com/images/article13-screenshot.png"
      },
      {
        articleId: "Article 14",
        number: 14,
        title: "Human Oversight",
        content: `<h3>Article 14: Human Oversight</h3>
        <p>1. High-risk AI systems shall be designed and developed in such a way, including with appropriate human-machine interface tools, that they can be effectively overseen by natural persons during the period in which the AI system is in use.</p>
        <p>2. Human oversight shall aim at preventing or minimising the risks to health, safety or fundamental rights that may emerge when a high-risk AI system is used in accordance with its intended purpose or under conditions of reasonably foreseeable misuse, in particular when such risks persist notwithstanding the application of other requirements set out in this Chapter.</p>
        <p>3. Human oversight shall be ensured through either one or all of the following measures:</p>
        <p>(a) identified and built, when technically feasible, into the high-risk AI system by the provider before it is placed on the market or put into service;</p>
        <p>(b) identified by the provider before placing the high-risk AI system on the market or putting it into service and that are appropriate to be implemented by the user.</p>
        <p>4. The measures referred to in paragraph 3 shall enable the individuals to whom human oversight is assigned to do the following, as appropriate to the circumstances:</p>
        <p>(a) fully understand the capacities and limitations of the high-risk AI system and be able to duly monitor its operation, so that signs of anomalies, dysfunctions and unexpected performance can be detected and addressed as soon as possible;</p>
        <p>(b) remain aware of the possible tendency of automatically relying or over-relying on the output produced by a high-risk AI system ('automation bias'), in particular for high-risk AI systems used to provide information or recommendations for decisions to be taken by natural persons;</p>
        <p>(c) be able to correctly interpret the high-risk AI system's output, taking into account in particular the characteristics of the system and the interpretation tools and methods available;</p>
        <p>(d) be able to decide, in any particular situation, not to use the high-risk AI system or otherwise disregard, override or reverse the output of the high-risk AI system;</p>
        <p>(e) be able to intervene in the operation of the high-risk AI system or interrupt the system through a "stop" button or a similar procedure.</p>`,
        officialUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        riskLevel: "high",
        keyPoints: JSON.stringify([
          "Systems must enable effective human oversight",
          "Measures to prevent automation bias",
          "Ability to override system outputs",
          "Emergency stop capabilities required"
        ]),
        version: "1.0",
        lastUpdated: new Date(),
        isLatest: true,
        exampleSummary: "This article mandates that high-risk AI systems must be designed to allow for effective human oversight, including the ability to monitor operation, interpret outputs, and override or interrupt the system when necessary.",
        imageUrl: "https://euaiact.com/images/article14-screenshot.png"
      }
    ];

    // Insert the articles into the database
    for (const article of articleData) {
      await db.insert(euAiActArticles).values(article);
    }

    console.log(`Successfully seeded ${articleData.length} EU AI Act articles.`);
  } catch (error) {
    console.error('Error seeding EU AI Act articles:', error);
  }
}

// Run the seed function
seedEuAiActArticles();