import Link from "next/link";

import { logoutUser } from "@/app/register/actions";
import { ROUTES } from "@/constants/routes";
import { getSession } from "@/lib/session";

import styles from "./HeaderUser.module.scss";

export async function HeaderUser() {
  const session = await getSession();

  if (!session) {
    return (
      <Link href={ROUTES.register} className={styles.joinButton}>
        Join
      </Link>
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
