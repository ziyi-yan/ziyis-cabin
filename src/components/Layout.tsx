import React from 'react'

// import '../styles/typography.scss'
import style from '../styles/layout.module.scss'
import { Siderbar } from './Siderbar'

interface Props {
  children: React.ReactNode
}

export const Layout = ({ children }: Props) => (
  <div className={style.layout}>
    <header className={style.header}></header>
    <div className={style.container}>
      <main className={style.main}>{children}</main>
      <Siderbar />
    </div>
  </div>
)
