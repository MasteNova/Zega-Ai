import { Component, type ReactNode, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import { ErrorState, Skeleton } from './components/ui';
import { RequireStaff } from './components/guards';
import { I18nProvider } from './i18n';
import { OnlineProvider } from './state/online';
import { ToastProvider } from './state/toast';
import { AuthProvider } from './state/auth';
import Home from './pages/Home';
import Explore from './pages/Explore';
import DestinationDetail from './pages/DestinationDetail';
import Planner from './pages/Planner';
import ItineraryResult from './pages/ItineraryResult';
import Fares from './pages/Fares';
import Phrasebook from './pages/Phrasebook';
import Safety from './pages/Safety';
import SosStatus from './pages/SosStatus';
import Saved from './pages/Saved';
import Preferences from './pages/Preferences';
import About from './pages/About';
import Login from './pages/Login';

const AdminPage = lazy(() => import('./pages/admin/AdminPage'));

const qc = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 1, refetchOnWindowFocus: false } }
});

class Boundary extends Component<{ children: ReactNode }, { err: Error | null }> {
  state = { err: null as Error | null };
  static getDerivedStateFromError(err: Error) { return { err }; }
  render() {
    if (this.state.err) return <ErrorState message={this.state.err.message} onRetry={() => location.reload()} />;
    return this.props.children;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <I18nProvider>
        <OnlineProvider>
          <AuthProvider>
            <ToastProvider>
              <BrowserRouter>
                <Layout>
                  <Boundary>
                    <Suspense fallback={<Skeleton className="h-64" />}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/explore" element={<Explore />} />
                        <Route path="/map" element={<Explore initialView="map" />} />
                        <Route path="/destination/:id" element={<DestinationDetail />} />
                        <Route path="/planner" element={<Planner />} />
                        <Route path="/itinerary" element={<ItineraryResult />} />
                        <Route path="/fares" element={<Fares />} />
                        <Route path="/phrases" element={<Phrasebook />} />
                        <Route path="/safety" element={<Safety />} />
                        <Route path="/sos/status" element={<SosStatus />} />
                        <Route path="/saved" element={<Saved />} />
                        <Route path="/preferences" element={<Preferences />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/admin" element={<RequireStaff><AdminPage /></RequireStaff>} />
                        <Route path="*" element={<ErrorState message="Page not found." />} />
                      </Routes>
                    </Suspense>
                  </Boundary>
                </Layout>
              </BrowserRouter>
            </ToastProvider>
          </AuthProvider>
        </OnlineProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
