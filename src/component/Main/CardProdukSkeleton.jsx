import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import "./css/CardProdukSkeleton.css";
import { Col } from "react-bootstrap";

export default function CardProdukSkeleton({ amount }) {
  const loadCards = Array(amount).fill(1);
  return loadCards.map((_, i) => (
    <Col key={i} xl={4} lg={4} md={6} sm={12} className="mb-3">
      <div className="card-skeleton rounded-5">
        <div>
          <Skeleton circle width={60} height={60} />
        </div>
        <div>
          <Skeleton count={5} />
        </div>
      </div>
    </Col>
  ));
}

CardProdukSkeleton.propTypes = {
  amount: PropTypes.number,
};
