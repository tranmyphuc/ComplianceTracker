

import Footer from './footer';

// Add the Footer component to the end of the layout content
return (
  <div className="min-h-screen flex flex-col">
    <MainNav />
    <div className="flex-1">
      {children}
    </div>
    <Footer />
  </div>
);
