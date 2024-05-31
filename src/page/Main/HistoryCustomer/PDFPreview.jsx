import { PDFViewer } from "@react-pdf/renderer";

// eslint-disable-next-line react/prop-types
const PDFPreview = ({ children }) => {
  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>{children}</PDFViewer>
  );
};

export default PDFPreview;
