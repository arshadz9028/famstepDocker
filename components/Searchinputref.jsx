import React from 'react'
import SearchModal from '../layouts/SearchModal';
import Image from "next/image";

const Searchinputref = ((props, ref) => {
    return (
        <>

            <div ref={ref} className={styles.search}  >
                <input type="text" id="search" value={props.searchinput} onClick={props.Checksearch} onChange={props.Checksearch} placeholder="Search" />

                <style jsx>{`
              #search {
                ${props.search && `
                    padding: .8rem 1.4rem;
                    width: 39.8rem;
                    border-radius: 0px;
                    background: white;
                `}
                  }
                  `}</style>

                {!search && <div className={styles.search_icon}>
                    <Image src={search1} alt="Icon" />
                </div>}
                {search && <SearchModal />}
            </div>

        </>
    )
})

export default Searchinputref