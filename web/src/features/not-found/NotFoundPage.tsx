import { Link } from "react-router-dom";
import styles from "../../styles/app.module.css";

export function NotFoundPage() {
  return (
    <div className={styles.emptyState}>
      <p className={styles.eyebrow}>404 / LOST ROUTE</p>
      <h1>ページが見つかりません</h1>
      <p>URLを確認するか、ガイド拠点へ戻ってください。</p>
      <Link className={styles.primaryButton} to="/">
        ガイド拠点へ戻る
      </Link>
    </div>
  );
}
