// Documentation Routes
{
  path: "documentation",
  children: [
    {
      path: "risk-assessment",
      element: <Suspense fallback={<PageLoader />}><RiskAssessmentDocumentation /></Suspense>
    }
  ]
},
{
  path: "risk-assessment/guides",
  element: <Suspense fallback={<PageLoader />}><RiskAssessmentGuides /></Suspense>
},
// ... other routes ...
{
  path: "/knowledge/regulatory",
  element: <RegulatoryContent />
},
{
  path: "/knowledge/glossary",
  element: <Glossary />
},
{
  path: "/knowledge/regulatory/:articleId",
  element: <RegulatoryArticle />
},
{
  path: "/documentation/training",
  element: <TrainingDocumentation />
}