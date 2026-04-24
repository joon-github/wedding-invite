import { AdminPanel } from "./admin-panel";
import styles from "./admin.module.scss";

type AdminPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const key = typeof params.key === "string" ? params.key : "";
  const adminKey = process.env.ADMIN_KEY ?? "";

  if (!adminKey || key !== adminKey) {
    return <div className={styles.denied}>접근 권한이 없습니다</div>;
  }

  return <AdminPanel adminKey={key} />;
}
