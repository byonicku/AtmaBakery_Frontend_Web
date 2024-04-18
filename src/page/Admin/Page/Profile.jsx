import OutlerHeader from "@/component/Admin/OutlerHeader";
import APIUser from "@/api/APIUser";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await APIUser.getSelf();
        console.log(data);
        setUser(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <OutlerHeader title="Profile" breadcrumb="Profile" />
      <section className="content">
        {isLoading ? (
          <div className="text-center">
            <Spinner
              as="span"
              animation="border"
              variant="primary"
              size="lg"
              role="status"
              aria-hidden="true"
            />
            <h6 className="mt-2 mb-0">Loading...</h6>
          </div>
        ) : (
          <div>{user?.nama}</div>
        )}
      </section>
    </>
  );
}
