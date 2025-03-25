import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const LanguageDemo = () => {
  const { t, currentLanguage } = useLanguage();

  return (
    <Card className="w-full max-w-3xl mx-auto mt-6">
      <CardHeader>
        <CardTitle>{t('app.title')}</CardTitle>
        <CardDescription>
          {currentLanguage === 'en' && 'Current language: English'}
          {currentLanguage === 'de' && 'Aktuelle Sprache: Deutsch'}
          {currentLanguage === 'vi' && 'Ngôn ngữ hiện tại: Tiếng Việt'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{t('riskAssessment.guides.description')}</p>
        
        <h3 className="text-lg font-semibold mt-4">{t('riskAssessment.methodology.title')}</h3>
        <p>{t('riskAssessment.methodology.description')}</p>
        <p className="mt-2">{t('riskAssessment.methodology.content')}</p>
        
        <h3 className="text-lg font-semibold mt-4">{t('riskAssessment.highRisk.title')}</h3>
        <p>{t('riskAssessment.highRisk.description')}</p>
        <p className="mt-2">{t('riskAssessment.highRisk.content')}</p>
      </CardContent>
      <CardFooter>
        <Button>{t('button.view')}</Button>
      </CardFooter>
    </Card>
  );
};