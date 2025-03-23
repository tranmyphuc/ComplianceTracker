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
  path: "/documentation/training-documentation",
  element: <TrainingDocumentation />,
},
{
  path: "/training/module/:id",
  element: <TrainingModule />,
},
{
  path: "/training/presentation/:id",
  element: <TrainingPresentationPage />,
},
{
  path: "/training/certificate/:id",
  element: <TrainingCertificatePage />,
},
{
          path: "systems/:id/assess-risk",
          element: <AssessRiskPage />
        },
        {
          path: "risk-management/:id",
          element: <SystemRiskManagement />
        },