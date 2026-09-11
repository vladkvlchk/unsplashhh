import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ProfileCollection } from "@/app/profile/ProfileCollection";
import { FeedHeader } from "@/components/feed-header/FeedHeader";
import { ROUTES } from "@/constants/routes";
import { COLUMNS_COOKIE_NAME } from "@/constants/storage";
import { parseColumnCount } from "@/lib/columns";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Your collection",
};

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect(ROUTES.register);
  }

  const cookieStore = await cookies();
  const columns = parseColumnCount(cookieStore.get(COLUMNS_COOKIE_NAME)?.value);

  return (
    <main className="container">
      <FeedHeader
        title={`${session.name}’s collection`}
        subtitle="Photos you saved from the gallery"
      />
      <ProfileCollection initialColumns={columns} />
    </main>
  );
}
