import { PDFViewer } from "@react-pdf/renderer";

const PDFPreview = ({ children }) => {
  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>{children}</PDFViewer>
  );
};

export default PDFPreview;
