import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Kontak() {
  return (
    <>
      <div
        className="error-message"
        style={{ justifyContent: "center", textAlign: "center" }}
      >
        <span className="error-title">Kontak</span>
        <p className="error-description mt-3">
          Halaman ini sedang dalam proses pembangunan
        </p>
        <p className="error-info mt-4">
          Kontak mengenai kami Atma Bakery akan segera hadir, kami hadir dalam
          produk menjamin citra rasa dan kualitas yang luar biasa dari produk
          kami.
        </p>
        <p className="error-info mt-1">
          Nantikan dan jangan sampai melewatkan setiap gigitan dari kue-kue
          kami!
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
