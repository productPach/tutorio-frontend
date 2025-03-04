import styles from "../layout.module.css";
import clsx from "clsx";
import LeftBar from "@/components/Tutor/LeftBar/LeftBar";
import { Profile } from "@/components/Tutor/Profile/Profile";

const ProfilePage: React.FC = () => {
  const page = "Profile";

  return (
    <>
      <section className={clsx(styles.container, styles.center)}>
        <LeftBar page={page} />
        <div className={styles.content}>
          <Profile />
        </div>
      </section>
    </>
  );
};

export default ProfilePage;
