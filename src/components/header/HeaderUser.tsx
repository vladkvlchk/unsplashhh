import Link from "next/link";

import { ROUTES } from "@/constants/routes";
import { logoutUser } from "@/lib/auth/actions";
import { getSession } from "@/lib/auth/session";

import styles from "./HeaderUser.module.scss";

export async function HeaderUser() {
  const session = await getSession();

  if (!session) {
    return (
      <div className={styles.guestLinks}>
        <Link href={ROUTES.login} className={styles.loginLink}>
          Log in
        </Link>
        <Link href={ROUTES.register} className={styles.joinButton}>
          Join
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.user}>
      <Link
        href={ROUTES.profile}
        className={styles.avatarLink}
        title={`${session.name}'s collection`}
      >
        <span className={styles.avatar} aria-hidden="true">
          {session.name.charAt(0).toUpperCase()}
        </span>
        <span className="visually-hidden">Profile</span>
      </Link>
      <form action={logoutUser}>
        <button type="submit" className={styles.logoutButton}>
          Log out
        </button>
      </form>
    </div>
  );
}
