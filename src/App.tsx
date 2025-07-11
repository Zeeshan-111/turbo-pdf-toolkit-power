
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import PDFToWord from "./pages/tools/PDFToWord";
import PDFToJPG from "./pages/tools/PDFToJPG";
import JPGToPDF from "./pages/tools/JPGToPDF";
import PDFToPNG from "./pages/tools/PDFToPNG";
import PNGToPDF from "./pages/tools/PNGToPDF";
import MergePDF from "./pages/tools/MergePDF";
import SplitPDF from "./pages/tools/SplitPDF";
import CompressPDF from "./pages/tools/CompressPDF";
import LockPDF from "./pages/tools/LockPDF";
import WordToPDF from "./pages/tools/WordToPDF";

import PDFReader from "./pages/tools/PDFReader";
import JPGCompress from "./pages/tools/JPGCompress";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/tools/pdf-to-word" element={<PDFToWord />} />
          <Route path="/tools/pdf-to-jpg" element={<PDFToJPG />} />
          <Route path="/tools/jpg-to-pdf" element={<JPGToPDF />} />
          <Route path="/tools/pdf-to-png" element={<PDFToPNG />} />
          <Route path="/tools/png-to-pdf" element={<PNGToPDF />} />
          <Route path="/tools/merge-pdf" element={<MergePDF />} />
          <Route path="/tools/split-pdf" element={<SplitPDF />} />
          <Route path="/tools/compress-pdf" element={<CompressPDF />} />
          <Route path="/tools/lock-pdf" element={<LockPDF />} />
          <Route path="/tools/word-to-pdf" element={<WordToPDF />} />
          
          <Route path="/tools/pdf-reader" element={<PDFReader />} />
          <Route path="/tools/jpg-compress" element={<JPGCompress />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
