import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ActivitiesProvider } from './contexts/ActivitiesContext';
import { DevelopmentProvider } from './contexts/DevelopmentContext';
import { SophiaProvider } from './contexts/SophiaContext';
import { FinancialProvider } from './contexts/FinancialContext';
import { HealthProvider } from './contexts/HealthContext';
import { EmotionalProvider } from './contexts/EmotionalContext';
import { DiaryProvider } from './contexts/DiaryContext';
import { CommunityProvider } from './contexts/CommunityContext';
import { RewardsProvider } from './contexts/RewardsContext';
import { SophiaChat } from './components/sophia/SophiaChat';

export function App() {
  return (
    <AuthProvider>
      <ActivitiesProvider>
        <DevelopmentProvider>
          <FinancialProvider>
            <HealthProvider>
              <EmotionalProvider>
                <DiaryProvider>
                  <CommunityProvider>
                    <RewardsProvider>
                      <SophiaProvider>
                        <div className="min-h-screen bg-gray-900">
                          <Outlet />
                          <SophiaChat />
                        </div>
                      </SophiaProvider>
                    </RewardsProvider>
                  </CommunityProvider>
                </DiaryProvider>
              </EmotionalProvider>
            </HealthProvider>
          </FinancialProvider>
        </DevelopmentProvider>
      </ActivitiesProvider>
    </AuthProvider>
  );
}