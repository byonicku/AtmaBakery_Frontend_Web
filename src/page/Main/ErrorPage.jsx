import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function ErrorPage() {
  return (
    <>
      <div
        className="error-message"
        style={{ justifyContent: "center", textAlign: "center" }}
      >
        <span className="error-title">Ooops! 404 Not Found</span>
        <p className="error-description mt-3">
          Halaman ini sedang dalam proses pembangunan atau anda mengakses
          halaman yang tidak tersedia
        </p>
        <Link to="/" className="error-button">
          <Button className="button-landing button-style mt-5" variant="danger">
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    </>
  );
}
