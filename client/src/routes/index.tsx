

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
