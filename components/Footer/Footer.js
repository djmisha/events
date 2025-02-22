import Link from "next/link";
import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <br />
      Created by{" "}
      <Link href="https://djmisha.com" target="_blank" title="San Diego DJ">
        San Diego DJ
      </Link>
    </footer>
  );
};

export default Footer;
