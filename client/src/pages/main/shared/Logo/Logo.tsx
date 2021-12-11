import { Icon } from "../../../../ui";

import styles from './Logo.module.scss'

const Logo = () => {
  return (
    <div>
      <div>
        <span className={styles.logo}>Na<span className={styles.color}>Sozvone</span></span> 
        <Icon name="logo" />
      </div>
      <div className={styles.text}>Цифры Знаешь</div>
    </div>
  )
}

export default Logo;