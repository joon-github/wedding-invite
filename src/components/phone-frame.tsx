import styles from "./phone-frame.module.scss";

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.device}>
        <div className={styles.screen} data-phone-screen>
          {children}
        </div>
      </div>
    </div>
  );
}
