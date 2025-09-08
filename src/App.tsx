import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WarningBanner } from '@/components/WarningBanner';
import { SupabaseEnvBanner } from '@/components/SupabaseEnvBanner';
import { RoleProvider } from '@/contexts/RoleContext';
import { EditModeProvider } from '@/contexts/EditModeContext';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import Index from "./pages/Index";
import Accounting from "./pages/Accounting";
import FSLI from "./pages/FSLI";
import ConsolidatedReporting from "./pages/ConsolidatedReporting";
import StatutoryReporting from "./pages/StatutoryReporting";
import GreenTransition from "./pages/GreenTransition";
import GreenTransitionNow from "./pages/green-transition/GreenTransitionNow";
import GreenTransitionGaps from "./pages/green-transition/GreenTransitionGaps";
import GreenTransitionFuture from "./pages/green-transition/GreenTransitionFuture";
import CriticalThinkingResearch from "./pages/CriticalThinkingResearch";
import EssayListTemplate from "./components/EssayListTemplate";
import EssayDetailTemplate from "./components/EssayDetailTemplate";
import GreenTransitionEssayListTemplate from "./components/GreenTransitionEssayListTemplate";
import GreenTransitionEssayDetailTemplate from "./components/GreenTransitionEssayDetailTemplate";
import BookListPage from "./pages/books/BookListPage";
import PdfReaderPage from "./pages/books/PdfReaderPage";
import Finance101 from "./pages/Finance101";
import FinanceWorkspace from "./pages/FinanceWorkspace";
import ExecutiveDashboard from "./pages/ExecutiveDashboard";
import FinancialAnalytics from "./pages/finance101/FinancialAnalytics";
import FinancialPlanningForecasting from "./pages/finance101/FinancialPlanningForecasting";
import Budgeting from "./pages/finance101/Budgeting";
import CFAPrep from "./pages/finance101/CFAPrep";
import EnglishIELTS from "./pages/EnglishIELTS";
import Auth from "./pages/Auth";
import BooksAcademia from "./pages/BooksAcademia";
import Categories from "./pages/books/Categories";
import Settings from "./pages/Settings";
import EmbedExample from "./pages/EmbedExample";
import DebugAuth from "./pages/DebugAuth";
import Health from "./pages/admin/Health";
import DikasTools from "./pages/DikasTools";
import Model from "./pages/Model";
import TestSuite from "./components/model/TestSuite";
import NotFound from "./pages/NotFound";

// Consolidation pages
import PSAKPrinciples from "./pages/consolidation/PSAKPrinciples";
import EquityAdjustmentParent from "./pages/consolidation/EquityAdjustmentParent";
import EliminationEquity from "./pages/consolidation/EliminationEquity";
import EliminationBalanceSheet from "./pages/consolidation/EliminationBalanceSheet";
import EliminationPnL from "./pages/consolidation/EliminationPnL";
import ControlSOCE from "./pages/consolidation/ControlSOCE";
import ControlNCIMovement from "./pages/consolidation/ControlNCIMovement";
import ControlBSSchedule from "./pages/consolidation/ControlBSSchedule";
import ControlSegmentInfo from "./pages/consolidation/ControlSegmentInfo";

// Financial Analytics pages
import VarianceAnalysis from "./pages/finance101/analytics/VarianceAnalysis";
import ProfitabilityAnalysis from "./pages/finance101/analytics/ProfitabilityAnalysis";
import LiquidityAnalysis from "./pages/finance101/analytics/LiquidityAnalysis";
import EfficiencyAnalysis from "./pages/finance101/analytics/EfficiencyAnalysis";
import FinancialStructureAnalysis from "./pages/finance101/analytics/FinancialStructureAnalysis";
import ForecastingInput from "./pages/forecasting/Input";
import ForecastingAssumptions from "./pages/forecasting/Assumptions";
import ForecastingOutput from "./pages/forecasting/Output";

// Import DynamicFSLITemplate for admin editing
import { DynamicFSLITemplate } from "@/components/DynamicFSLITemplate";

// FSLI Detail component using dynamic template
const FSLIDetail = ({ slug }: { slug: string }) => <DynamicFSLITemplate slug={slug} />;

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <RoleProvider>
        <EditModeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <SupabaseEnvBanner />
              <WarningBanner />
              <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/critical-thinking-research" element={<CriticalThinkingResearch />} />
          <Route path="/critical-thinking-research/:phase" element={<EssayListTemplate />} />
          <Route path="/critical-thinking-research/:phase/:essayId" element={<EssayDetailTemplate />} />
          
          <Route path="/accounting" element={<Accounting />} />
          <Route path="/accounting/fsli" element={<FSLI />} />
          <Route path="/accounting/consolidated-reporting" element={<ConsolidatedReporting />} />
          <Route path="/accounting/statutory-reporting" element={<StatutoryReporting />} />
          <Route path="/green-transition" element={<GreenTransition />} />
          <Route path="/green-transition/now" element={<GreenTransitionNow />} />
          <Route path="/green-transition/gaps" element={<GreenTransitionGaps />} />
          <Route path="/green-transition/future" element={<GreenTransitionFuture />} />
          
          {/* Green Transition Essay Routes - Must come after specific routes */}
          <Route path="/green-transition/:phase" element={<GreenTransitionEssayListTemplate />} />
          <Route path="/green-transition/:phase/:slug" element={<GreenTransitionEssayDetailTemplate />} />
          <Route path="/finance-101" element={<Finance101 />} />
          <Route path="/finance-workspace" element={<FinanceWorkspace />} />
          <Route path="/executive-dashboard" element={<ExecutiveDashboard />} />
          <Route path="/finance-101/financial-analytics" element={<FinancialAnalytics />} />
          <Route path="/finance-101/financial-planning-forecasting" element={<FinancialPlanningForecasting />} />
          <Route path="/finance-101/budgeting" element={<Budgeting />} />
          <Route path="/finance-101/cfa-prep" element={<CFAPrep />} />
          <Route path="/english-ielts" element={<EnglishIELTS />} />
          <Route path="/books-academia" element={<BooksAcademia />} />
                    <Route path="/books/categories" element={<Categories />} />
                    <Route path="/books/:category" element={<BookListPage />} />
                    <Route path="/books/:category/:bookId/read" element={<PdfReaderPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/embed-example" element={<EmbedExample />} />
          
          {/* FSLI Detail Routes - Using DynamicFSLITemplate */}
          <Route path="/accounting/fsli/cash-and-cash-equivalents" element={<FSLIDetail slug="cash_and_cash_equivalents" />} />
          <Route path="/accounting/fsli/restricted-cash" element={<FSLIDetail slug="restricted_cash" />} />
          <Route path="/accounting/fsli/trade-receivables-net" element={<FSLIDetail slug="trade_receivables_net" />} />
          <Route path="/accounting/fsli/third-parties" element={<FSLIDetail slug="third_parties" />} />
          <Route path="/accounting/fsli/related-parties" element={<FSLIDetail slug="related_parties" />} />
          <Route path="/accounting/fsli/other-receivables-net" element={<FSLIDetail slug="other_receivables_net" />} />
          <Route path="/accounting/fsli/due-from-government" element={<FSLIDetail slug="due_from_government" />} />
          <Route path="/accounting/fsli/inventories-net" element={<FSLIDetail slug="inventories_net" />} />
          <Route path="/accounting/fsli/corporate-dividend-taxes-receivable-current" element={<FSLIDetail slug="corporate_dividend_taxes_receivable_current" />} />
          <Route path="/accounting/fsli/advances-prepayments-current" element={<FSLIDetail slug="advances_prepayments_current" />} />
          <Route path="/accounting/fsli/other-current-assets" element={<FSLIDetail slug="other_current_assets" />} />
          <Route path="/accounting/fsli/other-non-current-assets" element={<FSLIDetail slug="other_non_current_assets" />} />
          <Route path="/accounting/fsli/restricted-cash-non-current" element={<FSLIDetail slug="restricted_cash_non_current" />} />
          <Route path="/accounting/fsli/trade-receivables-net-non-current" element={<FSLIDetail slug="trade_receivables_net_non_current" />} />
          <Route path="/accounting/fsli/fixed-assets-net" element={<FSLIDetail slug="fixed_assets_net" />} />
          <Route path="/accounting/fsli/investment-properties" element={<FSLIDetail slug="investment_properties" />} />
          <Route path="/accounting/fsli/deferred-tax-assets" element={<FSLIDetail slug="deferred_tax_assets" />} />
          <Route path="/accounting/fsli/long-term-investments" element={<FSLIDetail slug="long_term_investments" />} />
          <Route path="/accounting/fsli/advances-prepayments-non-current" element={<FSLIDetail slug="advances_prepayments_non_current" />} />
          <Route path="/accounting/fsli/corporate-dividend-taxes-receivable-non-current" element={<FSLIDetail slug="corporate_dividend_taxes_receivable_non_current" />} />
          <Route path="/accounting/fsli/other-non-current-receivables" element={<FSLIDetail slug="other_non_current_receivables" />} />
          <Route path="/accounting/fsli/oil-gas-properties-net" element={<FSLIDetail slug="oil_gas_properties_net" />} />
          <Route path="/accounting/fsli/right-of-use-assets-net" element={<FSLIDetail slug="right_of_use_assets_net" />} />
          <Route path="/accounting/fsli/other-non-current-assets-final" element={<FSLIDetail slug="other_non_current_assets_final" />} />
          
          {/* Consolidation Detail Routes */}
          <Route path="/accounting/consolidation/psak-principles" element={<PSAKPrinciples />} />
          <Route path="/accounting/consolidation/equity-adjustment-parent" element={<EquityAdjustmentParent />} />
          <Route path="/accounting/consolidation/elimination-equity" element={<EliminationEquity />} />
          <Route path="/accounting/consolidation/elimination-balance-sheet" element={<EliminationBalanceSheet />} />
          <Route path="/accounting/consolidation/elimination-pnl" element={<EliminationPnL />} />
          <Route path="/accounting/consolidation/control-soce" element={<ControlSOCE />} />
          <Route path="/accounting/consolidation/control-nci-movement" element={<ControlNCIMovement />} />
          <Route path="/accounting/consolidation/control-bs-schedule" element={<ControlBSSchedule />} />
          <Route path="/accounting/consolidation/control-segment-info" element={<ControlSegmentInfo />} />
          
          {/* Financial Analytics Detail Routes */}
        <Route path="/finance-101/financial-analytics/variance-analysis" element={<VarianceAnalysis />} />
        <Route path="/finance-101/financial-analytics/profitability-analysis" element={<ProfitabilityAnalysis />} />
        <Route path="/finance-101/financial-analytics/liquidity-analysis" element={<LiquidityAnalysis />} />
        <Route path="/finance-101/financial-analytics/efficiency-analysis" element={<EfficiencyAnalysis />} />
        <Route path="/finance-101/financial-analytics/financial-structure-analysis" element={<FinancialStructureAnalysis />} />
        
        {/* Forecasting Pages */}
        <Route path="/forecasting/input" element={<ForecastingInput />} />
        <Route path="/forecasting/assumptions" element={<ForecastingAssumptions />} />
        <Route path="/forecasting/output" element={<ForecastingOutput />} />
        
          <Route path="/auth" element={<Auth />} />
          <Route path="/debug/auth" element={<DebugAuth />} />
          <Route path="/admin/health" element={<Health />} />
          <Route path="/dikas-tools" element={<DikasTools />} />
          <Route path="/model" element={<Model />} />
          <Route path="/model/test" element={<TestSuite />} />
          
          <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </EditModeProvider>
      </RoleProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
