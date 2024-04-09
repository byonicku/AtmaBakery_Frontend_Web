import { Container } from "react-bootstrap";
import propTypes from "prop-types";

NotFound.propTypes = {
  text: propTypes.string,
};

export default function NotFound({
  text
}) {
  return (
    <Container className="text-center p-5">
      <h1 style={{ fontWeight: "bold" }}>{text}</h1>
      <img
        src="https://res.cloudinary.com/daorbrq8v/image/upload/f_auto,q_auto/v1/atma-bakery/lcbfi0gfhgelm2suvalz"
        style={{
          width: "15em",
        }}
      />
    </Container>
  );
}
