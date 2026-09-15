import Link from "next/link";;
import styles from '../../../styles/AdminSidebar.module.scss'
// import { usePathname } from 'next/navigation'

const MenuLink = ({ item }) => {

  // const pathname = usePathname()

  return (
    <>
      <Link href={item.path} >
        <div className={styles.containerMenuLink}>
          <item.icon className={styles.MenuIcon}/>
          <p className={styles.iconTitle}>
            {item.title}
          </p>
        </div>
      </Link>
    </>
  )
}

export default MenuLink