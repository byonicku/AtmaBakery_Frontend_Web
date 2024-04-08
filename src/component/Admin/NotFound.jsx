import { Container } from "react-bootstrap";

export default function NotFound() {
  return (
    <Container className="text-center p-5">
      <h1 style={{ fontWeight: "bold" }}>Belum Ada Penitip Disini</h1>
      <img
        src="https://res.cloudinary.com/daorbrq8v/image/upload/f_auto,q_auto/v1/atma-bakery/lcbfi0gfhgelm2suvalz"
        style={{
          width: "15em",
        }}
      />
    </Container>
  );
}
